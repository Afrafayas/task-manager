import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../store/authSlice";
import { toast } from "react-hot-toast";

// Zod schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Header */}
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
        <p className="text-slate-500 text-sm mb-6">Join Task Manager today</p>

        {/* Form */}
        <div className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="Afra NK"
              className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="afra@example.com"
              className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}