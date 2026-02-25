import React from "react";
import { useLoans } from "@/services/loan/loan.queries";
import { useBorrowers } from "@/services/borrower/borrower.queries";
import { useRepayments } from "@/services/repayment/repayment.queries";
import { useTransactions } from "@/services/transaction/transaction.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, CreditCard, Receipt } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </CardContent>
        </Card>
    );
}

export const Dashboard: React.FC = () => {
    const { data: loans } = useLoans({ limit: 1 });
    const { data: borrowers } = useBorrowers({ limit: 1 });
    const { data: repayments } = useRepayments({ limit: 1 });
    const { data: transactions } = useTransactions({ limit: 1 });

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to LoanManage Pro. Here's your system overview.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Borrowers"
                    value={borrowers?.pagination?.totalItems ?? "—"}
                    description="Registered customers"
                    icon={Users}
                />
                <StatCard
                    title="Total Loans"
                    value={loans?.pagination?.totalItems ?? "—"}
                    description="All loan accounts"
                    icon={Wallet}
                />
                <StatCard
                    title="Total Repayments"
                    value={repayments?.pagination?.totalItems ?? "—"}
                    description="Recorded payments"
                    icon={CreditCard}
                />
                <StatCard
                    title="Total Transactions"
                    value={transactions?.pagination?.totalItems ?? "—"}
                    description="Financial movements"
                    icon={Receipt}
                />
            </div>
        </div>
    );
};
