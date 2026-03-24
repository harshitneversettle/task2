import { useState } from "react";
import axios from "axios";

export default function Register({ onRegister }: { onRegister: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:3001/register",
        { name, email, password },
        { withCredentials: true },
      );
      onRegister();
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <p className="text-red-500">{error}</p>}
      <input
        className="border p-2 rounded w-64"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 rounded w-64"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 rounded w-64"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-black text-white px-6 py-2 rounded"
        onClick={handleRegister}
      >
        Register
      </button>
    </div>
  );
}
