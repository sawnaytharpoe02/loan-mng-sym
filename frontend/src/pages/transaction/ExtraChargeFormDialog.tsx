import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionSchema, type CreateTransactionDTO } from "@loan-mng/shared";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTransaction } from "@/services/transaction/transaction.mutations";
import { useLoans } from "@/services/loan/loan.queries";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";
import { z } from "zod";

// Subset schema: only LateFee and Penalty types allowed
const extraChargeSchema = createTransactionSchema.extend({
    transactionType: z.enum(["LateFee", "Penalty"]),
});

type ExtraChargeFormData = z.infer<typeof extraChargeSchema>;

interface ExtraChargeFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ExtraChargeFormDialog: React.FC<ExtraChargeFormDialogProps> = ({ open, onOpenChange }) => {
    const { mutate: createTransaction, isPending } = useCreateTransaction();
    const { data: loansResp } = useLoans({ limit: 200 });
    const activeLoans = (loansResp?.data || []).filter((l) => l.status === "Active");

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ExtraChargeFormData>({
        resolver: zodResolver(extraChargeSchema),
        defaultValues: {
            loanId: "",
            transactionType: "LateFee",
            amount: "",
            description: "",
            transactionDate: new Date().toISOString().slice(0, 10),
        },
    });

    const selectedLoan = watch("loanId");
    const selectedType = watch("transactionType");

    React.useEffect(() => {
        if (open) {
            reset({
                loanId: "",
                transactionType: "LateFee",
                amount: "",
                description: "",
                transactionDate: new Date().toISOString().slice(0, 10),
            });
        }
    }, [open, reset]);

    const onSubmit = (data: ExtraChargeFormData) => {
        createTransaction(data as CreateTransactionDTO, {
            onSuccess: () => {
                toast.success(`${data.transactionType === "LateFee" ? "Late fee" : "Penalty"} recorded successfully!`);
                onOpenChange(false);
            },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Failed to record charge.");
                } else {
                    toast.error("Failed to record charge.");
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Extra Charge</DialogTitle>
                    <DialogDescription>
                        Record a late fee or penalty against a loan. This will not affect the loan balance — it is tracked separately.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <Field>
                        <FieldLabel>Charge Type</FieldLabel>
                        <FieldContent>
                            <Select value={selectedType} onValueChange={(v) => setValue("transactionType", v as "LateFee" | "Penalty")}>
                                <SelectTrigger aria-invalid={!!errors.transactionType} className="w-full">
                                    <SelectValue placeholder="Select type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LateFee">Late Fee</SelectItem>
                                    <SelectItem value="Penalty">Penalty</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldError errors={[errors.transactionType]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Loan</FieldLabel>
                        <FieldContent>
                            <Select value={selectedLoan} onValueChange={(v) => setValue("loanId", v)}>
                                <SelectTrigger aria-invalid={!!errors.loanId} className="w-full">
                                    <SelectValue placeholder="Select loan..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {activeLoans.map((l) => {
                                        const name = typeof l.borrowerId === "object" ? l.borrowerId.fullName : l.borrowerId;
                                        return (
                                            <SelectItem key={l._id} value={l._id}>
                                                {name} — ${Number(l.loanAmount).toLocaleString()}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            <FieldError errors={[errors.loanId]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Amount</FieldLabel>
                        <FieldContent>
                            <Input {...register("amount")} placeholder="5000" aria-invalid={!!errors.amount} />
                            <FieldError errors={[errors.amount]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Date</FieldLabel>
                        <FieldContent>
                            <Input type="date" {...register("transactionDate")} aria-invalid={!!errors.transactionDate} />
                            <FieldError errors={[errors.transactionDate]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Description (optional)</FieldLabel>
                        <FieldContent>
                            <Input {...register("description")} placeholder="Reason for charge..." />
                            <FieldError errors={[errors.description]} />
                        </FieldContent>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Recording..." : "Record Charge"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
