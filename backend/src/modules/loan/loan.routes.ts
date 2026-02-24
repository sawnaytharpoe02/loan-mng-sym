import { Router } from "express";
import { LoanController } from "./loan.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { createLoanSchema, updateLoanSchema } from "@loan-mng/shared";

const router = Router();
const controller = new LoanController();

router.use(authenticate);

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.get("/borrower/:borrowerId", controller.findByBorrowerId);
router.post("/", authorize("Admin", "LoanOfficer"), validate(createLoanSchema), controller.create);
router.put("/:id", authorize("Admin", "LoanOfficer"), validate(updateLoanSchema), controller.update);
router.delete("/:id", authorize("Admin"), controller.delete);

export default router;
