import { useState } from "react";
import axios from "axios";

export default function Refresh({
  onRefresh,
}: {
  onRefresh: (token: string) => void;
}) {
  const [res, setRes] = useState("");

  const handleRefresh = async () => {
    try {
      const r = await axios.post(
        "http://localhost:3001/refresh",
        {},
        { withCredentials: true },
      );
      const t = r.data.accessToken;
      localStorage.setItem("accessToken", t);
      onRefresh(t);
      setRes(JSON.stringify(r.data, null, 2));
    } catch (e: any) {
      setRes(JSON.stringify(e.response?.data, null, 2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">POST /refresh</h1>
      <p className="text-gray-500 text-sm">
        Uses httpOnly cookie automatically
      </p>
      <button
        className="bg-black text-white px-6 py-2 rounded"
        onClick={handleRefresh}
      >
        Refresh Token
      </button>
      {res && (
        <pre className="bg-gray-100 rounded p-4 text-sm w-full max-w-md">
          {res}
        </pre>
      )}
    </div>
  );
}
