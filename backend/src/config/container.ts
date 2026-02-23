import "reflect-metadata";
import { container } from "tsyringe";

// Repositories
import { BorrowerRepository } from "../modules/borrower/borrower.repository";
import { LoanRepository } from "../modules/loan/loan.repository";
import { RepaymentRepository } from "../modules/repayment/repayment.repository";
import { InterestRateRepository } from "../modules/interest-rate/interest-rate.repository";
import { TransactionRepository } from "../modules/transaction/transaction.repository";
import { ContractRepository } from "../modules/contract/contract.repository";
import { UserRepository } from "../modules/auth/auth.repository";

// Services
import { BorrowerService } from "../modules/borrower/borrower.service";
import { LoanService } from "../modules/loan/loan.service";
import { RepaymentService } from "../modules/repayment/repayment.service";
import { InterestRateService } from "../modules/interest-rate/interest-rate.service";
import { TransactionService } from "../modules/transaction/transaction.service";
import { ContractService } from "../modules/contract/contract.service";
import { AuthService } from "../modules/auth/auth.service";
import { FileStorageService } from "../modules/common/storage.service";

// Register repositories
container.registerSingleton("BorrowerRepository", BorrowerRepository);
container.registerSingleton("LoanRepository", LoanRepository);
container.registerSingleton("RepaymentRepository", RepaymentRepository);
container.registerSingleton("InterestRateRepository", InterestRateRepository);
container.registerSingleton("TransactionRepository", TransactionRepository);
container.registerSingleton("ContractRepository", ContractRepository);
container.registerSingleton("UserRepository", UserRepository);

// Register services
container.registerSingleton("BorrowerService", BorrowerService);
container.registerSingleton("LoanService", LoanService);
container.registerSingleton("RepaymentService", RepaymentService);
container.registerSingleton("InterestRateService", InterestRateService);
container.registerSingleton("TransactionService", TransactionService);
container.registerSingleton("ContractService", ContractService);
container.registerSingleton("AuthService", AuthService);
container.registerSingleton("FileStorageService", FileStorageService);

export { container };
