import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, Link } from "react-router";
import { registerSchema, type RegisterDTO, UserRole } from "@loan-mng/shared";
import { Building2, Lock, Mail, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "@/services/auth/auth.mutations";
import { useAuthStore } from "@/store/auth.store";

export const RegisterPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { mutate: registerUser, isPending } = useRegister();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RegisterDTO>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: "Office",
        }
    });

    const selectedRole = watch("role");

    if (isAuthenticated) return <Navigate to="/" replace />;

    const onSubmit = (data: RegisterDTO) => {
        registerUser(data, {
            onSuccess: () => {
                toast.success("Account created successfully!");
                navigate("/");
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || "Registration failed. Try again.";
                toast.error(message);
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <div className="w-full max-w-md space-y-6 py-8">
                {/* Brand */}
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
                        <Building2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight">LoanManage Pro</h1>
                        <p className="text-sm text-muted-foreground">Create your system account</p>
                    </div>
                </div>

                {/* Register Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>Join our platform as a system administrator or officer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Field>
                                <FieldLabel htmlFor="username">Full Name</FieldLabel>
                                <FieldContent>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="username"
                                            className="pl-9"
                                            placeholder="John Doe"
                                            {...register("username")}
                                            aria-invalid={!!errors.username}
                                        />
                                    </div>
                                    <FieldError errors={[errors.username]} />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                                <FieldContent>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            className="pl-9"
                                            placeholder="john@example.com"
                                            {...register("email")}
                                            aria-invalid={!!errors.email}
                                        />
                                    </div>
                                    <FieldError errors={[errors.email]} />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="role">Account Role</FieldLabel>
                                <FieldContent>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                        <Select
                                            value={selectedRole}
                                            onValueChange={(val: any) => setValue("role", val)}
                                        >
                                            <SelectTrigger className="pl-9 w-full">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {UserRole.options.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role === "LoanOfficer" ? "Loan Officer" : role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FieldError errors={[errors.role]} />
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
                                {isPending ? "Creating Account..." : "Create Account"}
                            </Button>

                            <div className="text-center text-sm text-muted-foreground pt-2">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
