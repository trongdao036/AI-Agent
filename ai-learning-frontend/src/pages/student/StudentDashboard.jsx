import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, PlayCircle, Clock, FileText } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/documents");
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Lỗi tải:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
      {/* 1. Header & Tìm kiếm */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Thư viện Bài giảng 📚</h1>
          <p className="text-gray-500 mt-1">Chọn tài liệu để AI hỗ trợ học tập và kiểm tra.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition-all"
            placeholder="Tìm kiếm bài học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. Danh sách bài học (Grid View) */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-400">Đang tải dữ liệu...</div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-700">Chưa có bài giảng nào</h3>
          <p className="text-gray-500">Hãy nhờ giáo viên upload tài liệu nhé!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => navigate('/learn', { state: { currentDoc: doc } })}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden"
            >
              {/* Trang trí background */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BookOpen size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">PDF</span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                {doc.title}
              </h3>
              
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
                {doc.description}
              </p>

              <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} /> {new Date(parseFloat(doc.created_at) * 1000).toLocaleDateString('vi-VN')}
                </span>
                <button className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Vào học <PlayCircle size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;