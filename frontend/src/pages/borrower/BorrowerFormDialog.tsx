import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBorrowerSchema, type CreateBorrowerDTO } from "@loan-mng/shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateBorrower, useCreateBorrower } from "@/services/borrower/borrower.mutations";
import type { Borrower } from "@/services/borrower/borrower.types";
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";

interface BorrowerFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: Borrower | null;
}

export const BorrowerFormDialog: React.FC<BorrowerFormDialogProps> = ({
    open,
    onOpenChange,
    initialData,
}) => {
    const isEdit = !!initialData;
    const { mutate: create, isPending: creating } = useCreateBorrower();
    const { mutate: update, isPending: updating } = useUpdateBorrower(initialData?._id || "");
    const isLoading = creating || updating;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateBorrowerDTO>({
        resolver: zodResolver(createBorrowerSchema),
        defaultValues: initialData
            ? {
                fullName: initialData.fullName,
                email: initialData.email,
                phone: initialData.phone,
                nrc: initialData.nrc,
                address: initialData.address,
            }
            : { fullName: "", email: "", phone: "", nrc: "", address: "" },
    });

    // Reset form when dialog opens/closes or initialData changes
    React.useEffect(() => {
        if (open) {
            reset(
                initialData
                    ? {
                        fullName: initialData.fullName,
                        email: initialData.email,
                        phone: initialData.phone,
                        nrc: initialData.nrc,
                        address: initialData.address,
                    }
                    : { fullName: "", email: "", phone: "", nrc: "", address: "" }
            );
        }
    }, [open, initialData, reset]);

    const onSubmit = (data: CreateBorrowerDTO) => {
        if (isEdit && initialData) {
            update({ ...data }, {
                onSuccess: () => { toast.success("Borrower updated!"); onOpenChange(false); },
                onError: (err) => {
                    if (isAxiosError<IResponse>(err)) {
                        toast.error(err.response?.data?.message || "Failed to update borrower.");
                    } else {
                        toast.error("Failed to update borrower.");
                    }
                },
            });
        } else {
            create(data, {
                onSuccess: () => { toast.success("Borrower created!"); onOpenChange(false); },
                onError: (err) => {
                    if (isAxiosError<IResponse>(err)) {
                        toast.error(err.response?.data?.message || "Failed to create borrower.");
                    } else {
                        toast.error("Failed to create borrower.");
                    }
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Borrower" : "New Borrower"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the borrower's profile information." : "Fill in the details to create a new borrower."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <Field>
                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                        <FieldContent>
                            <Input id="fullName" {...register("fullName")} placeholder="John Doe" aria-invalid={!!errors.fullName} />
                            <FieldError errors={[errors.fullName]} />
                        </FieldContent>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <FieldContent>
                                <Input id="email" type="email" {...register("email")} placeholder="john@example.com" aria-invalid={!!errors.email} />
                                <FieldError errors={[errors.email]} />
                            </FieldContent>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="phone">Phone</FieldLabel>
                            <FieldContent>
                                <Input id="phone" {...register("phone")} placeholder="+1234567890" aria-invalid={!!errors.phone} />
                                <FieldError errors={[errors.phone]} />
                            </FieldContent>
                        </Field>
                    </div>

                    <Field>
                        <FieldLabel htmlFor="nrc">National ID / NRC</FieldLabel>
                        <FieldContent>
                            <Input id="nrc" {...register("nrc")} placeholder="14/MAMANA(N)101020" aria-invalid={!!errors.nrc} />
                            <FieldError errors={[errors.nrc]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="address">Address</FieldLabel>
                        <FieldContent>
                            <Textarea id="address" {...register("address")} placeholder="123 Main St, City, Country" className="min-h-[80px]" aria-invalid={!!errors.address} />
                            <FieldError errors={[errors.address]} />
                        </FieldContent>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Borrower" : "Create Borrower")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
