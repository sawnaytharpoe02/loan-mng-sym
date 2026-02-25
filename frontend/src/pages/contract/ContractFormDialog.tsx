import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContractSchema, type CreateContractDTO } from "@loan-mng/shared";
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
import { useCreateContract } from "@/services/contract/contract.mutations";
import { useLoans } from "@/services/loan/loan.queries";

interface ContractFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ContractFormDialog: React.FC<ContractFormDialogProps> = ({ open, onOpenChange }) => {
    const { mutate: create, isPending } = useCreateContract();
    const { data: loansResp } = useLoans({ limit: 200 });
    const loans = loansResp?.data || [];

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateContractDTO>({
        resolver: zodResolver(createContractSchema),
        defaultValues: { loanId: "", signingDate: new Date().toISOString().slice(0, 10) },
    });

    const selectedLoan = watch("loanId");

    React.useEffect(() => {
        if (open) reset({ loanId: "", signingDate: new Date().toISOString().slice(0, 10) });
    }, [open, reset]);

    const onSubmit = (data: CreateContractDTO) => {
        create(data, {
            onSuccess: () => { toast.success("Contract created!"); onOpenChange(false); },
            onError: () => toast.error("Failed to create contract."),
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>New Contract</DialogTitle>
                    <DialogDescription>Link a signing date to an existing loan.</DialogDescription>
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
                                    {loans.map((l) => {
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
                        <FieldLabel>Signing Date</FieldLabel>
                        <FieldContent>
                            <Input type="date" {...register("signingDate")} aria-invalid={!!errors.signingDate} />
                            <FieldError errors={[errors.signingDate]} />
                        </FieldContent>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Contract"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
