# Collaborative Japan Travel App Implementation Plan

> **For Claude:** Use `${SUPERPOWERS_SKILLS_ROOT}/skills/collaboration/executing-plans/SKILL.md` to implement this plan task-by-task.

**Goal:** Transform static Japan travel guide into collaborative planning app with favorites, comments, itinerary builder, and budget tracker using GitHub as backend and Vercel for hosting.

**Architecture:** Static HTML/CSS/JavaScript frontend using GitHub API to read/write data.json file for collaborative data storage. GitHub OAuth for authentication. Vercel auto-deploys on every commit. No traditional backend server needed.

**Tech Stack:** Vanilla JavaScript (ES6+), GitHub REST API, Octokit.js library, Vercel static hosting, existing HTML/CSS from itinerary.html

---

## Task 1: Initialize Git Repository and Project Structure

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `data.json`
- Create: `images/.gitkeep`
- Rename: `itinerary.html` → `index.html`

**Step 1: Initialize git repository**

Run: `git init`
Expected: "Initialized empty Git repository"

**Step 2: Create .gitignore file**

```
# .gitignore
node_modules/
.DS_Store
.env
.vercel
*.log
```

**Step 3: Create README.md with setup instructions**

```markdown
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
```

**Step 4: Rename itinerary.html to index.html**

Run: `mv itinerary.html index.html`
Expected: File renamed successfully

**Step 5: Create initial data.json structure**

```json
{
  "version": "1.0",
  "lastUpdated": null,
  "users": {},
  "favorites": {},
  "comments": [],
  "itinerary": {},
  "budget": {
    "hotels": [],
    "food": [],
    "transport": [],
    "activities": [],
    "shopping": []
  },
  "photos": []
}
```

**Step 6: Create images directory with .gitkeep**

Run: `mkdir -p images && touch images/.gitkeep`
Expected: Directory and file created

**Step 7: Initial commit**

```bash
git add .
git commit -m "Initial commit: Project structure and base HTML"
```

Expected: Files committed successfully

---

## Task 2: Extract CSS to Separate File

**Files:**
- Create: `styles.css`
- Modify: `index.html` (remove inline styles, add link to stylesheet)

**Step 1: Create styles.css file**

Extract all CSS from the `<style>` tag in `index.html` (lines 7-222) and save to `styles.css`

**Step 2: Update index.html to link external stylesheet**

Replace the `<style>...</style>` block with:

```html
<link rel="stylesheet" href="styles.css">
```

**Step 3: Test that styles still work**

Run: Open `index.html` in browser
Expected: Page looks identical to before

**Step 4: Commit**

```bash
git add styles.css index.html
git commit -m "refactor: Extract CSS to separate file"
```

---

## Task 3: Add GitHub OAuth Configuration and Octokit Library

**Files:**
- Create: `config.js`
- Create: `lib/octokit.min.js` (downloaded from CDN)
- Modify: `index.html` (add script tags)

**Step 1: Create config.js for GitHub settings**

```javascript
// config.js
const CONFIG = {
  github: {
    owner: 'YOUR_GITHUB_USERNAME', // Update this
    repo: 'japan-travel-planner',
    branch: 'main',
    dataFile: 'data.json',
    clientId: 'YOUR_GITHUB_OAUTH_CLIENT_ID' // Will be set up later
  },
  vercel: {
    url: 'https://japan-travel.vercel.app' // Update after deployment
  }
};
```

**Step 2: Add Octokit.js library via CDN**

Add to `index.html` before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@octokit/rest@19.0.11/dist/octokit.min.js"></script>
<script src="config.js"></script>
<script src="app.js"></script>
```

**Step 3: Commit**

```bash
git add config.js index.html
git commit -m "feat: Add GitHub OAuth config and Octokit library"
```

---

## Task 4: Create Authentication System

**Files:**
- Create: `auth.js`
- Modify: `index.html` (add login UI)

**Step 1: Create auth.js with GitHub OAuth flow**

```javascript
// auth.js
class GitHubAuth {
  constructor() {
    this.token = localStorage.getItem('github_token');
    this.user = JSON.parse(localStorage.getItem('github_user') || 'null');
  }

  isAuthenticated() {
    return !!this.token;
  }

