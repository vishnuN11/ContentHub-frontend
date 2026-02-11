import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    HandThumbUpIcon,
    ShareIcon
} from "@heroicons/react/24/outline";

export default function HealthList() {
    const [posts, setPosts] = useState([]);
    const [lang, setLang] = useState("en");
    const [showMoreId, setShowMoreId] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activeShareArticle, setActiveShareArticle] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchPosts();
    }, [lang]);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/health?lang=${lang}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPosts(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= LIKE ================= */
    const toggleLike = async (id) => {
        if (!token) {
            alert("Please login to like");
            return;
        }

        setPosts((prev) =>
            prev.map((p) =>
                p._id === id
                    ? {
                        ...p,
                        isLiked: !p.isLiked,
                        likesCount: p.isLiked
                            ? p.likesCount - 1
                            : p.likesCount + 1,
                    }
                    : p
            )
        );

        try {
            await axios.put(
                `http://localhost:5000/api/health/${id}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            fetchPosts(); // rollback safety
        }
    };

    /* ================= SHARE ================= */
    const sharePost = (post) => {
        const url = window.location.origin + `/health/${post._id}`;
        const text = `${post.title}\n\nRead more: ${url}`;

        const whatsapp = `https://wa.me/?text=${encodeURIComponent(text)}`;
        const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        const gmail = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(text)}`;

        window.open(whatsapp, "_blank");
    };
    const openShareModal = (article) => {
        setActiveShareArticle(article);
        setIsShareModalOpen(true);
    };

    const copyToClipboard = () => {
        const url = `${window.location.origin}`;
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
    };
    return (
        <div className="min-h-screen bg-gray-100 py-6 px-3">

            {/* 🔽 Language Dropdown */}
            <div className="max-w-6xl mx-auto mb-6 flex justify-end">
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="border px-3 py-2 rounded-lg shadow-sm"
                >
                    <option value="en">English</option>
                    <option value="mr">Marathi</option>
                    <option value="hi">Hindi</option>
                </select>
            </div>

            {/* 🔥 Cards Grid */}
            <div >
                {posts.length > 0 && posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white rounded-xl shadow-sm border p-4 max-w-2xl mx-auto mb-6"
                    >
                        {/* Content */}
                        <div className="p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                {post.title}
                            </h2>

                            {/* <div
                                className="text-sm text-gray-600 "
                                dangerouslySetInnerHTML={{
                                    __html: post.description,
                                }}
                            /> */}
                            <div
                                className={`text-sm text-gray-600 ${showMoreId === post._id ? "" : "line-clamp-4"
                                    }`}
                                dangerouslySetInnerHTML={{
                                    __html: post.description,
                                }}
                            />

                            {post.description && (
                                <button
                                    onClick={() =>
                                        setShowMoreId(
                                            showMoreId === post._id ? null : post._id
                                        )
                                    }
                                    className="text-blue-600 mt-1 text-sm"
                                >
                                    {showMoreId === post._id ? "Read less" : "Read more"}
                                </button>
                            )}


                            {/* Actions */}
                            <div className="flex justify-between items-center mt-4 border-t pt-3 text-gray-600">

                                {/* Like */}
                                <button
                                    onClick={() => toggleLike(post._id)}
                                    className={`flex items-center gap-1 ${post.isLiked ? "text-blue-600" : ""
                                        }`}
                                >
                                    <HandThumbUpIcon className="h-5 w-5" />
                                    {post.likesCount || 0}
                                </button>

                                {/* Share */}
                                <button
                                    onClick={() => openShareModal(post)}
                                    className="flex items-center gap-1 text-sm hover:text-blue-600 transition"
                                >
                                    <ShareIcon className="h-5 w-5 cursor-pointer" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
                            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeShareArticle.title + " " + window.location.origin)}`} target="_blank" rel="noreferrer" className="group">
                                <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-whatsapp text-xl"></i>
                                </div>
                                <span className="text-[10px] mt-1 block font-medium">WhatsApp</span>
                            </a>

                            {/* Facebook */}
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}`} target="_blank" rel="noreferrer" className="group">
                                <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-facebook-f text-xl"></i>
                                </div>
                                <span className="text-[10px] mt-1 block font-medium">Facebook</span>
                            </a>

                            {/* Twitter/X */}
                            <a href={`https://twitter.com/intent/tweet?text=${activeShareArticle.title}&url=${window.location.origin}`} target="_blank" rel="noreferrer" className="group">
                                <div className="bg-gray-100 p-3 rounded-full text-black group-hover:bg-black group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
                                    <i className="fab fa-x-twitter text-xl"></i>
                                </div>
                                <span className="text-[10px] mt-1 block font-medium">Twitter</span>
                            </a>

                            {/* Email */}
                            <a href={`mailto:?subject=${activeShareArticle.title}&body=Check this out: ${window.location.origin}`} className="group">
                                <div className="bg-red-100 p-3 rounded-full text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all mx-auto w-12 h-12 flex items-center justify-center">
                                    <i className="fas fa-envelope text-xl"></i>
                                </div>
                                <span className="text-[10px] mt-1 block font-medium">Email</span>
                            </a>
                        </div>

                        <div className="bg-gray-50 p-2 rounded-lg border flex items-center justify-between gap-2">
                            <input
                                readOnly
                                value={`${window.location.origin}`}
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
            {
                posts.length === 0 && (
                    <div className="flex items-center justify-center min-h-[60vh] px-4">
                        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full border border-gray-100">

                            {/* Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 text-green-600 p-4 rounded-full">
                                    🏥
                                </div>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                No Health Articles Available
                            </h2>

                            {/* Description */}
                            <p className="text-gray-500 text-sm mb-6">
                                We couldn’t find any health articles right now. Please check back later.
                            </p>

                            <p>You can also try viewing content in a different language:

                                 English,

                                 हिंदी (Hindi),

                               and मराठी (Marathi)</p>
                        </div>
                    </div>
                )
            }

        </div>
    );
}
