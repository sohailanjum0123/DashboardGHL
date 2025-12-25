import React,{useState} from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      await resetPassword(token, data.password);
      setMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-primary">Reset Password</h2>

        {message && <p className="mb-4 text-green-500">{message}</p>}

        <input
          type="password"
          placeholder="Enter new password"
          {...register("password", { required: true })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.password && <span className="text-red-500">Password is required</span>}

        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition">
          Reset Password
        </button>
      </form>
    </div>
  );
}
