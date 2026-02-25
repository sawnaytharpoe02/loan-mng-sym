import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router";
import { loginSchema, type LoginDTO } from "@loan-mng/shared";
import { Building2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { useLogin } from "@/services/auth/auth.mutations";
import { useAuthStore } from "@/store/auth.store";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";

export const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema),
    });

    if (isAuthenticated) return <Navigate to="/" replace />;

    const onSubmit = (data: LoginDTO) => {
        login(data, {
            onSuccess: () => {
                toast.success("Welcome back!");
                navigate("/");
            },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Invalid email or password.");
                } else {
                    toast.error("Invalid email or password.");
                }
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Brand */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
                        <Building2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">LoanManage Pro</h1>
                        <p className="text-sm text-muted-foreground">Loan Management System</p>
                    </div>
                </div>

                {/* Login Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign in</CardTitle>
                        <CardDescription>Enter your credentials to access the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Field>
                                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                <FieldContent>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-9"
                                            placeholder="admin@example.com"
                                            {...register("email")}
                                            aria-invalid={!!errors.email}
                                        />
                                    </div>
                                    <FieldError errors={[errors.email]} />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <FieldContent>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-9 pr-10"
                                            placeholder="••••••••"
                                            {...register("password")}
                                            aria-invalid={!!errors.password}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <FieldError errors={[errors.password]} />
                                </FieldContent>
                            </Field>

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
