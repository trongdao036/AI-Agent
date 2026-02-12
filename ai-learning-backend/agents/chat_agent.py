import google.generativeai as genai
import os

class ChatAgent:
    def __init__(self, vector_db, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.vector_db = vector_db

    def answer(self, question):
        # 1. Tìm kiến thức liên quan từ ChromaDB
        docs = self.vector_db.similarity_search(question, k=3)
        context = "\n".join([d.page_content for d in docs])
        
        # 2. Dùng Gemini để diễn giải
        prompt = f"Dựa trên kiến thức sau đây: {context}\nHãy trả lời câu hỏi của học sinh: {question}. Trả lời thân thiện và dễ hiểu."
        response = self.model.generate_content(prompt)
        return response.text