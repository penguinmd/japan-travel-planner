# Split-Screen Map Redesign Implementation Plan

> **For Claude:** Use `${SUPERPOWERS_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Redesign the Japan travel planner with a split-screen layout: scrollable content on the left (60%), sticky map on the right (40%) showing current city's locations.

**Architecture:**
- CSS Grid layout with sticky positioning for map panel
- Single map instance that re-centers and updates pins when tabs change
- Supabase for authentication (magic link) and real-time collaborative data storage
- Remove GitHub API dependencies, migrate to Supabase database

**Tech Stack:**
- Frontend: HTML/CSS/JavaScript, Leaflet.js for maps
- Backend: Supabase (auth + database + real-time)
- Hosting: Vercel (static site)
- No build step required

---

## Task 1: Set up Supabase Project

**Files:**
- Create: `.env` (local only, gitignored)
- Modify: `config.js`
- Create: `supabase-client.js`

**Step 1: Create Supabase project**

1. Go to https://supabase.com
2. Create new project: "japan-travel-planner"
3. Note the project URL and anon key
4. Create `.env` file (already in .gitignore):

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**Step 2: Set up database schema**

In Supabase SQL Editor, run:

```sql
-- Users table (managed by Supabase Auth)
-- No custom users table needed

-- Shared trip data table
CREATE TABLE trip_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  favorites JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb,
  itinerary JSONB DEFAULT '{}'::jsonb,
  budget JSONB DEFAULT '{"hotels":[],"food":[],"transport":[],"activities":[],"shopping":[]}'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE trip_data ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can read
CREATE POLICY "Anyone can read trip data"
  ON trip_data FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Anyone authenticated can update
CREATE POLICY "Anyone can update trip data"
  ON trip_data FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial row (only one row will exist)
INSERT INTO trip_data (id) VALUES ('00000000-0000-0000-0000-000000000001');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE trip_data;
```

**Step 3: Create Supabase client**

Create `supabase-client.js`:

```javascript
// supabase-client.js
// Note: In production, these will come from Vercel environment variables
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Trip data ID (singleton row)
const TRIP_DATA_ID = '00000000-0000-0000-0000-000000000001';
```

**Step 4: Update index.html to include Supabase SDK**

In `index.html`, add before other script tags (around line 13):

```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

**Step 5: Update config.js**

Modify `config.js` to remove GitHub config:

```javascript
// config.js
const CONFIG = {
  vercel: {
    url: 'https://japan-cyan.vercel.app'
  },
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key'
  }
};
```

**Step 6: Commit**

```bash
git add config.js supabase-client.js index.html
git commit -m "feat: set up Supabase project and database schema"
```

---

## Task 2: Implement Supabase Authentication

**Files:**
- Modify: `auth.js`
- Modify: `index.html` (auth UI section)

**Step 1: Rewrite auth.js for Supabase magic link**

Replace contents of `auth.js`:

```javascript
// auth.js - Supabase Magic Link Authentication
class SupabaseAuth {
  constructor() {
    this.user = null;
    this.session = null;
  }

  async init() {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.session = session;
      this.user = session.user;
      this.updateUI();
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.session = session;
      this.user = session?.user || null;
      this.updateUI();
    });
  }

  async sendMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);

    this.user = null;
    this.session = null;
    this.updateUI();
  }

  isAuthenticated() {
    return !!this.user;
  }

  updateUI() {
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userEmail = document.getElementById('user-email');

    if (this.user) {
      loggedOutView.style.display = 'none';
      loggedInView.style.display = 'block';
      if (userEmail) {
        userEmail.textContent = this.user.email;
      }
    } else {
      loggedOutView.style.display = 'block';
      loggedInView.style.display = 'none';
    }
  }
}

// Global instance
const auth = new SupabaseAuth();
```

**Step 2: Update auth UI in index.html**

Replace the auth-container div (around line 16):

