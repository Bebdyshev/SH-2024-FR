"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from '../../axios/instance';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaFacebook,
} from "react-icons/fa";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

const commonStyles = {
  inputIcon: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
  input: "block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-[#16a07c] focus:bg-white caret-blue-600",
  button: "inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-[#15bbe3] to-[#1d73b1] focus:outline-none hover:opacity-80 focus:opacity-80",
  socialButton: "relative inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-200 rounded-md hover:bg-gray-100 focus:bg-gray-100 hover:text-black focus:text-black focus:outline-none",
  link: "font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline",
};

export default function SignIn() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", company_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const typingPhrases = ["Сервис для мониторинга за успеваемостью учеников"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);

    try {
      const resp = await axiosInstance.post("/user/login", { email: formData.email, password: formData.password });
      const token = resp.data.accessToken; 
      localStorage.setItem('access_token', token);
      toast("Login successful");
      router.push("/dashboard/students");
    } catch (err) {
      console.error('Error logging in:', err);
      toast("Login failed");
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password || !formData.company_name) {
      setError("All fields are required for sign-up.");
      return;
    }

    setLoading(true);

    try {
      const resp = await axiosInstance.post("/signup", formData);
      toast("Sign-up successful, please log in.");
      setIsLogin(true); // Redirect to login form after sign-up
    } catch (err) {
      console.error('Error signing up:', err);
      setError("Sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white max-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-h-screen">
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8 max-h-screen">
          <div className="absolute inset-0">
            <Image
              className="object-cover"
              src="https://i.ibb.co.com/wCbTfHw/preview.png"
              alt="Green abstract"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 max-h-screen"></div>
          <div className="relative">
            <div className="w-full xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
              <h1 className="flex justify-start text-6xl md:text-6xl text-white font-bold">
                Unified Student Profile
              </h1> <br/>
              <div className="flex justify-start md:text-xl text-white">
                  <TypeAnimation
                  sequence={typingPhrases.flatMap((phrase) => [phrase, 2000])}
                  wrapper="span"
                  speed={50}
                  className="text-3xl text-white text-center md:text-left"
                  repeat={Infinity}
                />
                <h3 className="text-6xl font-bold text-white"></h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24 h-screen">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              Sign in to USP
            </h2>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="mt-8 space-y-5">
              {error && <p className="text-red-500">{error}</p>}
              <div>
                <label className="text-base font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div className={commonStyles.inputIcon}>
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter email to get started"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={commonStyles.input}
                  />
                </div>
              </div>

              <div>
                <label className="text-base font-medium text-gray-900">
                  Password
                </label>
                <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                  <div className={commonStyles.inputIcon}>
                    <FaLock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={commonStyles.input}
                  />
                </div>
              </div>

              <div>
                <button type="submit" className={commonStyles.button} disabled={loading}>
                  {loading ? "Processing..." : isLogin ? "Log in" : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
