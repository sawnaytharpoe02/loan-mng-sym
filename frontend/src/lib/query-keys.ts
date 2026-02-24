// Query keys factory following a standardized pattern
export const QUERY_KEY = {
    // Borrowers
    BORROWERS: ["borrowers"] as const,
    BORROWER: (id: string) => ["borrower", id] as const,

    // Loans
    LOANS: ["loans"] as const,
    LOAN: (id: string) => ["loan", id] as const,
    LOANS_BY_BORROWER: (borrowerId: string) => ["loans", "borrower", borrowerId] as const,

    // Repayments
    REPAYMENTS: ["repayments"] as const,
    REPAYMENT: (id: string) => ["repayment", id] as const,
    REPAYMENTS_BY_LOAN: (loanId: string) => ["repayments", "loan", loanId] as const,

    // Transactions
    TRANSACTIONS: ["transactions"] as const,
    TRANSACTION: (id: string) => ["transaction", id] as const,
    TRANSACTIONS_BY_LOAN: (loanId: string) => ["transactions", "loan", loanId] as const,

    // Contracts
    CONTRACTS: ["contracts"] as const,
    CONTRACT: (id: string) => ["contract", id] as const,
    CONTRACTS_BY_LOAN: (loanId: string) => ["contracts", "loan", loanId] as const,

    // Interest Rates
    INTEREST_RATES: ["interest-rates"] as const,
    ACTIVE_INTEREST_RATES: ["interest-rates", "active"] as const,
    INTEREST_RATE: (id: string) => ["interest-rate", id] as const,
};
