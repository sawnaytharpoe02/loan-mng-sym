import React from "react";
import { useBorrowers } from "../borrower.queries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Mail, Phone, MapPin, CreditCard, Edit, Trash2 } from "lucide-react";
import { useDeleteBorrower } from "../borrower.mutations";
import { toast } from "sonner";

export const BorrowerList: React.FC = () => {
    const { data: response, isLoading } = useBorrowers();
    const { mutate: deleteBorrower } = useDeleteBorrower();

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this borrower?")) {
            deleteBorrower(id, {
                onSuccess: () => toast.success("Borrower deleted successfully"),
                onError: () => toast.error("Failed to delete borrower"),
            });
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading borrowers...</div>;

    const borrowers = response?.data || [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Borrowers</h1>
                    <p className="text-muted-foreground">Manage your loan customers and their profiles.</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    New Borrower
                </Button>
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
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Mail className="mr-1 h-3 w-3" />
                                                    {borrower.email}
                                                </div>
                                                <div className="flex items-center text-xs text-muted-foreground">
                                                    <Phone className="mr-1 h-3 w-3" />
                                                    {borrower.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono">
                                                <CreditCard className="mr-1 h-3 w-3" />
                                                {borrower.identificationNumber}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-start max-w-[200px] text-xs text-muted-foreground">
                                                <MapPin className="mr-1 h-3 w-3 shrink-0 mt-0.5" />
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
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(borrower._id)}
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
                </CardContent>
            </Card>
        </div>
    );
};