  async login() {
    // For now, use Personal Access Token approach (simpler than OAuth)
    // User will manually create a token with repo permissions
    const token = prompt('Enter your GitHub Personal Access Token:\n\n' +
      '1. Go to: https://github.com/settings/tokens/new\n' +
      '2. Give it a name: "Japan Travel App"\n' +
      '3. Select scope: "repo" (full control)\n' +
      '4. Click "Generate token"\n' +
      '5. Copy and paste the token here:');

    if (!token) return false;

    try {
      // Test the token by fetching user info
      const octokit = new Octokit({ auth: token });
      const { data: user } = await octokit.rest.users.getAuthenticated();

      this.token = token;
      this.user = {
        login: user.login,
        name: user.name || user.login,
        email: user.email || `${user.login}@github.com`,
        avatar: user.avatar_url
      };

      localStorage.setItem('github_token', token);
      localStorage.setItem('github_user', JSON.stringify(this.user));

      return true;
    } catch (error) {
      alert('Invalid token. Please try again.');
      return false;
    }
  }

  logout() {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    this.token = null;
    this.user = null;
    window.location.reload();
  }

  getOctokit() {
    if (!this.token) throw new Error('Not authenticated');
    return new Octokit({ auth: this.token });
  }
}

// Global auth instance
const auth = new GitHubAuth();
```

**Step 2: Add login UI to index.html**

Add after the `<header>` section (before nav):

```html
<div id="auth-container" style="background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div id="logged-out-view">
    <p>Login to collaborate on this trip!</p>
    <button onclick="handleLogin()" class="nav-btn">Login with GitHub</button>
  </div>
  <div id="logged-in-view" style="display: none;">
    <img id="user-avatar" src="" alt="" style="width: 40px; height: 40px; border-radius: 50%; vertical-align: middle; margin-right: 10px;">
    <span id="user-name"></span>
    <button onclick="handleLogout()" class="nav-btn" style="margin-left: 20px; background: #f5576c;">Logout</button>
    <button onclick="saveData()" class="nav-btn" style="margin-left: 10px; background: #4CAF50;">Save Changes</button>
  </div>
</div>
```

**Step 3: Add auth handlers to index.html script section**

Add before `</body>`:

```html
<script src="auth.js"></script>
<script>
  async function handleLogin() {
    const success = await auth.login();
    if (success) {
      updateAuthUI();
      await loadData();
    }
  }

  function handleLogout() {
    auth.logout();
  }

  function updateAuthUI() {
    const loggedIn = auth.isAuthenticated();
    document.getElementById('logged-out-view').style.display = loggedIn ? 'none' : 'block';
    document.getElementById('logged-in-view').style.display = loggedIn ? 'block' : 'none';

    if (loggedIn) {
      document.getElementById('user-avatar').src = auth.user.avatar;
      document.getElementById('user-name').textContent = auth.user.name;
    }
  }

  // Initialize on page load
  window.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    if (auth.isAuthenticated()) {
      loadData();
    }
  });
</script>
```

**Step 4: Test authentication flow**

Run: Open index.html in browser
Expected: See login button, click it to test (won't work until GitHub token is created)

**Step 5: Commit**

```bash
git add auth.js index.html
git commit -m "feat: Add GitHub authentication system"
```

---

## Task 5: Create Data Layer (Read/Write to GitHub)

**Files:**
- Create: `data-manager.js`

**Step 1: Create data-manager.js with read/write functions**

```javascript
// data-manager.js
class DataManager {
  constructor() {
    this.data = null;
    this.currentSHA = null;
  }

  async load() {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be authenticated to load data');
    }

