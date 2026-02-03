# Charity/Donation Platform

A full-stack web application for managing charity campaigns and donations, built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Advanced Features](#advanced-features)
- [Deployment](#deployment)

## ✨ Features

### For All Users
- Browse active charity campaigns
- Filter campaigns by category and status
- View campaign details and donation history
- User registration and authentication with JWT
- Secure password hashing with bcrypt

### For Authenticated Users
- Make donations to campaigns
- View personal donation history
- Update profile information
- Anonymous donation option

### For Admins/Moderators
- Create new charity campaigns
- Edit existing campaigns
- Delete campaigns (Admin only)
- Manage campaign status
- Role-based access control (RBAC)

### Additional Features
- Email notifications using Nodemailer with SendGrid/Mailgun
- Input validation with Joi
- Comprehensive error handling
- Real-time campaign progress tracking

## 🛠 Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for email service
- Joi for validation

**Frontend:**
- HTML5
- CSS3 (Custom styling)
- Vanilla JavaScript
- Fetch API for AJAX requests

## 📁 Project Structure

```
charity-donation-app/
│
├── src/                          # Backend
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── userController.js     # User management
│   │   ├── campaignController.js # Campaign CRUD operations
│   │   └── donationController.js # Donation handling
│   │
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Campaign.js           # Campaign schema
│   │   └── Donation.js           # Donation schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── campaignRoutes.js     # Campaign endpoints
│   │   └── donationRoutes.js     # Donation endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── roleMiddleware.js     # RBAC
│   │   ├── errorMiddleware.js    # Global error handler
│   │   └── validate.js           # Joi validation schemas
│   │
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── mail.js               # Email configuration
│   │
│   └── app.js                    # Express app setup
│
├── frontend/                     # Frontend
│   ├── index.html                # Campaign listing page
│   ├── login.html                # Login page
│   ├── register.html             # Registration page
│   ├── dashboard.html            # User dashboard
│   ├── admin.html                # Admin panel
│   │
│   ├── css/
│   │   └── style.css             # Main stylesheet
│   │
│   └── js/
│       ├── api.js                # API communication
│       ├── auth.js               # Authentication logic
│       ├── campaigns.js          # Campaign display logic
│       ├── donations.js          # Donation handling
│       └── guard.js              # Route protection
│
├── server.js                     # Server entry point
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
├── .gitignore
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- SendGrid/Mailgun account (for email functionality)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd charity-donation-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/charity-donation
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
EMAIL_SERVICE=SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@charityapp.com
FRONTEND_URL=http://localhost:5000
```

4. **Start MongoDB** (if running locally)
```bash
mongod
```

5. **Run the application**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

6. **Access the application**
Open your browser and navigate to: `http://localhost:5000`

### Creating Admin User

To create an admin user, you can either:

**Option 1: Via MongoDB directly**
```javascript
// Connect to MongoDB and update a user
use charity-donation
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**Option 2: Register normally then update in database**
1. Register a new account via `/register.html`
2. Update the user's role in MongoDB to "admin" or "moderator"

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/charity-donation` |
| `JWT_SECRET` | Secret key for JWT | `your-secret-key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `EMAIL_SERVICE` | Email service provider | `SendGrid` |
| `EMAIL_HOST` | SMTP host | `smtp.sendgrid.net` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | SMTP username | `apikey` |
| `EMAIL_PASSWORD` | SMTP password/API key | `your-api-key` |
| `EMAIL_FROM` | Sender email address | `noreply@charityapp.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5000` |

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints (Public)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### User Endpoints (Private)

**All user endpoints require JWT token in Authorization header:**
```
Authorization: Bearer <token>
```

#### Get User Profile
```http
GET /api/users/profile
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/profile
Content-Type: application/json

{
  "username": "johnsmith",
  "email": "johnsmith@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "username": "johnsmith",
    "email": "johnsmith@example.com",
    "role": "user"
  }
}
```

### Campaign Endpoints

#### Get All Campaigns (Public)
```http
GET /api/campaigns?status=active&category=Education
```

**Query Parameters:**
- `status` (optional): Filter by status (active, completed, closed)
- `category` (optional): Filter by category

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "campaigns": [
    {
      "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
      "title": "Build School in Rural Area",
      "description": "Help us build a school...",
      "goalAmount": 50000,
      "currentAmount": 15000,
      "category": "Education",
      "status": "active",
      "createdBy": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "username": "admin"
      },
      "endDate": "2024-12-31T23:59:59.000Z",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "percentageCompleted": 30
    }
  ]
}
```

#### Get Single Campaign (Public)
```http
GET /api/campaigns/:id
```

#### Create Campaign (Private - Admin/Moderator)
```http
POST /api/campaigns
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Clean Water Project",
  "description": "Provide clean water to 1000 families...",
  "goalAmount": 25000,
  "category": "Healthcare",
  "endDate": "2024-12-31",
  "imageUrl": "https://example.com/water.jpg"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Campaign created successfully",
  "campaign": {
    "_id": "64c3d4e5f6g7h8i9j0k1l2m3",
    "title": "Clean Water Project",
    "description": "Provide clean water to 1000 families...",
    "goalAmount": 25000,
    "currentAmount": 0,
    "category": "Healthcare",
    "status": "active",
    "createdBy": "64a1b2c3d4e5f6g7h8i9j0k1",
    "endDate": "2024-12-31T00:00:00.000Z",
    "imageUrl": "https://example.com/water.jpg",
    "createdAt": "2024-01-20T14:30:00.000Z"
  }
}
```

#### Update Campaign (Private - Admin/Moderator)
```http
PUT /api/campaigns/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "description": "Updated description..."
}
```

#### Delete Campaign (Private - Admin Only)
```http
DELETE /api/campaigns/:id
Authorization: Bearer <token>
```

### Donation Endpoints

#### Get User Donations (Private)
```http
GET /api/donations
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 3,
  "donations": [
    {
      "_id": "64d4e5f6g7h8i9j0k1l2m3n4",
      "amount": 100,
      "campaign": {
        "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
        "title": "Build School in Rural Area",
        "category": "Education",
        "goalAmount": 50000
      },
      "message": "Great cause!",
      "isAnonymous": false,
      "status": "completed",
      "createdAt": "2024-01-22T09:15:00.000Z"
    }
  ]
}
```

#### Get Campaign Donations (Public)
```http
GET /api/donations/campaign/:campaignId
```

#### Create Donation (Private)
```http
POST /api/donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100,
  "campaign": "64b2c3d4e5f6g7h8i9j0k1l2",
  "message": "Keep up the good work!",
  "isAnonymous": false
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "donation": {
    "_id": "64e5f6g7h8i9j0k1l2m3n4o5",
    "amount": 100,
    "campaign": {
      "_id": "64b2c3d4e5f6g7h8i9j0k1l2",
      "title": "Build School in Rural Area"
    },
    "donor": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "message": "Keep up the good work!",
    "isAnonymous": false,
    "status": "completed",
    "createdAt": "2024-01-23T11:20:00.000Z"
  }
}
```

#### Get Single Donation (Private)
```http
GET /api/donations/:id
Authorization: Bearer <token>
```

#### Delete Donation (Private - Admin Only)
```http
DELETE /api/donations/:id
Authorization: Bearer <token>
```

### Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## 📸 Screenshots

### 1. Home Page - Campaign Listing
![Campaign Listing](screenshots/campaigns.png)
**Description:** Browse all active charity campaigns with filtering options by category and status. Each card shows campaign progress, goal amount, and days remaining.

### 2. Login Page
![Login Page](screenshots/login.png)
**Description:** Secure login page with email and password authentication. JWT tokens are used for session management.

### 3. Registration Page
![Registration Page](screenshots/register.png)
**Description:** New user registration with validation for username, email, and password. Passwords are hashed using bcrypt before storage.

### 4. User Dashboard
![User Dashboard](screenshots/dashboard.png)
**Description:** Personal dashboard showing user profile, donation statistics, and complete donation history with details.

### 5. Admin Panel
![Admin Panel](screenshots/admin.png)
**Description:** Admin interface for managing campaigns. Admins and moderators can create, edit, and delete campaigns. Role-based access control ensures only authorized users can access this panel.

### 6. Campaign Creation Modal
![Create Campaign](screenshots/create-campaign.png)
**Description:** Modal form for creating new campaigns with validation for all required fields including title, description, goal amount, category, and end date.

## 🎯 Advanced Features

### 1. Role-Based Access Control (RBAC)

The application implements three user roles with different permission levels:

- **User** (default): Can browse campaigns, make donations, and manage their profile
- **Moderator**: All user permissions + create and edit campaigns
- **Admin**: All moderator permissions + delete campaigns and donations

**Implementation:**
```javascript
// Middleware in roleMiddleware.js
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized`
      });
    }
    next();
  };
};

