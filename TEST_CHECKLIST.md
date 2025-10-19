# Comprehensive Test Checklist - Japan Travel Planner

## Pre-Testing Setup

### Supabase Configuration
- [ ] Supabase project created
- [ ] Database schema executed (trip_data table exists)
- [ ] Row Level Security policies enabled
- [ ] Realtime publication configured for trip_data
- [ ] Initial singleton row inserted (id: 00000000-0000-0000-0000-000000000001)
- [ ] Email authentication configured in Supabase Auth settings
- [ ] Magic link template configured (optional)

### Application Configuration
- [ ] `config.js` updated with correct Supabase URL
- [ ] `config.js` updated with correct Supabase anon key
- [ ] Vercel deployment successful
- [ ] HTTPS enabled on live URL

---

## Authentication Tests

### Magic Link Login
- [ ] Enter valid email address
- [ ] Click "Send Magic Link" button
- [ ] Success message appears ("Check your email for the magic link!")
- [ ] Email received (check inbox and spam)
- [ ] Email contains magic link
- [ ] Click magic link in email
- [ ] Redirected back to app
- [ ] Logged in successfully (UI shows logged-in state)
- [ ] User email displayed in header
- [ ] "Save Changes" button visible

### Invalid Email Handling
- [ ] Enter empty email - shows error message
- [ ] Enter invalid email format - shows error message
- [ ] Enter email with spaces - shows appropriate handling

### Logout
- [ ] Click "Logout" button
- [ ] Logged out successfully
- [ ] UI shows logged-out state
- [ ] Login form reappears
- [ ] "Save Changes" button hidden

### Session Persistence
- [ ] Login successfully
- [ ] Refresh page
- [ ] Still logged in (session persisted)
- [ ] User email still displayed

### Multi-User Authentication
- [ ] User 1 logs in (Browser 1)
- [ ] User 2 logs in with different email (Browser 2 or Incognito)
- [ ] Both users logged in simultaneously
- [ ] Both can access app features

---

## Split-Screen Layout Tests

### Desktop Layout (> 1024px)
- [ ] Page loads with split-screen layout
- [ ] Left panel takes ~60% width
- [ ] Right panel takes ~40% width
- [ ] 24px gap between panels
- [ ] Content panel scrollable
- [ ] Map panel sticky (stays in viewport)
- [ ] Map stays visible while scrolling content
- [ ] Layout looks balanced and professional

### Mobile Layout (< 1024px)
- [ ] Panels stack vertically
- [ ] Map appears above content
- [ ] Map takes full width
- [ ] Content takes full width
- [ ] Map height is 500px
- [ ] Both panels visible and usable

### Responsive Breakpoints
- [ ] Test at 1024px (breakpoint)
- [ ] Test at 768px (tablet)
- [ ] Test at 375px (mobile)
- [ ] Test at very large screen (1920px+)
- [ ] No horizontal scrolling at any size

---

## Map Initialization Tests

### Initial Map Load
- [ ] Map loads on page load
- [ ] Map centered on Japan (36.2048, 138.2529)
- [ ] Zoom level is 6 (Japan overview)
- [ ] Dark theme tiles load correctly
- [ ] No console errors
- [ ] Map controls visible (zoom buttons)
- [ ] Attribution displayed

### Map Panel Header
- [ ] Map title shows "Japan Overview"
- [ ] Map subtitle shows "Select a city to view locations"
- [ ] Text styling matches design (colors, fonts)

---

## City Navigation & Map Updates

### Tokyo Tab
- [ ] Click "Tokyo" tab
- [ ] Map flies/animates to Tokyo
- [ ] Animation is smooth (1.5s duration)
- [ ] Map title updates to "Tokyo Locations"
- [ ] Map subtitle shows correct location count
- [ ] Pins appear for all Tokyo locations
- [ ] Pins are numbered (1, 2, 3, etc.)
- [ ] Pins match location card order
- [ ] Map auto-zooms to fit all Tokyo pins
- [ ] Padding around pins (80px)

### Kyoto Tab
- [ ] Click "Kyoto" tab
- [ ] Map flies to Kyoto
- [ ] Previous Tokyo pins removed
- [ ] New Kyoto pins appear
- [ ] Correct number of pins displayed
- [ ] Pins correctly numbered
- [ ] Map fits all Kyoto locations

### Osaka Tab
- [ ] Click "Osaka" tab
- [ ] Map flies to Osaka
- [ ] Correct pins displayed
- [ ] Numbering correct

### Kinosaki Tab
- [ ] Click "Kinosaki" tab
- [ ] Map flies to Kinosaki
- [ ] Correct pins displayed
- [ ] Numbering correct

### Kanazawa Tab
- [ ] Click "Kanazawa" tab
- [ ] Map flies to Kanazawa
- [ ] Correct pins displayed
- [ ] Numbering correct