```html
<div id="auth-container" style="background: var(--bg-secondary); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center; border: 1px solid var(--border);">
    <div id="logged-out-view">
        <p style="color: var(--text-primary); margin-bottom: 12px;">Login to collaborate on this trip!</p>
        <input type="email" id="email-input" placeholder="Enter your email"
               style="padding: 12px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-tertiary); color: var(--text-primary); width: 300px; margin-right: 10px;">
        <button onclick="handleLogin()" class="nav-btn" style="padding: 12px 24px;">Send Magic Link</button>
        <p id="auth-message" style="margin-top: 10px; font-size: 0.9em; color: var(--text-secondary);"></p>
    </div>
    <div id="logged-in-view" style="display: none;">
        <span id="user-email" style="color: var(--text-primary); margin-right: 20px;"></span>
        <button onclick="handleLogout()" class="nav-btn" style="background: linear-gradient(135deg, #ff6b9d, #ff8fab);">Logout</button>
        <button onclick="saveData()" class="nav-btn" style="margin-left: 10px; background: linear-gradient(135deg, #00d4ff, #00e5ff);">Save Changes</button>
    </div>
</div>
```

**Step 3: Update auth handlers at bottom of index.html**

Find the `handleLogin()` and `handleLogout()` functions (around line 684) and replace:

```javascript
async function handleLogin() {
    const emailInput = document.getElementById('email-input');
    const authMessage = document.getElementById('auth-message');
    const email = emailInput.value.trim();

    if (!email) {
        authMessage.textContent = '⚠️ Please enter your email';
        authMessage.style.color = 'var(--accent-secondary)';
        return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        authMessage.textContent = '⚠️ Please enter a valid email';
        authMessage.style.color = 'var(--accent-secondary)';
        return;
    }

    try {
        await auth.sendMagicLink(email);
        authMessage.textContent = '✅ Check your email for the magic link!';
        authMessage.style.color = 'var(--accent-primary)';
        emailInput.value = '';
    } catch (error) {
        authMessage.textContent = `❌ Error: ${error.message}`;
        authMessage.style.color = 'var(--accent-secondary)';
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
    } catch (error) {
        alert(`Error logging out: ${error.message}`);
    }
}
```

**Step 4: Initialize auth on page load**

In the `DOMContentLoaded` event listener at the bottom of index.html, add:

```javascript
// Initialize auth
auth.init();
```

**Step 5: Test authentication flow**

1. Start local server: `python3 -m http.server 8080`
2. Open http://localhost:8080
3. Enter your email
4. Click "Send Magic Link"
5. Check email and click link
6. Verify you're logged in
7. Test logout

**Step 6: Commit**

```bash
git add auth.js index.html
git commit -m "feat: implement Supabase magic link authentication"
```

---

## Task 3: Migrate Data Layer to Supabase

**Files:**
- Create: `supabase-data.js`
- Modify: `index.html` (replace data-manager.js with supabase-data.js)
- Delete: `data-manager.js` (after migration complete)

**Step 1: Create Supabase data manager**

Create `supabase-data.js`:

```javascript
// supabase-data.js - Supabase Data Manager
class SupabaseDataManager {
  constructor() {
    this.data = null;
    this.subscription = null;
  }

  async load() {
    // Fetch trip data
    const { data, error } = await supabase
      .from('trip_data')
      .select('*')
      .eq('id', TRIP_DATA_ID)
      .single();

    if (error) {
      console.error('Error loading data:', error);
      // Initialize with empty data if doesn't exist
      this.data = {
        favorites: [],
        comments: [],
        itinerary: {},
        budget: { hotels: [], food: [], transport: [], activities: [], shopping: [] },
        photos: []
      };
    } else {
      this.data = data;
    }

    return this.data;
  }

  async save(commitMessage = 'Update trip data') {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be logged in to save changes');
    }

    const { error } = await supabase
      .from('trip_data')
      .update({
        favorites: this.data.favorites,
        comments: this.data.comments,
        itinerary: this.data.itinerary,
        budget: this.data.budget,
        photos: this.data.photos,
        updated_at: new Date().toISOString(),
        updated_by: auth.user.id
      })
      .eq('id', TRIP_DATA_ID);

    if (error) {
      console.error('Error saving data:', error);
      throw new Error(error.message);
    }

    return true;
  }

  subscribeToChanges(callback) {
    this.subscription = supabase
      .channel('trip_data_changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trip_data' },
        (payload) => {
          console.log('Data updated by another user:', payload);
          this.data = payload.new;
          callback(payload.new);
        }
      )
      .subscribe();
  }

  unsubscribe() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
  }

  // Helper methods (keep same interface as old data-manager)
  toggleFavorite(locationId) {
    const index = this.data.favorites.indexOf(locationId);
    if (index > -1) {
      this.data.favorites.splice(index, 1);
    } else {
      this.data.favorites.push(locationId);
    }
  }

  addComment(locationId, text, userName) {
    this.data.comments.push({
      id: Date.now(),
      locationId,
      text,
      userName,
      timestamp: new Date().toISOString()
    });
  }

  isFavorited(locationId) {
    return this.data.favorites.includes(locationId);
  }

  getCommentsForLocation(locationId) {
    return this.data.comments.filter(c => c.locationId === locationId);
  }
}

// Global instance
const dataManager = new SupabaseDataManager();
```

