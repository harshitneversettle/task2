import { useState } from "react";
import axios from "axios";

export default function GetPosts() {
  const [res, setRes] = useState("");

  const handleGetPosts = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const r = await axios.get("http://localhost:3001/posts", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setRes(JSON.stringify(r.data, null, 2));
    } catch (e: any) {
      setRes(JSON.stringify(e.response?.data, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">GET /posts</h1>
      <button
        className="bg-black text-white px-6 py-2 rounded"
        onClick={handleGetPosts}
      >
        Get My Posts
      </button>
      {res && (
        <pre className="bg-gray-100 rounded p-4 text-sm w-full max-w-md overflow-auto max-h-96">
          {res}
        </pre>
      )}
    </div>
  );
}
