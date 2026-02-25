import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useLoans } from "@/services/loan/loan.queries";
import { useDeleteLoan } from "@/services/loan/loan.mutations";
import { Copy, Edit, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { Loan } from "@/services/loan/loan.types";
import { LoanFormDialog } from "@/pages/loan/LoanFormDialog";
import { Spinner } from "@/components/ui/spinner";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";
import { useDebounce } from "use-debounce";
import { formatCurrency } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
    Active: "default",
    Closed: "secondary",
    Defaulted: "destructive",
};

export const LoanList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Loan | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const { data: response, isLoading } = useLoans({ page, limit: pageSize, search: debouncedSearch });
    const { mutate: deleteLoan, isPending: isDeleting } = useDeleteLoan();

    const loans = response?.data || [];
    const pagination = response?.pagination;

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteLoan(deleteTarget, {
            onSuccess: () => { toast.success("Loan deleted."); setDeleteTarget(null); },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Failed to delete loan.");
                } else {
                    toast.error("Failed to delete loan.");
                }
            },
        });
    };

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Loan ID copied to clipboard");
    };

    if (isLoading) return <div className="flex items-center mx-auto w-fit p-8 space-x-2"><Spinner className="text-primary h-6 w-6" /><p className="text-center text-muted-foreground">Loading loans ...</p></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
                    <p className="text-muted-foreground">Manage all active and past loan accounts.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search borrower name..."
                            className="pl-8 pr-8"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1.5 h-6 w-6"
                                onClick={() => setSearchQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> New Loan
                    </Button>
                </div>
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
                                <TableHead>ID</TableHead>
                                <TableHead>Borrower</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Loan Amount</TableHead>
                                <TableHead>Total w/ Interest</TableHead>
                                <TableHead>Repayment Terms</TableHead>
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

                                    const startDate = new Date(loan.startDate);
                                    const endDate = new Date(loan.endDate);
                                    const termMonths = Math.max(
                                        1,
                                        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                                        (endDate.getMonth() - startDate.getMonth())
                                    );
                                    return (
                                        <TableRow key={loan._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <span className="truncate max-w-[100px]" title={loan._id}>{loan._id}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => handleCopy(loan._id)}
                                                    >
                                                        <Copy className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{borrowerName}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{loan.loanType}</Badge>
                                            </TableCell>
                                            <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                                            <TableCell>{formatCurrency(loan.totalWithInterest)}</TableCell>
                                            <TableCell>{termMonths} months</TableCell>
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
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => { setEditTarget(loan); setFormOpen(true); }}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            variant="destructive"
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
