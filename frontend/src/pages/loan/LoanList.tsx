import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useLoans } from "@/services/loan/loan.queries";
import { useDeleteLoan } from "@/services/loan/loan.mutations";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Loan } from "@/services/loan/loan.types";
import { LoanFormDialog } from "@/pages/loan/LoanFormDialog";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
    Active: "default",
    Closed: "secondary",
    Defaulted: "destructive",
};

const formatCurrency = (val: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "MMK", maximumFractionDigits: 0 }).format(
        Number(val)
    );

export const LoanList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Loan | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const { data: response, isLoading } = useLoans({ page, limit: pageSize });
    const { mutate: deleteLoan, isPending: isDeleting } = useDeleteLoan();

    const loans = response?.data || [];
    const pagination = response?.pagination;

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteLoan(deleteTarget, {
            onSuccess: () => { toast.success("Loan deleted."); setDeleteTarget(null); },
            onError: () => toast.error("Failed to delete loan."),
        });
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading loans...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
                    <p className="text-muted-foreground">Manage all active and past loan accounts.</p>
                </div>
                <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> New Loan
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Loans</CardTitle>
                    <CardDescription>Overview of all registered loan accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Loan Amount</TableHead>
                                <TableHead>Total w/ Interest</TableHead>
                                <TableHead>Remaining</TableHead>
                                <TableHead>Rate</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loans.length > 0 ? (
                                loans.map((loan) => {
                                    const borrowerName =
                                        typeof loan.borrowerId === "object"
                                            ? loan.borrowerId.fullName
                                            : loan.borrowerId;
                                    return (
                                        <TableRow key={loan._id}>
                                            <TableCell className="font-medium">{borrowerName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{loan.loanType}</Badge>
                                            </TableCell>
                                            <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                                            <TableCell>{formatCurrency(loan.totalWithInterest)}</TableCell>
                                            <TableCell>{formatCurrency(loan.remainingBalance)}</TableCell>
                                            <TableCell>{loan.interestRate}%</TableCell>
                                            <TableCell>
                                                <Badge variant={STATUS_VARIANT[loan.status] ?? "secondary"}>
                                                    {loan.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setEditTarget(loan); setFormOpen(true); }}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => setDeleteTarget(loan._id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">No loans found.</TableCell>
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

            <LoanFormDialog
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditTarget(null); }}
                initialData={editTarget}
            />

            <DeleteDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Loan"
                description="This will permanently delete the loan record and cannot be undone."
            />
        </div>
    );
};
