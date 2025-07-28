import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Demo Credit Wallet API",
      version: "1.0.0",
      description: "API documentation for the Demo Credit Wallet MVP",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
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
