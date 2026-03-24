import { useState } from "react";
import axios from "axios";

export default function Logout({ onLogout }: { onLogout: () => void }) {
  const [res, setRes] = useState("");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const r = await axios.post(
        "http://localhost:3001/logout",
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      localStorage.removeItem("accessToken");
      setRes(JSON.stringify(r.data, null, 2));
      onLogout();
    } catch (e: any) {
      setRes(JSON.stringify(e.response?.data, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">POST /logout</h1>
      <button
        className="bg-red-600 text-white px-6 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
      {res && (
        <pre className="bg-gray-100 rounded p-4 text-sm w-full max-w-md">
          {res}
        </pre>
      )}
    </div>
  );
}
