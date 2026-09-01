import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketRouter from "./market";
import legalRouter from "./legal";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketRouter);
router.use(legalRouter);

export default router;
