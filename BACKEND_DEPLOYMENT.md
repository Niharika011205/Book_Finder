# Backend Deployment Guide - Step by Step

## 🚀 Deploy Backend to Render (FREE)

### Step 1: Push Your Code to GitHub
```bash
git add .
git commit -m "Update API URLs for deployment"
git push origin main
```

### Step 2: Deploy on Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Click "New +"** → Select **"Web Service"**
4. **Connect your repository**: `Niharika011205/Book_Finder`
5. **Configure the service**:
   - **Name**: `book-finder-backend` (or any name you like)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `.`)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. **Click "Create Web Service"**

7. **Wait 2-3 minutes** for deployment to complete

8. **Copy your backend URL** (e.g., `https://book-finder-backend.onrender.com`)

### Step 3: Update Frontend Environment Variable

1. **Go to Vercel**: https://vercel.com
2. **Open your project** → **Settings** → **Environment Variables**
3. **Add new variable**:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render URL (e.g., `https://book-finder-backend.onrender.com`)
   - **Environment**: Production, Preview, Development (select all)
4. **Click "Save"**
5. **Go to Deployments** → Click **"..."** on latest deployment → **"Redeploy"**

### Step 4: Test Your App

1. Visit your Vercel URL
2. Try to sign up/login
3. Search for books
4. Everything should work now!

## ⚠️ Important Notes

- **First request may be slow**: Render free tier sleeps after 15 minutes of inactivity
- **Data persistence**: On free tier, data may reset periodically
- **For production**: Consider upgrading to paid tier or using a real database

## 🐛 Troubleshooting

**Problem**: "Something went wrong" error
- **Solution**: Check if backend URL is correct in Vercel environment variables

**Problem**: CORS errors
- **Solution**: Backend already has CORS enabled in server.js

**Problem**: Backend is slow
- **Solution**: First request wakes up the server (takes 30-60 seconds on free tier)

## 📝 Alternative: Deploy to Railway

If Render doesn't work, try Railway:

1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway auto-detects and deploys
6. Copy the generated URL
7. Update VITE_API_URL in Vercel

## ✅ Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] VITE_API_URL updated in Vercel
- [ ] Frontend redeployed
- [ ] App tested and working
