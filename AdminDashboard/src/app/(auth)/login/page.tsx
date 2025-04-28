"use client";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
type LoginFormSchema = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const { control, handleSubmit, register, formState } =
    useForm<LoginFormSchema>({
      resolver: zodResolver(loginFormSchema),
      mode: "onTouched",
    });

  const loginMutation = useMutation({
    mutationKey: ["auth"],
    mutationFn: async (data: LoginFormSchema) => {
      return (await api.post("api/auth/login/", data)).data;
    },
  });

  const router = useRouter();

  const onSubmit = (data: LoginFormSchema) => {
    console.log("submitting", data);
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        console.log("Login successful", data);
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error("Login failed", error);
      },
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        Login bith
        <input
          {...register("email")}
          type="email"
          name="email"
          placeholder="email"
        />
        <input
          {...register("password")}
          type="password"
          name="password"
          placeholder="password"
        />
        <button
          disabled={!formState.isValid}
          className="cursor-pointer active:bg-black disabled:bg-red-500"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
