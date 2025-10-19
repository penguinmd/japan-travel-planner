# Supabase Setup Instructions

This guide will help you set up Supabase for the Japan Travel Planner application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: japan-travel-planner
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose the region closest to you or your users
   - **Pricing Plan**: Free tier is fine for this project
5. Click "Create new project"
6. Wait for the project to be provisioned (this may take 1-2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, click on the "SQL Editor" icon in the left sidebar
2. Click "New query"
3. Open the file `supabase-schema.sql` in this repository
4. Copy the entire contents of that file
5. Paste it into the SQL Editor
6. Click "Run" or press Cmd/Ctrl + Enter
7. You should see a success message confirming the schema was created

This will create:
- A `trip_data` table to store your travel data
- Row Level Security (RLS) policies for authenticated users
- An initial data row
- Real-time subscriptions for live collaboration

## Step 3: Get Your Project Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon) in the left sidebar
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

**IMPORTANT**: The `anon` key is safe to use in your frontend code. It's public and meant to be exposed.

## Step 4: Update Your Config File

1. Open `config.js` in your project
2. Replace the placeholder values with your actual credentials:

```javascript
supabase: {
  url: 'https://xxxxxxxxxxxxx.supabase.co',  // Your Project URL
  anonKey: 'eyJhbGc...'  // Your anon public key
}
```

3. Save the file

## Step 5: Enable Email Authentication

1. In Supabase dashboard, go to "Authentication" in the left sidebar
2. Click on "Providers"
3. Find "Email" in the list and make sure it's enabled
4. Configure email settings:
   - **Enable Email provider**: ON
   - **Confirm email**: OFF (for easier testing, you can enable this later)
   - **Secure email change**: ON (recommended)

## Step 6: Test Your Setup

1. Start your local development server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open your browser to `http://localhost:8080`

3. You should see the app load without errors in the console

4. The Supabase client should initialize successfully

## Troubleshooting

### "Invalid API key" error
- Double-check that you copied the entire `anon` key from Supabase
- Make sure there are no extra spaces or characters
- Verify the URL is correct and includes `https://`

### "Failed to fetch" or CORS errors
- Check that your Supabase project is fully provisioned (not still setting up)
- Verify you're using the correct Project URL
- Check your internet connection

### SQL schema errors
- Make sure you copied the entire `supabase-schema.sql` file
- Run each section separately if needed
- Check the Supabase logs for specific error messages

## Next Steps

Once Supabase is set up, you can move on to Task 2 in the implementation plan:
- Implement Supabase authentication with magic links
- Migrate the data layer to use Supabase instead of GitHub
- Set up real-time collaboration

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- Check the implementation plan in `docs/plans/2025-10-18-split-screen-map-redesign.md`
