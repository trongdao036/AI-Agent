from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
from pypdf import PdfReader

# 👇 Import các "vũ khí" mới của LangChain & Chroma

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
DB_DIR = "chroma_db" # Thư mục sẽ chứa "bộ não" của AI
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1. Khởi tạo mô hình Embedding (Chạy offline, miễn phí)
# Lần đầu chạy nó sẽ tải model về máy (khoảng 100MB)
print("⏳ Đang tải mô hình AI Embedding... (Chờ chút nhé)")
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
print("✅ Mô hình đã sẵn sàng!")

def process_and_store_document(file_path, filename):
    # A. Đọc PDF
    print(f"1. Đang đọc file: {filename}")
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
        
    if not text.strip():
        return False
        
    # B. Cắt nhỏ văn bản (Chunking)
    # Cắt thành các đoạn 1000 ký tự, gối nhau 100 ký tự
    print("2. Đang cắt nhỏ văn bản...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(text)
    
    # C. Lưu vào Vector Database (Chroma)
    print(f"3. Đang mã hóa {len(chunks)} đoạn văn thành Vector...")
    # Tạo Metadata để sau này biết đoạn này thuộc file nào
    metadatas = [{"source": filename} for _ in chunks]
    
    # Lưu vào ổ cứng
    Chroma.from_texts(
        texts=chunks,
        embedding=embedding_model,
        metadatas=metadatas,
        persist_directory=DB_DIR
    )
    print("✅ Đã lưu kiến thức vào bộ nhớ thành công!")
    return True

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # 1. Lưu file vật lý
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Xử lý AI: Đọc -> Cắt -> Lưu Vector
    try:
        success = process_and_store_document(file_path, file.filename)
        if success:
            return {"status": "success", "message": "Đã tiếp thu kiến thức từ tài liệu này!"}
        else:
            return {"status": "warning", "message": "File không có chữ hoặc bị lỗi."}
            
    except Exception as e:
        print(f"Lỗi: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)