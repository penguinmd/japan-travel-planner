# Getting Started with Japan Travel Planner

## Your App is LIVE!

**Live URL:** https://japan-cyan.vercel.app

**GitHub Repository:** https://github.com/penguinmd/japan-travel-planner

## Quick Start Guide

### No Setup Required!

The app uses simple password authentication and browser localStorage - no database or server configuration needed!

**How to start using the app:**
1. Visit: https://japan-cyan.vercel.app
2. Enter password: "Feels Like Fall" (case-sensitive)
3. Start planning your trip!

## How to Login

### Step 1: Visit the App

1. Go to: https://japan-cyan.vercel.app
2. You'll see the login section at the top

### Step 2: Enter the Shared Password

1. Enter the password: **"Feels Like Fall"** (without quotes, case-sensitive)
2. Click "Login"
3. You'll be logged in immediately!

**Note:** The password is case-sensitive. Make sure to capitalize "Feels", "Like", and "Fall".

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

**Data Persistence:** Your changes are saved to browser localStorage and persist across sessions!

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

## Sharing with Others

### How to Invite Others

Simply share the URL and password:

**Share this with your travel companions:**
- URL: https://japan-cyan.vercel.app
- Password: "Feels Like Fall" (case-sensitive)

**Steps for your friend:**
1. Visit the URL
2. Enter the shared password
3. Start collaborating!

### Important Notes About Data Sharing

- **Per-Browser Storage**: Each browser has its own localStorage
- **Not Real-time**: Changes in one browser don't automatically sync to others
- **Share Updates**: Use export/import features or share screenshots to keep everyone updated
- **Device-Specific**: Data on your phone won't sync to your laptop automatically

## Using the App Features

### Navigation
- Use tabs at top to switch between cities and sections
- "General Tips", "Trains", "Budget", "Itinerary" are general sections
- "Tokyo", "Kyoto", "Osaka", "Kinosaki", "Kanazawa" show city-specific locations

### Favorites
- Click star icon on any location card
- Your favorites are highlighted
- Click "Save Changes" to persist to localStorage
- Data saved in your browser

### Comments/Notes
- Click "Add Note" button on location cards
- Enter your comment
- Include your name
- Saves to browser localStorage

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
- Stored in browser localStorage

### Saving Changes
1. Make your edits
2. Click "Save Changes" button (top right)
3. Wait for confirmation message
4. Changes saved to browser localStorage

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

**Q: Password not working**
- Make sure you're using: "Feels Like Fall" (exact capitalization)
- It's case-sensitive!
- No quotes around the password
- Try copy-pasting: Feels Like Fall

**Q: Stay logged in?**
- Yes! Login state is saved to localStorage
- You'll stay logged in even after closing browser
- Only need to login once per browser

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

### Data Storage Issues

**Q: Changes not saving**
- Make sure you're logged in
- Click "Save Changes" button
- Check for error messages
- Check if localStorage is enabled in browser

**Q: Data disappeared**
- Check if logged in
- Verify browser localStorage wasn't cleared
- Check if you're using same browser
- Data is browser-specific (won't sync across devices)

**Q: Can't see friend's changes**
- This is expected! localStorage is per-browser
- Each person has their own data
- To share: use screenshots or export features
- For real-time sync, you'd need a server (like Supabase)

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
4. Share password with travel companions
5. Use notes to track research/tips

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

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Android)

### localStorage Limits
- Most browsers: ~5-10MB storage
- Plenty for trip data
- If you hit limits, reduce photo uploads
- Consider exporting/backing up data

### Data Backup
Since data is stored in browser localStorage:
- Consider taking screenshots of important data
- Copy/paste itinerary and budget to external document
- localStorage can be cleared if browser data is cleared
- No automatic cloud backup

## Important Reminders

**Password**: "Feels Like Fall" (case-sensitive)

**Data Storage**:
- Stored in browser localStorage
- Persists across browser sessions
- Not synced to cloud or other devices
- Cleared if you clear browser data

**Collaboration**:
- Share password with travel companions
- Each person's data is separate (per-browser)
- Not real-time collaborative (unlike Supabase version)
- Good for personal use or small groups with manual sync

## Ready to Start Planning!

You're all set to plan an amazing trip to Japan!

**Quick checklist:**
- [ ] Visited https://japan-cyan.vercel.app
- [ ] Logged in with password: "Feels Like Fall"
- [ ] Explored the split-screen interface
- [ ] Tested map interactions
- [ ] Added some favorites
- [ ] Clicked "Save Changes"
- [ ] Ready to plan!

Have an amazing trip to Japan!

---

**Need technical help?** Check README.md
