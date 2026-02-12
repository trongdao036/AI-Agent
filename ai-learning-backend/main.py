import os
import json
import uuid
import shutil
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma  # Import chuẩn mới
import google.generativeai as genai

# Import các Agent
from agents.content_agent import ContentAgent
from agents.assessment_agent import AssessmentAgent

# ============================================================================
# 1. CẤU HÌNH MÔI TRƯỜNG & API KEY
# ============================================================================
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    print("⚠️ CẢNH BÁO: Chưa tìm thấy GEMINI_API_KEY trong file .env")
else:
    genai.configure(api_key=API_KEY)

# ============================================================================
# 2. CẤU HÌNH SERVER & THƯ MỤC
# ============================================================================
app = FastAPI()

# Cấp quyền cho Frontend (CORS) - Quan trọng để React gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đường dẫn tuyệt đối
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
DB_DIR = os.path.join(BASE_DIR, "chroma_db")
METADATA_FILE = os.path.join(BASE_DIR, "metadata.json")

# Tạo thư mục nếu chưa có
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ============================================================================
# 3. KHỞI TẠO CÁC AGENT & CÔNG CỤ
# ============================================================================
print("⏳ Đang tải mô hình Embedding (Lần đầu sẽ hơi lâu)...")
try:
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    print("✅ Đã tải xong Embedding Model.")
except Exception as e:
    print(f"❌ Lỗi tải Embedding Model: {e}")
    exit(1)

print("🔌 Đang kết nối Vector Database...")
# Lưu ý: Cần dùng đúng thư viện langchain_chroma
vector_db = Chroma(persist_directory=DB_DIR, embedding_function=embedding_model)

# Khởi tạo các Worker (Agent)
content_worker = ContentAgent(embedding_model, DB_DIR)
assessment_worker = AssessmentAgent(vector_db, API_KEY)

# ============================================================================
# 4. HELPER FUNCTIONS (Hàm phụ trợ)
# ============================================================================

def save_metadata(doc_id, title, description, filename, original_name):
    """Lưu thông tin bài giảng vào file JSON"""
    if not os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'w', encoding='utf-8') as f: json.dump([], f)
    
    try:
        with open(METADATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except:
        data = []
    
    # Thêm bản ghi mới
    new_record = {
        "id": doc_id,
        "title": title,
        "description": description,
        "filename": filename,           # Tên file hệ thống (để AI đọc)
        "original_name": original_name, # Tên file gốc (để hiển thị)
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
    return {"message": "AI Learning Backend is Running!"}

# --- API 1: GIÁO VIÊN UPLOAD (Lưu File + Tiêu đề + Mô tả) ---
@app.post("/teacher/upload")
async def teacher_upload(
    file: UploadFile = File(...), 
    title: str = Form(...),       
    description: str = Form(...)  
):
    try:
        # 1. Tạo tên file an toàn (tránh trùng lặp)
        safe_filename = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, safe_filename)
        
        # 2. Lưu file vật lý vào ổ cứng
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 3. Content Agent học bài (Xử lý file)
        print(f"\n🤖 Content Agent đang học: {file.filename}...")
        success = content_worker.process_and_store(file_path, safe_filename)
        
        if not success:
            raise HTTPException(status_code=400, detail="Không đọc được nội dung file PDF")

        # 4. Lưu thông tin vào kho đề (Metadata)
        doc_id = str(uuid.uuid4())
        saved_info = save_metadata(doc_id, title, description, safe_filename, file.filename)
        
        return {
            "status": "success", 
            "message": "Đã thêm tài liệu vào kho tri thức thành công!", 
            "data": saved_info
        }
    except Exception as e:
        print(f"❌ Lỗi Upload: {str(e)}")
        return {"status": "error", "message": str(e)}

# --- API 2: HỌC SINH LẤY DANH SÁCH ĐỀ ---
@app.get("/student/documents")
async def get_documents():
    """Trả về danh sách các bài học đang có trong hệ thống"""
    if not os.path.exists(METADATA_FILE): 
        return []
    try:
        with open(METADATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

# --- API 3: SINH ĐỀ NGẪU NHIÊN (Assessment Agent) ---
@app.post("/student/generate-quiz")
async def generate_quiz(request: dict):
    print("\n\n==================================================")
    print("🚀 [DEBUG] API /student/generate-quiz ĐÃ NHẬN REQUEST!")
    
    filename = request.get("filename")
    print(f"📂 [DEBUG] Filename nhận được: {filename}")
    
    if not filename:
        print("❌ [LỖI] Không có filename gửi lên!")
        return {"error": "Thiếu tên file"}

    try:
        print("⏳ [DEBUG] Đang gọi assessment_worker.generate_quiz()...")
        
        # Gọi Agent sinh câu hỏi
        quiz = assessment_worker.generate_quiz(topic=filename)
        
        # Kiểm tra kết quả trả về
        if not quiz or len(quiz) == 0:
            print("⚠️ [CẢNH BÁO] Agent trả về rỗng -> Kích hoạt Fallback.")
            raise ValueError("Agent returned empty list")
            
        print(f"✅ [DEBUG] Trả về {len(quiz)} câu hỏi cho Frontend.")
        return quiz

    except Exception as e:
        print(f"❌ [CRITICAL ERROR] Lỗi sinh quiz: {str(e)}")
        # TRẢ VỀ CÂU HỎI MẪU ĐỂ FRONTEND KHÔNG BỊ TREO
        return [
            {
                "id": 1, 
                "question": f"Hệ thống đang gặp sự cố nhỏ ({str(e)}). Bạn có thấy câu hỏi này không?", 
                "options": ["A. Có, tôi thấy", "B. Không"], 
                "answer": "A"
            },
            {
                "id": 2, 
                "question": "1 + 1 = ?", 
                "options": ["A. 2", "B. 3", "C. 4", "D. 5"], 
                "answer": "A"
            }
        ]

# --- API 4: CHẤM ĐIỂM & NHẬN XÉT (Evaluation Agent Logic) ---
@app.post("/student/submit-quiz")
async def submit_quiz(request: dict):
    """Chấm điểm và nhờ AI nhận xét"""
    questions = request.get('questions', [])
    user_answers = request.get('user_answers', {})
    
    if not questions:
        return {"error": "Không có dữ liệu câu hỏi"}

    print("👩‍🏫 Đang chấm bài và nhận xét...")
    
    try:
        result = assessment_worker.evaluate_and_feedback(questions, user_answers)
        return result
    except Exception as e:
        print(f"❌ Lỗi chấm điểm: {str(e)}")
        return {
            "score": 0,
            "total": len(questions),
            "feedback": "Lỗi chấm điểm. Nhưng bạn đã làm rất tốt!"
        }

if __name__ == "__main__":
    import uvicorn
    # Reload=True để tự động restart server khi sửa code (chỉ dùng lúc dev)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)