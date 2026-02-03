# Quick Start Guide

Get the Charity Platform running in 5 minutes!

## Prerequisites

- Node.js installed (v14+)
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
cd charity-donation-app

# Install dependencies
npm install
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env.example .env
```

**Edit `.env` file** with your settings. For local development, use:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/charity-donation
JWT_SECRET=my-super-secret-key-change-in-production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key-here
EMAIL_FROM=noreply@charityapp.com
FRONTEND_URL=http://localhost:5000
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- See `DEPLOYMENT.md` for setup instructions
- Update `MONGODB_URI` in `.env` with your Atlas connection string

### 4. Run the Application

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

### 5. Access the App

Open your browser and go to: **http://localhost:5000**

## First Time Setup

### Create Your First User

1. Go to `http://localhost:5000/register.html`
2. Register with:
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `admin123`

### Make User an Admin

**Option 1: Using MongoDB Compass**
1. Connect to `mongodb://localhost:27017`
2. Open database `charity-donation`
3. Go to `users` collection
4. Find your user and edit
5. Change `role` from `"user"` to `"admin"`

**Option 2: Using Mongo Shell**
```bash
mongosh
use charity-donation
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Create Test Campaigns

1. Login as admin at `http://localhost:5000/login.html`
2. Go to Admin Panel: `http://localhost:5000/admin.html`
3. Click "Create New Campaign"
4. Fill in the form:
   - Title: "Build School in Rural Area"
   - Description: "Help us build a school for 500 children"
   - Goal Amount: 50000
   - Category: Education
   - End Date: [Select future date]
   - Image URL: https://via.placeholder.com/400x300?text=School
5. Click "Save Campaign"

## Testing the Application

### Test Flow

1. **Browse Campaigns**
   - Visit `http://localhost:5000`
   - See your created campaigns
   - Test filters (category, status)

2. **Register New User**
   - Go to `/register.html`
   - Create account: `user@example.com`
   - Check for welcome email

3. **Make Donation**
   - Login as regular user
   - Click on a campaign
   - Make a donation
   - Check for thank you email

4. **View Dashboard**
   - Go to `/dashboard.html`
   - See donation history
   - Update profile

5. **Admin Functions**
   - Login as admin
   - Go to `/admin.html`
   - Create, edit, delete campaigns

## Common Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Stop the server
Ctrl + C

# View logs
# They appear in your terminal
```

## Project Structure Quick Reference

```
├── src/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, validation, errors
│   └── config/         # Database & email config
├── frontend/
│   ├── *.html          # Web pages
│   ├── css/            # Styles
│   └── js/             # Frontend logic
├── server.js           # Entry point
└── .env               # Configuration
```

## API Testing with Postman/cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Campaigns (No Auth Required)
```bash
curl http://localhost:5000/api/campaigns
```

### Create Campaign (Auth Required)
```bash
curl -X POST http://localhost:5000/api/campaigns \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Campaign",
    "description": "This is a test campaign",
    "goalAmount": 10000,
    "category": "Education",
    "endDate": "2024-12-31"
  }'
```

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /F /PID <PID>  # Windows

# Or change PORT in .env
PORT=3000
```

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: verify IP whitelist

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Email Not Sending
- Verify SendGrid API key in `.env`
- Check EMAIL_FROM is verified in SendGrid
- Review SendGrid dashboard for errors
- For testing, comment out email code temporarily

## Default Test Data

After first setup, create test campaigns:

1. **Education Campaign**
   - Title: Build School in Rural Area
   - Goal: $50,000
   - Category: Education

2. **Healthcare Campaign**
   - Title: Medical Equipment for Clinic
   - Goal: $25,000
   - Category: Healthcare

3. **Environment Campaign**
   - Title: Plant 10,000 Trees
   - Goal: $15,000
   - Category: Environment

## Development Tips

1. **Auto-reload**: Use `npm run dev` for automatic server restart
2. **MongoDB GUI**: Install MongoDB Compass for easier database management
3. **API Testing**: Use Postman or Thunder Client VSCode extension
4. **Debugging**: Add `console.log()` statements in controllers
5. **Email Testing**: Use Mailtrap.io for testing emails without sending real ones

## Team Collaboration

1. **Git Workflow**
```bash
git pull origin main  # Get latest changes
git checkout -b feature/your-feature  # Create branch
# Make changes
git add .
git commit -m "Add feature"
git push origin feature/your-feature
# Create Pull Request on GitHub
```

2. **Code Standards**
   - Use async/await for asynchronous code
   - Add error handling to all controllers
   - Validate all inputs
   - Comment complex logic
   - Follow existing naming conventions

3. **Testing Checklist**
   - [ ] All API endpoints working
   - [ ] Authentication/Authorization working
   - [ ] Email notifications sending
   - [ ] Frontend displays correctly
   - [ ] Validation errors show properly
   - [ ] Role-based access working

## Next Steps

1. ✅ Get local development running
2. ✅ Create test data
3. ✅ Test all features
4. 📝 Add screenshots to `screenshots/` directory
5. 🚀 Deploy to production (see `DEPLOYMENT.md`)
6. 📊 Prepare for project defense

## Resources

- **API Documentation**: See `README.md` for complete API reference
- **Deployment Guide**: See `DEPLOYMENT.md` for hosting instructions
- **MongoDB Docs**: https://docs.mongodb.com
- **Express Docs**: https://expressjs.com
- **SendGrid Docs**: https://docs.sendgrid.com

## Support

If you encounter issues:
1. Check this guide first
2. Review error messages in terminal
3. Check MongoDB logs
4. Verify environment variables
5. Ask team members
6. Check Stack Overflow

---

**Happy Coding! 🚀**
