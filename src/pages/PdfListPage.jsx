import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import SubscribeModal from './SubscribeModal';

// ✅ API URL from environment variable
const API_URL = import.meta.env.VITE_API_BASE_URL

export default function PdfListPage() {
  const [pdfs, setPdfs] = useState([]);
  const [filteredPdfs, setFilteredPdfs] = useState([]);
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { requestDownload, canDownload } = useSubscription();

  useEffect(() => {
    fetchPdfs();
  }, []);

  useEffect(() => {
    filterPdfs();
  }, [pdfs, category, language, searchTerm]);

  const fetchPdfs = async () => {
    try {
      const response = await axios.get(`${API_URL}/pdf`, {
        params: { category, language }
      });
      
      console.log('API Response:', response.data);
      
      // Handle different response formats
      if (response.data && response.data.success) {
        if (Array.isArray(response.data.pdfs)) {
          setPdfs(response.data.pdfs);
          setFilteredPdfs(response.data.pdfs);
        } else if (Array.isArray(response.data)) {
          setPdfs(response.data);
          setFilteredPdfs(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setPdfs(response.data.data);
          setFilteredPdfs(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setPdfs([]);
          setFilteredPdfs([]);
        }
      } else {
        if (Array.isArray(response.data)) {
          setPdfs(response.data);
          setFilteredPdfs(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setPdfs([]);
          setFilteredPdfs([]);
        }
      }
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPdfs = () => {
    if (!Array.isArray(pdfs)) {
      console.error('pdfs is not an array:', pdfs);
      return;
    }
    
    let filtered = [...pdfs];

    if (category) {
      filtered = filtered.filter(pdf => 
        pdf.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (language) {
      filtered = filtered.filter(pdf => 
        pdf.language?.toLowerCase() === language.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(pdf =>
        pdf.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPdfs(filtered);
  };

  const handleDownloadClick = (pdf) => {
    requestDownload(pdf._id, pdf.title);
  };

  const categories = Array.isArray(pdfs) 
    ? [...new Set(pdfs.map(pdf => pdf.category).filter(Boolean))]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📚 PDF Library</h1>
        <p className="text-gray-400">
          Browse and read PDFs online. Subscribe to download.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search PDFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Languages</option>
              <option value="English">English 🇬🇧</option>
              <option value="Hindi">हिंदी 🇮🇳</option>
              <option value="Marathi">मराठी 🇮🇳</option>
            </select>
          </div>
        </div>
      </div>

      {/* PDF Grid */}
      {!Array.isArray(filteredPdfs) || filteredPdfs.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-xl">
          <p className="text-gray-400 text-lg">No PDFs found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPdfs.map((pdf) => (
            <div key={pdf._id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition group">
              {/* PDF Thumbnail/Icon */}
              <div className="h-40 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-6xl">📄</span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                  {pdf.title || 'Untitled PDF'}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  {pdf.category && (
                    <span className="bg-blue-600 text-xs px-2 py-1 rounded-full">
                      {pdf.category}
                    </span>
                  )}
                  {pdf.language && (
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                      {pdf.language === 'English' ? '🇬🇧' : 
                       pdf.language === 'Hindi' ? '🇮🇳' : '🇮🇳'} {pdf.language}
                    </span>
                  )}
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {pdf.description || 'No description available'}
                </p>

                <p className="text-gray-500 text-xs mb-4">
                  Size: {(pdf.size / 1024).toFixed(2)} KB
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    to={`/view/${pdf._id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-2 px-3 rounded-lg text-sm transition"
                  >
                    Read
                  </Link>
                  
                  <button
                    onClick={() => handleDownloadClick(pdf)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition"
                  >
                    {canDownload() ? 'Download' : '🔒 Download'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <SubscribeModal />
    </div>
  );
}