**Step 2: Update index.html to use new data manager**

Replace the script reference (around line 677):

```html
<!-- Old: <script src="data-manager.js"></script> -->
<script src="supabase-client.js"></script>
<script src="supabase-data.js"></script>
```

**Step 3: Initialize data on page load**

In the `DOMContentLoaded` event at bottom of index.html, add:

```javascript
// Initialize data
auth.init().then(async () => {
    if (auth.isAuthenticated()) {
        await dataManager.load();

        // Subscribe to real-time changes
        dataManager.subscribeToChanges((newData) => {
            console.log('Data synced from another user');
            // Refresh UI with new data
            location.reload(); // Simple approach for now
        });
    }
});
```

**Step 4: Update saveData() function**

Replace the `saveData()` function:

```javascript
async function saveData() {
    if (!auth.isAuthenticated()) {
        alert('Please log in to save changes');
        return;
    }

    try {
        await dataManager.save();
        alert('✅ Changes saved successfully!');
    } catch (error) {
        alert(`❌ Error saving: ${error.message}`);
    }
}
```

**Step 5: Test data operations**

1. Login with magic link
2. Add a favorite location
3. Click "Save Changes"
4. Refresh page - verify favorite persists
5. Open in another browser/incognito
6. Login with different email
7. Verify you see the same favorites

**Step 6: Commit**

```bash
git add supabase-data.js index.html
git commit -m "feat: migrate data layer to Supabase with real-time sync"
```

**Step 7: Remove old GitHub dependencies**

```bash
git rm data-manager.js
git add index.html  # Remove octokit script tag
git commit -m "chore: remove GitHub API dependencies"
```

---

## Task 4: Implement Split-Screen Layout

**Files:**
- Modify: `styles.css`
- Modify: `index.html`

**Step 1: Add CSS Grid layout for split-screen**

In `styles.css`, add after the `.container` rule (around line 27):

```css
/* Split-screen layout */
.main-layout {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: 24px;
    align-items: start;
}

.content-panel {
    overflow-y: visible;
}

.map-panel {
    position: sticky;
    top: 20px;
    height: calc(100vh - 120px);
    background: var(--bg-secondary);
    border-radius: 16px;
    border: 1px solid var(--border);
    padding: 20px;
    box-shadow: 0 8px 32px var(--shadow);
}

.map-container {
    height: calc(100% - 60px);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--border);
}

.map-header {
    margin-bottom: 16px;
}

.map-title {
    color: var(--accent-primary);
    font-size: 1.3em;
    font-weight: 600;
    margin: 0 0 8px 0;
}

.map-subtitle {
    color: var(--text-secondary);
    font-size: 0.9em;
    margin: 0;
}

/* Responsive: stack on mobile */
@media (max-width: 1024px) {
    .main-layout {
        grid-template-columns: 1fr;
    }

    .map-panel {
        position: relative;
        top: 0;
        height: 500px;
        order: -1; /* Map appears above content on mobile */
    }
}
```

**Step 2: Restructure HTML for split-screen**

In `index.html`, after the nav closing tag (around line 42), wrap content sections:

