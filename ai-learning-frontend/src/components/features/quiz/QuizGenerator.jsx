import React, { useState } from 'react';
import { Play, CheckCircle, RefreshCcw, Loader2, Award, BookOpen, BarChart } from 'lucide-react';

const QuizGenerator = ({ filename, topicName }) => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  
  // State mới cho kết quả từ Profiling Agent
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState(null); 
  const [submitting, setSubmitting] = useState(false);

  // --- 1. HÀM TẠO ĐỀ THI ---
  const handleGenerate = async () => {
    console.log("Check Filename:", filename);

    if (!filename) {
      alert("Lỗi: Không tìm thấy tên file (Filename is undefined). Hãy quay lại thư viện chọn lại bài.");
      return;
    }

    setLoading(true);
    setQuizData(null);
    setSubmitted(false);
    setResultData(null);

    try {
      const res = await fetch("http://localhost:8000/student/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: filename })
      });

      const data = await res.json();

      if (data.error) {
        alert("Server báo lỗi: " + data.error);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setQuizData(data);
      } else {
        alert("AI trả về dữ liệu rỗng hoặc sai định dạng.");
      }

    } catch (error) {
      alert("Lỗi kết nối Server: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. HÀM NỘP BÀI (GỌI BACKEND CHẤM ĐIỂM & XẾP LOẠI) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target);
    const userAnswers = {};

    // Gom đáp án người dùng chọn
    quizData.forEach(q => {
        // Backend đang mong đợi key dạng "q_1", "q_2"...
        const key = `q_${q.id}`;
        const value = formData.get(key);
        if (value) {
            userAnswers[key] = value; 
        }
    });

    try {
        // Gọi API chấm điểm và xếp loại
        const res = await fetch("http://localhost:8000/student/submit-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                student_id: "HOC_VIEN_01", // Bạn có thể thay bằng ID thật sau này
                questions: quizData,       // Gửi lại câu hỏi gốc để server đối chiếu
                user_answers: userAnswers  // Đáp án người dùng
            })
        });

        const data = await res.json();
        
        // Lưu kết quả server trả về (bao gồm cả Profiling)
        setResultData(data); 
        setSubmitted(true);

    } catch (error) {
        alert("Lỗi khi nộp bài: " + error.message);
    } finally {
        setSubmitting(false);
    }
  };

  // --- GIAO DIỆN 1: CHƯA CÓ ĐỀ ---
  if (!quizData) return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
      <div className="bg-indigo-100 p-6 rounded-full">
        <Play size={48} className="text-indigo-600 ml-1" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-800">Kiểm tra kiến thức</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Chủ đề: <span className="font-bold text-indigo-600">"{topicName}"</span>
          <br />
          <span className="text-xs text-gray-400">(File ID: {filename})</span>
        </p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2 disabled:bg-gray-400"
      >
        {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw />}
        {loading ? "AI đang soạn đề..." : "Bắt đầu làm bài"}
      </button>
    </div>
  );

  // --- GIAO DIỆN 2: KẾT QUẢ & XẾP LOẠI (HIỂN THỊ PROFILING) ---
  if (submitted && resultData) {
      const { profile, score_info } = resultData;
      
      // Màu sắc dựa trên Level
      let levelColor = "text-blue-600 bg-blue-100";
      if (profile.current_level.includes("Beginner")) levelColor = "text-orange-600 bg-orange-100";
      if (profile.current_level.includes("Advanced")) levelColor = "text-green-600 bg-green-100";

      return (
        <div className="flex flex-col items-center justify-center h-full p-6 overflow-y-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full text-center">
                <div className="mb-6 inline-block p-4 rounded-full bg-green-100 text-green-600">
                    <CheckCircle size={64} />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Điểm số: {score_info}</h2>
                <p className="text-gray-500 mb-6">Bạn đã hoàn thành bài kiểm tra.</p>

                {/* --- KHU VỰC HIỂN THỊ ĐÁNH GIÁ NĂNG LỰC --- */}
                <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                        <BarChart className="text-indigo-600" />
                        <div>
                            <p className="text-sm text-gray-500">Trình độ hiện tại</p>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${levelColor}`}>
                                {profile.current_level}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3 border-t border-gray-200 pt-4">
                        <Award className="text-indigo-600 mt-1" />
                        <div>
                            <p className="text-sm text-gray-500">Điểm trọng số (IRT)</p>
                            <p className="font-semibold text-gray-800">{profile.score_weighted} / 100</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 border-t border-gray-200 pt-4">
                        <BookOpen className="text-indigo-600 mt-1" />
                        <div>
                            <p className="text-sm text-gray-500">Lời khuyên từ AI</p>
                            <p className="font-medium text-gray-800 italic">"{profile.recommendation}"</p>
                        </div>
                    </div>
                </div>

                <button onClick={handleGenerate} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    <RefreshCcw size={20}/> Làm đề khác
                </button>
            </div>
        </div>
      );
  }

  // --- GIAO DIỆN 3: LÀM BÀI ---
  return (
    <div className="h-full overflow-y-auto pr-2 pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        {quizData.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="font-bold text-gray-800 mb-4 text-lg">Câu {idx + 1}: {q.question}</p>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <label 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-indigo-50 cursor-pointer transition-colors"
                >
                  <input 
                    type="radio" 
                    name={`q_${q.id}`} 
                    value={opt.charAt(0)} // Lấy ký tự đầu (A, B, C...)
                    required 
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-gray-900 font-medium leading-relaxed">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md flex justify-center items-center gap-2 disabled:bg-gray-400"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle />}
            {submitting ? "Đang chấm điểm..." : "Nộp bài"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizGenerator;