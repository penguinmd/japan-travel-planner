# Japan Travel Planner

A collaborative travel planning app with split-screen map interface for planning trips to Japan.

## Features

- **Split-screen layout**: Scrollable content on left (60%), sticky interactive map on right (40%)
- **Simple password authentication**: Shared password system for easy access
- **Local storage**: All data stored in browser localStorage - persists across sessions
- **Interactive maps**: Click locations to view on Google Maps, hover cards to highlight pins
- **Favorites & notes**: Save and share your must-visit spots with comments
- **Itinerary builder**: Plan your daily activities with drag-and-drop interface
- **Budget tracker**: Track shared expenses across categories
- **Photo uploads**: Share trip photos with your travel companions
- **Mobile responsive**: Map stacks above content on mobile devices

## Tech Stack

- **Frontend**: HTML/CSS/JavaScript (no build step required)
- **Maps**: Leaflet.js with CartoDB Dark Matter tiles
- **Storage**: Browser localStorage (no server/database required)
- **Hosting**: Vercel (static site)

## Architecture

### Split-Screen Layout
- CSS Grid layout with sticky positioning for map panel
- Single map instance that re-centers and updates pins when tabs change
- Content panel is scrollable, map stays visible in viewport
- Responsive design: stacks vertically on mobile (< 1024px)

### Authentication & Data
- Simple shared password authentication (password: "Feels Like Fall")
- All data stored in browser's localStorage
- Changes persist across browser sessions
- Data is shared per-browser (everyone using the same browser shares data)

### Map Interactions
- Numbered pins correspond to location cards
- Hover over location card highlights corresponding map pin
- Click map pin to open location in Google Maps
- Smooth animations when switching between cities

## Local Development

### Prerequisites
- Python 3 for local server (or any static file server)

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/japan-travel-planner.git
cd japan-travel-planner
```

2. Start local server:
```bash
python3 -m http.server 8080
```

3. Open browser to http://localhost:8080

4. Login with password: "Feels Like Fall" (case-sensitive)

## Deployment

### Automatic Deployment
Pushes to `main` branch automatically deploy to Vercel.

**Live URL:** https://japan-cyan.vercel.app

### Vercel Setup
1. Import repository in Vercel dashboard
2. Framework: Other (static site)
3. No environment variables needed
4. Deploy

## File Structure

```
/
├── index.html              # Main HTML structure
├── styles.css              # All styles including split-screen layout
├── config.js               # App configuration (Vercel URL)
├── auth.js                 # Simple password authentication
├── supabase-data.js        # localStorage-based data management
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
1. User visits app
2. Enters shared password: "Feels Like Fall"
3. Login state saved to localStorage
4. Can view and edit trip data
5. Changes save to localStorage on "Save Changes" click
6. Data persists across browser sessions

### Data Storage
1. User makes changes locally (favorites, comments, etc.)
2. Clicks "Save Changes" button
3. Data saved to browser's localStorage
4. Changes persist across browser restarts
5. Data is specific to each browser (not synced across devices/browsers)

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
- Change the shared password in `auth.js`
- Add new features (e.g., weather API, flight tracker)

## Important Notes

- **Shared Password**: The password "Feels Like Fall" is case-sensitive
- **Data Storage**: All data is stored in browser localStorage - it's not synced to a server
- **Per-Browser**: Each browser has its own separate data
- **Data Persistence**: Data persists across sessions but is lost if browser data is cleared
- **No Real-time Sync**: Changes in one browser/tab won't automatically appear in another

## Support

For setup help, see `GETTING_STARTED.md`

For implementation details, see `docs/plans/2025-10-18-split-screen-map-redesign.md`
