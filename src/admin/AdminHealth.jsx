import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import React, { useState } from "react";

export default function AdminHealth() {
  const [selectedLang, setSelectedLang] = useState("en");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submit = async () => {
    const formattedTitle = {
      en: selectedLang === "en" ? title : "",
      mr: selectedLang === "mr" ? title : "",
      hi: selectedLang === "hi" ? title : "",
    };

    const formattedDescription = {
      en: selectedLang === "en" ? description : "",
      mr: selectedLang === "mr" ? description : "",
      hi: selectedLang === "hi" ? description : "",
    };

    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/health`, {
      title: formattedTitle,
      description: formattedDescription,
      category: "Health",
      lang: selectedLang,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    alert("Posted Successfully");

    setTitle("");
    setDescription("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">

      {/* 🔽 Language Dropdown */}
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        className="border px-3 py-2 rounded-lg"
      >
        <option value="en">English</option>
        <option value="mr">Marathi</option>
        <option value="hi">Hindi</option>
      </select>

      {/* Title */}
      <input
        placeholder={`Title (${selectedLang})`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full rounded-lg"
      />

      {/* Description */}
      <ReactQuill
        value={description}
        onChange={setDescription}
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Publish
      </button>
    </div>
  );
}
