import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { authApi } from "../services/auth.api";
import { useAuthStore } from "../store/authStore";
import type { RegisterPayload } from "../types";
import { getErrorMessages } from "../utils/errors";

type RegisterForm = RegisterPayload & { confirmPassword: string };

const schema = z
  .object({
    confirmPassword: z.string(),
    email: z.string().email("Email không hợp lệ"),
    name: z
      .string()
      .min(2, "Tên tối thiểu 2 ký tự")
      .max(50, "Tên tối đa 50 ký tự")
      .regex(/^[a-zA-ZÀ-ỹ\s-]+$/, "Tên hiển thị chỉ được chứa chữ cái, dấu cách và dấu gạch ngang"),
    password: z
      .string()
      .min(8, "Mật khẩu tối thiểu 8 ký tự")
      .regex(/[a-z]/, "Mật khẩu cần có chữ thường")
      .regex(/[A-Z]/, "Mật khẩu cần có chữ hoa")
      .regex(/[0-9]/, "Mật khẩu cần có chữ số"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export function RegisterPage() {
  const { handleSubmit, register } = useForm<RegisterForm>();
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
      toast.error("Không thể đăng ký", {
        description: message,
      });
      return;
    }

    try {
      setIsLoading(true);
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
      const messages = getErrorMessages(caught, "Đăng ký thất bại");
      toast.error("Không thể đăng ký", {
        description: messages.join("\n"),
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
