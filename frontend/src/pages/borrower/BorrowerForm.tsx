import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBorrowerSchema, type CreateBorrowerDTO } from "@loan-mng/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";

interface BorrowerFormProps {
    initialData?: CreateBorrowerDTO;
    onSubmit: (data: CreateBorrowerDTO) => void;
    isLoading?: boolean;
}

export const BorrowerForm: React.FC<BorrowerFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateBorrowerDTO>({
        resolver: zodResolver(createBorrowerSchema),
        defaultValues: initialData || {
            fullName: "",
            email: "",
            phone: "",
            nrc: "",
            address: "",
        },
    });

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? "Update Borrower" : "Create New Borrower"}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                        <FieldContent>
                            <Input
                                id="fullName"
                                {...register("fullName")}
                                placeholder="John Doe"
                                aria-invalid={!!errors.fullName}
                            />
                            <FieldError errors={[errors.fullName]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">Email Address</FieldLabel>
                        <FieldContent>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="john@example.com"
                                aria-invalid={!!errors.email}
                            />
                            <FieldError errors={[errors.email]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                        <FieldContent>
                            <Input
                                id="phone"
                                {...register("phone")}
                                placeholder="+1234567890"
                                aria-invalid={!!errors.phone}
                            />
                            <FieldError errors={[errors.phone]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="nrc">National ID / NRC</FieldLabel>
                        <FieldContent>
                            <Input
                                id="nrc"
                                {...register("nrc")}
                                placeholder="ID-12345"
                                aria-invalid={!!errors.nrc}
                            />
                            <FieldError errors={[errors.nrc]} />
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="address">Address</FieldLabel>
                        <FieldContent>
                            <Textarea
                                id="address"
                                {...register("address")}
                                placeholder="123 Main St, City, Country"
                                className="min-h-[100px]"
                                aria-invalid={!!errors.address}
                            />
                            <FieldError errors={[errors.address]} />
                        </FieldContent>
                    </Field>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Borrower" : "Save Borrower")}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

