# Deployment Guide

This guide provides step-by-step instructions for deploying the Charity Platform to various hosting services.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Render Deployment](#render-deployment)
3. [Railway Deployment](#railway-deployment)
4. [Replit Deployment](#replit-deployment)
5. [MongoDB Atlas Setup](#mongodb-atlas-setup)
6. [SendGrid Email Setup](#sendgrid-email-setup)

## Prerequisites

Before deploying, ensure you have:
- GitHub account with your project repository
- MongoDB Atlas account (free tier available)
- SendGrid account for email functionality (free tier available)
- All code committed to GitHub

## Render Deployment

### Step 1: Create MongoDB Atlas Database
See [MongoDB Atlas Setup](#mongodb-atlas-setup) section below.

### Step 2: Deploy to Render

1. **Sign up/Login** to [Render](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your charity-donation-app repository

3. **Configure Service**
   - Name: `charity-donation-app`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: `Free`

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRE=7d
   EMAIL_SERVICE=SendGrid
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-sendgrid-api-key>
   EMAIL_FROM=noreply@yourapp.com
   FRONTEND_URL=https://charity-donation-app.onrender.com
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Wait for deployment (first deploy may take 5-10 minutes)

6. **Access Your App**
   - Your app will be available at: `https://charity-donation-app.onrender.com`

### Important Notes for Render:
- Free tier apps spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Free tier includes 750 hours/month
- Render assigns port 10000 automatically

## Railway Deployment

### Step 1: Install Railway CLI (Optional)

```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy via Dashboard

1. **Sign up/Login** to [Railway](https://railway.app)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MongoDB**
   - Click "Add Plugin" → "MongoDB"
   - Railway will automatically create a MongoDB instance
   - Connection string will be available as `MONGO_URL`

4. **Configure Environment Variables**
   Click on your service → "Variables" tab:
   ```
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=${{MONGO_URL}}/charity-donation
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRE=7d
   EMAIL_SERVICE=SendGrid
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-sendgrid-api-key>
   EMAIL_FROM=noreply@yourapp.com
   FRONTEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}
   ```

5. **Deploy**
   - Railway automatically deploys on git push
   - Click "Deploy" if manual deployment needed

6. **Generate Domain**
   - Go to Settings → "Generate Domain"
   - Your app will be available at generated URL

### Important Notes for Railway:
- $5 free credit/month
- Automatic HTTPS
- Easy MongoDB integration
- Custom domains supported

## Replit Deployment

### Step 1: Import from GitHub

1. **Sign up/Login** to [Replit](https://replit.com)

2. **Import Repository**
   - Click "Create Repl"
   - Select "Import from GitHub"
   - Paste your repository URL

3. **Configure Repl**
   - Language: Node.js
   - Click "Import from GitHub"

### Step 2: Setup Environment Variables

1. **Open Secrets (Environment Variables)**
   - Click the lock icon in the left sidebar
   - Add each variable:
   ```
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-random-string>
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASSWORD=<your-sendgrid-api-key>
   EMAIL_FROM=noreply@yourapp.com
   NODE_ENV=production
   ```

### Step 3: Configure .replit File

Create `.replit` file in root:
```toml
run = "npm start"
entrypoint = "server.js"

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "npm start"]
```

### Step 4: Deploy

1. Click "Run" button
2. Replit will automatically:
   - Install dependencies
   - Start the server
   - Provide a URL

### Important Notes for Replit:
- Always-on requires Replit Hacker plan
- Free tier sleeps after inactivity
- Built-in code editor
- Good for development/testing

## MongoDB Atlas Setup

### Step 1: Create Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free"
3. Complete registration

### Step 2: Create Cluster

1. **Choose Plan**
   - Select "FREE" tier (M0)
   - Cloud Provider: AWS, Google Cloud, or Azure
   - Region: Choose closest to your users

2. **Create Cluster**
   - Click "Create Cluster"
   - Wait 3-5 minutes for provisioning

### Step 3: Configure Security

1. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Authentication: Password
   - Username: `admin`
   - Password: Generate secure password
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

2. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 4.1 or later
5. Copy connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your database user password
7. Add database name: `charity-donation`
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/charity-donation?retryWrites=true&w=majority
   ```

## SendGrid Email Setup

### Step 1: Create Account

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account (100 emails/day free)

### Step 2: Verify Sender Identity

1. **Single Sender Verification** (easiest for development)
   - Go to "Settings" → "Sender Authentication"
   - Click "Verify a Single Sender"
   - Fill in your details
   - Verify email sent to your address
   - This email will be your `EMAIL_FROM`

### Step 3: Create API Key

1. Go to "Settings" → "API Keys"
2. Click "Create API Key"
3. Name: `charity-app-production`
4. Permissions: "Full Access" (or "Mail Send" only)
5. Click "Create & View"
6. **IMPORTANT**: Copy the API key (shown only once)
7. Use this as `EMAIL_PASSWORD` in environment variables

### Step 4: Configure Environment Variables

```env
EMAIL_SERVICE=SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=your-verified-email@example.com
```

### Alternative: Mailgun Setup

If using Mailgun instead of SendGrid:

1. Sign up at [mailgun.com](https://www.mailgun.com)
2. Verify domain or use sandbox domain
3. Get SMTP credentials
4. Configure:
   ```env
   EMAIL_HOST=smtp.mailgun.org
   EMAIL_PORT=587
   EMAIL_USER=postmaster@your-domain.mailgun.org
   EMAIL_PASSWORD=your-mailgun-smtp-password
   EMAIL_FROM=noreply@your-domain.com
   ```

## Post-Deployment Steps

### 1. Test the Application

1. **Visit your deployed URL**
2. **Register a new account**
3. **Check email** for welcome message
4. **Login** with new account
5. **Test all features**

### 2. Create Admin User

Using MongoDB Atlas:
1. Go to "Collections"
2. Find your database → users collection
3. Find your user document
4. Edit document
5. Change `role` from `"user"` to `"admin"`
6. Save changes

Or using MongoDB Compass:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 3. Monitor Application

- Check logs in your hosting platform
- Monitor email delivery in SendGrid dashboard
- Watch for errors in MongoDB Atlas

## Troubleshooting

### Common Issues

**Issue: Cannot connect to MongoDB**
- Verify IP whitelist includes 0.0.0.0/0
- Check connection string is correct
- Ensure password doesn't contain special characters (URL encode if needed)

**Issue: Emails not sending**
- Verify SendGrid API key is correct
- Check sender email is verified
- Review SendGrid activity feed for errors
- Ensure EMAIL_USER is set to "apikey"

**Issue: 404 errors for frontend**
- Verify static files are being served
- Check build completed successfully
- Ensure frontend files are in correct location

**Issue: CORS errors**
- Update FRONTEND_URL to match deployed URL
- Check CORS configuration in app.js

## Security Checklist

Before going live:
- [ ] Generate strong JWT_SECRET (minimum 32 characters)
- [ ] Use HTTPS (automatic with Render/Railway)
- [ ] Verify MongoDB network access is restricted
- [ ] Review and limit SendGrid API key permissions
- [ ] Enable MongoDB authentication
- [ ] Set NODE_ENV to production
- [ ] Remove any console.log statements with sensitive data
- [ ] Test all security features (authentication, authorization)

## Costs Summary

**Free Tier Limits:**
- **Render**: 750 hours/month free, apps sleep after inactivity
- **Railway**: $5 credit/month, ~500 hours uptime
- **Replit**: Free with sleep, $7/month for always-on
- **MongoDB Atlas**: 512MB storage free forever
- **SendGrid**: 100 emails/day free forever

**Recommended for Production:**
- Render Starter ($7/month) - Always on, better performance
- Railway Pro ($5/month included credit) - Automatic scaling
- MongoDB Atlas M10+ - Better performance and backups
- SendGrid Essentials ($19.95/month) - 50,000 emails/month

## Support

If you encounter issues:
1. Check hosting platform documentation
2. Review application logs
3. Verify environment variables
4. Test locally with production settings
5. Contact platform support

## Next Steps

After successful deployment:
1. Set up custom domain
2. Configure SSL certificate (usually automatic)
3. Set up monitoring/logging
4. Create backup strategy
5. Plan scaling strategy
6. Implement CI/CD pipeline

---

**Good luck with your deployment!**