    const octokit = auth.getOctokit();

    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner: CONFIG.github.owner,
        repo: CONFIG.github.repo,
        path: CONFIG.github.dataFile,
        ref: CONFIG.github.branch
      });

      this.currentSHA = fileData.sha;
      const content = atob(fileData.content);
      this.data = JSON.parse(content);

      // Add current user if not exists
      if (!this.data.users[auth.user.email]) {
        this.data.users[auth.user.email] = {
          name: auth.user.name,
          avatar: auth.user.avatar
        };
      }

      // Initialize user favorites if not exists
      if (!this.data.favorites[auth.user.email]) {
        this.data.favorites[auth.user.email] = [];
      }

      return this.data;
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  async save(commitMessage = 'Update travel plans') {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be authenticated to save data');
    }

    if (!this.data) {
      throw new Error('No data to save');
    }

    const octokit = auth.getOctokit();

    // Update timestamp
    this.data.lastUpdated = new Date().toISOString();

    // Encode content
    const content = btoa(JSON.stringify(this.data, null, 2));

    try {
      const { data: result } = await octokit.rest.repos.createOrUpdateFileContents({
        owner: CONFIG.github.owner,
        repo: CONFIG.github.repo,
        path: CONFIG.github.dataFile,
        message: `${commitMessage} - by ${auth.user.name}`,
        content: content,
        sha: this.currentSHA,
        branch: CONFIG.github.branch
      });

      this.currentSHA = result.content.sha;

      return true;
    } catch (error) {
      if (error.status === 409) {
        alert('Someone else made changes. Please refresh the page and try again.');
      } else {
        console.error('Error saving data:', error);
        alert('Failed to save changes: ' + error.message);
      }
      return false;
    }
  }

  // Helper methods
  toggleFavorite(locationId) {
    const userEmail = auth.user.email;
    const favorites = this.data.favorites[userEmail];
    const index = favorites.indexOf(locationId);

    if (index === -1) {
      favorites.push(locationId);
    } else {
      favorites.splice(index, 1);
    }
  }

  isFavorited(locationId, userEmail = auth.user.email) {
    return this.data.favorites[userEmail]?.includes(locationId) || false;
  }

  addComment(locationId, text) {
    const comment = {
      id: 'c' + Date.now(),
      locationId: locationId,
      user: auth.user.email,
      userName: auth.user.name,
      text: text,
      timestamp: new Date().toISOString(),
      replies: []
    };

    this.data.comments.push(comment);
    return comment;
  }

  getCommentsForLocation(locationId) {
    return this.data.comments.filter(c => c.locationId === locationId);
  }

  addBudgetItem(category, item) {
    this.data.budget[category].push({
      ...item,
      addedBy: auth.user.email,
      timestamp: new Date().toISOString()
    });
  }

  getTotalBudget() {
    let total = 0;
    for (const category in this.data.budget) {
      this.data.budget[category].forEach(item => {
        total += item.cost || item.estimatedCost || 0;
      });
    }
    return total;
  }
}

// Global data manager instance
const dataManager = new DataManager();
```

**Step 2: Add data loading to index.html**

Update the `loadData()` function:

```javascript
async function loadData() {
  try {
    await dataManager.load();
    console.log('Data loaded successfully:', dataManager.data);
    renderUI();
  } catch (error) {
    console.error('Failed to load data:', error);
    alert('Failed to load data. Make sure the repository exists and you have access.');
  }
}

async function saveData() {
  const success = await dataManager.save();
  if (success) {
    alert('Changes saved! The page will auto-update in ~15 seconds via Vercel.');
  }
}

function renderUI() {
  // Will implement in next task
  console.log('Rendering UI with data...');
}
```

**Step 3: Add script tag to index.html**

Add before auth.js:

```html
<script src="data-manager.js"></script>
```

**Step 4: Test data loading**

Run: Open index.html, login, check console
Expected: Should attempt to load data.json from GitHub

**Step 5: Commit**

```bash
git add data-manager.js index.html
git commit -m "feat: Add data layer for GitHub read/write operations"
```

---

## Task 6: Add Favorites/Voting UI to Location Cards

**Files:**
- Create: `ui-components.js`
- Modify: `index.html` (add favorite buttons to location cards)

**Step 1: Create ui-components.js with favorite button logic**

```javascript
// ui-components.js

function createFavoriteButton(locationId) {
  const isFavorited = dataManager.isFavorited(locationId);
  const button = document.createElement('button');
  button.className = 'favorite-btn';
  button.innerHTML = isFavorited ? '⭐' : '☆';
  button.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer; float: right;';
  button.title = isFavorited ? 'Unfavorite' : 'Favorite';

  button.onclick = (e) => {
    e.stopPropagation();
    if (!auth.isAuthenticated()) {
      alert('Please login to favorite locations');
      return;
    }

    dataManager.toggleFavorite(locationId);
    button.innerHTML = dataManager.isFavorited(locationId) ? '⭐' : '☆';
    updateUnsavedChangesIndicator();
  };

  return button;
}

