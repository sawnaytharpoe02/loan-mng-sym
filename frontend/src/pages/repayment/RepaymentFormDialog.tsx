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
import { useCreateRepayment } from "@/services/repayment/repayment.mutations";
import { useLoans } from "@/services/loan/loan.queries";

interface RepaymentFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preselectedLoanId?: string;
}

export const RepaymentFormDialog: React.FC<RepaymentFormDialogProps> = ({ open, onOpenChange, preselectedLoanId }) => {
    const { mutate: create, isPending } = useCreateRepayment();
    const { data: loansResp } = useLoans({ limit: 200 });
    const activeLoans = (loansResp?.data || []).filter((l) => l.status === "Active");

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateRepaymentDTO>({
        resolver: zodResolver(createRepaymentSchema),
        defaultValues: {
            loanId: preselectedLoanId ?? "",
            amountPaid: "",
            paymentDate: new Date().toISOString().slice(0, 10),
        },
    });

    const selectedLoan = watch("loanId");

    React.useEffect(() => {
        if (open) {
            reset({
                loanId: preselectedLoanId ?? "",
                amountPaid: "",
                paymentDate: new Date().toISOString().slice(0, 10),
            });
        }
    }, [open, preselectedLoanId, reset]);

    const onSubmit = (data: CreateRepaymentDTO) => {
        create(data, {
            onSuccess: () => { toast.success("Repayment recorded!"); onOpenChange(false); },
            onError: () => toast.error("Failed to record repayment."),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Repayment</DialogTitle>
                    <DialogDescription>Enter the repayment details for an active loan.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
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

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Recording..." : "Record Repayment"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
