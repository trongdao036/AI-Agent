import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Chào bạn! Tớ đã học xong tài liệu mới. Bạn cần hỏi gì không?' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Hiện câu hỏi của người dùng ngay lập tức
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Gửi xuống Chat Agent ở Backend
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      // 3. Hiện câu trả lời của AI
      setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Lỗi kết nối Server rồi cậu ơi!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 p-4 text-white font-bold flex items-center gap-2">
        <Bot size={24} /> Trợ giảng AI
      </div>

      {/* Nội dung Chat */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl flex gap-2 ${
              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 shadow-sm border'
            }`}>
              {m.role === 'ai' && <Bot size={18} className="mt-1" />}
              <div>{m.text}</div>
              {m.role === 'user' && <User size={18} className="mt-1" />}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-400 text-sm italic ml-2">AI đang suy nghĩ...</div>}
      </div>

      {/* Ô nhập liệu */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Hỏi gì đi..."
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;