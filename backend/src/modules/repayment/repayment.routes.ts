import { Router } from "express";
import { RepaymentController } from "./repayment.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { createRepaymentSchema } from "@loan-mng/shared";

const router = Router();
const controller = new RepaymentController();

router.use(authenticate);

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.get("/loan/:loanId", controller.findByLoanId);
router.post("/", authorize("Admin", "LoanOfficer"), validate(createRepaymentSchema), controller.create);

export default router;
