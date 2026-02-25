import { Routes, Route } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { BorrowerList } from "@/pages/borrower/BorrowerList";
import { LoanList } from "@/pages/loan/LoanList";
import { RepaymentList } from "@/pages/repayment/RepaymentList";
import { InterestRateList } from "@/pages/interest-rate/InterestRateList";
import { TransactionList } from "@/pages/transaction/TransactionList";
import { ContractList } from "@/pages/contract/ContractList";
import { ContractGenerator } from "@/pages/contract/ContractGenerator";
import { Dashboard } from "@/pages/dashboard/Dashboard";
import { RegisterPage } from "./pages/auth/RegisterPage";

export default function App() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected shell */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="borrowers" element={<BorrowerList />} />
                    <Route path="loans" element={<LoanList />} />
                    <Route path="repayments" element={<RepaymentList />} />
                    <Route path="transactions" element={<TransactionList />} />
                    <Route path="interest-rates" element={<InterestRateList />} />
                    <Route path="contracts" element={<ContractList />} />
                    <Route path="contracts/generator" element={<ContractGenerator />} />
                </Route>
            </Route>
        </Routes>
    );
}