```html
</nav>

<div class="main-layout">
    <!-- LEFT: Content Panel -->
    <div class="content-panel">
        <!-- All existing content sections go here -->
        <!-- GENERAL TIPS -->
        <section id="tips" class="content-section active">
        ...
        </section>

        <!-- TRAINS -->
        <section id="trains" class="content-section">
        ...
        </section>

        <!-- All other sections... -->
    </div>

    <!-- RIGHT: Map Panel (sticky) -->
    <div class="map-panel">
        <div class="map-header">
            <h3 class="map-title" id="map-title">Japan Overview</h3>
            <p class="map-subtitle" id="map-subtitle">Select a city to view locations</p>
        </div>
        <div id="main-map" class="map-container"></div>
    </div>
</div>
```

**Step 3: Update showSection() function to not affect map**

In the `showSection()` function (around line 660), keep existing logic:

```javascript
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update map for city sections
    updateMapForSection(sectionId);
}
```

**Step 4: Test layout**

1. Start server: `python3 -m http.server 8080`
2. Open http://localhost:8080
3. Verify split-screen layout appears
4. Scroll content - map should stay fixed
5. Resize window - verify responsive behavior
6. Test on mobile width (< 1024px) - should stack

**Step 5: Commit**

```bash
git add styles.css index.html
git commit -m "feat: implement split-screen layout with sticky map panel"
```

---

## Task 5: Update Map to Display Current City

**Files:**
- Modify: `maps.js`
- Modify: `index.html` (add updateMapForSection function)

**Step 1: Refactor maps.js for single map instance**

Replace the `initializeMaps()` function in `maps.js`:

```javascript
// Global map instance
let mainMapInstance = null;
let currentCityMarkers = [];

// Initialize single map instance
function initializeMainMap() {
    if (mainMapInstance) {
        return; // Already initialized
    }

    const mapElement = document.getElementById('main-map');
    if (!mapElement) {
        console.error('Map container not found');
        return;
    }

    // Create map centered on Japan
    mainMapInstance = L.map('main-map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([36.2048, 138.2529], 6); // Center of Japan

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mainMapInstance);

    // Error handling
    mainMapInstance.on('tileerror', function(error) {
        console.warn('Tile loading error:', error);
    });
}

// Update map to show specific city
function updateMapForCity(cityKey) {
    if (!mainMapInstance) {
        initializeMainMap();
    }

    const locations = cityLocations[cityKey];
    if (!locations) {
        console.warn('No locations for city:', cityKey);
        return;
    }

    // Clear existing markers
    currentCityMarkers.forEach(marker => marker.remove());
    currentCityMarkers = [];

    // Calculate center
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    // Fly to city with animation
    mainMapInstance.flyTo([avgLat, avgLng], 13, {
        duration: 1.5,
        easeLinearity: 0.25
    });

    // Add markers after animation
    setTimeout(() => {
        locations.forEach((loc, index) => {
            const marker = L.marker([loc.lat, loc.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background: var(--accent-secondary); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${index + 1}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
            }).addTo(mainMapInstance);

            // Click opens Google Maps
            marker.on('click', () => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
            });

            // Hover shows tooltip
            marker.bindTooltip(loc.name, {
                permanent: false,
                direction: 'top'
            });

            currentCityMarkers.push(marker);
        });

        // Fit bounds to show all markers
        const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
        mainMapInstance.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 14
        });
    }, 800);
}
```

**Step 2: Remove old map initialization code**

Delete the old `initializeMaps()`, `createCityMap()`, and `createCityMapHTML()` functions.

**Step 3: Add map update function to index.html**

In `index.html`, add this function before the closing `</script>` tag:

