class AdaptiveAgent:
    def recommend_path(self, profile):
        # Dựa vào level từ Profiling Agent để chọn tài liệu
        if profile['current_level'] == "Basic":
            return "Gợi ý: Cậu nên xem lại video nền tảng trước khi làm bài tập."
        return "Gợi ý: Cậu có thể thử thách với các bài tập nâng cao."