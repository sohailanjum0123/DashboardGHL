import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { requestPasswordReset } from "../services/api"; // your API function

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState(""); // useState imported directly
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await requestPasswordReset(data.email);
      setMessage(res.data.message || "Reset link sent to your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-primary">Forgot Password</h2>

        {message && <p className="mb-4 text-green-500">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          {...register("email", { required: true })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.email && <span className="text-red-500">Email is required</span>}

        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
