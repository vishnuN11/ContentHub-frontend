import React, { useState } from 'react'
import AdminArticle from './AdminArticle';

export const AllArticles = () => {
    const [activeTab, setActiveTab] = useState("marathi");
    
      const tabClass = (tab) =>
        `px-4 py-2 rounded-t-md font-medium ${
          activeTab === tab
            ? "bg-white text-blue-600 border-t border-l border-r"
            : "bg-gray-100 text-gray-600 hover:text-blue-600"
        }`;
  return (
    <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto bg-white rounded shadow">
            
            {/* Header */}
            <div className="border-b p-4">
              <h1 className="text-2xl font-semibold">Article Panel</h1>
            </div>
    
            {/* Tabs */}
            <div className="flex border-b bg-gray-50 px-4">
              <button
                className={tabClass("marathi")}
                onClick={() => setActiveTab("marathi")}
              >
                Marathi Article
              </button>
              <button
                className={tabClass("english")}
                onClick={() => setActiveTab("english")}
              >
                English Articles
              </button>
              <button
                className={tabClass("hindi")}
                onClick={() => setActiveTab("hindi")}
              >
                 Hindi Articles
              </button>
            </div>
    
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "marathi" && (
                  <AdminArticle/>
              )}
    
              {activeTab === "english" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">English Articles</h2>
    
                  {/* 🔽 PUT YOUR ARTICLE TABLE HERE */}
                  <div className="border border-dashed rounded p-6 text-gray-400 text-center">
                    Article Table Goes Here
                  </div>
                </div>
              )}
    
              {activeTab === "hindi" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">hindi</h2>
    
                  {/* 🔽 PUT USER INFO / TABLE HERE */}
                  <div className="border border-dashed rounded p-6 text-gray-400 text-center">
                    User Info Goes Here
                  </div>
                </div>
              )}
            </div>
    
          </div>
        </div>
  )
}
