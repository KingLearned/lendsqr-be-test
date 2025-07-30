import swaggerJSDoc from "swagger-jsdoc";
import { BASE_URL } from "../config/env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lendsqr Demo Credit Wallet API",
      version: "1.0.0",
      description: "API documentation for the Lendsqr Demo Credit Wallet MVP",
    },
    servers: [
      {
        url: BASE_URL,
      },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        }
    },
    security: [
        {
            BearerAuth: []
        },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