// Usage in routes
router.post('/', protect, authorize('admin', 'moderator'), createCampaign);
router.delete('/:id', protect, authorize('admin'), deleteCampaign);
```

### 2. SMTP Email Service Integration

Email notifications are sent using Nodemailer with SendGrid/Mailgun:

**Features:**
- Welcome email on user registration
- Thank you email after donation
- Environment-based configuration
- Error handling for failed emails

**Configuration (config/mail.js):**
```javascript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**Email Types:**
- **Welcome Email**: Sent when users register
- **Donation Confirmation**: Sent after successful donation

## 🚀 Deployment

### Deploying to Render

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add environment variables in Render dashboard:**
   - All variables from `.env.example`
   - Set `NODE_ENV=production`
   - Use MongoDB Atlas connection string for `MONGODB_URI`

5. **Deploy**

### Deploying to Railway

1. **Install Railway CLI** or use the dashboard
2. **Initialize project:**
```bash
railway init
```

3. **Add environment variables:**
```bash
railway variables set MONGODB_URI=<your-atlas-uri>
railway variables set JWT_SECRET=<your-secret>
# ... add all other variables
```

4. **Deploy:**
```bash
railway up
```

### MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist all IP addresses (0.0.0.0/0) for production
4. Get connection string and add to environment variables

### SendGrid Setup

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify a sender email address
4. Add API key to `EMAIL_PASSWORD` environment variable
5. Set `EMAIL_FROM` to your verified email

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Protected routes with middleware
- Input validation with Joi
- CORS configuration
- Environment variables for sensitive data
- SQL injection prevention (MongoDB/Mongoose)
- XSS protection through data validation

## 🧪 Testing

To test the application:

1. **Register a new user** at `/register.html`
2. **Login** with credentials at `/login.html`
3. **Browse campaigns** on the home page
4. **Make a donation** (requires login)
5. **View your dashboard** to see donation history
6. **Create admin user** in MongoDB and access admin panel

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributors

Your Team Members:
- Team Member 1 - [Role/Contribution]
- Team Member 2 - [Role/Contribution]
- Team Member 3 - [Role/Contribution]

## 🙏 Acknowledgments

- Node.js and Express.js communities
- MongoDB documentation
- MDN Web Docs
- Stack Overflow community

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: your-email@example.com

---

**Last Updated:** February 2024
