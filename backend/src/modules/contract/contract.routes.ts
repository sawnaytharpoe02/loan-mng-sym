import { Router } from "express";
import { ContractController } from "./contract.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { upload } from "../../config/multer";
import { validate } from "../../middleware/validate.middleware";
import { createContractSchema } from "@loan-mng/shared";

const router = Router();
const controller = new ContractController();

router.use(authenticate);

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.get("/loan/:loanId", controller.findByLoanId);
router.get("/:id/download", controller.download);
router.post("/", authorize("Admin", "LoanOfficer"), upload.single("document"), validate(createContractSchema), controller.create);
router.delete("/:id", authorize("Admin"), controller.delete);

export default router;
