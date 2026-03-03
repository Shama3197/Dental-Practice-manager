# Vercel Deployment Fix Guide

## The Problem

Your current Vercel deployment isn't showing things correctly because:
1. The `vercel.json` only handles backend routes
2. Frontend needs to be deployed separately or configured properly
3. Environment variables may not be set correctly

## Solution: Deploy as Separate Projects (Recommended)

### Step 1: Deploy Backend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Project Name**: `dental-practice-manager-backend`
   - **Root Directory**: `tracker-backend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`
5. Add Environment Variables:
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   FRONTEND_URL=https://your-frontend-url.vercel.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=https://your-backend-url.vercel.app/api/calendar/oauth2callback
   ```
6. Click **"Deploy"**
7. **Copy the deployment URL** (e.g., `https://dental-practice-manager-backend.vercel.app`)

### Step 2: Deploy Frontend

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import the **same** GitHub repository
4. Configure:
   - **Project Name**: `dental-practice-manager-frontend`
   - **Root Directory**: `tracker-frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install`
5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   Replace `your-backend-url` with the actual backend URL from Step 1
6. Click **"Deploy"**

### Step 3: Update Backend CORS

After frontend is deployed:
1. Go to backend project settings
2. Update `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy backend

## Alternative: Single Project Setup

If you want to use a single Vercel project, you need to:

1. **Set Root Directory** in Vercel Dashboard to `tracker-frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Add API route** as a serverless function

But **separate projects is strongly recommended** for better scalability and independent deployments.

## Environment Variables Checklist

### Backend Project:
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (MongoDB Atlas connection string)
- [ ] `FRONTEND_URL` (your frontend Vercel URL)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `GOOGLE_REDIRECT_URI` (backend URL + `/api/calendar/oauth2callback`)
- [ ] `JWT_SECRET` (if using authentication)
- [ ] `CLOUDINARY_*` (if using file uploads)

### Frontend Project:
- [ ] `VITE_API_URL` (your backend Vercel URL + `/api`)

## Testing After Deployment

1. **Frontend**: Visit your frontend URL - should show the app
2. **Backend Health**: Visit `https://your-backend-url.vercel.app/api/health`
3. **API Test**: Visit `https://your-backend-url.vercel.app/api/patients`

## Common Issues

### Issue: Frontend shows blank page
**Fix**: Check browser console for errors. Likely `VITE_API_URL` is not set correctly.

### Issue: API calls fail with CORS error
**Fix**: Update `FRONTEND_URL` in backend environment variables and redeploy.

### Issue: Images not loading
**Fix**: Ensure images are in `tracker-frontend/public/images/` and paths start with `/images/`

### Issue: Build fails
**Fix**: Check build logs. Common causes:
- Missing dependencies
- TypeScript errors
- Linting errors
- Node version mismatch

## Quick Fix Commands

If you need to check what's wrong:

```bash
# Test backend locally
cd tracker-backend
npm install
npm start

# Test frontend build locally
cd tracker-frontend
npm install
npm run build
npm run preview
```
