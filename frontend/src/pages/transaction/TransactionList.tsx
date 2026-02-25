import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { useTransactions } from "@/services/transaction/transaction.queries";
import type { Transaction } from "@/services/transaction/transaction.types";
import { formatCurrency } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const BADGE_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
    Repayment: "default",
    LateFee: "secondary",
    Penalty: "destructive",
};

export const TransactionList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: response, isLoading } = useTransactions({ page, limit: pageSize });
    const transactions: Transaction[] = response?.data || [];
    const pagination = response?.pagination;

    if (isLoading) return <div className="flex items-center mx-auto w-fit p-8 space-x-2"><Spinner className="text-primary h-6 w-6" /><p className="text-center text-muted-foreground">Loading transactions ...</p></div>;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                <p className="text-muted-foreground">Full financial transaction log for all loans.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>Read-only ledger of all financial movements.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.length > 0 ? (
                                transactions.map((t) => (
                                    <TableRow key={t._id}>
                                        <TableCell>{new Date(t.transactionDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</TableCell>
                                        <TableCell>
                                            <Badge variant={BADGE_VARIANT[t.transactionType] ?? "secondary"}>
                                                {t.transactionType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{formatCurrency(t.amount)}</TableCell>
                                        <TableCell className="text-muted-foreground">{t.description || "—"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No transactions found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {pagination && (
                        <Pagination
                            currentPage={page}
                            totalItems={pagination.totalItems}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                            pageSizeOptions={[5, 10, 20, 50]}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
