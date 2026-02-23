import os
import json
import uuid
import shutil
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
import google.generativeai as genai

# Import các Agent
from agents.content_agent import ContentAgent
from agents.assessment_agent import AssessmentAgent
# [MỚI] Import Profiling Agent
from agents.profiling_agent import ProfilingAgent

# ============================================================================
# 1. CẤU HÌNH MÔI TRƯỜNG
# ============================================================================
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("⚠️ CẢNH BÁO: Chưa tìm thấy GEMINI_API_KEY trong file .env")
else:
    genai.configure(api_key=API_KEY)

# ============================================================================
# 2. CẤU HÌNH SERVER
# ============================================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
DB_DIR = os.path.join(BASE_DIR, "chroma_db")
METADATA_FILE = os.path.join(BASE_DIR, "metadata.json")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# ============================================================================
# 3. KHỞI TẠO AGENTS
# ============================================================================
print("⏳ Đang tải mô hình Embedding...")
try:
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embedding_model)
    print("✅ Đã kết nối Vector DB.")
except Exception as e:
    print(f"❌ Lỗi khởi tạo AI: {e}")
    exit(1)

# Khởi tạo 3 Workers chính
content_worker = ContentAgent(embedding_model, DB_DIR)
assessment_worker = AssessmentAgent(vector_db, API_KEY)
profiling_worker = ProfilingAgent()  # [MỚI] Worker chuyên xếp loại học viên

# ============================================================================
# 4. HELPER FUNCTIONS
# ============================================================================
def save_metadata(doc_id, title, description, filename, original_name):
    if not os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'w', encoding='utf-8') as f: json.dump([], f)
    
    try:
        with open(METADATA_FILE, 'r', encoding='utf-8') as f: data = json.load(f)
    except: data = []
    
    new_record = {
        "id": doc_id,
        "title": title,
        "description": description,
        "filename": filename,
        "original_name": original_name,
        "created_at": str(os.path.getmtime(os.path.join(UPLOAD_DIR, filename)))
    }
    data.append(new_record)
    
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return new_record

# ============================================================================
# 5. API ENDPOINTS
# ============================================================================

@app.get("/")
async def root():
    return {"message": "Hệ thống AI Learning đã sẵn sàng!"}

# --- 1. UPLOAD TÀI LIỆU ---
@app.post("/teacher/upload")
async def teacher_upload(file: UploadFile = File(...), title: str = Form(...), description: str = Form(...)):
    try:
        safe_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"🤖 Content Agent đang học: {file.filename}...")
        success = content_worker.process_and_store(file_path, safe_filename)
        
        if not success:
            raise HTTPException(status_code=400, detail="Lỗi đọc nội dung file")

        doc_id = str(uuid.uuid4())
        saved_info = save_metadata(doc_id, title, description, safe_filename, file.filename)
        
        return {"status": "success", "message": "Đã thêm tài liệu thành công!", "data": saved_info}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- 2. LẤY DANH SÁCH BÀI ---
@app.get("/student/documents")
async def get_documents():
    if not os.path.exists(METADATA_FILE): return []
    try:
        with open(METADATA_FILE, 'r', encoding='utf-8') as f: return json.load(f)
    except: return []

# --- 3. SINH ĐỀ THI (ASSESSMENT AGENT) ---
@app.post("/student/generate-quiz")
async def generate_quiz(request: dict):
    filename = request.get("filename")
    if not filename: return {"error": "Thiếu tên file"}

    try:
        print(f"⏳ Đang sinh câu hỏi cho bài: {filename}...")
        quiz = assessment_worker.generate_quiz(topic=filename)
        if not quiz: raise ValueError("AI trả về rỗng")
        return quiz
    except Exception as e:
        print(f"❌ Lỗi sinh quiz: {str(e)}")
        # Fallback data
        return [
            {"id": 1, "question": "1 + 1 = ?", "options": ["A. 2", "B. 3"], "answer": "A", "difficulty": 1},
            {"id": 2, "question": "Nước sôi ở bao nhiêu độ?", "options": ["A. 90", "B. 100"], "answer": "B", "difficulty": 1}
        ]

# --- 4. NỘP BÀI & XẾP LOẠI (PROFILING AGENT) ---
@app.post("/student/submit-quiz")
async def submit_quiz(request: dict):
    """
    Nhận bài làm -> Chấm điểm -> Gọi Profiling Agent xếp loại
    """
    questions = request.get('questions', [])    # Danh sách câu hỏi gốc (có đáp án đúng)
    user_answers = request.get('user_answers', {}) # Đáp án học viên chọn
    student_id = request.get('student_id', 'Guest') # ID học viên

    if not questions:
        return {"error": "Dữ liệu câu hỏi bị thiếu."}

    print(f"📝 Đang chấm bài cho học viên: {student_id}...")

    # --- BƯỚC 1: CHẤM ĐIỂM CHI TIẾT ---
    score = 0
    details = []
    
    for q in questions:
        q_id = str(q['id']) # ID câu hỏi
        correct_ans = q.get('answer', '').strip().upper() # Đáp án đúng (VD: "A")
        
        # Đáp án người dùng chọn (Lấy từ frontend gửi lên)
        user_ans = user_answers.get(f"q_{q_id}", "").strip().upper() 
        # Lưu ý: Frontend gửi key dạng "q_1", "q_2"... cần khớp với format

        # Nếu user_answers gửi lên dạng {"1": "A"} thay vì {"q_1": "A"}, dùng dòng này:
        if not user_ans: user_ans = user_answers.get(q_id, "").strip().upper()

        is_correct = (user_ans == correct_ans)
        if is_correct:
            score += 1
            
        details.append({
            "question_id": q_id,
            "is_correct": is_correct,
            "difficulty": q.get('difficulty', 1) # Mặc định độ khó 1 nếu không có
        })

    # --- BƯỚC 2: GỌI PROFILING AGENT ---
    quiz_results_format = {
        "score": score,
        "total_questions": len(questions),
        "details": details
    }

    # Agent tính toán trọng số và xếp loại
    profile_result = profiling_worker.update_profile(student_id, quiz_results_format)

    # --- BƯỚC 3: TRẢ KẾT QUẢ VỀ FRONTEND ---
    print("✅ Đã xếp loại xong:", profile_result)
    
    return {
        "message": "Đã chấm điểm thành công",
        "score_info": f"{score}/{len(questions)}",
        "profile": profile_result, # Chứa level: Beginner/Intermediate...
        # Bạn có thể gọi thêm assessment_worker để lấy lời phê chi tiết nếu muốn
        # "ai_feedback": assessment_worker.get_feedback(...) 
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)