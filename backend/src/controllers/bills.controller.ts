import { NextFunction, Request, Response, Router } from "express";
import * as HttpStatus from "http-status-codes";
import { param, validationResult } from "express-validator/check";

// Import Services
import { AdditionalService } from "../services/additionals.service";
import { BillService } from "../services/bills.service";

// Import Interfaces
import { responseError } from "../resources/interfaces/responseError.interface";

const billsRouter: Router = Router();

/**
 * Returns basic data about the user
 *
 * @Method GET
 * @URL /api/bills/:id
 *
 */
billsRouter
  .route("/:id")

  .get(
    [
      param("id")
        .exists()
        .isNumeric()
        .isLength({ min: 1 })
    ],

    async (req: Request, res: Response, next: NextFunction) => {
      const billService = new BillService();
      const additionalService = new AdditionalService();

      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        const err: responseError = {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          error: validationErrors.array()
        };
        return next(err);
      }

      try {
        const userId = req.params.id;
        const bill = await billService.getByUserId(userId);
        const additional = await additionalService.getByUserId(userId);

        if (bill && additional) {
          res.status(HttpStatus.OK).json({
            accountBill: bill.accountBill,
            availableFunds: bill.availableFunds,
            currency: {
              id: bill.currency.id,
              name: bill.currency.name
            },
            additionals: {
              accountBalanceHistory: additional.accountBalanceHistory,
              incomingTransfersSum: additional.incomingTransfersSum,
              outgoingTransfersSum: additional.outgoingTransfersSum
            }
          });
        }
      } catch (error) {
        const err: responseError = {
          success: false,
          code: HttpStatus.BAD_REQUEST,
          error
        };
        next(err);
      }
    }
  );

export default billsRouter;
