import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLoanSchema, LoanType, type CreateLoanDTO } from "@loan-mng/shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCreateLoan, useUpdateLoan } from "@/services/loan/loan.mutations";
import { useBorrowers } from "@/services/borrower/borrower.queries";
import type { Loan } from "@/services/loan/loan.types";

interface LoanFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Loan | null;
}

const LOAN_TYPES = LoanType.options;

export const LoanFormDialog: React.FC<LoanFormDialogProps> = ({ open, onOpenChange, initialData }) => {
    const isEdit = !!initialData;
    const { mutate: create, isPending: creating } = useCreateLoan();
    const { mutate: update, isPending: updating } = useUpdateLoan(initialData?._id ?? "");
    const isLoading = creating || updating;

    const { data: borrowersResp } = useBorrowers({ limit: 200 });
    const borrowers = borrowersResp?.data || [];

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateLoanDTO>({
        resolver: zodResolver(createLoanSchema),
        defaultValues: {
            borrowerId: typeof initialData?.borrowerId === "object" ? initialData.borrowerId._id : initialData?.borrowerId ?? "",
            loanAmount: initialData?.loanAmount ?? "",
            loanType: initialData?.loanType ?? "Personal",
            startDate: initialData?.startDate ? initialData.startDate.slice(0, 10) : "",
            endDate: initialData?.endDate ? initialData.endDate.slice(0, 10) : "",
            interestRate: initialData?.interestRate ?? "",
        },
    });

    const selectedType = watch("loanType");
    const selectedBorrower = watch("borrowerId");

    React.useEffect(() => {
        if (open) {
            reset({
                borrowerId: typeof initialData?.borrowerId === "object" ? initialData.borrowerId._id : initialData?.borrowerId ?? "",
                loanAmount: initialData?.loanAmount ?? "",
                loanType: initialData?.loanType ?? "Personal",
                startDate: initialData?.startDate ? initialData.startDate.slice(0, 10) : "",
                endDate: initialData?.endDate ? initialData.endDate.slice(0, 10) : "",
                interestRate: initialData?.interestRate ?? "",
            });
        }
    }, [open, initialData, reset]);

    const onSubmit = (data: CreateLoanDTO) => {
        if (isEdit) {
            update(data, {
                onSuccess: () => { toast.success("Loan updated!"); onOpenChange(false); },
                onError: () => toast.error("Failed to update loan."),
            });
        } else {
            create(data, {
                onSuccess: () => { toast.success("Loan created!"); onOpenChange(false); },
                onError: () => toast.error("Failed to create loan."),
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Loan" : "New Loan"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the loan details." : "Fill in the details to create a new loan."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    {/* Borrower */}
                    <Field>
                        <FieldLabel>Borrower</FieldLabel>
                        <FieldContent>
                            <Select value={selectedBorrower} onValueChange={(v) => setValue("borrowerId", v)}>
                                <SelectTrigger aria-invalid={!!errors.borrowerId} className="w-full">
                                    <SelectValue placeholder="Select borrower..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {borrowers.map((b) => (
                                        <SelectItem key={b._id} value={b._id}>{b.fullName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError errors={[errors.borrowerId]} />
                        </FieldContent>
                    </Field>

                    {/* Loan Type */}
                    <Field>
                        <FieldLabel>Loan Type</FieldLabel>
                        <FieldContent>
                            <Select value={selectedType} onValueChange={(v) => setValue("loanType", v as CreateLoanDTO["loanType"])}>
                                <SelectTrigger aria-invalid={!!errors.loanType} className="w-full">
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOAN_TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError errors={[errors.loanType]} />
                        </FieldContent>
                    </Field>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel>Loan Amount</FieldLabel>
                            <FieldContent>
                                <Input {...register("loanAmount")} placeholder="10000" aria-invalid={!!errors.loanAmount} />
                                <FieldError errors={[errors.loanAmount]} />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>Interest Rate (%)</FieldLabel>
                            <FieldContent>
                                <Input {...register("interestRate")} placeholder="10" aria-invalid={!!errors.interestRate} />
                                <FieldError errors={[errors.interestRate]} />
                            </FieldContent>
                        </Field>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel>Start Date</FieldLabel>
                            <FieldContent>
                                <Input type="date" {...register("startDate")} aria-invalid={!!errors.startDate} />
                                <FieldError errors={[errors.startDate]} />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel>End Date</FieldLabel>
                            <FieldContent>
                                <Input type="date" {...register("endDate")} aria-invalid={!!errors.endDate} />
                                <FieldError errors={[errors.endDate]} />
                            </FieldContent>
                        </Field>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Loan" : "Create Loan")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
