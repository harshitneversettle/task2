import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";

type Screen = "login" | "register" | "dashboard";

export default function App() {
  const [screen, setScreen] = useState<Screen>(
    localStorage.getItem("accessToken") ? "dashboard" : "login",
  );

  const handleLogin = () => setScreen("dashboard");
  const handleRegister = () => setScreen("login");
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setScreen("login");
  };

  if (screen === "dashboard") {
    return (
      <div>
        <div className="bg-gray-950 border-b border-gray-800 px-6 py-3 flex justify-between items-center font-mono">
          <span className="text-gray-400 text-xs">
            token:{" "}
            <span className="text-green-400 text-xs">
              {localStorage.getItem("accessToken")?.slice(0, 30)}…
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300"
          >
            logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {screen === "login" ? (
        <div>
          <Login onLogin={handleLogin} />
          <p className="text-center text-sm text-gray-500 -mt-6">
            No account?{" "}
            <button
              className="text-black underline"
              onClick={() => setScreen("register")}
            >
              Register
            </button>
          </p>
        </div>
      ) : (
        <div>
          <Register onRegister={handleRegister} />
          <p className="text-center text-sm text-gray-500 -mt-6">
            Already have an account?{" "}
            <button
              className="text-black underline"
              onClick={() => setScreen("login")}
            >
              Login
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
