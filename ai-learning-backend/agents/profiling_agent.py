# agents/profiling_agent.py
import numpy as np
from sklearn.tree import DecisionTreeClassifier

class ProfilingAgent:
    def __init__(self):
        # Khởi tạo mô hình (có thể mở rộng train sau này)
        self.ml_model = DecisionTreeClassifier(max_depth=3)
        self.LEVELS = {
            "WEAK": "Beginner (Cần cố gắng)",
            "AVERAGE": "Intermediate (Khá)",
            "GOOD": "Advanced (Giỏi)"
        }

    def _calculate_irt_score(self, quiz_results):
        """Tính điểm dựa trên độ khó (IRT cơ bản)"""
        total_weight = 0
        earned_weight = 0
        
        questions = quiz_results.get('details', [])
        
        # Nếu không có chi tiết, tính trung bình cộng thường
        if not questions:
            raw_score = quiz_results.get('score', 0)
            total = quiz_results.get('total_questions', 1)
            return (raw_score / total) * 100 if total > 0 else 0

        for q in questions:
            # Mặc định độ khó là 1 nếu đề bài không có field 'difficulty'
            difficulty = q.get('difficulty', 1) 
            total_weight += difficulty
            if q.get('is_correct'):
                earned_weight += difficulty
        
        return (earned_weight / total_weight) * 100 if total_weight > 0 else 0

    def update_profile(self, student_id, quiz_results):
        # 1. Tính điểm trọng số
        final_score_percent = self._calculate_irt_score(quiz_results)
        
        # 2. Xếp loại
        if final_score_percent < 40:
            level = self.LEVELS["WEAK"]
            recommendation = "Nên ôn lại các kiến thức cơ bản."
        elif 40 <= final_score_percent < 70:
            level = self.LEVELS["AVERAGE"]
            recommendation = "Kiến thức ổn, hãy luyện thêm bài tập nâng cao."
        else:
            level = self.LEVELS["GOOD"]
            recommendation = "Xuất sắc! Đủ điều kiện học module tiếp theo."

        return {
            "student_id": student_id,
            "score_weighted": round(final_score_percent, 2),
            "current_level": level,
            "raw_score": f"{quiz_results.get('score')}/{quiz_results.get('total_questions')}",
            "recommendation": recommendation
        }