### Non-City Tabs
- [ ] Click "General Tips" tab
- [ ] Map resets to Japan overview
- [ ] All city pins removed
- [ ] Map title shows "Japan Overview"
- [ ] Map subtitle shows default text

- [ ] Click "Trains" tab - map resets
- [ ] Click "Budget" tab - map resets
- [ ] Click "Itinerary" tab - map resets
- [ ] Click "Photos" tab - map resets

---

## Map Pin Interactions

### Pin Appearance
- [ ] Pins have pink background (--accent-secondary)
- [ ] Pins are circular (32px diameter)
- [ ] Pins have white border (3px)
- [ ] Pins have drop shadow
- [ ] Numbers are white and bold
- [ ] Numbers are centered in pins

### Pin Click Interactions
- [ ] Click a pin
- [ ] Google Maps opens in new tab
- [ ] Correct coordinates passed
- [ ] Google Maps shows correct location

### Pin Hover (Tooltips)
- [ ] Hover over pin
- [ ] Tooltip appears showing location name
- [ ] Tooltip positioned above pin
- [ ] Tooltip text is readable
- [ ] Tooltip disappears on mouse out

---

## Location Card Hover Effects

### Tokyo Location Hover
- [ ] Hover over first Tokyo location card
- [ ] Corresponding pin (1) highlights on map
- [ ] Pin changes color to blue (--accent-primary)
- [ ] Pin size increases slightly (38px)
- [ ] Pin border thickens (4px)
- [ ] Pin has pulse animation
- [ ] Map pans slightly to show pin
- [ ] Pan animation is smooth (0.5s)

### Multiple Locations
- [ ] Hover over location 1 - pin 1 highlights
- [ ] Move to location 2 - pin 1 unhighlights, pin 2 highlights
- [ ] Move to location 3 - pin 2 unhighlights, pin 3 highlights
- [ ] Move mouse away - last pin unhighlights

### Location Card Styling on Hover
- [ ] Location card border-left turns blue
- [ ] Location card gets shadow effect
- [ ] Location number badge scales up
- [ ] Location number badge turns blue
- [ ] Cursor changes to pointer
- [ ] Transitions are smooth

### Different Cities
- [ ] Test hover effects on Kyoto locations
- [ ] Test hover effects on Osaka locations
- [ ] Test hover effects on Kinosaki locations
- [ ] Test hover effects on Kanazawa locations

---

## Data Management Tests

### Initial Data Load
- [ ] Login successfully
- [ ] Data loads from Supabase
- [ ] If no data exists, defaults are used
- [ ] No console errors
- [ ] Favorites array initialized
- [ ] Comments array initialized
- [ ] Itinerary object initialized
- [ ] Budget object initialized
- [ ] Photos array initialized

### Favorites Feature
- [ ] Click star on a location (not favorited)
- [ ] Star fills/highlights
- [ ] Location marked as favorite locally
- [ ] Click "Save Changes"
- [ ] Success message appears
- [ ] Refresh page
- [ ] Favorite persists (still starred)

- [ ] Click star on favorited location
- [ ] Star empties/unhighlights
- [ ] Location unfavorited locally
- [ ] Click "Save Changes"
- [ ] Refresh page
- [ ] Unfavorite persists

### Comments/Notes Feature
- [ ] Click "Add Note" on a location
- [ ] Input fields appear
- [ ] Enter note text
- [ ] Enter your name
- [ ] Submit note
- [ ] Note appears in list
- [ ] Timestamp is current
- [ ] Click "Save Changes"
- [ ] Refresh page
- [ ] Note persists

### Save Changes Flow
- [ ] Make multiple changes (favorites, notes, etc.)
- [ ] Not logged in - shows error
- [ ] Login first
- [ ] Click "Save Changes"
- [ ] Success message appears ("Changes saved successfully!")
- [ ] Check Supabase dashboard - data updated
- [ ] updated_at timestamp is current
- [ ] updated_by contains user ID

---

## Real-Time Sync Tests

### Setup
- [ ] Browser 1: User 1 logged in
- [ ] Browser 2: User 2 logged in (different email)
- [ ] Both viewing same app

### Real-Time Updates
- [ ] Browser 1: Add favorite, save changes
- [ ] Browser 2: Page refreshes automatically OR manual refresh
- [ ] Browser 2: New favorite visible
- [ ] Browser 1: Add comment, save changes
- [ ] Browser 2: New comment visible after refresh

### Subscription Active
- [ ] Check browser console for subscription messages
- [ ] Subscription to 'trip_data_changes' channel active
- [ ] Updates logged when data changes
- [ ] No subscription errors

### Data Consistency
- [ ] Both users see identical data
- [ ] No data conflicts
- [ ] Changes don't overwrite each other
- [ ] Last saved wins (expected behavior)

