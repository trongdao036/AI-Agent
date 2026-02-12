class ProfilingAgent:
    def update_profile(self, student_id, quiz_results):
        # Phân tích kết quả từ Assessment Agent
        score = quiz_results.get('score', 0)
        level = "Basic" if score < 50 else "Advanced"
        
        # Trả về phân loại để Adaptive Agent điều chỉnh
        return {"student_id": student_id, "current_level": level}