```javascript
function updateMapForSection(sectionId) {
    const cityMap = {
        'tokyo': 'tokyo',
        'kyoto': 'kyoto',
        'osaka': 'osaka',
        'kinosaki': 'kinosaki',
        'kanazawa': 'kanazawa'
    };

    const mapTitle = document.getElementById('map-title');
    const mapSubtitle = document.getElementById('map-subtitle');

    if (cityMap[sectionId]) {
        const cityName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        mapTitle.textContent = `${cityName} Locations`;

        const locations = cityLocations[sectionId];
        mapSubtitle.textContent = `${locations.length} places to visit`;

        updateMapForCity(sectionId);
    } else {
        // Non-city sections
        mapTitle.textContent = 'Japan Overview';
        mapSubtitle.textContent = 'Select a city to view locations';

        // Reset to Japan overview
        if (mainMapInstance) {
            mainMapInstance.flyTo([36.2048, 138.2529], 6);
            currentCityMarkers.forEach(marker => marker.remove());
            currentCityMarkers = [];
        }
    }
}
```

**Step 4: Initialize map on page load**

In the `DOMContentLoaded` event listener:

```javascript
// Initialize main map
initializeMainMap();
```

**Step 5: Remove old individual city maps from HTML**

Delete all the old map container divs in each city section (the ones with `style="background: #f8f9ff..."`).

**Step 6: Test map updates**

1. Start server
2. Click "Tokyo" tab - map should fly to Tokyo with pins
3. Click "Kyoto" tab - map should animate to Kyoto
4. Click "General Tips" - map should reset to Japan overview
5. Click pins - should open Google Maps in new tab
6. Hover pins - should show location names

**Step 7: Commit**

```bash
git add maps.js index.html
git commit -m "feat: implement single map instance with city-based updates"
```

---

## Task 6: Add Location Card Hover Effects

**Files:**
- Modify: `index.html` (add data attributes to location cards)
- Modify: `styles.css` (hover styles)
- Create: `map-interactions.js`

**Step 1: Add data attributes to location cards**

In `index.html`, update location cards to include `data-location-index`:

For example, in Tokyo section:

```html
<div class="location-card" data-location-index="0" onmouseover="highlightMapPin(0, 'tokyo')" onmouseout="unhighlightMapPin()">
    <strong><span class="location-number">1</span> Shinjuku</strong>
    Great area to stay. Love walking around and seeing all the lit-up streets.
</div>

<div class="location-card" data-location-index="1" onmouseover="highlightMapPin(1, 'tokyo')" onmouseout="unhighlightMapPin()">
    <strong><span class="location-number">2</span> Imperial Palace & Gardens</strong>
    Lots of history, very pretty. Must visit.
</div>
```

**Step 2: Add CSS for location number badges**

In `styles.css`:

```css
.location-number {
    display: inline-block;
    background: var(--accent-secondary);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
    font-size: 0.85em;
    font-weight: bold;
    margin-right: 8px;
    vertical-align: middle;
}

.location-card:hover {
    border-left-color: var(--accent-primary);
    box-shadow: 0 4px 20px rgba(0, 212, 255, 0.3);
    cursor: pointer;
}

.location-card:hover .location-number {
    background: var(--accent-primary);
    transform: scale(1.1);
    transition: all 0.2s ease;
}
```

**Step 3: Create map interaction functions**

Create `map-interactions.js`:

```javascript
// map-interactions.js - Location card <-> Map pin interactions

let highlightedMarker = null;

function highlightMapPin(locationIndex, cityKey) {
    if (!currentCityMarkers[locationIndex]) return;

    const marker = currentCityMarkers[locationIndex];

    // Store original icon
    if (!marker._originalIcon) {
        marker._originalIcon = marker.getIcon();
    }

    // Create highlighted icon
    const highlightedIcon = L.divIcon({
        className: 'custom-marker highlighted',
        html: `<div style="background: var(--accent-primary); width: 38px; height: 38px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; animation: pulse 1s infinite;">${locationIndex + 1}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    marker.setIcon(highlightedIcon);
    highlightedMarker = marker;

    // Optionally pan to marker
    mainMapInstance.panTo(marker.getLatLng(), {
        animate: true,
        duration: 0.5
    });
}