function createCommentButton(locationId) {
  const button = document.createElement('button');
  button.textContent = '💬 Add Note';
  button.className = 'nav-btn';
  button.style.cssText = 'margin-top: 10px; padding: 8px 16px; font-size: 0.9em;';

  button.onclick = () => {
    if (!auth.isAuthenticated()) {
      alert('Please login to add comments');
      return;
    }

    const text = prompt('Enter your note:');
    if (text) {
      dataManager.addComment(locationId, text);
      renderCommentsForLocation(locationId);
      updateUnsavedChangesIndicator();
    }
  };

  return button;
}

function renderCommentsForLocation(locationId) {
  const container = document.getElementById(`comments-${locationId}`);
  if (!container) return;

  const comments = dataManager.getCommentsForLocation(locationId);
  container.innerHTML = '';

  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.style.cssText = 'background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 5px;';
    commentDiv.innerHTML = `
      <strong>${comment.userName}</strong>
      <small style="color: #666; margin-left: 10px;">${new Date(comment.timestamp).toLocaleDateString()}</small>
      <p style="margin: 5px 0 0 0;">${comment.text}</p>
    `;
    container.appendChild(commentDiv);
  });
}

function updateUnsavedChangesIndicator() {
  let indicator = document.getElementById('unsaved-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'unsaved-indicator';
    indicator.style.cssText = 'background: #fff3cd; padding: 10px; text-align: center; border-radius: 8px; margin-bottom: 20px;';
    indicator.innerHTML = '⚠️ You have unsaved changes. Click "Save Changes" to sync.';

    const authContainer = document.getElementById('auth-container');
    authContainer.parentNode.insertBefore(indicator, authContainer.nextSibling);
  }
}

function addInteractiveFeatures() {
  // Add favorite buttons to all location cards
  document.querySelectorAll('.location-card, .food-card, .hotel-card').forEach(card => {
    // Generate location ID from card content
    const titleElement = card.querySelector('strong, h4');
    if (!titleElement) return;

    const locationId = titleElement.textContent
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Add favorite button
    const favoriteBtn = createFavoriteButton(locationId);
    titleElement.appendChild(favoriteBtn);

    // Add comment button
    const commentBtn = createCommentButton(locationId);
    card.appendChild(commentBtn);

    // Add comments container
    const commentsDiv = document.createElement('div');
    commentsDiv.id = `comments-${locationId}`;
    commentsDiv.style.marginTop = '10px';
    card.appendChild(commentsDiv);

    // Render existing comments
    if (dataManager.data) {
      renderCommentsForLocation(locationId);
    }
  });
}
```

**Step 2: Update renderUI() to call addInteractiveFeatures()**

```javascript
function renderUI() {
  if (!dataManager.data) return;
  addInteractiveFeatures();
}
```

**Step 3: Add script tag to index.html**

Add before closing body:

```html
<script src="ui-components.js"></script>
```

**Step 4: Test favorite and comment features**

Run: Open index.html, login, click favorite buttons and add comments
Expected: Stars toggle, comments appear, unsaved changes indicator shows

**Step 5: Commit**

```bash
git add ui-components.js index.html
git commit -m "feat: Add favorites and comments UI to location cards"
```

---

## Task 7: Add Itinerary Builder

**Files:**
- Create: `itinerary.js`
- Modify: `index.html` (add itinerary section)

**Step 1: Create itinerary.js with day planner**

```javascript
// itinerary.js

function createItinerarySection() {
  const itinerarySection = document.createElement('section');
  itinerarySection.id = 'itinerary-planner';
  itinerarySection.className = 'content-section';
  itinerarySection.innerHTML = `
    <h2>📅 Trip Itinerary</h2>
    <div style="margin-bottom: 20px;">
      <label>Trip Start Date: <input type="date" id="trip-start-date" /></label>
      <label style="margin-left: 20px;">Number of Days: <input type="number" id="trip-days" value="14" min="1" max="30" /></label>
      <button onclick="generateItinerary()" class="nav-btn" style="margin-left: 20px;">Generate Days</button>
    </div>
    <div id="itinerary-days-container"></div>
  `;

  return itinerarySection;
}

