# 🛒 Yalla E-commerce API

A comprehensive e-commerce API built with Node.js, Express, MongoDB, and Docker. Features include user authentication, product management, shopping cart, orders, and more.

## 🚀 Quick Start with Docker

### Windows One-Click Setup

1. **Double-click `run.bat`** for automatic setup
2. **Or use PowerShell**: Right-click `run.ps1` → "Run with PowerShell"
3. **Access your API**: http://localhost:8000
4. **View Documentation**: http://localhost:8000/docs

### Manual Docker Setup

```bash
# 1. Clone the repository
git clone https://github.com/MahmoudKamal01/yalla_e-commerce_api.git
cd yalla_e-commerce_api

# 2. Create environment file
copy env.example config.env
# Edit config.env with your configuration

# 3. Start services
docker-compose up -d

# 4. View logs
docker-compose logs -f app
```

## 📋 Features

- **🔐 Authentication**: JWT-based user authentication
- **👥 User Management**: Registration, login, profile management
- **🛍️ Product Management**: CRUD operations with image uploads
- **🛒 Shopping Cart**: Add/remove items, apply coupons
- **📦 Order Management**: Create and track orders
- **📊 Categories & Brands**: Product categorization
- **⭐ Reviews & Ratings**: Product reviews system
- **📧 Email Integration**: Password reset via email
- **📚 API Documentation**: Interactive Swagger UI
- **🐳 Docker Support**: One-click deployment

## 🏗️ Architecture

- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Cache**: Redis (optional)
- **Documentation**: Swagger/OpenAPI 3.0
- **Containerization**: Docker + Docker Compose

## 📊 API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgotPassword` - Password reset
- `PUT /api/v1/auth/resetPassword` - Reset password

### Products

- `GET /api/v1/products` - List products (with filtering, pagination)
- `POST /api/v1/products` - Create product (Admin/Manager)
- `GET /api/v1/products/{id}` - Get specific product
- `PUT /api/v1/products/{id}` - Update product (Admin/Manager)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

### Cart & Orders

- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart` - Add product to cart
- `POST /api/v1/orders/{cartId}` - Create order
- `GET /api/v1/orders` - Get user orders

## 🔧 Development

### Prerequisites

- Node.js 18+
- MongoDB
- Docker (optional)

### Local Development

```bash
# Install dependencies
npm install

# Create config.env file
cp env.example config.env
# Edit config.env with your configuration

# Start development server
npm run dev
```

### Docker Development

```bash
# Start with Docker
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 🚀 Production Deployment

### Using Docker Hub

```bash
# Pull latest image
docker pull mahmoudkamalaldeen/yalla_ecommerce_api:latest

# Run with environment file
docker run -p 8000:8000 --env-file config.env mahmoudkamalaldeen/yalla_ecommerce_api:latest
```

### Using Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs
- **Docker Setup**: See `DOCKER_README.md`
- **Environment Variables**: See `env.example`

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm start               # Start production server

# Docker
npm run docker:compose:up     # Start Docker services
npm run docker:compose:down   # Stop Docker services
npm run docker:compose:logs   # View logs
npm run docker:build         # Build Docker image

# Linting
npm run lint            # Run ESLint
```

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- CORS configuration
- Environment variable security

## 📁 Project Structure

```
yalla_e-commerce_api/
├── config/              # Configuration files
├── middlewares/         # Express middlewares
├── models/             # MongoDB models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── uploads/            # File uploads
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Multi-container setup
├── run.bat            # Windows setup script
└── README.md          # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mahmoud Kamal**

- GitHub: [@MahmoudKamal01](https://github.com/MahmoudKamal01)
- Email: mahmoud@example.com

## 🆘 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f app`
2. Verify Docker is running
3. Review the troubleshooting section in `DOCKER_README.md`
4. Open an issue on GitHub

---

**Happy coding! 🚀**
