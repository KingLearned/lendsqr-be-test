import express from "express";
import { UserController } from "../controllers/userController";
import AuthHelper from "../middlewares/Authenticator";

const UserRouter = express.Router();

/**
 * @swagger
 * /user/user-details:
 *   get:
 *     summary: Get users details with wallet number and balance
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       401:
 *         description: Unauthorized or error fetching user details
*/
UserRouter.route("/user-details").get(AuthHelper.AuthenticateUser, UserController.getUserDetails);
/**
 * @swagger
 * /user/users-all:
 *   get:
 *     summary: Get users details with wallet number and balance
 *     responses:
 *       200:
 *         description: Users fetched successfully
*/
UserRouter.route("/users-all").get(UserController.getAllUsers);
/**
 * @swagger
 * /user/fund-wallet:
 *   post:
 *     summary: Funding of user's wallet
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Wallet funded successfully
 *       400:
 *         description: Invalid input
 */
UserRouter.route("/fund-wallet").post(AuthHelper.AuthenticateUser, UserController.fundWallet);
/**
 * @swagger
 * /user/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account_number
 *               - amount
 *             properties:
 *               account_number:
 *                 type: string
 *                 example: "0763512345"
 *               amount:
 *                 type: number
 *                 example: 500
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Invalid input or insufficient funds
 */
UserRouter.route("/transfer").post(AuthHelper.AuthenticateUser, UserController.transferFunds);
/**
 * @swagger
 * /user/withdraw:
 *   post:
 *     summary: Withdraw funds from wallet
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 250
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Insufficient funds or bad request
 */
UserRouter.route("/withdraw").post(AuthHelper.AuthenticateUser, UserController.withdrawFunds);
/**
 * @swagger
 * /user/transaction-history:
 *   get:
 *     summary: Get transaction history for the authenticated user
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: Transaction history fetched successfully
 *       404:
 *         description: No transactions found
 */
UserRouter.route("/transaction-history").get(AuthHelper.AuthenticateUser, UserController.getTransactionHistory);

export default UserRouter;