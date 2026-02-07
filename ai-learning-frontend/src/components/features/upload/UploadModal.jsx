import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import Button from '../../common/Button';
import Input from '../../common/Input';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);

    try {
      // 1. Tạo thùng chứa file (FormData)
      const formData = new FormData();
      formData.append("file", file); // Chữ "file" này phải khớp với bên Python

      // 2. Gửi file sang Server Python (Port 8000)
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      // 3. Xử lý kết quả trả về
      if (response.ok) {
        const data = await response.json(); // Đọc tin nhắn từ Python
        console.log("Server phản hồi:", data);

        // Báo cho Dashboard biết để cập nhật bảng
        if (onUploadSuccess) {
          onUploadSuccess(file);
        }

        alert("Upload thành công! Python đã nhận được file.");
        setFile(null);
        onClose();
      } else {
        alert("Lỗi! Server Python từ chối nhận file.");
      }

    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không tìm thấy Server Python! Bạn đã chạy 'python main.py' chưa?");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-lg">Tải lên học liệu mới</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Khu vực kéo thả file */}
          <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
              file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
            }`}>
            
            {file ? (
              <>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                  <FileText size={24} />
                </div>
                <p className="font-medium text-green-800 text-center">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button onClick={() => setFile(null)} className="text-xs text-red-500 mt-3 font-medium hover:underline">
                  Xóa file này
                </button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                  <Upload size={24} />
                </div>
                <p className="text-gray-600 font-medium mb-1">Click để chọn tài liệu</p>
                <p className="text-xs text-gray-400">Hỗ trợ PDF, DOCX (Max 20MB)</p>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".pdf,.docx,.doc"
                />
              </>
            )}
          </div>

          <Input label="Tên chủ đề (Optional)" placeholder="Ví dụ: Chương 1 - Nhập môn..." />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Hủy bỏ</Button>
          <Button 
            disabled={!file} 
            isLoading={isUploading} 
            onClick={handleUpload}
            className="shadow-indigo-200"
          >
            {isUploading ? 'Đang gửi sang AI...' : 'Bắt đầu phân tích'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;