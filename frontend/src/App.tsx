import { useState } from "react";
import Login from "./components/login";
import Register from "./components/register";
import Refresh from "./components/refresh";
import Logout from "./components/logout";
import GetMe from "./components/getMe";
import GetUsers from "./components/getUsers";
import DeleteUser from "./components/deleteUser";
import CreatePost from "./components/createPost";
import GetPosts from "./components/getPost";
import DeletePost from "./components/deletePost";

type Screen =
  | "login"
  | "register"
  | "refresh"
  | "logout"
  | "getme"
  | "getusers"
  | "deleteuser"
  | "createpost"
  | "getposts"
  | "deletepost";

const navItems: { label: string; screen: Screen }[] = [
  { label: "Login", screen: "login" },
  { label: "Register", screen: "register" },
  { label: "Refresh", screen: "refresh" },
  { label: "Logout", screen: "logout" },
  { label: "GET /me", screen: "getme" },
  { label: "GET /users", screen: "getusers" },
  { label: "DEL /user", screen: "deleteuser" },
  { label: "POST /post", screen: "createpost" },
  { label: "GET /posts", screen: "getposts" },
  { label: "DEL /post", screen: "deletepost" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");

  const handleLogin = () => {
    setToken(localStorage.getItem("accessToken") || "");
    setScreen("getme");
  };

  const handleLogout = () => {
    setToken("");
    setScreen("login");
  };

  const handleRefresh = (t: string) => setToken(t);

  return (
    <div className="min-h-screen bg-white">
      {/* navbar */}
      <div className="border-b flex flex-wrap gap-1 p-3 items-center">
        {navItems.map((n) => (
          <button
            key={n.screen}
            onClick={() => setScreen(n.screen)}
            className={`px-3 py-1 rounded text-sm border transition-colors ${
              screen === n.screen
                ? "bg-black text-white border-black"
                : "border-gray-300 text-gray-600 hover:border-black"
            }`}
          >
            {n.label}
          </button>
        ))}
        {token && (
          <span className="ml-auto text-xs text-gray-400 truncate max-w-xs">
            {token.slice(0, 24)}…
          </span>
        )}
      </div>

      {/* active screen */}
      <div>
        {screen === "login" && <Login onLogin={handleLogin} />}
        {screen === "register" && (
          <Register onRegister={() => setScreen("login")} />
        )}
        {screen === "refresh" && <Refresh onRefresh={handleRefresh} />}
        {screen === "logout" && <Logout onLogout={handleLogout} />}
        {screen === "getme" && <GetMe />}
        {screen === "getusers" && <GetUsers />}
        {screen === "deleteuser" && <DeleteUser />}
        {screen === "createpost" && <CreatePost />}
        {screen === "getposts" && <GetPosts />}
        {screen === "deletepost" && <DeletePost />}
      </div>
    </div>
  );
}
