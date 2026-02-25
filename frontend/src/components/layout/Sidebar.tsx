import { NavLink, useNavigate } from "react-router";
import {
    LayoutDashboard,
    Users,
    Wallet,
    CreditCard,
    TrendingUp,
    Receipt,
    FileText,
    LogOut,
    Building2,
    Calculator,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { Separator } from "@/components/ui/separator";
import { LoanCalculatorDrawer } from "../calculator/LoanCalculatorDrawer";

const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/borrowers", label: "Borrowers", icon: Users },
    { path: "/loans", label: "Loans", icon: Wallet },
    { path: "/repayments", label: "Repayments", icon: CreditCard },
    { path: "/transactions", label: "Transactions", icon: Receipt },
    { path: "/interest-rates", label: "Interest Rates", icon: TrendingUp },
    { path: "/contracts", label: "Contracts", icon: FileText },
];

export function Sidebar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [calcOpen, setCalcOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="flex h-screen w-56 flex-col border-r bg-card">
            {/* Logo */}
            <div className="flex h-16 items-center gap-3 border-b px-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="leading-tight">
                    <p className="text-sm font-bold">LoanManage</p>
                    <p className="text-xs text-muted-foreground">Pro</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-1 p-3">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={path === "/"}
                        className={({ isActive }: { isActive: boolean }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )
                        }
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                    </NavLink>
                ))}

                <button
                    onClick={() => setCalcOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    <Calculator className="h-4 w-4 shrink-0" />
                    Calculator
                </button>

                <LoanCalculatorDrawer open={calcOpen} onOpenChange={setCalcOpen} />
            </nav>

            <Separator />

            {/* User footer */}
            <div className="p-3 space-y-2">
                {user && (
                    <div className="px-3 py-2">
                        <p className="text-sm font-semibold truncate">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                )}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}
