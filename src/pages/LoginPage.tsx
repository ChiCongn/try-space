import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { authApi } from "../services/auth.api";
import { useAuthStore } from "../store/authStore";
import type { LoginPayload } from "../types";
import { getErrorMessages } from "../utils/errors";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
});

export function LoginPage() {
  const { handleSubmit, register } = useForm<LoginPayload>({
    defaultValues: { email: "an.nguyen@gmail.com", password: "Password123!" },
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/catalog", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  async function onSubmit(data: LoginPayload) {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ";
      setError(message);
      toast.error("Không thể đăng nhập", {
        description: message,
      });
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await authApi.login(parsed.data);
      setUser(response.data.user);
      setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken,
      );
      toast.success("Đăng nhập thành công");
      navigate((location.state as { from?: string } | null)?.from ?? "/");
    } catch (caught) {
      const messages = getErrorMessages(caught, "Đăng nhập thất bại");
      setError(messages[0] ?? "Đăng nhập thất bại");
      toast.error("Không thể đăng nhập", {
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
        <span>Welcome back</span>
        <h1>Đăng nhập</h1>
        {error ? <div className="form-error">{error}</div> : null}
        <label>
          Email
          <input type="email" {...register("email")} />
        </label>
        <label>
          Mật khẩu
          <input type="password" {...register("password")} />
        </label>
        <button className="primary-link" type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </form>
    </main>
  );
}