---

## Itinerary Tests

### Initial Setup
- [ ] Click "Itinerary" tab
- [ ] Itinerary section loads
- [ ] Start date picker visible
- [ ] Activity input fields visible
- [ ] No errors in console

### Adding Activities
- [ ] Set trip start date
- [ ] Add activity to Day 1
- [ ] Activity appears in list
- [ ] Add multiple activities to same day
- [ ] Add activities to different days
- [ ] Activities organized by day

### Saving Itinerary
- [ ] Add several activities
- [ ] Click "Save Changes"
- [ ] Success message
- [ ] Refresh page
- [ ] All activities persist
- [ ] Dates correct
- [ ] Order preserved

---

## Budget Tests

### Categories
- [ ] Click "Budget" tab
- [ ] All categories visible:
  - Hotels
  - Food
  - Transport
  - Activities
  - Shopping
- [ ] Each category has input form

### Adding Expenses
- [ ] Add hotel expense
  - Description filled
  - Amount entered
  - Payer selected
- [ ] Expense appears in hotel list
- [ ] Add expenses to other categories
- [ ] All expenses display correctly

### Budget Calculations
- [ ] Total per category calculates correctly
- [ ] Overall total calculates correctly
- [ ] Numbers formatted properly (currency)

### Saving Budget
- [ ] Add multiple expenses
- [ ] Click "Save Changes"
- [ ] Refresh page
- [ ] All expenses persist
- [ ] Totals recalculate correctly

---

## Photos Tests

### Photo Upload
- [ ] Click "Photos" tab
- [ ] Upload form visible
- [ ] Select photo file
- [ ] Add caption
- [ ] Upload photo
- [ ] Photo appears in gallery
- [ ] Caption displays correctly

### Photo Display
- [ ] Photos shown in grid/list
- [ ] Thumbnails load
- [ ] Click photo to enlarge (if implemented)
- [ ] All photos visible

### Saving Photos
- [ ] Upload photo
- [ ] Click "Save Changes"
- [ ] Refresh page
- [ ] Photo persists
- [ ] Caption persists

---

## Error Handling Tests

### Network Errors
- [ ] Disconnect internet
- [ ] Try to login - appropriate error
- [ ] Try to save data - appropriate error
- [ ] Map tiles fail gracefully
- [ ] Reconnect internet - app recovers

### Supabase Errors
- [ ] Invalid credentials in config.js - shows error
- [ ] Database unreachable - shows error
- [ ] Row Level Security blocks access - shows error
- [ ] Errors displayed to user clearly

### Invalid Data
- [ ] Try to save without being logged in - error shown
- [ ] Invalid email format - error shown
- [ ] Empty required fields - validation errors

---

## Performance Tests

### Page Load Speed
- [ ] Initial page load < 3 seconds
- [ ] Map loads within 2 seconds
- [ ] No render-blocking resources
- [ ] Fonts load quickly

### Map Performance
- [ ] Switching cities is smooth (no lag)
- [ ] Pin rendering is fast
- [ ] Hover effects are immediate
- [ ] No stuttering during animations

### Data Operations
- [ ] Data loads quickly on login
- [ ] Save operations complete within 2 seconds
- [ ] Real-time updates arrive within 1-2 seconds
- [ ] No memory leaks (check DevTools)

---

## Browser Compatibility Tests

### Desktop Browsers
- [ ] Chrome (latest) - all features work
- [ ] Firefox (latest) - all features work
- [ ] Safari (latest) - all features work
- [ ] Edge (latest) - all features work

### Mobile Browsers
- [ ] iOS Safari - all features work
- [ ] Chrome Android - all features work
- [ ] Firefox Mobile - all features work

### Browser Features
- [ ] JavaScript enabled - app works
- [ ] JavaScript disabled - shows message or graceful degradation
- [ ] Cookies enabled for authentication
- [ ] Local storage available

---

## Mobile Device Tests

### iOS Devices
- [ ] iPhone (iOS Safari)
- [ ] Layout stacks correctly
- [ ] Touch interactions work
- [ ] Map touch gestures work (pinch zoom, pan)
- [ ] Login flow works
- [ ] All features accessible

### Android Devices
- [ ] Android phone (Chrome)
- [ ] Layout stacks correctly
- [ ] Touch interactions work
- [ ] Map touch gestures work
- [ ] Login flow works
- [ ] All features accessible

### Tablet Devices
- [ ] iPad - test both orientations
- [ ] Android tablet - test both orientations
- [ ] Layout responsive at tablet size

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter key activates buttons
- [ ] Focus indicators visible
- [ ] Tab order logical

### Screen Reader (Basic)
- [ ] Buttons have labels
- [ ] Forms have labels
- [ ] Alt text on images (if any)
- [ ] Semantic HTML structure

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Links distinguishable
- [ ] Interactive elements visible

