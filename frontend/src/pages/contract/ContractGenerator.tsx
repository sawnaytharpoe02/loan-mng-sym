import React, { useRef, useState, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel, FieldContent, FieldDescription } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContractTemplate } from "./ContractTemplate";
import { useBorrowers } from "@/services/borrower/borrower.queries";
import { Download, ArrowLeft, RefreshCcw, Sparkles } from "lucide-react";
import { Link } from "react-router";
import Decimal from "decimal.js";
import { Badge } from "@/components/ui/badge";

export const ContractGenerator: React.FC = () => {
    const templateRef = useRef<HTMLDivElement>(null);
    const { data: borrowersResp } = useBorrowers({ limit: 100 });
    const borrowers = borrowersResp?.data || [];

    const [formData, setFormData] = useState({
        borrowerId: "",
        loanAmount: "10000",
        interestRate: "10",
        termMonths: "12",
        effectiveDate: new Date().toISOString().slice(0, 10),
        collateral: "",
        witnessName: "",
        contractNumber: "",
        lenderName: "MaharBawga Finance Ltd.",
    });

    const selectedBorrower = useMemo(() =>
        borrowers.find(b => b._id === formData.borrowerId),
        [borrowers, formData.borrowerId]);

    const monthlyPayment = useMemo(() => {
        try {
            const P = new Decimal(formData.loanAmount || 0);
            const r = new Decimal(formData.interestRate || 0).dividedBy(100).dividedBy(12);
            const n = new Decimal(formData.termMonths || 1);

            if (r.isZero()) return P.dividedBy(n).toFixed(2);

            // P * (r(1+r)^n) / ((1+r)^n - 1)
            const onePlusR = r.plus(1);
            const onePlusRPowN = onePlusR.pow(n);
            const numerator = r.times(onePlusRPowN);
            const denominator = onePlusRPowN.minus(1);

            return P.times(numerator).dividedBy(denominator).toFixed(2);
        } catch {
            return "0.00";
        }
    }, [formData.loanAmount, formData.interestRate, formData.termMonths]);

    const handlePrint = useReactToPrint({
        contentRef: templateRef,
        documentTitle: `Contract_${selectedBorrower?.fullName || "Draft"}_${formData.effectiveDate}`,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateContractNumber = () => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const newNumber = `CONT-${date}-${random}`;
        setFormData(prev => ({ ...prev, contractNumber: newNumber }));
    };

    const templateData = {
        borrowerName: selectedBorrower?.fullName || "",
        borrowerNrc: selectedBorrower?.nrc || "",
        borrowerAddress: selectedBorrower?.address || "",
        loanAmount: formData.loanAmount,
        interestRate: formData.interestRate,
        termMonths: formData.termMonths,
        contractNumber: formData.contractNumber,
        monthlyPayment,
        effectiveDate: formData.effectiveDate,
        collateral: formData.collateral,
        lenderName: formData.lenderName,
        witnessName: formData.witnessName,
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/contracts"><ArrowLeft className="h-5 w-5" /></Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Contract Generator</h1>
                        <p className="text-muted-foreground">Draft and preview loan agreements before signing.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setFormData({
                        ...formData,
                        borrowerId: "",
                        loanAmount: "10000",
                        interestRate: "10",
                        termMonths: "12",
                        collateral: "",
                        witnessName: "",
                    })}>
                        <RefreshCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button onClick={() => handlePrint()}>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>

            <div className="h-fit">
                {/* Form Side */}
                <Card className="h-fit flex flex-col mb-5">
                    <CardHeader>
                        <CardTitle>Agreement Details</CardTitle>
                        <CardDescription>Fill in the facts to populate the template.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 overflow-y-auto py-2">
                        <Field>
                            <FieldLabel>Borrower</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={formData.borrowerId}
                                    onValueChange={(v) => setFormData(prev => ({ ...prev, borrowerId: v }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select borrower..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {borrowers.map(b => (
                                            <SelectItem key={b._id} value={b._id}>{b.fullName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Loan Amount ($)</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        name="loanAmount"
                                        value={formData.loanAmount}
                                        onChange={handleChange}
                                    />
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Interest Rate (%)</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        name="interestRate"
                                        value={formData.interestRate}
                                        onChange={handleChange}
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Term (Months)</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        name="termMonths"
                                        value={formData.termMonths}
                                        onChange={handleChange}
                                    />
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel>Effective Date</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="date"
                                        name="effectiveDate"
                                        value={formData.effectiveDate}
                                        onChange={handleChange}
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Contract Number</FieldLabel>
                            <FieldContent>
                                <div className="flex gap-2">
                                    <Input
                                        name="contractNumber"
                                        value={formData.contractNumber}
                                        onChange={handleChange}
                                        placeholder="CONT-2024..."
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={generateContractNumber}
                                        title="Generate Unique ID"
                                    >
                                        <Sparkles className="h-4 w-4 text-amber-500" />
                                    </Button>
                                </div>
                            </FieldContent>
                            <FieldDescription>
                                Generate a unique contract number for this agreement. Please saved this to reuse when creating new contract.
                            </FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>Lender Name</FieldLabel>
                            <FieldContent>
                                <Input
                                    name="lenderName"
                                    value={formData.lenderName}
                                    onChange={handleChange}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Collateral (Optional)</FieldLabel>
                            <FieldContent>
                                <Input
                                    placeholder="e.g. Toyota Camry 2020 (VIN: ...)"
                                    name="collateral"
                                    value={formData.collateral}
                                    onChange={handleChange}
                                />
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Witness Name</FieldLabel>
                            <FieldContent>
                                <Input
                                    placeholder="Full name of witness"
                                    name="witnessName"
                                    value={formData.witnessName}
                                    onChange={handleChange}
                                />
                            </FieldContent>
                        </Field>
                    </CardContent>
                </Card>

                {/* Preview Side */}
                <Card className="h-full flex flex-col overflow-hidden">
                    <CardHeader className="bg-white border-b shrink-0">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Document Preview</CardTitle>
                                <CardDescription>Real-time reflection of your inputs.</CardDescription>
                            </div>
                            <Badge variant="secondary" className="font-mono uppercase tracking-tighter">Draft Mode</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="overflow-auto p-8 shadow-none scrollbar-thin scrollbar-thumb-gray-300">
                        <div className="origin-top transform-gpu transition-transform duration-300 scale-[0.85] hover:scale-[0.95]">
                            <ContractTemplate
                                ref={templateRef}
                                data={templateData}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};

