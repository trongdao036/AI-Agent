import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API Key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Lỗi: Chưa có GEMINI_API_KEY trong file .env")
else:
    genai.configure(api_key=api_key)
    print(f"🔑 API Key OK. Đang lấy danh sách Model...")
    
    try:
        print("--- DANH SÁCH MODEL KHẢ DỤNG ---")
        for m in genai.list_models():
            # Chỉ lấy các model hỗ trợ sinh nội dung (generateContent)
            if 'generateContent' in m.supported_generation_methods:
                print(f"✅ {m.name}")
    except Exception as e:
        print(f"❌ Lỗi kết nối: {e}")