import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {

  const [currState, setCurrState] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currState === "signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState, { fullName, email, password, bio });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col md:flex-row items-center justify-center md:justify-evenly gap-12 px-6 backdrop-blur-2xl">

      {/* -------- Logo Section -------- */}
      <div className="flex flex-col items-center text-center gap-4">
        <img
          src={assets.logo_big}
          alt=""
          className="w-32 sm:w-40 md:w-[220px]"
        />
      </div>

      {/* -------- Form Section -------- */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-[390px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 sm:p-8 flex flex-col gap-5 text-white shadow-2xl"
      >

        <h2 className="font-semibold text-2xl flex justify-between items-center">
          {currState === "signup" ? "Sign up" : "Login"}

          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* -------- Full Name -------- */}
        {currState === "signup" && !isDataSubmitted && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Full Name</label>

            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              placeholder="Enter your full name"
              required
              className="p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
            />
          </div>
        )}

        {/* -------- Email -------- */}
        {!isDataSubmitted && (
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Email Address</label>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="you@example.com"
              required
              className="p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
            />
          </div>
        )}

        {/* -------- Password -------- */}
        {!isDataSubmitted && (
          <div className="flex flex-col gap-1">

            <label className="text-sm text-gray-300">Password</label>

            <div className="relative">

              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                className="p-3 w-full bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>
          </div>
        )}

        {/* -------- Bio -------- */}
        {currState === "signup" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            placeholder="Provide a short bio..."
            required
            className="p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
          />
        )}

        {/* -------- Submit -------- */}
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 rounded-md font-medium hover:opacity-90 transition"
        >
          {currState === "signup" ? "Create Account" : "Login Now"}
        </button>

        {/* -------- Terms -------- */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        {/* -------- Switch Auth -------- */}
        <div className="text-sm text-gray-400">

          {currState === "signup" ? (
            <p>
              Already have an account?
              <span
                onClick={() => {
                  setCurrState("login");
                  setIsDataSubmitted(false);
                }}
                className="ml-1 text-violet-400 cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Create an account
              <span
                onClick={() => setCurrState("signup")}
                className="ml-1 text-violet-400 cursor-pointer"
              >
                Click here
              </span>
            </p>
          )}

        </div>

      </form>
    </div>
  );
};

export default LoginPage;