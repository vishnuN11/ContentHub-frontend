import React,{ useEffect, useState } from "react";
import axios from "axios";

const AdminArticle = () => {
  const [articles, setArticles] = useState([]);
  const token = localStorage.getItem("token");
  const [lang, setlang] = useState("mr");
  
    const handleChange = (e) => {
      setlang(e.target.value );
    };

  const fetchArticles = async () => {
    try {
      const res = await axios.get(
       `${import.meta.env.VITE_API_BASE_URL}/articles?lang=`+lang,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArticles(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteArticle = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/articles/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // update UI instantly (no refresh)
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [lang]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
         <select
          name="language"
          value={lang}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >
          <option value="mr">Marathi</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      <h1 className="text-2xl font-semibold mb-6">
        Marathi Articles (Admin)
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Language</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {articles.map((article) => (
              <tr
                key={article._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">{article.title}</td>
                <td className="px-4 py-3 capitalize">
                  {article.language}
                </td>
                <td className="px-4 py-3">{article.author}</td>

                <td className="px-4 py-3 justify-center flex space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() =>
                      alert("Navigate to update page")
                    }
                  >
                    Update
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => deleteArticle(article._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {articles.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500"
                >
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticle;
