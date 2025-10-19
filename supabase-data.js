// data-manager.js - localStorage-based Data Manager
// All data stored in browser's localStorage - shared per browser
class LocalStorageDataManager {
  constructor() {
    this.data = null;
    this.STORAGE_KEY = "japan_trip_data";
  }

  async load() {
    // Try to load data from localStorage
    const storedData = localStorage.getItem(this.STORAGE_KEY);

    if (storedData) {
      try {
        this.data = JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        // Initialize with empty data structure if parse fails
        this.data = this.getEmptyDataStructure();
      }
    } else {
      // Initialize with empty data structure if no stored data
      this.data = this.getEmptyDataStructure();
    }

    return this.data;
  }

  getEmptyDataStructure() {
    return {
      users: {},
      favorites: {},
      comments: [],
      itinerary: {},
      budget: { hotels: [], food: [], transport: [], activities: [], shopping: [] },
      photos: [],
      lastUpdated: new Date().toISOString()
    };
  }

  async save(commitMessage = 'Update trip data') {
    if (!this.data) {
      throw new Error('No data to save');
    }

    // Update timestamp
    this.data.lastUpdated = new Date().toISOString();

    // Save to localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
      return true;
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      throw new Error('Failed to save data: ' + error.message);
    }
  }

  subscribeToChanges(callback) {
    // localStorage doesn't have real-time sync across tabs/browsers
    // But we can listen to storage events for changes in other tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY && event.newValue) {
        try {
          this.data = JSON.parse(event.newValue);
          callback(this.data);
        } catch (error) {
          console.error('Error parsing updated data:', error);
        }
      }
    });
  }

  unsubscribe() {
    // Remove storage event listener if needed
    // Note: This simple implementation doesn't track the specific listener
    // In a production app, you'd want to store and remove the specific listener
  }

  // Helper methods (keep same interface as old data-manager)
  toggleFavorite(locationId) {
    if (!auth.isAuthenticated()) {
      console.warn('Must be logged in to toggle favorites');
      return;
    }

    const userKey = 'shared_user'; // Everyone shares the same favorites in simple mode

    if (!this.data.favorites[userKey]) {
      this.data.favorites[userKey] = [];
    }

    const favorites = this.data.favorites[userKey];
    const index = favorites.indexOf(locationId);

    if (index === -1) {
      favorites.push(locationId);
    } else {
      favorites.splice(index, 1);
    }
  }

  isFavorited(locationId, userEmail = null) {
    const userKey = 'shared_user'; // Everyone shares the same favorites in simple mode
    return this.data.favorites[userKey]?.includes(locationId) || false;
  }

  addComment(locationId, text) {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be logged in to add comments');
    }

    const comment = {
      id: 'c' + Date.now(),
      locationId: locationId,
      user: 'shared_user',
      userName: 'Traveler',
      text: text,
      timestamp: new Date().toISOString(),
      replies: []
    };

    this.data.comments.push(comment);
    return comment;
  }

  getCommentsForLocation(locationId) {
    if (!this.data || !this.data.comments) return [];
    return this.data.comments.filter(c => c.locationId === locationId);
  }

  addBudgetItem(category, item) {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be logged in to add budget items');
    }

    this.data.budget[category].push({
      ...item,
      addedBy: 'shared_user',
      timestamp: new Date().toISOString()
    });
  }

  getTotalBudget() {
    if (!this.data || !this.data.budget) return 0;
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
const dataManager = new LocalStorageDataManager();
