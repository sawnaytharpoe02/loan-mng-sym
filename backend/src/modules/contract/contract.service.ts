import { injectable, inject } from "tsyringe";
import { ContractRepository } from "./contract.repository";
import { LoanRepository } from "../loan/loan.repository";
import { ApiError } from "../../utils/api-error";
import { FileStorageService } from "../common/storage.service";

export interface IS3File {
    key: string;
    originalname: string;
    mimetype: string;
    size: number;
    location: string;
}

@injectable()
export class ContractService {
    constructor(
        @inject("ContractRepository") private contractRepository: ContractRepository,
        @inject("LoanRepository") private loanRepository: LoanRepository,
        @inject("FileStorageService") private storageService: FileStorageService
    ) { }

    async create(loanId: string, signingDate: string, file: IS3File) {
        const loan = await this.loanRepository.findById(loanId);
        if (!loan) {
            throw ApiError.notFound("Loan not found");
        }

        // The 'key' contains the full path (e.g., 'contracts/unique-suffix.pdf')
        return this.contractRepository.create({
            loanId: loan._id as any,
            documentPath: file.key,
            originalName: file.originalname,
            signingDate: new Date(signingDate),
        });
    }

    async findByLoanId(loanId: string) {
        return this.contractRepository.findByLoanId(loanId);
    }

    async findAll() {
        return this.contractRepository.findAll();
    }

    async findById(id: string) {
        const contract = await this.contractRepository.findById(id);
        if (!contract) {
            throw ApiError.notFound("Contract not found");
        }
        return contract;
    }

    async getDownloadUrl(id: string) {
        const contract = await this.contractRepository.findById(id);
        if (!contract) {
            throw ApiError.notFound("Contract not found");
        }

        const url = await this.storageService.getSignedDownloadUrl(
            contract.documentPath,
            contract.originalName
        );
        return { url, originalName: contract.originalName };
    }

    async delete(id: string) {
        const contract = await this.contractRepository.findById(id);
        if (!contract) {
            throw ApiError.notFound("Contract not found");
        }

        // Delete object from S3 using storage service
        await this.storageService.deleteFile(contract.documentPath);

        return this.contractRepository.delete(id);
    }
}
