import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("userName", data.userName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("avatar", data.avatar[0]);
      if (data.coverImage?.length) formData.append("coverImage", data.coverImage[0]);

      await registerUser(formData);
      navigate("/dashboard");
    } catch (error) {
      console.log("ERRRRRRRR",error)
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-primary">Signup</h2>

        <input
          type="text"
          placeholder="Full Name"
          {...register("fullName", { required: true })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.fullName && <span className="text-red-500">Full Name is required</span>}

        <input
          type="text"
          placeholder="Username"
          {...register("userName", { required: true })}
          className="w-full p-2 mb-4 border rounded"
        />
        {errors.userName && <span className="text-red-500">Username is required</span>}

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

        <input
          type="file"
          {...register("avatar", { required: true })}
          className="w-full mb-4"
        />
        {errors.avatar && <span className="text-red-500">Avatar is required</span>}

        <input
          type="file"
          {...register("coverImage")}
          className="w-full mb-4"
        />

        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80 transition">
          Signup
        </button>

        <p className="mt-4 text-center text-sm text-text">
          Already have an account?{" "}
          <span className="text-primary cursor-pointer" onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
