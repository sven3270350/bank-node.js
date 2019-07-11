import { Router } from "express";

// Import Controllers
import usersRouter from "./controllers/users.controller";
import utilsRouter from "./controllers/utils.controller";
import registerRouter from "./controllers/register.controller";
import loginRouter from "./controllers/login.controller";
import logoutRouter from "./controllers/logout.controller";
import billsRouter from "./controllers/bills.controller";
import searchRouter from "./controllers/search.controller";
import currencyRouter from "./controllers/currency.controller";
import notificationsRouter from "./controllers/notifications.controller";
import transactionsRouter from "./controllers/transactions.controller";
import createRouter from "./controllers/create.controller";
import confirmRouter from "./controllers/confirm.controller";

// Import Middlewares
import { AuthHandler } from "./middlewares/authHandler.middleware";

const auth = new AuthHandler();
const router: Router = Router();

router.use("/Auth", [registerRouter, loginRouter, logoutRouter]);
router.use("/users", usersRouter);
router.use("/bills", auth.authenticate(), [billsRouter, searchRouter]);
router.use("/transactions", auth.authenticate(), [
  transactionsRouter,
  createRouter,
  confirmRouter
]);
router.use("/additionals", auth.authenticate(), notificationsRouter);
router.use("/currency", currencyRouter);

router.use("/utils", utilsRouter);

export default router;
