import express from "express";
import { AuthController } from "../controllers/authController";

const AuthRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: For onboarding a new user
 *     tags: [Auth Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phone
 *               - password
 *               - bvn
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               bvn:
 *                type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
AuthRouter.route("/register").post(AuthController.registerUser);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and receive authentication token
 *     tags: [Auth Endpoints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 */
AuthRouter.route("/login").post(AuthController.loginUser);

export default AuthRouter;
