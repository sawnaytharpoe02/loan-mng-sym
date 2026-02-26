import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRepaymentSchema, type CreateRepaymentDTO } from "@loan-mng/shared";
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
import { useCreateRepayment, useUpdateRepayment } from "@/services/repayment/repayment.mutations";
import { useLoans } from "@/services/loan/loan.queries";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";
import type { Repayment } from "@/services/repayment/repayment.types";

interface RepaymentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preselectedLoanId?: string;
    editRepayment?: Repayment | null;
}

export const RepaymentFormDialog: React.FC<RepaymentFormDialogProps> = ({ open, onOpenChange, preselectedLoanId, editRepayment }) => {
    const isEditMode = !!editRepayment;
    const { mutate: create, isPending: isCreating } = useCreateRepayment();
    const { mutate: update, isPending: isUpdating } = useUpdateRepayment();
    const isPending = isCreating || isUpdating;
    const { data: loansResp } = useLoans({ limit: 200 });
    const activeLoans = (loansResp?.data || []).filter((l) => l.status === "Active");

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateRepaymentDTO>({
        resolver: zodResolver(createRepaymentSchema),
        defaultValues: {
            loanId: preselectedLoanId ?? "",
            amountPaid: "",
            paymentDate: new Date().toISOString().slice(0, 10),
            paymentTerm: undefined,
        },
    });

    const selectedLoan = watch("loanId");

    React.useEffect(() => {
        if (open) {
            if (editRepayment) {
                const loanId = typeof editRepayment.loanId === "object" ? editRepayment.loanId._id : editRepayment.loanId;
                reset({
                    loanId: loanId,
                    amountPaid: editRepayment.amountPaid,
                    paymentDate: editRepayment.paymentDate ? new Date(editRepayment.paymentDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                    paymentTerm: editRepayment.paymentTerm ?? undefined,
                });
            } else {
                reset({
                    loanId: preselectedLoanId ?? "",
                    amountPaid: "",
                    paymentDate: new Date().toISOString().slice(0, 10),
                    paymentTerm: undefined,
                });
            }
        }
    }, [open, preselectedLoanId, editRepayment, reset]);

    const onSubmit = (data: CreateRepaymentDTO) => {
        if (isEditMode) {
            update({ id: editRepayment!._id, data }, {
                onSuccess: () => { toast.success("Repayment updated!"); onOpenChange(false); },
                onError: (err) => {
                    if (isAxiosError<IResponse>(err)) {
                        toast.error(err.response?.data?.message || "Failed to update repayment.");
                    } else {
                        toast.error("Failed to update repayment.");
                    }
                },
            });
        } else {
            create(data, {
                onSuccess: () => { toast.success("Repayment recorded!"); onOpenChange(false); },
                onError: (err) => {
                    if (isAxiosError<IResponse>(err)) {
                        toast.error(err.response?.data?.message || "Failed to record repayment.");
                    } else {
                        toast.error("Failed to record repayment.");
                    }
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Repayment" : "Record Repayment"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "Update the repayment details. Balance will be recalculated." : "Enter the repayment details for an active loan."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <Field>
                        <FieldLabel>Loan</FieldLabel>
                        <FieldContent>
                            <Select value={selectedLoan} onValueChange={(v) => setValue("loanId", v)} disabled={isEditMode}>
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
                        <FieldLabel>Amount Paid</FieldLabel>
                        <FieldContent>
                            <Input {...register("amountPaid")} placeholder="500" aria-invalid={!!errors.amountPaid} />
                            <FieldError errors={[errors.amountPaid]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Payment Date</FieldLabel>
                        <FieldContent>
                            <Input type="date" {...register("paymentDate")} aria-invalid={!!errors.paymentDate} />
                            <FieldError errors={[errors.paymentDate]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Payment Term</FieldLabel>
                        <FieldContent>
                            <Input type="number" {...register("paymentTerm", { valueAsNumber: true })} aria-invalid={!!errors.paymentTerm} />
                            <FieldError errors={[errors.paymentTerm]} />
                        </FieldContent>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (isEditMode ? "Updating..." : "Recording...") : (isEditMode ? "Update Repayment" : "Record Repayment")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
