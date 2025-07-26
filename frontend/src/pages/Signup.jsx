import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const fullname = formData.get("fullname");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const phoneNumber = formData.get("phoneNumber");
    const role = formData.get("role");

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/register", {
        fullname,
        email,
        password,
        phoneNumber,
        role,
      });

      alert("Signup successful!");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-green-600 px-4">
      <div
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl py-10 px-8 w-full max-w-md transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-[0_25px_60px_rgba(72,255,168,0.45)]"
        style={{ animation: "fadeInUp 0.8s ease both" }}
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6 tracking-tight">
          Create an Account
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Fullname */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              name="fullname"
              type="text"
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input
              name="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              name="role"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <span
            className="text-green-600 hover:text-green-800 font-semibold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>

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

export default Signup;
