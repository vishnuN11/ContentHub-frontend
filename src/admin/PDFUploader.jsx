import React, { useState } from 'react';
import axios from 'axios';

function PDFUploader({ onUploadSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    language: 'English',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const categories = ['Books', 'Magazines', 'Reports', 'Manuals', 'Others'];
  const languages = ['English', 'Hindi', 'Marathi'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size cannot exceed 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('category', formData.category);
    uploadData.append('language', formData.language);
    uploadData.append('tags', formData.tags);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to upload PDFs');
        setUploading(false);
        return;
      }

      console.log('Uploading PDF with token:', token ? 'Token exists' : 'No token');

      const response = await axios.post(
        'http://localhost:5000/api/pdf/upload',
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            }
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      console.log('Upload response:', response.data);

      if (response.data.success) {
        // Success message
        alert('✅ PDF uploaded successfully!');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'Books',
          language: 'English',
          tags: ''
        });
        setFile(null);
        setProgress(0);
        
        // Reset file input
        const fileInput = document.getElementById('pdf-file');
        if (fileInput) fileInput.value = '';
        
        // Call the onUploadSuccess callback if provided
        if (onUploadSuccess && typeof onUploadSuccess === 'function') {
          console.log('Calling onUploadSuccess with:', response.data.pdf);
          onUploadSuccess(response.data.pdf);
        }
      } else {
        setError(response.data.message || 'Upload failed');
      }

    } catch (err) {
      console.error('Upload error:', err);
      
      // Handle different types of errors
      if (err.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again.');
      } else if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          setError('Session expired. Please login again.');
          // Optionally redirect to login
          // window.location.href = '/login';
        } else if (err.response.status === 403) {
          setError('You do not have permission to upload PDFs');
        } else if (err.response.status === 413) {
          setError('File too large. Maximum size is 10MB');
        } else {
          setError(err.response.data?.message || `Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        // Request made but no response
        setError('No response from server. Please check if server is running.');
      } else {
        // Something else happened
        setError('Error uploading PDF: ' + err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">📤 Upload PDF</h2>
      
      <form onSubmit={handleSubmit}>
        {/* File Input */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">PDF File *</label>
          <input
            id="pdf-file"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
            disabled={uploading}
          />
          {file && (
            <p className="text-green-400 text-sm mt-2">
              ✅ Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
            placeholder="Enter PDF title"
            required
            disabled={uploading}
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
            placeholder="Enter description"
            rows="3"
            disabled={uploading}
          />
        </div>

        {/* Category and Language */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              disabled={uploading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
              disabled={uploading}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
            placeholder="e.g. education, guide, tutorial"
            disabled={uploading}
          />
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-1 text-center">{progress}% uploaded</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
            ❌ {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading... {progress}%
            </span>
          ) : '📤 Upload PDF'}
        </button>
      </form>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
          <p>Debug: Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
          <p>API URL: http://localhost:5000/api/pdf/upload</p>
        </div>
      )}
    </div>
  );
}

export default PDFUploader;