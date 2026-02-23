import { Router } from "express";
import { InterestRateController } from "./interest-rate.controller";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const router = Router();
const controller = new InterestRateController();

router.use(authenticate);

router.get("/", controller.findAll);
router.get("/active", controller.findActive);
router.get("/:id", controller.findById);
router.put("/:id", authorize("Admin"), controller.update);

export default router;
