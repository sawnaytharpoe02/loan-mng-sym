import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useRepayments, useRepaymentsByLoan } from "@/services/repayment/repayment.queries";
import { useDeleteRepayment } from "@/services/repayment/repayment.mutations";
import { MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { RepaymentFormDialog } from "@/pages/repayment/RepaymentFormDialog";
import type { Repayment } from "@/services/repayment/repayment.types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";
import { useDebounce } from "use-debounce";

export const RepaymentList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [searchLoanId, setSearchLoanId] = useState("");
    const [debouncedSearch] = useDebounce(searchLoanId, 500);

    const { data: allResponse, isLoading: isLoadingAll } = useRepayments(
        { page, limit: pageSize },
        { enabled: !debouncedSearch }
    );

    const { data: loanResponse, isLoading: isLoadingLoan } = useRepaymentsByLoan(
        debouncedSearch,
        { page, limit: pageSize },
        { enabled: !!debouncedSearch }
    );

    const { mutate: deleteRepayment, isPending: isDeleting } = useDeleteRepayment();

    const response = (debouncedSearch ? loanResponse : allResponse) as any;
    const isLoading = debouncedSearch ? isLoadingLoan : isLoadingAll;
    const repayments: Repayment[] = response?.data || [];
    const pagination = response?.pagination;

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteRepayment(deleteTarget, {
            onSuccess: () => { toast.success("Repayment deleted."); setDeleteTarget(null); },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Failed to delete repayment.");
                } else {
                    toast.error("Failed to delete repayment.");
                }
            },
        });
    };

    if (isLoading) return <div className="flex items-center mx-auto w-fit p-8 space-x-2"><Spinner className="text-primary h-6 w-6" /><p className="text-center text-muted-foreground">Loading repayments ...</p></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Repayments</h1>
                    <p className="text-muted-foreground">Track all loan repayment records.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter by Loan ID..."
                            className="pl-8 pr-8"
                            value={searchLoanId}
                            onChange={(e) => setSearchLoanId(e.target.value)}
                        />
                        {searchLoanId && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1.5 h-6 w-6"
                                onClick={() => setSearchLoanId("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Button onClick={() => setFormOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Record Repayment
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Repayments</CardTitle>
                    <CardDescription>A log of all repayment transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Payment Date</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Principal Paid</TableHead>
                                <TableHead>Interest Paid</TableHead>
                                <TableHead>Remaining Balance</TableHead>
                                <TableHead>Term</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {repayments.length > 0 ? (
                                repayments.map((r) => (
                                    <TableRow key={r._id}>
                                        <TableCell>{formatDate(r.paymentDate)}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(r.amountPaid)}</TableCell>
                                        <TableCell>{r.principalPaid ? formatCurrency(r.principalPaid) : "—"}</TableCell>
                                        <TableCell>{r.interestPaid ? formatCurrency(r.interestPaid) : "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{formatCurrency(r.remainingBalance)}</Badge>
                                        </TableCell>
                                        <TableCell>month {r.paymentTerm ?? "—"}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteTarget(r._id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">No repayments found.</TableCell>
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

            <RepaymentFormDialog open={formOpen} onOpenChange={setFormOpen} />

            <DeleteDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Repayment"
                description="This will permanently remove this repayment record."
            />
        </div>
    );
};
