# Japan Travel Planner

A collaborative travel planning app with split-screen map interface for planning trips to Japan.

## Features

- **Split-screen layout**: Scrollable content on left (60%), sticky interactive map on right (40%)
- **Magic link authentication**: Passwordless email-based login via Supabase
- **Real-time collaboration**: Changes sync instantly between users
- **Interactive maps**: Click locations to view on Google Maps, hover cards to highlight pins
- **Favorites & notes**: Save and share your must-visit spots with comments
- **Itinerary builder**: Plan your daily activities with drag-and-drop interface
- **Budget tracker**: Track shared expenses across categories
- **Photo uploads**: Share trip photos with your travel companions
- **Mobile responsive**: Map stacks above content on mobile devices

## Tech Stack

- **Frontend**: HTML/CSS/JavaScript (no build step required)
- **Maps**: Leaflet.js with CartoDB Dark Matter tiles
- **Backend**: Supabase (authentication + database + real-time sync)
- **Hosting**: Vercel (static site)

## Architecture

### Split-Screen Layout
- CSS Grid layout with sticky positioning for map panel
- Single map instance that re-centers and updates pins when tabs change
- Content panel is scrollable, map stays visible in viewport
- Responsive design: stacks vertically on mobile (< 1024px)

### Authentication & Data
- Supabase magic link authentication (passwordless)
- Real-time collaborative data storage in single shared row
- Row-level security policies for authenticated users
- Changes sync instantly via Supabase Realtime subscriptions

### Map Interactions
- Numbered pins correspond to location cards
- Hover over location card highlights corresponding map pin
- Click map pin to open location in Google Maps
- Smooth animations when switching between cities

## Local Development

### Prerequisites
- Supabase account and project (see SUPABASE_SETUP.md)
- Python 3 for local server

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/japan-travel-planner.git
cd japan-travel-planner
```

2. Update `config.js` with your Supabase credentials:
```javascript
const CONFIG = {
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key'
  }
};
```

3. Start local server:
```bash
python3 -m http.server 8080
```

4. Open browser to http://localhost:8080

## Database Schema

See `docs/plans/2025-10-18-split-screen-map-redesign.md` for full schema details.

**trip_data table** (singleton row):
- `id`: UUID primary key
- `favorites`: JSONB array of location IDs
- `comments`: JSONB array of comment objects
- `itinerary`: JSONB object with daily plans
- `budget`: JSONB object with expense categories
- `photos`: JSONB array of photo objects
- `updated_at`: Timestamp
- `updated_by`: User ID reference

## Deployment

### Automatic Deployment
Pushes to `main` branch automatically deploy to Vercel.

**Live URL:** https://japan-cyan.vercel.app

### Vercel Setup
1. Import repository in Vercel dashboard
2. Framework: Other (static site)
3. No environment variables needed (Supabase keys are public-safe)
4. Deploy

## File Structure

```
/
├── index.html              # Main HTML structure
├── styles.css              # All styles including split-screen layout
├── config.js               # Supabase configuration
├── supabase-client.js      # Supabase client initialization
├── auth.js                 # Magic link authentication
├── supabase-data.js        # Data management & real-time sync
├── maps.js                 # Leaflet map initialization & updates
├── map-interactions.js     # Location card <-> pin hover effects
├── itinerary.js            # Itinerary builder functionality
├── budget.js               # Budget tracker functionality
├── photos.js               # Photo upload functionality
├── ui-components.js        # Reusable UI components
└── docs/
    └── plans/              # Implementation plans
```

## How It Works

### User Flow
1. User visits app and enters email
2. Receives magic link in email
3. Clicks link to authenticate
4. Can view and edit trip data
5. Changes save to Supabase on "Save Changes" click
6. Other authenticated users see changes in real-time

### Data Sync Flow
1. User makes changes locally (favorites, comments, etc.)
2. Clicks "Save Changes" button
3. Data updates in Supabase `trip_data` table
4. Supabase broadcasts change via Realtime
5. Other connected clients receive update and refresh UI

### Map Updates
1. User clicks city tab (e.g., "Tokyo")
2. `showSection()` calls `updateMapForSection()`
3. Map flies to city center with animation
4. Pins rendered for all locations in that city
5. Hover over location card highlights corresponding pin

## Contributing

Feel free to fork and customize for your own trips!

### Making Changes
1. Edit files locally
2. Test with local server
3. Commit and push to GitHub
4. Vercel auto-deploys to production

### Customization Ideas
- Change color scheme in `styles.css`
- Add new cities in location data
- Modify authentication flow
- Add new features (e.g., weather API, flight tracker)

## Support

For setup help, see `GETTING_STARTED.md`

For Supabase configuration, see `SUPABASE_SETUP.md`

For implementation details, see `docs/plans/2025-10-18-split-screen-map-redesign.md`
