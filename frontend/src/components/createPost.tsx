import { useState } from "react";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [res, setRes] = useState("");

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const r = await axios.post(
        "http://localhost:3001/posts",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );
      setRes(JSON.stringify(r.data, null, 2));
    } catch (e: any) {
      setRes(JSON.stringify(e.response?.data, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">POST /posts</h1>
      <input
        className="border p-2 rounded w-64"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="border p-2 rounded w-64"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="bg-black text-white px-6 py-2 rounded"
        onClick={handleCreate}
      >
        Create Post
      </button>
      {res && (
        <pre className="bg-gray-100 rounded p-4 text-sm w-full max-w-md">
          {res}
        </pre>
      )}
    </div>
  );
}