function unhighlightMapPin() {
    if (highlightedMarker && highlightedMarker._originalIcon) {
        highlightedMarker.setIcon(highlightedMarker._originalIcon);
        highlightedMarker = null;
    }
}
```

**Step 4: Add pulse animation to styles.css**

```css
@keyframes pulse {
    0% {
        box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6);
    }
    50% {
        box-shadow: 0 4px 24px rgba(0, 212, 255, 0.9);
    }
    100% {
        box-shadow: 0 4px 16px rgba(0, 212, 255, 0.6);
    }
}
```

**Step 5: Include map-interactions.js in index.html**

```html
<script src="map-interactions.js"></script>
```

**Step 6: Test hover interactions**

1. Open Tokyo section
2. Hover over a location card
3. Verify corresponding pin on map highlights and pulses
4. Verify map pans slightly to show the pin
5. Move mouse away - pin returns to normal
6. Test with multiple locations

**Step 7: Commit**

```bash
git add map-interactions.js styles.css index.html
git commit -m "feat: add location card hover effects with map pin highlighting"
```

---

## Task 7: Set Vercel Environment Variables

**Files:**
- None (Vercel dashboard configuration)
- Modify: `supabase-client.js` (use env vars)
- Modify: `config.js`

**Step 1: Update config.js to use environment variables**

```javascript
// config.js
const CONFIG = {
  vercel: {
    url: window.location.origin
  },
  supabase: {
    // These will be replaced by Vercel at build time
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key'
  }
};
```

**Note:** For static sites on Vercel, environment variables need to be injected via a build script or referenced directly. Since this is a static site with no build step, we'll use a different approach.

**Step 2: Create a template approach**

Actually, for pure static sites, create `config.template.js`:

```javascript
// config.js - Update these values in Vercel environment variables
const CONFIG = {
  vercel: {
    url: 'https://japan-cyan.vercel.app'
  },
  supabase: {
    url: '%%SUPABASE_URL%%',  // Will be replaced by Vercel
    anonKey: '%%SUPABASE_ANON_KEY%%'  // Will be replaced by Vercel
  }
};
```

**Alternative (Simpler): Just use the values directly**

Since Supabase anon key is safe to expose (it's public), just hardcode them:

```javascript
// config.js
const CONFIG = {
  vercel: {
    url: 'https://japan-cyan.vercel.app'
  },
  supabase: {
    url: 'https://your-project-ref.supabase.co',
    anonKey: 'your-actual-anon-key-here'
  }
};
```

**Step 3: Update supabase-client.js to use CONFIG**

```javascript
// supabase-client.js
const supabase = window.supabase.createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.anonKey
);

const TRIP_DATA_ID = '00000000-0000-0000-0000-000000000001';
```

**Step 4: Commit**

```bash
git add config.js supabase-client.js
git commit -m "feat: configure Supabase credentials for production"
```

**Step 5: Deploy to Vercel**

```bash
git push origin main
```

Vercel will auto-deploy. Visit https://japan-cyan.vercel.app to test.

---

## Task 8: Final Testing & Cleanup

**Files:**
- Update: `README.md`
- Update: `GETTING_STARTED.md`
- Delete: Old unused files

**Step 1: Update README.md**

Update `README.md` with new architecture:

```markdown
# Japan Travel Planner

A collaborative travel planning app with split-screen map interface.

## Features

- 🗺️ **Split-screen layout**: Content on left, interactive map on right
- 🔐 **Magic link authentication**: Email-based passwordless login
- 🤝 **Real-time collaboration**: Changes sync instantly via Supabase
- 📍 **Interactive maps**: Click locations to view on Google Maps
- ⭐ **Favorites & notes**: Save and share your must-visit spots
- 📅 **Itinerary builder**: Plan your daily activities
- 💰 **Budget tracker**: Track shared expenses

## Tech Stack

- Frontend: HTML/CSS/JavaScript
- Maps: Leaflet.js with CartoDB Dark Matter tiles
- Backend: Supabase (auth + database + realtime)
- Hosting: Vercel

## Local Development

1. Clone the repo
2. Update `config.js` with your Supabase credentials
3. Run: `python3 -m http.server 8080`
4. Open: http://localhost:8080

## Authentication

Uses Supabase magic link authentication. Enter your email to receive a login link.

## Database Schema

See `docs/plans/2025-10-18-split-screen-map-redesign.md` for full schema.

## Deployment

