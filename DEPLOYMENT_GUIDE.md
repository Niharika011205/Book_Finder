# Deployment Guide for Book Finder

## 🚀 Deploying to Vercel

### Step 1: Deploy Backend (JSON Server)

Since JSON Server doesn't work well on Vercel, deploy it to **Render** or **Railway**:

#### Option A: Deploy to Render (Recommended)
1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `.` (leave empty)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Click "Create Web Service"
6. Copy your backend URL (e.g., `https://your-app.onrender.com`)

#### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. It will auto-detect and deploy
4. Copy your backend URL

### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 1 (e.g., `https://your-app.onrender.com`)

5. Click "Deploy"

### Step 3: Update Backend URL

After deployment, if you need to change the backend URL:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` with your backend URL
3. Redeploy

## 🔧 Local Development

1. Start backend:
   ```bash
   npm start
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## ⚠️ Important Notes

- The backend URL must be accessible from the internet
- JSON Server is for development only - consider using a real database for production
- Make sure CORS is enabled on your backend
- The `.env` file is not committed to Git (it's in .gitignore)

## 🐛 Troubleshooting

**Issue**: Login works but nothing shows after
- **Solution**: Check if backend URL is correct in environment variables

**Issue**: CORS errors
- **Solution**: Backend needs to allow requests from your frontend domain

**Issue**: Data not persisting
- **Solution**: JSON Server on free hosting may reset data. Use a real database for production.