function generateItinerary() {
  const startDate = document.getElementById('trip-start-date').value;
  if (!startDate) {
    alert('Please select a start date');
    return;
  }

  const numDays = parseInt(document.getElementById('trip-days').value);
  const container = document.getElementById('itinerary-days-container');
  container.innerHTML = '';

  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const dayCard = document.createElement('div');
    dayCard.className = 'tip-card';
    dayCard.style.marginBottom = '20px';
    dayCard.innerHTML = `
      <h3>Day ${i + 1} - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div>
          <strong>Morning</strong>
          <div id="day-${dateStr}-morning" class="itinerary-slot" style="min-height: 60px; background: #fff; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <button onclick="addToItinerary('${dateStr}', 'morning')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>
          </div>
        </div>
        <div>
          <strong>Afternoon</strong>
          <div id="day-${dateStr}-afternoon" class="itinerary-slot" style="min-height: 60px; background: #fff; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <button onclick="addToItinerary('${dateStr}', 'afternoon')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>
          </div>
        </div>
        <div>
          <strong>Evening</strong>
          <div id="day-${dateStr}-evening" class="itinerary-slot" style="min-height: 60px; background: #fff; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <button onclick="addToItinerary('${dateStr}', 'evening')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(dayCard);
  }

  // Render existing itinerary data
  renderExistingItinerary();
}

function addToItinerary(date, timeSlot) {
  if (!auth.isAuthenticated()) {
    alert('Please login to build your itinerary');
    return;
  }

  const activity = prompt('Enter activity/location name:');
  if (!activity) return;

  // Initialize date if not exists
  if (!dataManager.data.itinerary[date]) {
    dataManager.data.itinerary[date] = { morning: [], afternoon: [], evening: [] };
  }

  dataManager.data.itinerary[date][timeSlot].push(activity);
  renderItinerarySlot(date, timeSlot);
  updateUnsavedChangesIndicator();
}

function renderItinerarySlot(date, timeSlot) {
  const slotElement = document.getElementById(`day-${date}-${timeSlot}`);
  if (!slotElement) return;

  const activities = dataManager.data.itinerary[date]?.[timeSlot] || [];

  slotElement.innerHTML = `<button onclick="addToItinerary('${date}', '${timeSlot}')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>`;

  activities.forEach((activity, index) => {
    const activityDiv = document.createElement('div');
    activityDiv.style.cssText = 'background: #e3f2fd; padding: 8px; margin: 5px 0; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;';
    activityDiv.innerHTML = `
      <span>${activity}</span>
      <button onclick="removeFromItinerary('${date}', '${timeSlot}', ${index})" style="background: #f5576c; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">✕</button>
    `;
    slotElement.appendChild(activityDiv);
  });
}

function removeFromItinerary(date, timeSlot, index) {
  dataManager.data.itinerary[date][timeSlot].splice(index, 1);
  renderItinerarySlot(date, timeSlot);
  updateUnsavedChangesIndicator();
}

function renderExistingItinerary() {
  for (const date in dataManager.data.itinerary) {
    for (const timeSlot of ['morning', 'afternoon', 'evening']) {
      renderItinerarySlot(date, timeSlot);
    }
  }
}
```

**Step 2: Add itinerary section to index.html**

Add button to nav:

```html
<button class="nav-btn" onclick="showSection('itinerary-planner')">Itinerary</button>
```

Add script tag before closing body:

```html
<script src="itinerary.js"></script>
```

Add to DOMContentLoaded:

```javascript
window.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  if (auth.isAuthenticated()) {
    loadData();
  }

  // Add itinerary section
  const kanazawaSection = document.getElementById('kanazawa');
  const itinerarySection = createItinerarySection();
  kanazawaSection.parentNode.insertBefore(itinerarySection, kanazawaSection.nextSibling);
});
```

**Step 3: Test itinerary builder**

Run: Open index.html, click Itinerary tab, generate days, add activities
Expected: Can add/remove activities to day/time slots

**Step 4: Commit**

```bash
git add itinerary.js index.html
git commit -m "feat: Add itinerary builder with day/time planning"
```

---

## Task 8: Add Budget Tracker

**Files:**
- Create: `budget.js`
- Modify: `index.html` (add budget section)

**Step 1: Create budget.js with expense tracking**

```javascript
// budget.js

