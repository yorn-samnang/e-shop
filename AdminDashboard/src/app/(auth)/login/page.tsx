"use client";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import Input from "@/components/ui/Input";
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
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: "onTouched",
  });

  const { isPending, ...loginMutation } = useMutation({
    mutationKey: ["auth"],
    mutationFn: async (data: LoginFormSchema) => {
      return (await api.post("/api/auth/login/", data)).data;
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
  const error = !!errors;
  return (
    <div className="flex min-h-screen grow items-center justify-center bg-brand-surface/40 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="E-Shop"
            className="mx-auto mb-5 h-20 w-20 object-contain"
          />
          <h1 className="mb-2 font-bold text-4xl text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-500">
            Please enter your credentials to continue
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              fullWidth
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
              })}
            />

            <Input
              label="Password"
              type="password"
              fullWidth
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
              })}
            />

            <Button
              disabled={isPending || !isValid}
              type="submit"
              fullWidth
              size="lg"
            >
              Login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