---

## Security Tests

### Authentication
- [ ] Can't access data without login
- [ ] Magic link expires appropriately
- [ ] Session timeout works (if implemented)
- [ ] Logout clears session

### Data Access
- [ ] Row Level Security policies enforced
- [ ] Unauthenticated users can't read data
- [ ] Unauthenticated users can't write data
- [ ] Users can only update, not delete/insert new rows

### XSS Prevention
- [ ] User input (comments) properly escaped
- [ ] No script injection possible
- [ ] Safe handling of HTML in user content

---

## Production Deployment Tests

### Vercel Deployment
- [ ] App accessible at https://japan-cyan.vercel.app
- [ ] HTTPS enabled (padlock in browser)
- [ ] No mixed content warnings
- [ ] All assets load from HTTPS

### Environment Variables
- [ ] Supabase URL correct in production
- [ ] Supabase anon key correct in production
- [ ] No secrets exposed in client code
- [ ] Config.js values match production

### Build & Deploy
- [ ] Push to main triggers deployment
- [ ] Deployment completes successfully
- [ ] Changes visible on live site within 30 seconds
- [ ] No build errors in Vercel logs

---

## Edge Cases & Stress Tests

### Large Data Sets
- [ ] Add 50+ favorites - performance OK
- [ ] Add 100+ comments - UI handles well
- [ ] Large itinerary (30+ days) - displays correctly
- [ ] Many budget items - calculations correct

### Concurrent Users
- [ ] 2 users saving simultaneously - no conflicts
- [ ] 3+ users logged in - all see updates
- [ ] Rapid saves - data consistency maintained

### Long Sessions
- [ ] Keep app open for 1+ hour - session persists
- [ ] Keep app open overnight - session may expire
- [ ] Re-login after long period - data still intact

### Unusual Input
- [ ] Very long comment text - handles gracefully
- [ ] Special characters in comments - displays correctly
- [ ] Emoji in comments - displays correctly
- [ ] Unicode characters - handles correctly

---

## User Experience Tests

### First-Time User
- [ ] Landing page clear and inviting
- [ ] Login process intuitive
- [ ] Instructions easy to follow
- [ ] Features discoverable
- [ ] No confusion about what to do

### Returning User
- [ ] Easy to login again
- [ ] Data persists from previous session
- [ ] Can pick up where left off
- [ ] Familiar interface

### Collaboration Experience
- [ ] Easy to invite others
- [ ] Clear that data is shared
- [ ] Can see others' contributions
- [ ] Feels collaborative, not conflicting

---

## Final Checklist

### Documentation
- [ ] README.md updated and accurate
- [ ] GETTING_STARTED.md clear and helpful
- [ ] SUPABASE_SETUP.md complete
- [ ] This TEST_CHECKLIST.md comprehensive

### Code Quality
- [ ] No console errors in production
- [ ] No console warnings (or acceptable ones noted)
- [ ] Code formatted consistently
- [ ] Comments where needed

### Deployment
- [ ] Live URL works
- [ ] All features functional in production
- [ ] Performance acceptable
- [ ] No broken links

### Ready for Users
- [ ] App tested end-to-end
- [ ] Critical bugs fixed
- [ ] User experience polished
- [ ] Documentation complete
- [ ] Ready to share with friends!

---

## Notes for Tester

**Important:**
- This checklist assumes Supabase is properly configured
- Some tests require multiple browsers/devices
- Real-time sync may require manual page refresh if auto-refresh not implemented
- Performance benchmarks are approximate guidelines
- Not all tests may apply if features were modified

**Test Environment:**
- Local: http://localhost:8080
- Production: https://japan-cyan.vercel.app

**Reporting Issues:**
1. Note which test failed
2. Describe expected vs actual behavior
3. Include browser/device information
4. Check console for errors
5. Include screenshots if helpful

**Test Completion:**
- Date tested: _________________
- Tester name: _________________
- Environment: ☐ Local ☐ Production
- Pass rate: _____ / _____ tests passed
- Critical issues: _________________
- Minor issues: _________________
- Ready for production: ☐ Yes ☐ No

---

## Quick Smoke Test (5 minutes)

For rapid verification, test these critical flows:

1. **Authentication**
   - [ ] Login with magic link works
   - [ ] Logout works

2. **Layout**
   - [ ] Split-screen displays correctly
   - [ ] Map is sticky on desktop

3. **Map**
   - [ ] Click Tokyo - map updates
   - [ ] Hover location - pin highlights

4. **Data**
   - [ ] Add favorite, save, refresh - persists
   - [ ] Two users see same data

5. **Mobile**
   - [ ] Open on phone - layout stacks
   - [ ] All features accessible

If all 5 pass, app is likely production-ready!