function createBudgetSection() {
  const budgetSection = document.createElement('section');
  budgetSection.id = 'budget-tracker';
  budgetSection.className = 'content-section';
  budgetSection.innerHTML = `
    <h2>💰 Budget Tracker</h2>

    <div class="tip-card" style="background: #e8f5e9;">
      <h3 style="margin: 0;">Total Budget: $<span id="total-budget">0</span></h3>
      <p style="margin: 5px 0 0 0;">Per Person: $<span id="per-person-budget">0</span></p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
      <div class="budget-category">
        <h3>🏨 Hotels</h3>
        <div id="budget-hotels"></div>
        <button onclick="addBudgetItem('hotels')" class="nav-btn" style="margin-top: 10px;">+ Add Hotel</button>
      </div>

      <div class="budget-category">
        <h3>🍜 Food</h3>
        <div id="budget-food"></div>
        <button onclick="addBudgetItem('food')" class="nav-btn" style="margin-top: 10px;">+ Add Meal</button>
      </div>

      <div class="budget-category">
        <h3>🚄 Transport</h3>
        <div id="budget-transport"></div>
        <button onclick="addBudgetItem('transport')" class="nav-btn" style="margin-top: 10px;">+ Add Transport</button>
      </div>

      <div class="budget-category">
        <h3>🎭 Activities</h3>
        <div id="budget-activities"></div>
        <button onclick="addBudgetItem('activities')" class="nav-btn" style="margin-top: 10px;">+ Add Activity</button>
      </div>

      <div class="budget-category">
        <h3>🛍️ Shopping</h3>
        <div id="budget-shopping"></div>
        <button onclick="addBudgetItem('shopping')" class="nav-btn" style="margin-top: 10px;">+ Add Shopping</button>
      </div>
    </div>
  `;

  return budgetSection;
}

function addBudgetItem(category) {
  if (!auth.isAuthenticated()) {
    alert('Please login to add budget items');
    return;
  }

  const name = prompt(`Enter ${category.slice(0, -1)} name:`);
  if (!name) return;

  const cost = parseFloat(prompt('Enter cost in USD:'));
  if (isNaN(cost)) return;

  let item = { name, cost };

  // Special fields for hotels
  if (category === 'hotels') {
    const nights = parseInt(prompt('Number of nights:'));
    if (!isNaN(nights)) {
      item.nights = nights;
      item.cost = cost * nights;
    }
  }

  dataManager.addBudgetItem(category, item);
  renderBudgetCategory(category);
  updateBudgetTotals();
  updateUnsavedChangesIndicator();
}

function renderBudgetCategory(category) {
  const container = document.getElementById(`budget-${category}`);
  if (!container) return;

  const items = dataManager.data.budget[category];
  container.innerHTML = '';

  items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.style.cssText = 'background: #f8f9ff; padding: 10px; margin: 5px 0; border-radius: 5px;';
    itemDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${item.name}</strong>
          ${item.nights ? `<br><small>${item.nights} nights</small>` : ''}
        </div>
        <div style="text-align: right;">
          <strong>$${item.cost || item.estimatedCost || 0}</strong>
          <button onclick="removeBudgetItem('${category}', ${index})" style="background: #f5576c; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em; margin-left: 10px;">✕</button>
        </div>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function removeBudgetItem(category, index) {
  dataManager.data.budget[category].splice(index, 1);
  renderBudgetCategory(category);
  updateBudgetTotals();
  updateUnsavedChangesIndicator();
}

function updateBudgetTotals() {
  const total = dataManager.getTotalBudget();
  document.getElementById('total-budget').textContent = total.toFixed(2);
  document.getElementById('per-person-budget').textContent = (total / 2).toFixed(2);
}

function renderAllBudgetCategories() {
  ['hotels', 'food', 'transport', 'activities', 'shopping'].forEach(category => {
    renderBudgetCategory(category);
  });
  updateBudgetTotals();
}
```

**Step 2: Add budget section to index.html**

Add button to nav:

```html
<button class="nav-btn" onclick="showSection('budget-tracker')">Budget</button>
```

Add script tag:

```html
<script src="budget.js"></script>
```

Update DOMContentLoaded:

```javascript
window.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  if (auth.isAuthenticated()) {
    loadData();
  }

  // Add itinerary section
  const kanazawaSection = document.getElementById('kanazawa');
  const itinerarySection = createItinerarySection();
  kanazawaSection.parentNode.insertBefore(itinerarySection, kanazawaSection.nextSibling);

  // Add budget section
  const budgetSection = createBudgetSection();
  itinerarySection.parentNode.insertBefore(budgetSection, itinerarySection.nextSibling);
});
```

Update renderUI():

```javascript
function renderUI() {
  if (!dataManager.data) return;
  addInteractiveFeatures();
  renderAllBudgetCategories();
}
```

**Step 3: Test budget tracker**

Run: Open index.html, click Budget tab, add expenses
Expected: Can add/remove budget items, see totals

**Step 4: Commit**

```bash
git add budget.js index.html
git commit -m "feat: Add budget tracker with category totals"
```

---

## Task 9: Add Photo Upload Feature

**Files:**
- Create: `photos.js`
- Modify: `ui-components.js` (add photo upload buttons)

**Step 1: Create photos.js with upload logic**

```javascript
// photos.js

