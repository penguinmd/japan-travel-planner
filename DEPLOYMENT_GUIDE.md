# Deployment Guide - Interactive Features with Neon Database

This guide explains how to deploy the interactive recommendation features for the Japan Travel Planner.

## Overview

The app now supports:
- ✅ User identification (name-based, no passwords)
- ✅ Friend recommendations with attribution
- ✅ Cross-device syncing via Neon Postgres
- ✅ Star ratings for recommendations
- ✅ User-specific favorites
- ✅ Data migration from localStorage

---

## 📋 Prerequisites

- Vercel account (connected to your GitHub repo)
- Neon database (Postgres) connected to Vercel project

---

## 🚀 Deployment Steps

### Step 1: Connect Neon Database to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `japan-travel-planner` project
3. Click on the **Storage** tab
4. Click **Create Database** → Select **Postgres (Neon)**
5. Name it: `japan-travel-db`
6. Select region closest to your users
7. Click **Create**

Vercel will automatically add these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### Step 2: Deploy to Vercel

Push your code to GitHub:

```bash
git add .
git commit -m "Add interactive recommendations with Neon database"
git push origin claude/add-recommendation-feature-011CUQk1XqStJjx6L4VbpvDG
```

Vercel will automatically deploy your changes.

### Step 3: Initialize Database Schema

After deployment, visit:

```
https://your-site.vercel.app/api/setup-db
```

You should see:

```json
{
  "success": true,
  "message": "Database tables created successfully",
  "tables": ["users", "recommendations", "favorites"],
  "indexes": ["idx_recommendations_location", "idx_favorites_location", "idx_favorites_user"]
}
```

This creates all necessary database tables and indexes.

### Step 4: Migrate Existing Data (Optional)

If you have existing localStorage data to migrate:

1. Log in to the site with the password
2. Click the **"Migrate to Database"** button
3. Confirm the migration
4. All existing comments/favorites will be tagged as "Brix"

---

## 🎯 How to Use

### For Users

1. **First Visit**: Enter your name when prompted
2. **Add Recommendations**: Click "💬 Add Recommendation" on any location
3. **Favorite Locations**: Click the star (⭐) to favorite
4. **View Recommendations**: See all friend recommendations with names
5. **Delete Your Recommendations**: Click "Delete" on your own recommendations

### User Identification

- Names are stored in localStorage (persists across sessions)
- Click "Change Name" to switch users
- Each device/browser needs separate identification

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Recommendations Table
```sql
CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  location_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  user_name VARCHAR(100) NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  location_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  user_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(location_id, user_id)
);
```

---

## 🔌 API Endpoints

### User Identification
- `POST /api/users/identify` - Get or create user by name

### Recommendations
- `GET /api/recommendations?locationId=xxx` - Get recommendations for location
- `POST /api/recommendations` - Add new recommendation
- `DELETE /api/recommendations/:id` - Delete recommendation

### Favorites
- `GET /api/favorites?userId=xxx` - Get user's favorites
- `POST /api/favorites` - Add favorite
- `DELETE /api/favorites/:id` - Remove favorite

### Migration
- `POST /api/migrate` - Migrate localStorage data to database

### Database Setup
- `GET /api/setup-db` - Initialize database schema (one-time)

---

## 🧪 Testing

### Test Database Connection
```bash
curl https://your-site.vercel.app/api/setup-db
```

### Test User Identification
```bash
curl -X POST https://your-site.vercel.app/api/users/identify \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}'
```

### Test Recommendations
```bash
curl "https://your-site.vercel.app/api/recommendations?locationId=tokyo-shinjuku"
```

---

## 🔧 Troubleshooting

### Database Connection Errors

**Error**: `POSTGRES_URL environment variable is not set`

**Solution**:
1. Check that Neon database is connected in Vercel Storage tab
2. Redeploy the project to pick up environment variables
3. Check environment variables in Vercel Settings → Environment Variables

### Migration Not Working

**Error**: No data to migrate

**Solution**:
1. Make sure you're logged in first
2. Check that localStorage has data (open DevTools → Application → LocalStorage)
3. Look for key `japan_trip_data`

### User Modal Not Appearing

**Solution**:
1. Clear localStorage for the site
2. Refresh the page
3. User identification modal should appear

---

## 📱 Features

### ✅ Implemented

- User identification (name-based)
- Recommendations with user attribution
- Star ratings (1-5)
- Favorites (per user)
- Delete own recommendations
- Cross-device syncing
- Migration from localStorage

### 🔮 Future Enhancements

- Email verification
- Reply threads
- Like/vote on recommendations
- Filter by recommender
- User profiles
- Recommendation types (must-visit, skip, etc.)

---

## 🔒 Security

### Current Approach (Simple)
- No passwords for user identification
- Honor system for deleting recommendations
- Public reading (anyone can view)
- Client-side user validation

### Recommended for Production
- Add email verification
- Add rate limiting on API endpoints
- Add moderation queue
- Add CAPTCHA for user creation

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify database connection in Vercel
3. Check API endpoint responses in Network tab
4. Review deployment logs in Vercel

---

## 🎉 Success Checklist

- [ ] Neon database connected in Vercel
- [ ] Code deployed to Vercel
- [ ] Database schema initialized (`/api/setup-db`)
- [ ] User identification modal appears
- [ ] Can add recommendations
- [ ] Recommendations show user names
- [ ] Favorites work across devices
- [ ] Existing data migrated as "Brix"

---

**Congratulations!** Your Japan Travel Planner now supports collaborative recommendations with friend attribution! 🗺️✨
