import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loanCalculatorSchema } from "@loan-mng/shared";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { useCalculateLoan } from "@/services/calculator/calculator.mutations";
import { formatCurrency } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Calculator, X } from "lucide-react";
import type { LoanCalculatorDTO, AmortizationEntry } from "@/services/calculator/calculator.types";

interface LoanCalculatorDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LoanCalculatorDrawer: React.FC<LoanCalculatorDrawerProps> = ({ open, onOpenChange }) => {
    const { mutate: calculate, isPending, data: resultAxios } = useCalculateLoan();
    const result = resultAxios?.data?.data;

    const { register, handleSubmit, formState: { errors } } = useForm<LoanCalculatorDTO>({
        resolver: zodResolver(loanCalculatorSchema),
        defaultValues: { principal: "1000000", annualRate: "10", termMonths: 12 },
    });

    const onSubmit = (data: LoanCalculatorDTO) => {
        calculate(data);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="min-h-fit">
                <div className="mx-auto w-full max-w-4xl">
                    <DrawerHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calculator className="h-6 w-6 text-primary" />
                                <DrawerTitle className="text-2xl">Loan Calculator</DrawerTitle>
                            </div>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon"><X className="h-4 w-4" /></Button>
                            </DrawerClose>
                        </div>
                        <DrawerDescription>
                            Calculate monthly payments and view amortization schedule.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto max-h-[70vh]">
                        {/* Input Section */}
                        <div className="space-y-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Field>
                                    <FieldLabel>Principal Amount (MMK)</FieldLabel>
                                    <FieldContent>
                                        <Input {...register("principal")} placeholder="1,000,000" />
                                        <FieldError errors={[errors.principal]} />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Annual Interest Rate (%)</FieldLabel>
                                    <FieldContent>
                                        <Input {...register("annualRate")} placeholder="10" />
                                        <FieldError errors={[errors.annualRate]} />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Term (Months)</FieldLabel>
                                    <FieldContent>
                                        <Input type="number" {...register("termMonths", { valueAsNumber: true })} placeholder="12" />
                                        <FieldError errors={[errors.termMonths]} />
                                    </FieldContent>
                                </Field>

                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? <><Spinner className="mr-2 h-4 w-4" /> Calculating...</> : "Calculate"}
                                </Button>
                            </form>

                            {result && (
                                <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                                    <h3 className="font-bold text-lg border-b pb-2">Results</h3>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Monthly Payment</p>
                                        <p className="text-2xl font-black text-primary">{formatCurrency(result.monthlyPayment)}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Payment</p>
                                            <p className="text-sm font-bold">{formatCurrency(result.totalPayment)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Interest</p>
                                            <p className="text-sm font-bold">{formatCurrency(result.totalInterest)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Schedule Section */}
                        <div className="md:col-span-2">
                            {result ? (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg flex items-center justify-between">
                                        Amortization Schedule
                                        <span className="text-xs font-normal text-muted-foreground">{result.amortizationSchedule.length} payments</span>
                                    </h3>
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="max-h-[50vh] overflow-y-auto">
                                            <Table>
                                                <TableHeader className="sticky top-0 bg-secondary/50 backdrop-blur-sm z-10">
                                                    <TableRow>
                                                        <TableHead className="w-16">Month</TableHead>
                                                        <TableHead>Principal</TableHead>
                                                        <TableHead>Interest</TableHead>
                                                        <TableHead className="text-right">Balance</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {result.amortizationSchedule.map((entry: AmortizationEntry) => (
                                                        <TableRow key={entry.month}>
                                                            <TableCell className="font-medium">#{entry.month}</TableCell>
                                                            <TableCell>{formatCurrency(entry.principal)}</TableCell>
                                                            <TableCell>{formatCurrency(entry.interest)}</TableCell>
                                                            <TableCell className="text-right font-mono text-xs">{formatCurrency(entry.balance)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed border-muted">
                                    <Calculator className="h-12 w-12 opacity-20 mb-4" />
                                    <p>Enter loan details and click calculate to view the schedule.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <DrawerFooter className="border-t bg-muted/30">
                        <DrawerClose asChild>
                            <Button variant="outline">Close Calculator</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
