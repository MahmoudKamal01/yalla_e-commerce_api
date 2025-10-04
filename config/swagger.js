const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Yalla E-commerce API",
      version: "1.0.0",
      description:
        "A comprehensive e-commerce API built with Node.js, Express, and MongoDB",
      contact: {
        name: "Mahmoud Kamal",
        email: "mahmoud@example.com",
        url: "https://github.com/MahmoudKamal01/yalla_e-commerce_api",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Development server",
      },
      {
        url: "https://your-production-url.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
            phone: {
              type: "string",
              description: "User phone number",
            },
            profileImg: {
              type: "string",
              description: "User profile image URL",
            },
            role: {
              type: "string",
              enum: ["user", "manager", "admin"],
              description: "User role",
            },
            active: {
              type: "boolean",
              description: "User account status",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Product ID",
            },
            title: {
              type: "string",
              description: "Product title",
            },
            slug: {
              type: "string",
              description: "Product slug",
            },
            description: {
              type: "string",
              description: "Product description",
            },
            quantity: {
              type: "number",
              description: "Available quantity",
            },
            sold: {
              type: "number",
              description: "Number of items sold",
            },
            price: {
              type: "number",
              description: "Product price",
            },
            priceAfterDiscount: {
              type: "number",
              description: "Price after discount",
            },
            colors: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Available colors",
            },
            imageCover: {
              type: "string",
              description: "Cover image URL",
            },
            images: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Product images",
            },
            category: {
              type: "string",
              description: "Category ID",
            },
            subcategory: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Subcategory IDs",
            },
            brand: {
              type: "string",
              description: "Brand ID",
            },
            ratingsAverage: {
              type: "number",
              description: "Average rating",
            },
            ratingsQuantity: {
              type: "number",
              description: "Number of ratings",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Category ID",
            },
            name: {
              type: "string",
              description: "Category name",
            },
            slug: {
              type: "string",
              description: "Category slug",
            },
            image: {
              type: "string",
              description: "Category image URL",
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Cart ID",
            },
            cartItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: {
                    type: "string",
                    description: "Product ID",
                  },
                  quantity: {
                    type: "number",
                    description: "Item quantity",
                  },
                  price: {
                    type: "number",
                    description: "Item price",
                  },
                },
              },
            },
            totalCartPrice: {
              type: "number",
              description: "Total cart price",
            },
            totalPriceAfterDiscount: {
              type: "number",
              description: "Total price after discount",
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Order ID",
            },
            user: {
              type: "string",
              description: "User ID",
            },
            cartItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  product: {
                    type: "string",
                    description: "Product ID",
                  },
                  quantity: {
                    type: "number",
                    description: "Item quantity",
                  },
                  price: {
                    type: "number",
                    description: "Item price",
                  },
                },
              },
            },
            shippingAddress: {
              type: "object",
              properties: {
                details: {
                  type: "string",
                  description: "Address details",
                },
                phone: {
                  type: "string",
                  description: "Phone number",
                },
                city: {
                  type: "string",
                  description: "City",
                },
                postalCode: {
                  type: "string",
                  description: "Postal code",
                },
              },
            },
            taxPrice: {
              type: "number",
              description: "Tax amount",
            },
            shippingPrice: {
              type: "number",
              description: "Shipping cost",
            },
            totalOrderPrice: {
              type: "number",
              description: "Total order price",
            },
            paymentMethodType: {
              type: "string",
              enum: ["card", "cash"],
              description: "Payment method",
            },
            isPaid: {
              type: "boolean",
              description: "Payment status",
            },
            paidAt: {
              type: "string",
              format: "date-time",
              description: "Payment date",
            },
            isDelivered: {
              type: "boolean",
              description: "Delivery status",
            },
            deliveredAt: {
              type: "string",
              format: "date-time",
              description: "Delivery date",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Error status",
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./services/*.js"], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
