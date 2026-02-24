import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { createTransactionSchema } from "@loan-mng/shared";

const router = Router();
const controller = new TransactionController();

router.use(authenticate);

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.get("/loan/:loanId", controller.findByLoanId);
router.post("/", authorize("Admin", "LoanOfficer"), validate(createTransactionSchema), controller.create);

export default router;
