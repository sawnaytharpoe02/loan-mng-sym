import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { useInterestRates } from "@/services/interest-rate/interest-rate.queries";
import { useDeleteInterestRate } from "@/services/interest-rate/interest-rate.mutations";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { InterestRateFormDialog } from "./InterestRateFormDialog";

export const InterestRateList: React.FC = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const { data: response, isLoading } = useInterestRates();
    const { mutate: deleteRate, isPending: isDeleting } = useDeleteInterestRate();

    const rates = response?.data || [];

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteRate(deleteTarget, {
            onSuccess: () => { toast.success("Rate deleted."); setDeleteTarget(null); },
            onError: () => toast.error("Failed to delete rate."),
        });
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading interest rates...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Interest Rates</h1>
                    <p className="text-muted-foreground">Manage the available interest rates for loans.</p>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Rate
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Rate Configurations</CardTitle>
                    <CardDescription>All configured interest rates in the system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rate (%)</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rates.length > 0 ? (
                                rates.map((rate) => (
                                    <TableRow key={rate._id}>
                                        <TableCell className="font-bold text-lg">{rate.rate}%</TableCell>
                                        <TableCell className="text-muted-foreground">{rate.description || "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant={rate.isActive ? "default" : "secondary"}>
                                                {rate.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(rate.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteTarget(rate._id)}
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
                                    <TableCell colSpan={5} className="h-24 text-center">No interest rates configured.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <InterestRateFormDialog open={formOpen} onOpenChange={setFormOpen} />

            <DeleteDialog
                open={!!deleteTarget}
                onOpenChange={(o) => !o && setDeleteTarget(null)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title="Delete Interest Rate"
                description="This will permanently remove this interest rate configuration."
            />
        </div>
    );
};
