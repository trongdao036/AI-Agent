import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import Button from '../../common/Button';

const QuizView = ({ quizData, onFinish }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút làm bài
  const [isFinished, setIsFinished] = useState(false);

  // Bộ đếm thời gian
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleFinish = () => {
    setIsFinished(true);
    // Tính điểm sơ bộ
    let score = 0;
    quizData.forEach((q, index) => {
      if (answers[index] === q.answer) score++;
    });
    const finalScore = (score / quizData.length) * 10;
    onFinish(finalScore); // Gửi điểm cho Evaluation Agent
  };

  if (isFinished) return (
    <div className="text-center p-10 bg-white rounded-2xl shadow-lg border border-green-100">
      <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Hoàn thành bài tập!</h2>
      <p className="text-gray-500 mt-2">Kết quả của bạn đã được ghi lại bởi Evaluation Agent.</p>
      <Button className="mt-6" onClick={() => window.location.reload()}>Quay lại bài học</Button>
    </div>
  );

  const q = quizData[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header bài tập */}
      <div className="px-8 py-4 bg-gray-50 border-b flex justify-between items-center">
        <span className="font-medium text-gray-600">Câu hỏi {currentQuestion + 1}/{quizData.length}</span>
        <div className="flex items-center gap-2 text-amber-600 font-mono font-bold">
          <Clock size={18} />
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Nội dung câu hỏi */}
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                answers[currentQuestion] === opt 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              <span className="font-bold mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Điều hướng */}
      <div className="px-8 py-4 bg-gray-50 border-t flex justify-between">
        <Button 
          variant="ghost" 
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(v => v - 1)}
        > Quay lại </Button>
        
        {currentQuestion < quizData.length - 1 ? (
          <Button onClick={() => setCurrentQuestion(v => v + 1)}> Tiếp theo </Button>
        ) : (
          <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700"> Nộp bài </Button>
        )}
      </div>
    </div>
  );
};

export default QuizView;