async function uploadPhoto(locationId, file) {
  if (!auth.isAuthenticated()) {
    alert('Please login to upload photos');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Resize image if too large (max 500KB)
  const resizedImage = await resizeImage(file, 1200, 0.8);

  // Generate filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${locationId}-${timestamp}.${extension}`;

  try {
    // Convert to base64
    const base64 = await fileToBase64(resizedImage);

    // Upload to GitHub
    const octokit = auth.getOctokit();
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: CONFIG.github.owner,
      repo: CONFIG.github.repo,
      path: `images/${filename}`,
      message: `Add photo for ${locationId}`,
      content: base64,
      branch: CONFIG.github.branch
    });

    // Add to data.json
    const caption = prompt('Add a caption (optional):') || '';
    dataManager.data.photos.push({
      locationId,
      filename,
      uploadedBy: auth.user.email,
      userName: auth.user.name,
      caption,
      timestamp: new Date().toISOString()
    });

    // Render photo
    renderPhotosForLocation(locationId);
    updateUnsavedChangesIndicator();

    alert('Photo uploaded! Click Save Changes to update.');
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload photo: ' + error.message);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function createPhotoUploadButton(locationId) {
  const container = document.createElement('div');
  container.style.marginTop = '10px';

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.id = `photo-input-${locationId}`;
  input.onchange = (e) => {
    if (e.target.files[0]) {
      uploadPhoto(locationId, e.target.files[0]);
    }
  };

  const button = document.createElement('button');
  button.textContent = '📷 Add Photo';
  button.className = 'nav-btn';
  button.style.cssText = 'padding: 8px 16px; font-size: 0.9em;';
  button.onclick = () => input.click();

  container.appendChild(input);
  container.appendChild(button);

  return container;
}

