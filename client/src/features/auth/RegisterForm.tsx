import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useToastStore } from "../../store/toastStore";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must contain an uppercase letter").regex(/[0-9]/, "Must contain a number"),
});

type FormData = z.infer<typeof schema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { register: registerAuth } = useAuth();
  
  const onSubmit = async (data: FormData) => {
    try {
      await registerAuth(data);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error ?? err.message
        : "Registration failed. Please try again.";
      useToastStore.getState().addToast(message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input label="Full Name" placeholder="John Doe" {...register("name")} error={errors.name?.message} />
      <Input label="Work Email" type="email" placeholder="john@company.com" {...register("email")} error={errors.email?.message} />
      <Input label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />
      
      <Button type="submit" className="w-full mt-2 py-3 text-[15px] shadow-md">Create account</Button>
    </form>
  );
};
