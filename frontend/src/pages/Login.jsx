import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Call login API
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });

      const user = res.data.data.user;

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirect
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard/products");
      }

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-primary">Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.email && <span className="text-red-500">Email is required</span>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.password && <span className="text-red-500">Password is required</span>}

        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition">
          Login
        </button>

        <p className="mt-4 text-center text-sm text-text">
          Don't have an account?{" "}
          <span className="text-primary cursor-pointer" onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}
