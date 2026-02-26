import { useProfile } from "@/services/auth/auth.queries";
import { Spinner } from "@/components/ui/spinner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    CheckCircle2,
    XCircle,
    User,
    Mail,
    ShieldCheck,
    Lock,
} from "lucide-react";

interface Permission {
    module: string;
    actions: {
        read: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    };
}

const getPermissionsByRole = (role: string): Permission[] => {
    const modules = [
        "Borrowers",
        "Loans",
        "Repayments",
        "Transactions",
        "Contracts",
        "Interest Rates",
    ];

    return modules.map((module) => {
        let permissions = { read: true, create: false, update: false, delete: false };

        if (role === "Admin") {
            permissions = { read: true, create: true, update: true, delete: true };
            // Special cases for Admin
            if (module === "Repayments" || module === "Transactions") permissions.delete = false;
        } else if (role === "LoanOfficer") {
            permissions.read = true;
            if (module !== "Interest Rates") {
                permissions.create = true;
                permissions.update = true;
            }
            if (module === "Transactions" || module === "Contracts") permissions.update = false;
            permissions.delete = false;
        } else if (role === "Office") {
            permissions = { read: true, create: false, update: false, delete: false };
        }

        return { module, actions: permissions };
    });
};

export function ProfilePage() {
    const { data: user, isLoading, error } = useProfile();

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner className="h-8 w-8 text-primary" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
                <p className="text-destructive font-medium">Failed to load profile.</p>
            </div>
        );
    }

    const permissions = getPermissionsByRole(user.role);

    return (
        <div className="container mx-auto max-w-4xl py-10 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-card border rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                        <User className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{user.username}</h1>
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="flex items-center text-muted-foreground gap-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm">Account ID: {user._id}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="px-4 py-1 text-sm font-medium capitalize flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        {user.role}
                    </Badge>
                    <p className="text-xs text-muted-foreground italic">
                        {user.role === 'Admin' ? 'System Administrator' : user.role === 'LoanOfficer' ? 'Loan Processing Officer' : 'Back Office Staff'}
                    </p>
                </div>
            </div>

            {/* Permissions Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Access Control & Permissions</h2>
                </div>
                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                    {permissions.map((perm) => (
                        <Card key={perm.module} className="overflow-hidden border-l-4 border-l-primary/80">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{perm.module}</CardTitle>
                                <CardDescription>Module Access Rights</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-y-3">
                                    <PermissionItem label="View" allowed={perm.actions.read} />
                                    <PermissionItem label="Create" allowed={perm.actions.create} />
                                    <PermissionItem label="Update" allowed={perm.actions.update} />
                                    <PermissionItem label="Delete" allowed={perm.actions.delete} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Security Notice */}
            <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-primary">Security & Compliance</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Your permissions are assigned based on your organizational role. If you require additional access or believe your permissions are incorrect, please contact the system administrator. All actions performed on this platform are logged for auditing purposes.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function PermissionItem({ label, allowed }: { label: string; allowed: boolean }) {
    return (
        <div className="flex items-center gap-2">
            {allowed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
                <XCircle className="h-4 w-4 text-muted-foreground/30" />
            )}
            <span className={allowed ? "text-sm font-medium" : "text-sm text-muted-foreground"}>
                {label}
            </span>
        </div>
    );
}
