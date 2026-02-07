import React, { useState } from 'react';
import { UploadCloud, FileText, Users, BarChart3 } from 'lucide-react';
import Button from '../../components/common/Button';
import Card, { CardHeader } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import UploadModal from '../../components/features/upload/UploadModal';

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. 👇 State danh sách tài liệu (Ban đầu giả lập 2 file có sẵn)
  const [documents, setDocuments] = useState([
    { name: 'Giao_trinh_Python_Co_ban.pdf', size: '2.4 MB', status: 'Done', date: '12/05/2025' },
    { name: 'Kien_truc_May_tinh_Chuong_1.docx', size: '1.1 MB', status: 'Processing', date: 'Hôm nay' },
  ]);

  // 2. 👇 HÀM handleNewUpload NẰM Ở ĐÂY
  // Hàm này sẽ được gọi khi Modal báo upload thành công
  const handleNewUpload = (file) => {
    // Tạo đối tượng tài liệu mới từ file nhận được
    const newDoc = {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB', // Đổi byte sang MB
      status: 'Processing', // Mặc định là đang xử lý
      date: 'Vừa xong'
    };

    // Thêm vào đầu danh sách (dùng toán tử spread ...)
    setDocuments([newDoc, ...documents]);
  };

  return (
    <div className="space-y-8">
      {/* Header & Button Open Modal */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Quản lý Học liệu 📚</h1>
           <p className="text-gray-500">Tải tài liệu lên để AI Agent tự động soạn bài giảng.</p>
        </div>
        
        <Button 
          className="shadow-lg shadow-indigo-200"
          onClick={() => setIsModalOpen(true)} 
        >
           <UploadCloud size={20} className="mr-2" /> Tải tài liệu mới
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
            { label: 'Tổng số tài liệu', value: documents.length, icon: <FileText className="text-blue-600" />, color: 'bg-blue-50' }, // Số lượng tự động cập nhật
            { label: 'Học viên tham gia', value: '45', icon: <Users className="text-green-600" />, color: 'bg-green-50' },
            { label: 'Quiz đã tạo', value: '128', icon: <BarChart3 className="text-purple-600" />, color: 'bg-purple-50' }
         ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
               <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  {stat.icon}
               </div>
               <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <h4 className="text-2xl font-bold text-gray-800">{stat.value}</h4>
               </div>
            </div>
         ))}
      </div>

      {/* Table Documents */}
      <Card>
         <CardHeader>
            <h3 className="text-lg font-bold text-gray-800">Tài liệu gần đây</h3>
            <Button variant="ghost" size="sm">Xem tất cả</Button>
         </CardHeader>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-gray-100 text-sm text-gray-500">
                     <th className="p-4 font-medium">Tên tài liệu</th>
                     <th className="p-4 font-medium">Dung lượng</th>
                     <th className="p-4 font-medium">Trạng thái AI</th>
                     <th className="p-4 font-medium">Ngày upload</th>
                     <th className="p-4 font-medium text-right">Hành động</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {/* Render danh sách từ State */}
                  {documents.map((doc, idx) => (
                     <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center text-red-500">
                              <FileText size={16} />
                           </div>
                           <span className="font-medium text-gray-700">{doc.name}</span>
                        </td>
                        <td className="p-4 text-gray-500">{doc.size}</td>
                        <td className="p-4">
                           {doc.status === 'Done' ? (
                              <Badge variant="success">Đã xử lý xong</Badge>
                           ) : (
                              <Badge variant="warning" className="animate-pulse">AI đang đọc...</Badge>
                           )}
                        </td>
                        <td className="p-4 text-gray-500">{doc.date}</td>
                        <td className="p-4 text-right">
                           <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">Chi tiết</Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

      {/* 3. 👇 Truyền hàm handleNewUpload vào Modal qua prop 'onUploadSuccess' */}
      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={handleNewUpload} 
      />
    </div>
  );
};

export default TeacherDashboard;