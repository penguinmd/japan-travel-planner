# Getting Started with Japan Travel Planner

## Your App is LIVE!

**Live URL:** https://japan-cyan.vercel.app

**GitHub Repository:** https://github.com/penguinmd/japan-travel-planner

## Quick Start Guide

### IMPORTANT: Supabase Setup Required

Before using the app, you need to set up Supabase authentication and database. See `SUPABASE_SETUP.md` for detailed instructions.

**Quick Setup:**
1. Create free Supabase account at https://supabase.com
2. Create new project
3. Run the SQL schema from `SUPABASE_SETUP.md`
4. Update `config.js` with your Supabase URL and anon key
5. Deploy to Vercel

## How to Login

### Step 1: Visit the App

1. Go to: https://japan-cyan.vercel.app
2. You'll see the login section at the top

### Step 2: Magic Link Authentication

1. Enter your email address in the login box
2. Click "Send Magic Link"
3. Check your email (including spam folder)
4. Click the magic link in the email
5. You'll be automatically logged in!

**Note:** No password needed - it's completely passwordless authentication.

### Step 3: Start Planning

Once logged in, you can:

- **Explore locations** - Browse cities using the navigation tabs
- **Use the split-screen map** - Content on left, interactive map on right
- **Hover locations** - Hover over location cards to highlight pins on map
- **Click map pins** - Opens location in Google Maps in new tab
- **Add favorites** - Star your must-visit places
- **Add notes** - Comment on locations to share thoughts
- **Build itinerary** - Click "Itinerary" tab to plan daily activities
- **Track budget** - Click "Budget" tab to manage expenses
- **Upload photos** - Share trip photos with the group
- **Save changes** - Click "Save Changes" button when done

**Real-time Sync:** Changes sync instantly! Other logged-in users see updates immediately.

## Understanding the Split-Screen Layout

### Desktop View
- **Left Panel (60%)**: Scrollable content with location details
- **Right Panel (40%)**: Sticky map that stays visible as you scroll

### Map Features
- **City switching**: Click a city tab (Tokyo, Kyoto, etc.) - map flies to that city
- **Numbered pins**: Match the numbered location cards
- **Interactive hover**: Hover location card to highlight and pulse the pin
- **Click pins**: Opens location in Google Maps
- **Auto-zoom**: Map automatically fits all locations for current city

### Mobile View
- Map appears above content (stacks vertically)
- Full touch support
- Optimized for small screens

## Adding Collaborators

### How to Invite Others

Simply share the URL: https://japan-cyan.vercel.app

**Steps for your friend:**
1. Visit the URL
2. Enter their email
3. Click magic link in email
4. Start collaborating!

**No special setup required** - anyone with the link can login and collaborate.

### Collaboration Features

- **Real-time updates**: Changes appear instantly for all users
- **Shared data**: Everyone sees the same favorites, notes, itinerary, budget
- **User attribution**: See who made the last update
- **Conflict-free**: Supabase handles concurrent edits automatically

## Using the App Features

### Navigation
- Use tabs at top to switch between cities and sections
- "General Tips", "Trains", "Budget", "Itinerary", "Photos" are general sections
- "Tokyo", "Kyoto", "Osaka", "Kinosaki", "Kanazawa" show city-specific locations

### Favorites
- Click star icon on any location card
- Your favorites are highlighted
- Click "Save Changes" to persist
- All users see the same favorites

### Comments/Notes
- Click "Add Note" button on location cards
- Enter your comment
- Include your name
- Shares thoughts with the group

### Itinerary Builder
- Set trip start date
- Add activities to each day
- Drag and drop to reorder (if supported)
- See full trip timeline

### Budget Tracker
- Add expenses by category:
  - Hotels
  - Food
  - Transport
  - Activities
  - Shopping
- Enter description, amount, who paid
- See total budget summary

### Photos
- Upload trip photos
- Add captions
- Share with all collaborators

### Saving Changes
1. Make your edits
2. Click "Save Changes" button (top right)
3. Wait for confirmation message
4. Changes sync to all users immediately

## Mobile Usage

### Installing as App

**iOS:**
1. Visit URL in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. App icon appears on home screen

**Android:**
1. Visit URL in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"
4. App icon appears on home screen

### Mobile Features
- Full touch support
- Responsive layout
- Map stacks above content
- All features work on mobile

## Troubleshooting

### Login Issues

**Q: Didn't receive magic link**
- Check spam/junk folder
- Make sure email is correct
- Try sending again
- Check Supabase email settings

**Q: Magic link expired**
- Links expire after 1 hour
- Request a new one
- Click the newest link in your email

**Q: Can't login at all**
- Verify Supabase is configured correctly
- Check browser console for errors
- Make sure you're using HTTPS URL
- Try different browser

### Map Issues

**Q: Map not loading**
- Check internet connection
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors
- Make sure JavaScript is enabled

**Q: Pins not appearing**
- Click a city tab to load locations
- Make sure you're on a city section
- Check browser console for errors

**Q: Hover effects not working**
- Make sure you're hovering over location cards
- Try refreshing the page
- Works best on desktop (limited on mobile)

### Data Sync Issues

**Q: Changes not saving**
- Make sure you're logged in
- Click "Save Changes" button
- Check for error messages
- Verify Supabase connection

**Q: Don't see friend's changes**
- Refresh the page
- Check if friend saved changes
- Verify both logged in
- Check browser console

**Q: Data disappeared**
- Check if logged in
- Verify Supabase database is configured
- Check if data exists in Supabase dashboard
- Contact admin if database was reset

### General Issues

**Q: App looks broken**
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Clear browser cache
- Try different browser
- Check if JavaScript is enabled

**Q: Slow performance**
- Check internet connection
- Close other tabs
- Try on different device
- Map loading can take a moment on slow connections

## Tips for Best Experience

### Before Your Trip
1. Add all must-visit locations to favorites
2. Build rough itinerary with daily plans
3. Add budget items for major expenses
4. Collaborate with travel companions
5. Use notes to share research/tips

### During Your Trip
1. Upload photos as you go
2. Update itinerary with actual activities
3. Track expenses in real-time
4. Share discoveries via comments
5. Use map to navigate between locations

### After Your Trip
1. Complete budget with final expenses
2. Upload all photos
3. Add final notes and memories
4. Review itinerary vs reality
5. Keep as reference for future trips

## Advanced Features

### Keyboard Shortcuts
- (Currently none - could be added in future)

### URL Parameters
- App loads to "General Tips" by default
- No query params currently supported

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Android)

## Getting Help

### Resources
- **Technical docs**: See README.md
- **Supabase setup**: See SUPABASE_SETUP.md
- **Implementation plan**: See docs/plans/2025-10-18-split-screen-map-redesign.md

### Common Questions

**Q: Is this free?**
A: Yes! Supabase free tier + Vercel free hosting.

**Q: Is my data private?**
A: Data is shared with all authenticated users. Use Row Level Security in Supabase for privacy.

**Q: Can I use for other trips?**
A: Yes! Clone the repo and customize for any destination.

**Q: Can I customize the design?**
A: Yes! Edit styles.css and redeploy.

## Ready to Start Planning!

You're all set to plan an amazing trip to Japan!

**Quick checklist:**
- [ ] Supabase configured
- [ ] App deployed to Vercel
- [ ] Logged in successfully
- [ ] Invited collaborators
- [ ] Explored the split-screen interface
- [ ] Tested map interactions
- [ ] Added some favorites
- [ ] Ready to plan!

Have an amazing trip to Japan! ✨

---

**Need technical help?** Check README.md or SUPABASE_SETUP.md
