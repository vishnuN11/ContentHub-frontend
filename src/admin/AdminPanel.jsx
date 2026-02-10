import { useState } from "react";
import React from "react";
import CreateArticle from "./CreateArticle";
import { AllArticles } from "./AllArticles";
import AdminArticle from "./AdminArticle";
export  function AdminPanel() {
  const [activeTab, setActiveTab] = useState("create");

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
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 px-4">
          <button
            className={tabClass("create")}
            onClick={() => setActiveTab("create")}
          >
            Create Article
          </button>
          <button
            className={tabClass("articles")}
            onClick={() => setActiveTab("articles")}
          >
            All Articles
          </button>
          <button
            className={tabClass("users")}
            onClick={() => setActiveTab("users")}
          >
            User Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "create" && (
            <CreateArticle/>
          )}

          {activeTab === "articles" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Articles</h2>

             <AdminArticle/>
            </div>
          )}

          {activeTab === "users" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">User Info</h2>

              {/* 🔽 PUT USER INFO / TABLE HERE */}
              <div className="border border-dashed rounded p-6 text-gray-400 text-center">
                User Info Goes Here
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