function renderPhotosForLocation(locationId) {
  const container = document.getElementById(`photos-${locationId}`);
  if (!container) return;

  const photos = dataManager.data.photos.filter(p => p.locationId === locationId);
  container.innerHTML = '';

  if (photos.length === 0) return;

  const photosDiv = document.createElement('div');
  photosDiv.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;';

  photos.forEach(photo => {
    const photoCard = document.createElement('div');
    photoCard.style.cssText = 'position: relative; cursor: pointer;';

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/${CONFIG.github.owner}/${CONFIG.github.repo}/${CONFIG.github.branch}/images/${photo.filename}`;
    img.alt = photo.caption;
    img.style.cssText = 'width: 100%; height: 150px; object-fit: cover; border-radius: 5px;';
    img.onclick = () => {
      window.open(img.src, '_blank');
    };

    photoCard.appendChild(img);

    if (photo.caption) {
      const caption = document.createElement('div');
      caption.textContent = photo.caption;
      caption.style.cssText = 'font-size: 0.8em; margin-top: 5px; color: #666;';
      photoCard.appendChild(caption);
    }

    photosDiv.appendChild(photoCard);
  });

  container.appendChild(photosDiv);
}
```

**Step 2: Update ui-components.js to add photo buttons**

Add to `addInteractiveFeatures()` function:

```javascript
// Add photo upload button
const photoUploadBtn = createPhotoUploadButton(locationId);
card.appendChild(photoUploadBtn);

// Add photos container
const photosDiv = document.createElement('div');
photosDiv.id = `photos-${locationId}`;
card.appendChild(photosDiv);

// Render existing photos
if (dataManager.data) {
  renderPhotosForLocation(locationId);
}
```

**Step 3: Add script tag to index.html**

```html
<script src="photos.js"></script>
```

**Step 4: Update renderUI() to render photos**

```javascript
function renderUI() {
  if (!dataManager.data) return;
  addInteractiveFeatures();
  renderAllBudgetCategories();

  // Render all photos
  document.querySelectorAll('.location-card, .food-card, .hotel-card').forEach(card => {
    const titleElement = card.querySelector('strong, h4');
    if (!titleElement) return;

    const locationId = titleElement.textContent
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    renderPhotosForLocation(locationId);
  });
}
```

**Step 5: Test photo upload**

Run: Open index.html, select location, upload image
Expected: Image uploads to /images folder and displays

**Step 6: Commit**

```bash
git add photos.js ui-components.js index.html
git commit -m "feat: Add photo upload and gallery for locations"
```

---

## Task 10: Create GitHub Repository and Deploy to Vercel

**Files:**
- Modify: `config.js` (update with actual GitHub username)
- Create: `.env.example`
- Update: `README.md`

**Step 1: Update config.js with your GitHub username**

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username in `config.js`

**Step 2: Create .env.example for documentation**

```
# .env.example
# GitHub OAuth (will set up later if needed)
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

**Step 3: Update README.md with setup instructions**

Add deployment section to README.md:

```markdown
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
```

**Step 4: Commit final changes**

```bash
git add .
git commit -m "docs: Add deployment instructions and finalize config"
```

**Step 5: Create GitHub repository**

Run: Follow README instructions to create GitHub repo

**Step 6: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/japan-travel-planner.git
git branch -M main
git push -u origin main
```

Expected: Code pushed to GitHub successfully

**Step 7: Deploy to Vercel**

1. Visit https://vercel.com/new
2. Import the GitHub repository
3. Click Deploy
4. Copy the deployment URL

**Step 8: Update config.js with Vercel URL**

Update the `vercel.url` field in config.js with actual URL, then:

```bash
git add config.js
git commit -m "chore: Update Vercel URL in config"
git push
```

**Step 9: Test the deployed app**

Run: Visit the Vercel URL
Expected: App loads, can login with GitHub token, all features work

**Step 10: Final commit**

```bash
git add .
git commit -m "chore: Deployment complete - app is live!"
git push
```

---

## Testing Checklist

After deployment, test these features:

- [ ] Login with GitHub Personal Access Token
- [ ] Favorite/unfavorite locations
- [ ] Add comments to locations
- [ ] Build daily itinerary
- [ ] Add budget items and see totals
- [ ] Upload photos
- [ ] Save changes (commits to GitHub)
- [ ] Refresh and see saved data persists
- [ ] Second user (friend) can login and see changes
- [ ] Both users can make changes (conflict handling works)

---

## Future Enhancements (Optional)

1. **Export to PDF** - Generate printable itinerary
2. **Google Maps Integration** - Embed maps with pins
3. **Mobile PWA** - Install as phone app
4. **Email notifications** - Alert when friend makes changes
5. **Offline mode** - Service worker for offline access
6. **Custom domain** - Use your own domain name
7. **Real-time sync** - WebSocket for live updates (would need backend)

---

## Troubleshooting

**Q: Can't save data - "409 conflict" error**
A: Someone else saved at the same time. Refresh the page and try again.

**Q: Photos not showing**
A: Make sure images are pushed to GitHub and URL in config.js is correct.

**Q: Friend can't login**
A: Make sure they're added as a collaborator and using a valid GitHub token with `repo` scope.

**Q: Changes not appearing after save**
A: Wait 15-30 seconds for Vercel to redeploy, then refresh the page.