Automatic deployment via Vercel on push to main branch.

**Live URL:** https://japan-cyan.vercel.app
```

**Step 2: Update GETTING_STARTED.md**

Replace with new instructions:

```markdown
# 🚀 Getting Started with Japan Travel Planner

## ✅ Your App is LIVE!

**Live URL:** https://japan-cyan.vercel.app

## 🔐 How to Login

### Step 1: Visit the App

1. Go to: https://japan-cyan.vercel.app
2. Enter your email address
3. Click "Send Magic Link"
4. Check your email (including spam folder)
5. Click the magic link
6. You're in! 🎉

### Step 2: Start Planning

Now you can:
- ⭐ **Favorite locations** - Click the star icon
- 💬 **Add notes** - Click "Add Note" on any location
- 📅 **Build itinerary** - Plan daily activities
- 💰 **Track budget** - Add shared expenses
- 📷 **View on map** - Hover over locations to see them highlighted
- 💾 **Save changes** - Click "Save Changes" when done

**Important:** Changes sync in real-time. Your friend will see updates immediately!

## 👥 Adding Your Friend

### Step 3: Share the Link

Just send them: https://japan-cyan.vercel.app

They can:
1. Enter their email
2. Receive magic link
3. Login and start collaborating!

## 🗺️ Using the Map

**Split-Screen Interface:**
- Left side: Scrollable content with location details
- Right side: Interactive map (stays visible as you scroll)

**Map Interactions:**
- Click a city tab → Map zooms to that city
- Hover over a location → Pin highlights on map
- Click a pin → Opens in Google Maps
- Numbered pins match location order

## 📱 Mobile Usage

Works great on phones! Map appears above content on mobile.

## 🐛 Troubleshooting

**Q: Didn't receive magic link**
A: Check spam folder. Try resending.

**Q: Changes not syncing**
A: Refresh the page. Make sure you're logged in.

**Q: Map not loading**
A: Check internet connection. Try hard refresh (Cmd+Shift+R).

## 🎉 You're Ready!

Start planning your amazing trip to Japan! 🇯🇵✨

---

**Need help?** Check the README.md for technical details.
```

**Step 3: Delete unused files**

```bash
# Remove old GitHub-based files
rm data-manager.js

# Keep these for reference but they're no longer used:
# - auth.js (replaced but keeping old version)
```

**Step 4: Full end-to-end test**

Test checklist:
- [ ] Login with magic link works
- [ ] Logout works
- [ ] Click Tokyo tab → map flies to Tokyo
- [ ] Click Kyoto tab → map flies to Kyoto
- [ ] Hover location card → pin highlights
- [ ] Click pin → opens Google Maps
- [ ] Add favorite → saves to Supabase
- [ ] Refresh page → favorite persists
- [ ] Open in incognito → login with different email → see same favorites
- [ ] Make change in one browser → see it sync to other browser
- [ ] Test on mobile viewport (< 1024px) → map stacks above content
- [ ] Search box filters locations

**Step 5: Commit final changes**

```bash
git add README.md GETTING_STARTED.md
git commit -m "docs: update documentation for split-screen redesign"
```

**Step 6: Push to production**

```bash
git push origin main
```

**Step 7: Verify production deployment**

1. Visit https://japan-cyan.vercel.app
2. Run through full test checklist
3. Share with friend to test collaboration

---

## Implementation Complete! 🎉

**Summary of Changes:**

1. ✅ Supabase authentication with magic links
2. ✅ Real-time collaborative data storage
3. ✅ Split-screen layout (60/40)
4. ✅ Sticky map panel on right
5. ✅ City-specific map views
6. ✅ Location card hover → pin highlight
7. ✅ Click pins → Google Maps
8. ✅ Mobile responsive design
9. ✅ Updated documentation

**Architecture:**
- GitHub removed, now pure Supabase backend
- Single map instance with city-based updates
- Real-time sync via Supabase Realtime
- Passwordless authentication

**Next Steps (Optional):**
- Add user profiles/avatars
- Implement undo/redo for edits
- Add photo upload to Supabase Storage
- Create printable PDF export
- Add offline support with service workers
