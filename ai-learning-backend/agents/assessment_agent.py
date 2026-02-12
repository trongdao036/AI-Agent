import google.generativeai as genai
import json
import re
import time
import warnings

warnings.filterwarnings("ignore")

class AssessmentAgent:
    def __init__(self, vector_db, api_key):
        self.vector_db = vector_db
        genai.configure(api_key=api_key)
        
        # Danh sách các model để thử lần lượt (Ưu tiên Flash để nhanh & free)
        self.model_candidates = [
            'gemini-flash-latest',       # Ưu tiên 1: Bản Flash mới nhất (Thường là 1.5)
            'gemini-pro-latest',         # Ưu tiên 2: Bản Pro mới nhất
            'gemini-2.0-flash-lite-001', # Ưu tiên 3: Bản Lite siêu nhẹ (Ít bị 429)
            'gemini-1.5-flash-8b'        # Ưu tiên 4: Bản siêu nhỏ
        ]
        # Khởi tạo mặc định
        self.current_model = genai.GenerativeModel(self.model_candidates[0])

    def clean_json_string(self, json_str):
        try:
            clean = re.sub(r'```json', '', json_str)
            clean = re.sub(r'```', '', clean)
            return clean.strip()
        except:
            return ""

    def call_gemini_with_fallback(self, prompt):
        """Hàm thông minh: Thử từng model cho đến khi được thì thôi"""
        
        for model_name in self.model_candidates:
            try:
                print(f"🔄 Đang thử model: {model_name}...")
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                return response
            except Exception as e:
                err = str(e).lower()
                # Nếu lỗi 404 (Không tìm thấy) hoặc 429 (Hết quota) -> Thử cái tiếp theo
                if "404" in err or "not found" in err or "429" in err or "quota" in err:
                    print(f"⚠️ Model {model_name} bị lỗi ({'Quota' if '429' in err else 'Not Found'}). Đang đổi model khác...")
                    continue # Chuyển sang vòng lặp tiếp theo
                else:
                    raise e # Lỗi khác (Code sai) thì báo luôn
        
        raise Exception("Đã thử tất cả Model nhưng đều thất bại. Google đang chặn.")

    def generate_quiz(self, topic):
        print(f"\n--- 🚀 BẮT ĐẦU SINH QUIZ: {topic} ---")
        
        # 1. TÌM KIẾM DỮ LIỆU
        try:
            docs = self.vector_db.similarity_search("tóm tắt nội dung", k=5, filter={"source": topic})
            if not docs:
                docs = self.vector_db.similarity_search("khái niệm", k=4)
            
            if docs:
                context = "\n".join([d.page_content for d in docs])
                print(f"✅ Đã có ngữ cảnh ({len(docs)} đoạn).")
            else:
                context = "Lập trình cơ bản."
        except:
            context = "Kiến thức máy tính."

        # 2. PROMPT
        prompt = f"""
        Dựa trên nội dung: "{context[:4000]}"
        
        Hãy đóng vai Giảng viên. Tạo 5 câu hỏi trắc nghiệm Tiếng Việt.
        YÊU CẦU DUY NHẤT: Trả về JSON ARRAY thuần túy:
        [
            {{ "id": 1, "question": "...", "options": ["A","B"], "answer": "A" }}
        ]
        """

        try:
            # 3. GỌI GEMINI (DÙNG HÀM FALLBACK)
            response = self.call_gemini_with_fallback(prompt)
            raw_text = self.clean_json_string(response.text)
            
            # XỬ LÝ JSON
            if "[" in raw_text and "]" in raw_text:
                json_str = raw_text[raw_text.find("["):raw_text.rfind("]")+1]
                data = json.loads(json_str)
            else:
                data = json.loads(raw_text)

            if isinstance(data, dict):
                for k in data.keys():
                    if isinstance(data[k], list):
                        data = data[k]
                        break
            
            if not isinstance(data, list): data = [data]

            print(f"🎉 Thành công! Sinh {len(data)} câu hỏi.")
            return data

        except Exception as e:
            print(f"❌ Lỗi sinh Quiz: {str(e)}")
            return [
                {
                    "id": 1, 
                    "question": f"Tất cả model đều bận: {str(e)}", 
                    "options": ["A. OK"], 
                    "answer": "A"
                },
                {
                    "id": 2, 
                    "question": "1 + 1 = ?", 
                    "options": ["A. 2", "B. 3"], 
                    "answer": "A"
                }
            ]

    def evaluate_and_feedback(self, questions, user_answers):
        score = 0
        for q in questions:
            if str(user_answers.get(str(q['id']))) == str(q['answer']): score += 1
        return {"score": score, "total": len(questions), "feedback": f"Kết quả: {score}/{len(questions)}"}