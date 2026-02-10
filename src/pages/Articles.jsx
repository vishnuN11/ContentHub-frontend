import React, { useEffect, useState } from "react";
import {
  HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ShareIcon
} from "@heroicons/react/24/outline";
import axios from "axios";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [showMoreId, setShowMoreId] = useState(null);
  const [showCommentsId, setShowCommentsId] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState({});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeShareArticle, setActiveShareArticle] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // save this at login

  /* =======================
     FETCH ARTICLES
  ======================= */
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/articles?lang=mr`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArticles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch articles error", err);
    }
  };

  /* =======================
     LIKE / UNLIKE
  ======================= */
  // const toggleLike = async (articleId) => {
  //   try {
  //     const res = await axios.put(
  //       `http://localhost:5000/api/articles/${articleId}/like`,
  //       {},
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     setArticles((prev) =>
  //       prev.map((a) =>
  //         a._id === articleId
  //           ? {
  //               ...a,
  //               isLiked: res.data.liked,
  //               likesCount: res.data.likesCount
  //             }
  //           : a
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Like error", err);
  //   }
  // };

  const toggleLike = async (articleId) => {
    setArticles((prev) =>
      prev.map((a) =>
        a._id === articleId
          ? {
            ...a,
            isLiked: !a.isLiked,
            likesCount: a.isLiked
              ? a.likesCount - 1
              : a.likesCount + 1
          }
          : a
      )
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/articles/${articleId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Like error", err);
      fetchArticles(); // rollback safety
    }
  };

  /* =======================
     FETCH COMMENTS
  ======================= */
  const fetchComments = async (articleId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/articles/${articleId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => ({
        ...prev,
        [articleId]: res.data
      }));
    } catch (err) {
      console.error("Fetch comments error", err);
    }
  };

  /* =======================
     SHOW / HIDE COMMENTS
  ======================= */
  const toggleComments = (articleId) => {
    if (showCommentsId === articleId) {
      setShowCommentsId(null);
    } else {
      setShowCommentsId(articleId);
      fetchComments(articleId);
    }
  };

  /* =======================
     ADD COMMENT
  ======================= */
  const addComment = async (articleId) => {
    if (!commentText[articleId]?.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/articles/${articleId}/comment`,
        { text: commentText[articleId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentText((prev) => ({ ...prev, [articleId]: "" }));
      fetchComments(articleId);
      setShowCommentsId(articleId);
    } catch (err) {
      console.error("Add comment error", err);
    }
  };

  /* =======================
     DELETE COMMENT
  ======================= */
  const deleteComment = async (articleId, commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/articles/${articleId}/comment/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComments(articleId);
    } catch (err) {
      console.error("Delete comment error", err);
    }
  };
  const handleShare = async (article) => {
    const shareData = {
      title: article.title,
      text: `Check out this article: ${article.title} by ${article.author}`,
      url: window.location.href, // This will automatically use your live URL when hosted
    };

    // 1. Try native mobile sharing first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // 2. Fallback for Desktop: Open WhatsApp directly
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareData.text + " " + shareData.url
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const openShareModal = (article) => {
    setActiveShareArticle(article);
    setIsShareModalOpen(true);
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/article/${activeShareArticle._id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };
  return (
    <main className="bg-gray-100 min-h-screen py-6 px-2">
      {articles.map((article) => (
        <article
          key={article._id}
          className="bg-white rounded-xl shadow-sm border p-4 max-w-2xl mx-auto mb-6"
        >
          {/* ================= HEADER ================= */}
          <header className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-800">
              {article.title}
            </h2>
            <p className="text-xs text-gray-500">
              {article.date
                ? new Date(article.date).toDateString()
                : ""}
            </p>
          </header>

          {/* ================= BODY ================= */}
          <p className="text-gray-700 text-sm mt-2 leading-relaxed">
            {showMoreId === article._id
              ? article.description
              : article.description?.slice(0, 180)}

            {article.description?.length > 180 && (
              <button
                onClick={() =>
                  setShowMoreId(
                    showMoreId === article._id ? null : article._id
                  )
                }
                className="text-blue-600 ml-1 text-sm"
              >
                {showMoreId === article._id
                  ? "Read less"
                  : "Read more"}
              </button>
            )}
          </p>

          {/* ================= AUTHOR ================= */}
          <div className="mt-3 text-sm text-gray-600">
            ✍️ {article.author}
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-between items-center mt-4 border-t pt-3 text-gray-600">
            <button
              onClick={() => toggleLike(article._id)}
              className={`flex items-center gap-1 ${article.isLiked ? "text-blue-600" : ""
                }`}
            >
              <HandThumbUpIcon className="h-5 w-5" />
              {article.likesCount || 0}
            </button>

            <button
              onClick={() => toggleComments(article._id)}
              className="flex items-center gap-1 text-sm"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              {article.commentsCount || 0}
              <span className="text-blue-600 ml-1">
                {showCommentsId === article._id
                  ? "Hide"
                  : "Show"}
              </span>
            </button>

            <button
              onClick={() => openShareModal(article)}
              className="flex items-center gap-1 text-sm hover:text-blue-600 transition"
            >
              <ShareIcon className="h-5 w-5 cursor-pointer" />
              <span>Share</span>
            </button>
          </div>

          {/* ================= ADD COMMENT ================= */}
          <div className="mt-3">
            <input
              value={commentText[article._id] || ""}
              onChange={(e) =>
                setCommentText((prev) => ({
                  ...prev,
                  [article._id]: e.target.value
                }))
              }
              placeholder="Add a comment..."
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => addComment(article._id)}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
            >
              Comment
            </button>
          </div>

          {/* ================= COMMENTS LIST ================= */}
          {showCommentsId === article._id && (
            <div className="mt-4 space-y-3">
              {comments[article._id]?.length === 0 && (
                <p className="text-sm text-gray-500">
                  No comments yet
                </p>
              )}

              {comments[article._id]?.map((c) => (
                <div
                  key={c._id}
                  className="bg-gray-50 border rounded-lg p-3"
                >
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                      {c.user?.name || "User"}
                    </span>
                    <span>
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mt-1">
                    {c.text}
                  </p>

                  {c.user?._id?.toString() === userId?.toString() && (
                    <button
                      onClick={() => deleteComment(article._id, c._id)}
                      className="text-red-500 text-xs mt-1"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </article>
      ))}
      {/* ================= SHARE MODAL ================= */}
{isShareModalOpen && activeShareArticle && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl scale-up-center">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Share Article</h3>
        <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8 text-center">
        {/* WhatsApp */}
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeShareArticle.title + " " + window.location.origin + "/article/" + activeShareArticle._id)}`} target="_blank" rel="noreferrer" className="group">
          <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
            <i className="fab fa-whatsapp text-xl"></i>
          </div>
          <span className="text-[10px] mt-1 block font-medium">WhatsApp</span>
        </a>
        
        {/* Facebook */}
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/article/${activeShareArticle._id}`} target="_blank" rel="noreferrer" className="group">
          <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
            <i className="fab fa-facebook-f text-xl"></i>
          </div>
          <span className="text-[10px] mt-1 block font-medium">Facebook</span>
        </a>

        {/* Twitter/X */}
        <a href={`https://twitter.com/intent/tweet?text=${activeShareArticle.title}&url=${window.location.origin}/article/${activeShareArticle._id}`} target="_blank" rel="noreferrer" className="group">
          <div className="bg-gray-100 p-3 rounded-full text-black group-hover:bg-black group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
            <i className="fab fa-x-twitter text-xl"></i>
          </div>
          <span className="text-[10px] mt-1 block font-medium">Twitter</span>
        </a>

        {/* Email */}
        <a href={`mailto:?subject=${activeShareArticle.title}&body=Check this out: ${window.location.origin}/article/${activeShareArticle._id}`} className="group">
          <div className="bg-red-100 p-3 rounded-full text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
            <i className="fas fa-envelope text-xl"></i>
          </div>
          <span className="text-[10px] mt-1 block font-medium">Email</span>
        </a>
      </div>

      <div className="bg-gray-50 p-2 rounded-lg border flex items-center justify-between gap-2">
        <input 
          readOnly 
          value={`${window.location.origin}/article/${activeShareArticle._id}`}
          className="bg-transparent text-[10px] text-gray-500 truncate flex-1 outline-none"
        />
        <button 
          onClick={copyToClipboard}
          className="bg-purple-700 text-white px-3 py-1 rounded-md text-[10px] font-bold hover:bg-purple-800 transition"
        >
          Copy
        </button>
      </div>
    </div>
  </div>
)}  
    </main>
  );
};

export default Articles;
