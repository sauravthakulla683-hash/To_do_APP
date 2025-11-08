import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:1000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/dashboard");
      } else {
        setMsg(data.message || "❌ Invalid credentials");
      }
    } catch {
      setMsg("⚠️ Server error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="w-[400px] bg-gray-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          <span className="text-blue-500">My</span>App
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Welcome back! Please log in to continue.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-sm outline-none placeholder-gray-500 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg p-3 text-sm outline-none placeholder-gray-500 transition-all"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition-all rounded-lg py-2 font-semibold shadow-md"
          >
            Sign In
          </button>
        </form>

        {msg && <p className="text-center text-red-400 mt-4 text-sm">{msg}</p>}

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
