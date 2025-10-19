# Testing Supabase Magic Link Authentication

## Important Note
The authentication flow **cannot be fully tested** until you have configured your Supabase project and added the credentials to `config.js`. Follow Task 1 in the implementation plan to set up Supabase first.

## Once Supabase is Configured

### Prerequisites
1. Complete Task 1: Set up Supabase project
2. Update `config.js` with your actual Supabase URL and anon key
3. Run the database schema SQL in your Supabase project
4. Configure email settings in Supabase (Settings > Auth > Email Templates)

### Test Plan

#### Test 1: Magic Link Login Flow
1. Start local server: `python3 -m http.server 8080`
2. Open http://localhost:8080 in your browser
3. You should see the auth container with:
   - Dark theme styling (dark background, cyan/pink accents)
   - Email input field
   - "Send Magic Link" button
4. Enter a valid email address
5. Click "Send Magic Link"
6. **Expected Result:**
   - Message appears: "Check your email for the magic link!"
   - Message is displayed in cyan color (accent-primary)
   - Email input field is cleared

#### Test 2: Email Validation
1. Leave email field empty and click "Send Magic Link"
   - **Expected:** "Please enter your email" error in pink
2. Enter invalid email (e.g., "notanemail")
   - **Expected:** "Please enter a valid email" error in pink
3. Enter valid email format
   - **Expected:** Success message in cyan

#### Test 3: Magic Link Email
1. After sending magic link, check your email inbox
2. **Expected:**
   - Email from Supabase (subject: "Confirm your email")
   - Click the magic link in the email
3. Should redirect back to http://localhost:8080
4. **Expected:**
   - Logged-out view disappears
   - Logged-in view appears showing:
     - Your email address
     - "Logout" button (pink gradient)
     - "Save Changes" button (cyan gradient)

#### Test 4: Session Persistence
1. While logged in, refresh the page (F5)
2. **Expected:**
   - You remain logged in
   - Email address still displayed
   - No need to re-authenticate

#### Test 5: Logout Flow
1. While logged in, click "Logout" button
2. **Expected:**
   - Logged-in view disappears
   - Logged-out view appears
   - Email input field is shown again
   - Session is cleared

#### Test 6: Multiple Browser/Device Testing
1. Log in on Browser A
2. Open the app in Browser B (or incognito mode)
3. Log in with a different email
4. **Expected:**
   - Both browsers can be logged in simultaneously
   - Each maintains their own session
   - Both can see the same shared trip data (once data layer is implemented)

#### Test 7: Production Testing (After Deploy to Vercel)
1. Visit https://japan-cyan.vercel.app
2. Repeat all tests above
3. **Expected:**
   - Magic link redirects to production URL
   - All functionality works same as local

## Common Issues & Troubleshooting

### Issue: "Error: Invalid API credentials"
- **Cause:** Supabase credentials not configured in `config.js`
- **Fix:** Add your actual Supabase URL and anon key to `config.js`

### Issue: No email received
- **Cause:** Supabase email settings not configured
- **Fix:** Check Supabase dashboard > Settings > Auth > Email settings
- **Note:** By default, Supabase uses a development email service with rate limits

### Issue: "Error: Email link is invalid or has expired"
- **Cause:** Magic link expired (default: 1 hour) or already used
- **Fix:** Request a new magic link

### Issue: Redirect goes to wrong URL
- **Cause:** `emailRedirectTo` in auth.js uses `window.location.origin`
- **Fix:** Verify the redirect URL is correct, or update auth.js to use specific URL

### Issue: UI doesn't update after login
- **Cause:** Auth state change listener not working
- **Fix:** Check browser console for errors, ensure Supabase SDK loaded

## Browser Console Verification

Open browser DevTools (F12) and check Console:
- No errors on page load
- On successful magic link send: No errors
- On successful login: Auth state change should trigger
- Session object should be visible in Application > Local Storage > `supabase.auth.token`

## What's Implemented

### auth.js
- `SupabaseAuth` class with magic link authentication
- `init()` - Checks for existing session and sets up auth state listener
- `sendMagicLink(email)` - Sends magic link to email
- `signOut()` - Signs out user
- `isAuthenticated()` - Returns true if user is logged in
- `updateUI()` - Shows/hides logged-in and logged-out views

### index.html
- Email input field with dark mode styling
- Magic link button
- Auth message display for feedback
- Logged-in view shows user email
- Logout and Save Changes buttons
- Form validation for email

### Integration
- Auth initialized on page load
- Auth state persisted in browser
- Ready for data layer integration (Task 3)

## Next Steps After Testing

Once authentication is working:
1. Proceed to Task 3: Migrate Data Layer to Supabase
2. Test collaborative features with multiple users
3. Test real-time sync functionality
