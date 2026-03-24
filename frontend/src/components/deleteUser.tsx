import { useState } from "react";
import axios from "axios";

export default function DeleteUser() {
  const [id, setId] = useState("");
  const [res, setRes] = useState("");

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const r = await axios.delete(`http://localhost:3001/users/${id}`, {
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
      <h1 className="text-2xl font-bold">DELETE /users/:id</h1>
      <p className="text-gray-500 text-sm">Admin only</p>
      <input
        className="border p-2 rounded w-64"
        placeholder="User ID"
        onChange={(e) => setId(e.target.value)}
      />
      <button
        className="bg-red-600 text-white px-6 py-2 rounded"
        onClick={handleDelete}
      >
        Delete User
      </button>
      {res && (
        <pre className="bg-gray-100 rounded p-4 text-sm w-full max-w-md">
          {res}
        </pre>
      )}
    </div>
  );
}
