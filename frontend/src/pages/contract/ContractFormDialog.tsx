import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContractSchema } from "@loan-mng/shared";
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
import { isAxiosError } from "axios";
import type { IResponse } from "@/types/api.types";
import { Upload, File } from "lucide-react";
import { z } from "zod";

interface ContractFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const extendedCreateContractSchema = createContractSchema.extend({
    file: z.any().optional(),
});

type ExtendedCreateContractDTO = z.infer<typeof extendedCreateContractSchema>;

export const ContractFormDialog: React.FC<ContractFormDialogProps> = ({ open, onOpenChange }) => {
    const { mutate: create, isPending } = useCreateContract();
    const { data: loansResp } = useLoans({ limit: 200 });
    const loans = loansResp?.data || [];
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ExtendedCreateContractDTO>({
        resolver: zodResolver(extendedCreateContractSchema),
        defaultValues: { loanId: "", signingDate: new Date().toISOString().slice(0, 10), contractNumber: "" },
    });

    const selectedLoan = watch("loanId");
    const selectedFile = watch("file");

    useEffect(() => {
        if (open) reset({ loanId: "", signingDate: new Date().toISOString().slice(0, 10), contractNumber: "" });
    }, [open, reset]);

    const onSubmit = (data: ExtendedCreateContractDTO) => {
        if (!data.file || data.file.length === 0) {
            toast.error("Please select a contract document file.");
            return;
        }

        const formData = new FormData();
        formData.append("loanId", data.loanId);
        formData.append("signingDate", data.signingDate);
        formData.append("contractNumber", data.contractNumber);
        formData.append("document", data.file[0]);

        create(formData as any, {
            onSuccess: () => {
                toast.success("Contract uploaded successfully!");
                onOpenChange(false);
            },
            onError: (err) => {
                if (isAxiosError<IResponse>(err)) {
                    toast.error(err.response?.data?.message || "Failed to upload contract.");
                } else {
                    toast.error("Failed to upload contract.");
                }
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Signed Contract</DialogTitle>
                    <DialogDescription>
                        Register a signed loan agreement. Select the loan and upload the PDF file.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <Field>
                        <FieldLabel>Loan Agreement</FieldLabel>
                        <FieldContent>
                            <Select value={selectedLoan} onValueChange={(v) => setValue("loanId", v)}>
                                <SelectTrigger className="w-full">
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
                        <FieldLabel>Contract Number</FieldLabel>
                        <FieldContent>
                            <Input type="text" {...register("contractNumber")} aria-invalid={!!errors.contractNumber} />
                            <FieldError errors={[errors.contractNumber]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Signing Date</FieldLabel>
                        <FieldContent>
                            <Input type="date" {...register("signingDate")} aria-invalid={!!errors.signingDate} />
                            <FieldError errors={[errors.signingDate]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Contract File (PDF)</FieldLabel>
                        <FieldContent>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${selectedFile?.length ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    {...register("file")}
                                    ref={(e) => {
                                        register("file").ref(e);
                                        (fileInputRef as any).current = e;
                                    }}
                                />
                                {selectedFile?.length ? (
                                    <>
                                        <File className="h-8 w-8 text-primary" />
                                        <p className="text-sm font-medium text-center truncate max-w-full">
                                            {selectedFile[0].name}
                                        </p>
                                        <Button type="button" variant="ghost" size="sm" onClick={(e) => {
                                            e.stopPropagation();
                                            setValue("file", [] as any);
                                        }}>Remove</Button>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground text-center">
                                            Click to upload or drag and drop signed PDF
                                        </p>
                                    </>
                                )}
                            </div>
                            <FieldError errors={[errors.file]} />
                        </FieldContent>
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Uploading..." : "Save Contract"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
