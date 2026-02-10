import { useState } from "react";
import axios from "axios";
import React from "react";
export default function CreateArticle() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    author: "",
    date: "",
    language: "mr"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/articles`, form, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    alert("Article saved");
    setForm({
      title: "",
      description: "",
      author: "",
      date: "",
      language: "mr"
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create Article
      </h1>

      <form onSubmit={submit} className="space-y-5">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Article Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* Language */}
       <select
  name="language"
  value={form.language}
  onChange={handleChange}
  className="
    w-full
    border
    rounded-lg
    bg-white
    appearance-none
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500

    text-sm sm:text-base
    px-3 py-2 sm:py-3
  "
>
  <option value="mr">Marathi</option>
  <option value="en">English</option>
  <option value="hi">Hindi</option>
</select>


        {/* Description */}
        <textarea
          name="description"
          placeholder="Article Content"
          value={form.description}
          onChange={handleChange}
          rows={6}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* Author */}
        <input
          type="text"
          name="author"
          placeholder="Author Name"
          value={form.author}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        {/* Date */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800"
        >
          Publish Article
        </button>
      </form>
    </div>
  );
}
