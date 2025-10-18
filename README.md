# Japan Travel Planner

Collaborative travel planning app for Japan trip.

## Features
- Favorites/voting system
- Comments & notes
- Day-by-day itinerary builder
- Budget tracker
- Photo uploads
- Interactive maps

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: GitHub (data storage via API)
- Hosting: Vercel
- Auth: GitHub OAuth

## Setup for Development

1. Clone the repository
2. Open `index.html` in a browser to test locally
3. Push changes to GitHub to deploy via Vercel

## Setup for Your Friend

1. Create a GitHub account (free)
2. Visit the deployed URL
3. Click "Login with GitHub"
4. Start planning!

## Live URL
https://japan-travel.vercel.app (update after deployment)

## Deployment Steps

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `japan-travel-planner`
3. Make it Public or Private (your choice)
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 2. Push Local Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/japan-travel-planner.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Framework Preset: Other
5. Root Directory: ./
6. Click "Deploy"
7. Copy your deployment URL

### 4. Update config.js
Update the Vercel URL in `config.js` with your actual deployment URL

### 5. Create Personal Access Token
You and your friend both need to:
1. Go to https://github.com/settings/tokens/new
2. Note: "Japan Travel App"
3. Expiration: 90 days (or custom)
4. Select scope: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again)
7. Use this token when logging into the app

### 6. Add Friend as Collaborator
1. Go to your repository settings
2. Collaborators → Add people
3. Enter friend's GitHub username
4. They accept the invitation
5. They can now use the app!
