import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useToastStore } from "../../store/toastStore";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useAuth();
  
  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? err.message
        : "Login failed. Please check your credentials.";
      useToastStore.getState().addToast(message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Email" type="email" placeholder="you@company.com" {...register("email")} error={errors.email?.message} />
      <Input label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />
      <Button type="submit" isLoading={isSubmitting} className="w-full mt-2 py-3 text-[15px] shadow-md">Sign in</Button>
    </form>
  );
};
