import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInterestRateSchema, type CreateInterestRateDTO } from "@loan-mng/shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateInterestRate } from "@/services/interest-rate/interest-rate.mutations";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";

const ALLOWED_RATES = ["5", "10", "15", "20"];

interface InterestRateFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const InterestRateFormDialog: React.FC<InterestRateFormDialogProps> = ({ open, onOpenChange }) => {
    const { mutate: create, isPending } = useCreateInterestRate();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CreateInterestRateDTO>({
        resolver: zodResolver(createInterestRateSchema),
        defaultValues: { rate: "10", description: "", isActive: true },
        mode: "onChange"
    });

    const selectedRate = watch("rate");

    useEffect(() => {
        if (open) reset({ rate: "10", description: "", isActive: true });
    }, [open, reset]);

    const onSubmit = (data: CreateInterestRateDTO) => {
        create(data, {
            onSuccess: () => { toast.success("Interest rate created!"); onOpenChange(false); },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Failed to create interest rate.");
                } else {
                    toast.error("Failed to create interest rate.");
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Interest Rate</DialogTitle>
                    <DialogDescription>Configure a new interest rate for loan products.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <Field>
                        <FieldLabel>Rate (%)</FieldLabel>
                        <FieldContent>
                            <Select value={selectedRate} onValueChange={(v) => setValue("rate", v)}>
                                <SelectTrigger aria-invalid={!!errors.rate} className="w-full">
                                    <SelectValue placeholder="Select rate..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALLOWED_RATES.map((r) => (
                                        <SelectItem key={r} value={r}>{r}%</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError errors={[errors.rate]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Description (optional)</FieldLabel>
                        <FieldContent>
                            <Input {...register("description")} placeholder="Standard personal loan rate" />
                        </FieldContent>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Add Rate"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
