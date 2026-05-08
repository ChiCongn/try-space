import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../stores/authStore";
import type { RegisterPayload } from "../types";

type RegisterForm = RegisterPayload & { confirmPassword: string };

const schema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().email("Email không hợp lệ"),
    name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export function RegisterPage() {
  const { handleSubmit, register } = useForm<RegisterForm>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  async function onSubmit(data: RegisterForm) {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ";
      setError(message);
      toast.error("Không thể đăng ký", {
        description: message,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await authApi.register({
        email: parsed.data.email,
        name: parsed.data.name,
        password: parsed.data.password,
      });
      setUser(response.data.user);
      setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken,
      );
      toast.success("Tạo tài khoản thành công");
      navigate("/");
    } catch (caught) {
      const message =
        (caught as { response?: { data?: { message?: string } } }).response
          ?.data?.message ?? "Đăng ký thất bại";
      setError(message);
      toast.error("Không thể đăng ký", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <Link className="site-logo" to="/">
        TrySpace
      </Link>
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <span>Create account</span>
        <h1>Đăng ký</h1>
        {error ? <div className="form-error">{error}</div> : null}
        <label>
          Tên hiển thị
          <input {...register("name")} />
        </label>
        <label>
          Email
          <input type="email" {...register("email")} />
        </label>
        <label>
          Mật khẩu
          <input type="password" {...register("password")} />
        </label>
        <label>
          Xác nhận mật khẩu
          <input type="password" {...register("confirmPassword")} />
        </label>
        <button className="primary-link" type="submit" disabled={isLoading}>
          {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </button>
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </main>
  );
}
