import express from "express";
import dotenv from "dotenv";
import DB from "./src/config/db";
import AuthRouter from "./src/routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/utils/swaggerdoc";
import UserRouter from "./src/routes/userRoute";
import cors from "cors";

DB
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);
// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`LendSqr Server running on: http://localhost:${PORT}`));
