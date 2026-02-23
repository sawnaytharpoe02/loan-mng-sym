import { Router } from "express";
import { BorrowerController } from "./borrower.controller";
import { validate } from "../../middleware/validate.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";
import { createBorrowerSchema, updateBorrowerSchema } from "@loan-mng/shared";

const router = Router();
const controller = new BorrowerController();

router.use(authenticate);

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/", authorize("Admin", "LoanOfficer"), validate(createBorrowerSchema), controller.create);
router.put("/:id", authorize("Admin", "LoanOfficer"), validate(updateBorrowerSchema), controller.update);
router.delete("/:id", authorize("Admin"), controller.delete);

export default router;
