import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!userType) {
      alert("Please select a login type (Student or Recruiter).");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password,
          role: userType, // ✅ Send role
        },
        {
          withCredentials: true, // ✅ Allow cookie to be set
        }
      );

      if (res.data.success) {
        // Optional: Save token or user info
        // localStorage.setItem("token", res.data.token);

        if (userType === "student") {
          navigate("/home");
        } else {
          navigate("/recruiterHome");
        }
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-green-600 px-4">
      <div
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-[0_25px_60px_rgba(72,255,168,0.45)]"
        style={{ animation: "fadeInUp 0.8s ease both" }}
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6 tracking-tight">
          Login to Job Portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition transform focus:scale-105"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition transform focus:scale-105"
              required
            />
          </div>

          {/* Login As */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Login As</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition transform focus:scale-105"
              required
            >
              <option value="">-- Select Role --</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Don't have an account?{" "}
          <span
            className="text-green-400 hover:underline cursor-pointer"
            onClick={() => navigate("/Signup")}
          >
            Sign up
          </span>
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
