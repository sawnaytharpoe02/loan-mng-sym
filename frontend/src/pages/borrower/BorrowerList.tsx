import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Mail, Phone, MapPin, CreditCard, Edit, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useBorrowers } from "@/services/borrower/borrower.queries";
import { useDeleteBorrower } from "@/services/borrower/borrower.mutations";
import { Pagination } from "@/components/ui/pagination";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { BorrowerFormDialog } from "@/pages/borrower/BorrowerFormDialog";
import type { Borrower } from "@/services/borrower/borrower.types";
import { Spinner } from "@/components/ui/spinner";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";
import { useDebounce } from "use-debounce";
import { Input } from "@/components/ui/input";

export const BorrowerList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [formOpen, setFormOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Borrower | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const { data: response, isLoading } = useBorrowers({ page, limit: pageSize, search: debouncedSearch });
    const { mutate: deleteBorrower, isPending: isDeleting } = useDeleteBorrower();

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteBorrower(deleteTarget, {
            onSuccess: () => {
                toast.success("Borrower deleted successfully");
                setDeleteTarget(null);
            },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Failed to delete borrower");
                } else {
                    toast.error("Failed to delete borrower");
                }
            },
        });
    };

    const handleEditClick = (borrower: Borrower) => {
        setEditTarget(borrower);
        setFormOpen(true);
    };

    const handleNewClick = () => {
        setEditTarget(null);
        setFormOpen(true);
    };

    if (isLoading) return <div className="flex items-center mx-auto w-fit p-8 space-x-2"><Spinner className="text-primary h-6 w-6" /><p className="text-center text-muted-foreground">Loading borrowers ...</p></div>;

    const borrowers = response?.data || [];
    const pagination = response?.pagination;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Borrowers</h1>
                    <p className="text-muted-foreground">Manage your loan customers and their profiles.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
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
                    <Button onClick={handleNewClick}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        New Borrower
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Borrowers</CardTitle>
                    <CardDescription>A list of all borrowers registered in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>National ID</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {borrowers.length > 0 ? (
                                borrowers.map((borrower) => (
                                    <TableRow key={borrower._id}>
                                        <TableCell className="font-medium">{borrower.fullName}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center text-[13px] text-muted-foreground">
                                                    <Mail className="mr-1 h-3 w-3" />{borrower.email}
                                                </div>
                                                <div className="flex items-center text-[13px] text-muted-foreground">
                                                    <Phone className="mr-1 h-3 w-3" />{borrower.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center"><CreditCard className="mr-1 w-4 h-4" />
                                                <p className="text-[13px] font-mono">{borrower.nrc}</p></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start max-w-[200px]">
                                                <MapPin className="mr-1 h-4 w-4 shrink-0 mt-0.5" />
                                                <span className="truncate">{borrower.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEditClick(borrower)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteTarget(borrower._id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No borrowers found.
                                    </TableCell>
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
                            onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
                            pageSizeOptions={[5, 10, 20, 50]}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Create / Edit Dialog */}
            <BorrowerFormDialog
                open={formOpen}
                onOpenChange={(open) => { setFormOpen(open); if (!open) setEditTarget(null); }}
                initialData={editTarget}
            />

            {/* Delete Confirmation */}
            <DeleteDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Borrower"
                description="This will permanently delete the borrower and cannot be undone."
            />
        </div>
    );
};
