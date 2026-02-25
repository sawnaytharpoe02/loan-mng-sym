import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useContracts } from "@/services/contract/contract.queries";
import { useDeleteContract } from "@/services/contract/contract.mutations";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ContractFormDialog } from "@/pages/contract/ContractFormDialog";
import type { Contract } from "@/services/contract/contract.types";

export const ContractList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const { data: response, isLoading } = useContracts({ page, limit: pageSize });
    const { mutate: deleteContract, isPending: isDeleting } = useDeleteContract();

    const contracts: Contract[] = response?.data || [];
    const pagination = response?.pagination;

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteContract(deleteTarget, {
            onSuccess: () => { toast.success("Contract deleted."); setDeleteTarget(null); },
            onError: () => toast.error("Failed to delete contract."),
        });
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading contracts...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
                    <p className="text-muted-foreground">Loan contract signing records.</p>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Contract
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Contracts</CardTitle>
                    <CardDescription>Signed loan agreements registered in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contract #</TableHead>
                                <TableHead>Loan</TableHead>
                                <TableHead>Signing Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contracts.length > 0 ? (
                                contracts.map((c) => {
                                    const loanInfo = typeof c.loanId === "object" ? c.loanId : null;
                                    const borrowerName =
                                        loanInfo && typeof loanInfo.borrowerId === "object"
                                            ? loanInfo.borrowerId.fullName
                                            : "—";
                                    return (
                                        <TableRow key={c._id}>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono">
                                                    {c.contractNumber || c._id.slice(-8).toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{borrowerName}</TableCell>
                                            <TableCell>{new Date(c.signingDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => setDeleteTarget(c._id)}
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
                                    <TableCell colSpan={4} className="h-24 text-center">No contracts found.</TableCell>
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

            <ContractFormDialog open={formOpen} onOpenChange={setFormOpen} />

            <DeleteDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Contract"
                description="This will permanently remove this contract record."
            />
        </div>
    );
};
