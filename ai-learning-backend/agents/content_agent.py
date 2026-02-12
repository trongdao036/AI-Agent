import os
from langchain_community.document_loaders import PyPDFLoader
# --- SỬA DÒNG IMPORT NÀY ---
from langchain_text_splitters import RecursiveCharacterTextSplitter 
# ---------------------------
from langchain_chroma import Chroma

class ContentAgent:
    def __init__(self, embedding_model, db_dir):
        self.embedding_model = embedding_model
        self.db_dir = db_dir
        self.vector_db = Chroma(persist_directory=db_dir, embedding_function=embedding_model)

    def process_and_store(self, file_path, filename):
        try:
            print(f"📚 Content Agent: Đang đọc file {filename}...")
            
            # 1. Đọc file PDF
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            if not documents:
                print("❌ File PDF rỗng hoặc không đọc được text.")
                return False

            # 2. Chia nhỏ văn bản (Chunking)
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            chunks = text_splitter.split_documents(documents)
            
            # --- QUAN TRỌNG: GẮN METADATA "SOURCE" ---
            # Để sau này AssessmentAgent có thể tìm đúng file này bằng filter={"source": filename}
            for chunk in chunks:
                chunk.metadata["source"] = filename 

            # 3. Lưu vào Vector DB
            if chunks:
                self.vector_db.add_documents(chunks)
                print(f"✅ Đã lưu {len(chunks)} đoạn văn vào Kho tri thức.")
                return True
            
            return False

        except Exception as e:
            print(f"❌ Lỗi xử lý Content: {str(e)}")
            return False