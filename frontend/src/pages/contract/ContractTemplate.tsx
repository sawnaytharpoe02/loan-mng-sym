import { formatCurrency } from "@/lib/utils";
import { forwardRef } from "react";

interface ContractTemplateProps {
    data: {
        borrowerName: string;
        borrowerNrc: string;
        borrowerAddress: string;
        loanAmount: string;
        interestRate: string;
        termMonths: string;
        monthlyPayment: string;
        effectiveDate: string;
        contractNumber: string;
        collateral?: string;
        lenderName: string;
        witnessName: string;
    };
}

export const ContractTemplate = forwardRef<HTMLDivElement, ContractTemplateProps>(({ data }, ref) => {
    const {
        borrowerName,
        borrowerNrc,
        borrowerAddress,
        loanAmount,
        interestRate,
        termMonths,
        monthlyPayment,
        effectiveDate,
        contractNumber,
        collateral,
        lenderName,
        witnessName,
    } = data;

    return (
        <div
            ref={ref}
            className="contract-container print-margin-top p-8 space-y-8 bg-white text-black w-[816px] mx-auto border border-gray-100"
        >
            {/* Header */}
            <div className="text-center space-y-2 border-b-2 border-gray-900 pb-6">
                <h1 className="text-2xl font-bold uppercase tracking-widest">Loan Agreement Contract</h1>
                <p className="text-muted-foreground font-medium">Official Binding Document</p>
                <div className="flex justify-between text-sm mt-4 font-mono">
                    <span>Date: {effectiveDate || "________________"}</span>
                    <span>Contract No: {contractNumber}</span>
                </div>
            </div>

            {/* Parties */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold border-l-4 border-gray-900 pl-3">1. THE PARTIES</h2>
                <p className="leading-relaxed">
                    This Loan Agreement (the "Agreement") is made and entered into as of <strong>{effectiveDate || "________________"}</strong>,
                    by and between:
                </p>
                <div className="ml-6 space-y-2">
                    <p>
                        <strong>Lender:</strong> {lenderName || "Global Finance Solutions Ltd."} (the "Lender")
                    </p>
                    <p>
                        <strong>Borrower:</strong> {borrowerName || "________________"} with NRC/ID: <strong>{borrowerNrc || "________________"}</strong>,
                        residing at <strong>{borrowerAddress || "________________"}</strong> (the "Borrower").
                    </p>
                </div>
            </section>

            {/* Loan Terms */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold border-l-4 border-gray-900 pl-3">2. LOAN TERMS</h2>
                <p className="leading-relaxed">
                    The Lender agrees to lend the principal amount of <strong>{formatCurrency(loanAmount || "0")}</strong> (the "Loan")
                    to the Borrower, and the Borrower agrees to repay this amount inclusive of interest at a rate of
                    <strong> {interestRate || "0"}%</strong> per annum.
                </p>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div>
                        <span className="text-xs uppercase text-gray-500 block font-bold">Principal Amount</span>
                        <span className="text-base font-bold">{formatCurrency(loanAmount || "0")}</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-500 block font-bold">Annual Interest Rate</span>
                        <span className="text-base font-bold">{interestRate || "0"}%</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-500 block font-bold">Repayment Term</span>
                        <span className="text-base font-bold">{termMonths || "0"} Months</span>
                    </div>
                    <div>
                        <span className="text-xs uppercase text-gray-500 block font-bold">Monthly Payment</span>
                        <span className="text-base font-bold">{formatCurrency(monthlyPayment || "0")}</span>
                    </div>
                </div>
            </section>

            {/* Collateral */}
            {collateral && (
                <section className="space-y-4">
                    <h2 className="text-lg font-bold border-l-4 border-gray-900 pl-3">3. COLLATERAL</h2>
                    <p className="leading-relaxed">
                        As security for the repayment of the Loan, the Borrower pledges the following asset(s):
                        <br />
                        <strong className="block mt-2 ml-6 text-gray-800 italic underline">"{collateral}"</strong>
                    </p>
                </section>
            )}

            {/* Default */}
            <section className="space-y-4">
                <h2 className="text-lg font-bold border-l-4 border-gray-900 pl-3">{collateral ? "4." : "3."} DEFAULT</h2>
                <p className="text-sm leading-relaxed text-gray-700">
                    If the Borrower fails to make any payment when due under this Agreement, the Borrower shall be in default.
                    In such event, the Lender may declare the entire remaining Balance immediately due and payable.
                    The Borrower shall also be liable for all costs and expenses, including reasonable legal fees,
                    incurred by the Lender in enforcing its rights under this Agreement.
                </p>
            </section>

            {/* Signatures */}
            <div className="pt-12 grid grid-cols-2 gap-24 break-before-page">
                <div className="space-y-12">
                    <div className="border-t border-gray-900 pt-2">
                        <p className="font-bold">Lender Signature</p>
                        <p className="text-xs text-gray-500 lowercase italic">Authorized Representative</p>
                    </div>
                    <div className="border-t border-gray-900 pt-2">
                        <p className="font-bold">Witness Signature</p>
                        <p className="text-xs text-gray-500">{witnessName || "________________"}</p>
                    </div>
                </div>
                <div className="space-y-12">
                    <div className="border-t border-gray-900 pt-2">
                        <p className="font-bold">Borrower Signature</p>
                        <p className="text-xs text-gray-500">{borrowerName || "________________"}</p>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs text-gray-400 mt-auto">This document is generated by Loan Management System.</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    .print-margin-top {
                        margin-top: 2rem;
                    }
                    .break-before-page {
                        break-before: page;
                        page-break-before: always;
                        padding-top: 6rem;
                    }
                    body {
                        background-color: white !important;
                    }
                    .contract-container {
                        border: none !important;
                        width: 100% !important;
                        padding: 5rem !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
});

ContractTemplate.displayName = "ContractTemplate";
