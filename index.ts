import express from "express";
import DB from "./src/config/db";
import AuthRouter from "./src/routes/authRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/utils/swaggerdoc";
import UserRouter from "./src/routes/userRoute";
import cors from "cors";
import { PORT } from "./src/config/env";

DB
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/user", UserRouter);

// API documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec,  
    {
        swaggerOptions: {
            persistAuthorization: true,
        }
    }
));

app.listen(PORT, () => console.log(`LendSqr Server running on: http://localhost:${PORT}`));
