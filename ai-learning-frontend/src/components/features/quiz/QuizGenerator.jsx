import React, { useState } from 'react';
import { Play, CheckCircle, RefreshCcw, Loader2, AlertCircle } from 'lucide-react';

const QuizGenerator = ({ filename, topicName }) => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerate = async () => {
    // 1. Kiểm tra filename trước khi gửi
    console.log("Check Filename:", filename);

    if (!filename) {
      alert("Lỗi: Không tìm thấy tên file (Filename is undefined). Hãy quay lại thư viện chọn lại bài.");
      return;
    }

    setLoading(true);
    setQuizData(null);
    setSubmitted(false);

    try {
      const res = await fetch("http://localhost:8000/student/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // 2. Gửi đúng key "filename"
        body: JSON.stringify({ filename: filename })
      });

      const data = await res.json();

      // Xử lý lỗi từ Backend trả về
      if (data.error) {
        alert("Server báo lỗi: " + data.error);
        return;
      }

      // Nếu data trả về là mảng câu hỏi
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

  // --- GIAO DIỆN 2: KẾT QUẢ ---
  if (submitted) return (
    <div className="text-center p-8">
      <div className="mb-6 inline-block p-4 rounded-full bg-green-100 text-green-600">
        <CheckCircle size={64} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Kết quả: {score}/{quizData.length}</h2>
      <p className="text-gray-600 mb-6">Bạn đã hoàn thành bài kiểm tra.</p>
      <button onClick={handleGenerate} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold mt-4 hover:bg-indigo-700 transition-colors">
        Làm đề khác
      </button>
    </div>
  );

  // --- GIAO DIỆN 3: LÀM BÀI ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let correct = 0;
    quizData.forEach(q => {
      // So sánh đáp án (Lấy ký tự đầu tiên của value, ví dụ 'A' từ 'A. ...')
      if (formData.get(`q_${q.id}`) === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

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
                    value={opt.charAt(0)} 
                    required 
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  {/* --- SỬA LỖI MỜ CHỮ TẠI ĐÂY --- */}
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
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-md"
          >
            Nộp bài
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizGenerator;