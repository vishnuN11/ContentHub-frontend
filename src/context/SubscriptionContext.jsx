import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPdfForDownload, setSelectedPdfForDownload] = useState(null);

  // API URL
  const API_URL = 'http://localhost:5000';

  // सबस्क्रिप्शन स्टेटस चेक करा
  useEffect(() => {
    const checkSubscription = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/mock-payment/status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Subscription response:', response.data); // Debug
        
        // ✅ API response structure प्रमाणे subscription सेट करा
        if (response.data.success) {
          setSubscription(response.data);
        } else {
          setSubscription(null);
        }
      } catch (error) {
        console.error('Subscription check error:', error);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  // डाउनलोड चेक करा
  const canDownload = () => {
    if (!subscription) return false;
    
    // ✅ तुमच्या API response structure नुसार
    // MockPaymentRoutes मधून येणारा response
    return subscription.hasActiveSubscription === true;
  };

  // डाउनलोड रिक्वेस्ट
  const requestDownload = async (pdfId, pdfTitle) => {
    console.log('Download requested for:', pdfId, pdfTitle); // Debug
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to download');
      return;
    }

    if (canDownload()) {
      try {
        // ✅ API call through axios (better than window.open)
        const response = await axios.get(`${API_URL}/api/pdf/download/${pdfId}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob' // Important for file download
        });

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${pdfTitle || 'document'}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        console.log('Download successful');

      } catch (error) {
        console.error('Download error:', error);
        
        // Check if error is due to subscription
        if (error.response?.status === 403) {
          setSelectedPdfForDownload({ id: pdfId, title: pdfTitle });
          setShowSubscribeModal(true);
        } else {
          alert('Download failed. Please try again.');
        }
      }
    } else {
      // No subscription or expired
      setSelectedPdfForDownload({ id: pdfId, title: pdfTitle });
      setShowSubscribeModal(true);
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      canDownload,
      requestDownload,
      showSubscribeModal,
      setShowSubscribeModal,
      selectedPdfForDownload
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};