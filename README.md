# Advanced Backend API with Product Management

[![CI/CD Pipeline](https://github.com/putraxdev/Backend-api-test-1/actions/workflows/ci.yml/badge.svg)](https://github.com/putraxdev/Backend-api-test-1/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/putraxdev/Backend-api-test-1/branch/main/graph/badge.svg)](https://codecov.io/gh/putraxdev/Backend-api-test-1)
[![Code Quality](https://img.shields.io/badge/code%20quality-A-brightgreen)](https://github.com/putraxdev/Backend-api-test-1)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen)](https://github.com/putraxdev/Backend-api-test-1)

## 🚀 Overview

Advanced backend API dengan clean architecture, built dengan Node.js, Express, PostgreSQL, dan implementasi best practices untuk production-ready application. Dilengkapi dengan sistem manajemen produk yang komprehensif dan dokumentasi API menggunakan Swagger.

## ✨ Key Features

### 🏗️ **Architecture & Design**
- **Clean Architecture**: Controller → Usecase → Repository → Model pattern
- **DTO Pattern**: Separate Request/Response objects untuk type safety
- **Middleware Layer**: Authentication, validation, error handling
- **Dependency Injection**: Loosely coupled components

### �️ **Product Management System**
- **Complete CRUD Operations**: Create, Read, Update, Delete products
- **Advanced Product Schema**: Name, description, price, SKU, category, stock, dimensions, tags
- **Stock Management**: Stock tracking dan low stock alerts
- **Search & Filter**: Search by name/description/SKU, filter by category/price/status
- **Audit Trail**: createdBy, updatedBy, createdAt, updatedAt untuk setiap produk
- **Soft Delete**: Deactivate products without permanent deletion

### �🔒 **Security & Authentication**
- **Password Hashing**: bcrypt dengan salt rounds 12
- **JWT Authentication**: Advanced JWT dengan claims validation
- **Request Validation**: Joi schema validation
- **SQL Injection Protection**: Sequelize ORM

### 🗄️ **Database & ORM**
- **PostgreSQL**: Production-grade database
- **Sequelize ORM**: Modern ORM dengan associations dan validations
- **Docker Integration**: Containerized database setup
- **Adminer**: Web-based database management

### 📚 **API Documentation**
- **Swagger UI**: Interactive API documentation di `/api-docs`
- **OpenAPI 3.0**: Standard API specification
- **Authentication Integration**: Test endpoints langsung dari Swagger
- **Schema Validation**: Request/response schema documentation

### 🧪 **Testing & Quality**
- **TDD Approach**: Test-driven development
- **95%+ Coverage**: Comprehensive test coverage
- **Jest Framework**: Unit & integration tests
- **Supertest**: API endpoint testing
- **Product Test Suite**: Complete test coverage untuk product features

### 📊 **Code Quality & CI/CD**
- **ESLint**: Airbnb style guide (strict mode)
- **GitHub Actions**: Automated CI/CD pipeline
- **Codecov**: Coverage tracking & reporting
- **Quality Gates**: Strict merge requirements

### 🐳 **DevOps & Production**
- **Docker**: Multi-stage production builds
- **Makefile**: Development automation
- **Health Checks**: Application monitoring
- **Environment Config**: 12-factor app compliance

## 📋 Project Structure

```
├── cmd/web/main.js                 # Application entry point
├── src/
## 📁 Project Structure

```
Backend-api-test-1/
├── cmd/web/                        # Application entry point
│   └── main.js                     # Server setup and initialization
├── src/
│   ├── controllers/                # HTTP request handlers
│   │   ├── userController.js
│   │   └── productController.js    # NEW: Product management
│   ├── usecases/                   # Business logic layer
│   │   ├── userUsecase.js
│   │   └── productUsecase.js       # NEW: Product business logic
│   ├── repositories/               # Data access layer
│   │   ├── userRepository.js
│   │   └── productRepository.js    # NEW: Product data access
│   ├── models/                     # Database models
│   │   ├── db.js
│   │   ├── testDb.js
│   │   ├── user.js
│   │   └── product.js              # NEW: Product model
│   ├── routes/                     # API routes
│   │   ├── userRoutes.js
│   │   └── productRoutes.js        # NEW: Product API routes
│   ├── middleware/                 # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── validateRequest.js
│   ├── config/                     # Configuration files
│   │   └── swagger.js              # NEW: Swagger configuration
│   └── dto/                        # Data transfer objects
│       ├── userRequest.js
│       ├── userResponse.js
│       ├── loginResponse.js
│       ├── errorResponse.js
│       ├── productRequest.js       # NEW: Product DTOs
│       └── productResponse.js      # NEW: Product response DTOs
├── tests/                          # Test files
│   ├── user.test.js
│   ├── userUsecase.test.js
│   ├── repository.test.js
│   ├── controller.test.js
│   ├── middleware.test.js
│   ├── product.test.js             # NEW: Product model tests
│   ├── productRepository.test.js   # NEW: Product repository tests
│   ├── productUsecase.test.js      # NEW: Product usecase tests
│   └── productController.test.js   # NEW: Product controller tests
├── .github/
│   ├── workflows/ci.yml            # CI/CD pipeline
│   └── BRANCH_PROTECTION.md        # Branch protection rules
├── Makefile                        # NEW: Development automation
├── docker-compose.yml              # Development services
├── Dockerfile                      # Production container
├── .eslintrc.json                  # Linting configuration
└── .githooks/pre-push              # Git hooks
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js**: 18.x or 20.x
- **Docker & Docker Compose**: Latest version
- **Git**: Latest version
- **npm**: 9.x or higher
- **Make**: For using Makefile commands (optional)

### 🚀 Quick Start (Recommended)

The fastest way to get started is using our Makefile:

```bash
# Clone repository
git clone https://github.com/putraxdev/Backend-api-test-1.git
cd Backend-api-test-1

# One-command setup and run (starts everything!)
make run
```

This single command will:
1. Start PostgreSQL database in Docker
2. Install dependencies
3. Run database migrations
4. Start the application
5. Show you all available endpoints and documentation

### 🌟 Alternative: Manual Setup

```bash
# 1. Clone Repository
git clone https://github.com/putraxdev/Backend-api-test-1.git
cd Backend-api-test-1
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Environment Variables:**
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appdb
DB_USER=appuser
DB_PASS=appsecret

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

```bash
# Start PostgreSQL and Adminer
docker-compose up -d

# Verify database is running
docker-compose ps
```

**Database Access:**
- **PostgreSQL**: `localhost:5432`
- **Adminer**: `http://localhost:8080`
  - Server: `postgres`
  - Username: `appuser`
  - Password: `appsecret`
  - Database: `appdb`

### 4. Dependencies Installation

```bash
# Install production dependencies
npm install

# Install development dependencies (for development)
npm install --include=dev
```

### 5. Development Setup

```bash
# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Start development server
npm run dev

# Start production server
npm start
```

## 🔧 Development Workflow

### 🛠️ Makefile Commands

We provide a comprehensive Makefile for development automation. Here are the most useful commands:

#### Quick Start Commands
```bash
make help           # Show all available commands
make run            # Complete setup and start (database + app)
make quick-start    # Setup and start for new developers
```

#### Development Commands
```bash
make install        # Install dependencies
make dev            # Start development server with auto-reload
make test           # Run all tests
make test-watch     # Run tests in watch mode
make test-coverage  # Run tests with coverage report
make lint           # Run linter
make lint-fix       # Fix linting issues
```

#### Database Commands
```bash
make docker-up      # Start PostgreSQL in Docker
make docker-down    # Stop Docker services
make db-migrate     # Setup database (handled automatically)
make db-status      # Check database status
make db-connect     # Connect to database via CLI
```

#### Production Commands
```bash
make build          # Build for production
make prod-start     # Start in production mode
make docker-build   # Build Docker image
```

#### Utility Commands
```bash
make clean          # Clean dependencies and build artifacts
make info           # Show environment information
make health         # Check application health
make logs           # Show application logs
make stop           # Stop application and services
make restart        # Restart application
```

#### Quality & CI Commands
```bash
make validate       # Run linting and tests
make audit          # Run security audit
make audit-fix      # Fix security vulnerabilities
make ci             # Run complete CI pipeline
```

**Example Workflow:**
```bash
# New developer setup
make quick-start

# Daily development
make dev             # Start dev server
make test-watch      # Run tests while developing

# Before commit
make validate        # Ensure code quality

# Production deployment
make prod-build && make prod-start
```

### Git Hooks Setup

```bash
# Setup pre-push hooks (recommended)
chmod +x .githooks/pre-push
git config core.hooksPath .githooks
```

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push (will trigger quality checks)
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## 📡 API Documentation

### Base URL
```
Development: http://localhost:3000
Production: https://your-domain.com
```

### 📚 API Documentation
Interactive API documentation tersedia di **Swagger UI**: 
- **Local**: http://localhost:3000/api-docs
- **Features**: Test endpoints langsung, lihat schema, authentication integration

### Endpoints

#### 🏥 Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-08-19T07:00:00.000Z",
  "version": "1.0.0",
  "documentation": "/api-docs"
}
```

---

## 👤 User Management API

#### 👤 User Registration
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation Rules:**
- Username: 3-30 alphanumeric characters
- Email: Valid email format
- Password: Min 6 chars, must contain uppercase, lowercase, and number

**Response (201):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2025-08-19T07:00:00.000Z"
}
```

#### 🔐 User Login
```http
POST /api/users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2025-08-19T07:00:00.000Z"
  },
  "expiresIn": "1h"
}
```

#### 👨‍💼 Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <your-jwt-token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2025-08-19T07:00:00.000Z"
}
```

---

## 🛍️ Product Management API

#### ✨ Create Product
```http
POST /api/products
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Laptop Gaming ASUS ROG",
  "description": "High performance gaming laptop with RTX 4060",
  "price": 15000000,
  "sku": "LP-ASUS-ROG-001",
  "category": "Electronics",
  "stock": 10,
  "weight": 2.5,
  "dimensions": {
    "length": 35.5,
    "width": 25.0,
    "height": 2.5
  },
  "tags": ["gaming", "laptop", "asus", "high-performance"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Laptop Gaming ASUS ROG",
    "description": "High performance gaming laptop with RTX 4060",
    "price": 15000000,
    "sku": "LP-ASUS-ROG-001",
    "category": "Electronics",
    "stock": 10,
    "isActive": true,
    "weight": 2.5,
    "dimensions": {
      "length": 35.5,
      "width": 25.0,
      "height": 2.5
    },
    "tags": ["gaming", "laptop", "asus", "high-performance"],
    "createdBy": 1,
    "updatedBy": null,
    "createdAt": "2025-08-19T07:00:00.000Z",
    "updatedAt": "2025-08-19T07:00:00.000Z",
    "creator": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

#### 📋 Get All Products (with Advanced Filtering)
```http
GET /api/products?page=1&limit=10&search=laptop&category=electronics&minPrice=1000000&maxPrice=20000000&sortBy=price&sortOrder=ASC
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name, description, or SKU
- `category`: Filter by category
- `isActive`: Filter by status (true/false)
- `minPrice` & `maxPrice`: Price range filter
- `sortBy`: Sort field (name, price, stock, createdAt, etc.)
- `sortOrder`: ASC or DESC

**Response (200):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Laptop Gaming ASUS ROG",
        "price": 15000000,
        "sku": "LP-ASUS-ROG-001",
        "category": "Electronics",
        "stock": 10,
        "isActive": true,
        "createdAt": "2025-08-19T07:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 🔍 Get Product by ID
```http
GET /api/products/1
```

#### 🔍 Get Product by SKU
```http
GET /api/products/sku/LP-ASUS-ROG-001
```

#### ✏️ Update Product
```http
PUT /api/products/1
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Laptop Gaming ASUS ROG (Updated)",
  "price": 14500000,
  "stock": 15
}
```

#### 📦 Update Product Stock
```http
PATCH /api/products/1/stock
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "stock": 25
}
```

#### 🗂️ Get Products by Category
```http
GET /api/products/category/Electronics
```

#### ⚠️ Get Low Stock Products
```http
GET /api/products/reports/low-stock?threshold=10
```

#### 💤 Soft Delete (Deactivate Product)
```http
PATCH /api/products/1/deactivate
Authorization: Bearer <your-jwt-token>
```

#### 🗑️ Hard Delete Product
```http
DELETE /api/products/1
Authorization: Bearer <your-jwt-token>
```
}
```

### Error Responses

**Validation Error (400):**
```json
{
  "error": {
    "message": "Username must be at least 3 characters long",
    "code": "VALIDATION_ERROR",
    "timestamp": "2025-08-19T07:00:00.000Z"
  }
}
```

**Authentication Error (401):**
```json
{
  "error": {
    "message": "Token expired",
    "code": "TOKEN_EXPIRED",
    "timestamp": "2025-08-19T07:00:00.000Z"
  }
}
```

## 🧪 Testing Strategy

### Test Coverage Requirements

- **Minimum Coverage**: 90%
- **Current Coverage**: 95%+
- **Test Types**: Unit, Integration, API

### Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage
```

### Test Structure

```bash
tests/
├── user.test.js           # Integration tests for user endpoints
├── userUsecase.test.js    # Unit tests for business logic
├── repository.test.js     # Unit tests for data layer
├── controller.test.js     # Unit tests for controllers
└── middleware.test.js     # Unit tests for middleware
```

### Writing Tests

```javascript
// Example test structure
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  test('should do something specific', async () => {
    // Arrange
    const input = { /* test data */ };
    
    // Act
    const result = await someFunction(input);
    
    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

## 🚦 Quality Gates & CI/CD

### GitHub Actions Pipeline

The CI/CD pipeline runs on every push and pull request:

1. **Code Linting** (ESLint strict mode)
2. **Security Audit** (npm audit)
3. **Tests & Coverage** (minimum 90%)
4. **Docker Build Test**
5. **Integration Tests**
6. **Quality Gate Summary**

### Branch Protection Rules

**Main branch is protected with these requirements:**

✅ **Required Status Checks:**
- Code Linting
- Security Audit
- Tests & Coverage (90%+ Required) - Node 18.x
- Tests & Coverage (90%+ Required) - Node 20.x
- Docker Build Test
- Quality Gate Summary

✅ **Additional Protections:**
- Require branches to be up to date before merging
- Require pull request reviews before merging (minimum 1)
- Dismiss stale PR approvals when new commits are pushed
- Include administrators (even admins must follow rules)

### Pre-push Hooks

Before each push, the system automatically checks:

1. **Linting**: No ESLint errors/warnings
2. **Tests**: All tests must pass
3. **Coverage**: Minimum 90% coverage
4. **Docker Build**: Must build successfully

### CodeRabbit Integration

AI-powered code reviews with strict rules:

- **Security**: Block hardcoded secrets, missing error handling
- **Quality**: Enforce best practices, code complexity
- **Testing**: Require tests for new code
- **Documentation**: Require documentation for new functions

## 🐳 Docker & Production

### Development with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Build

```bash
# Build production image
docker build -t advanced-backend-api:prod .

# Run production container
docker run -d \
  --name backend-api \
  -p 3000:3000 \
  -e DB_HOST=your-db-host \
  -e DB_NAME=your-db-name \
  -e DB_USER=your-db-user \
  -e DB_PASS=your-db-pass \
  -e JWT_SECRET=your-jwt-secret \
  advanced-backend-api:prod
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Monitoring setup (health checks)
- [ ] Logging configuration
- [ ] Security headers enabled
- [ ] Rate limiting configured

## 📊 Monitoring & Observability

### Health Checks

```bash
# Application health
curl http://localhost:3000/health

# Database health (via Adminer)
open http://localhost:8080
```

### Metrics & Logging

- **Access Logs**: Express request logging
- **Error Logs**: Structured error reporting
- **Performance**: Response time monitoring
- **Database**: Query performance tracking

## 🔒 Security Best Practices

### Implementation

1. **Password Security**: bcrypt with salt rounds 12
2. **JWT Security**: Short-lived tokens (1h), proper claims
3. **Input Validation**: Joi schema validation on all inputs
4. **SQL Injection**: Parameterized queries via Sequelize
5. **Rate Limiting**: Configurable request limits
6. **CORS**: Proper cross-origin configuration

### Security Headers

```javascript
// Implemented in production
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

## 🤝 Contributing Guidelines

### Code Standards

1. **Follow ESLint**: Airbnb style guide (strict mode)
2. **Test Coverage**: Maintain 90%+ coverage
3. **Documentation**: Update README for new features
4. **Commit Messages**: Use conventional commits

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with tests
3. Ensure all quality gates pass
4. Request review from team
5. Address feedback
6. Merge after approval

### Code Review Checklist

- [ ] Code follows style guide
- [ ] Tests cover new functionality
- [ ] Documentation updated
- [ ] Security implications considered
- [ ] Performance impact assessed
- [ ] Error handling implemented

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Check if database is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres
```

**Linting Errors:**
```bash
# Auto-fix common issues
npm run lint:fix

# Check remaining issues
npm run lint
```

**Test Failures:**
```bash
# Run specific test file
npm test -- tests/user.test.js

# Run tests in verbose mode
npm test -- --verbose
```

**Docker Build Issues:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t advanced-backend-api .
```

### Performance Optimization

1. **Database**: Use indexes, optimize queries
2. **Caching**: Implement Redis for sessions
3. **Compression**: Enable gzip compression
4. **CDN**: Use CDN for static assets

## 📞 Support & Contact

- **Documentation**: This README
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Security**: security@your-domain.com

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🎯 Quick Start Commands

```bash
# Full setup (first time)
git clone https://github.com/putraxdev/test-19-08-2024.git
cd test-19-08-2024
cp .env.example .env
docker-compose up -d
npm install
npm test
npm run dev

# Daily development
docker-compose up -d    # Start services
npm run dev            # Start development server
npm test              # Run tests
npm run lint          # Check code quality

# Before pushing
npm test              # Ensure tests pass
npm run lint          # Check linting
git add .
git commit -m "feat: your feature"
git push origin your-branch
```

**🎉 You're ready to build amazing APIs!**