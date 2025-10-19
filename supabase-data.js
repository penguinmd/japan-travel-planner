// supabase-data.js - Supabase Data Manager
// Replaces GitHub-based data-manager.js with Supabase backend
class SupabaseDataManager {
  constructor() {
    this.data = null;
    this.subscription = null;
  }

  async load() {
    // Try to fetch trip data from Supabase
    const { data, error } = await supabase
      .from('trip_data')
      .select('*')
      .eq('id', TRIP_DATA_ID)
      .single();

    if (error) {
      console.error('Error loading data from Supabase:', error);
      // Initialize with empty data structure if doesn't exist
      this.data = {
        users: {},
        favorites: {},
        comments: [],
        itinerary: {},
        budget: { hotels: [], food: [], transport: [], activities: [], shopping: [] },
        photos: [],
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Convert Supabase data format to match old data-manager structure
      this.data = {
        users: data.users || {},
        favorites: data.favorites || {},
        comments: data.comments || [],
        itinerary: data.itinerary || {},
        budget: data.budget || { hotels: [], food: [], transport: [], activities: [], shopping: [] },
        photos: data.photos || [],
        lastUpdated: data.updated_at || new Date().toISOString()
      };
    }

    // Add current user if authenticated
    if (auth.isAuthenticated() && auth.user) {
      if (!this.data.users[auth.user.email]) {
        this.data.users[auth.user.email] = {
          name: auth.user.email.split('@')[0], // Use email prefix as name
          email: auth.user.email
        };
      }

      // Initialize user favorites if not exists
      if (!this.data.favorites[auth.user.email]) {
        this.data.favorites[auth.user.email] = [];
      }
    }

    return this.data;
  }

  async save(commitMessage = 'Update trip data') {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be logged in to save changes');
    }

    if (!this.data) {
      throw new Error('No data to save');
    }

    // Update timestamp
    this.data.lastUpdated = new Date().toISOString();

    const { error } = await supabase
      .from('trip_data')
      .update({
        users: this.data.users,
        favorites: this.data.favorites,
        comments: this.data.comments,
        itinerary: this.data.itinerary,
        budget: this.data.budget,
        photos: this.data.photos,
        updated_at: this.data.lastUpdated,
        updated_by: auth.user.id
      })
      .eq('id', TRIP_DATA_ID);

    if (error) {
      console.error('Error saving data to Supabase:', error);
      throw new Error(error.message);
    }

    return true;
  }

  subscribeToChanges(callback) {
    if (this.subscription) {
      console.warn('Already subscribed to changes');
      return;
    }

    this.subscription = supabase
      .channel('trip_data_changes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trip_data', filter: `id=eq.${TRIP_DATA_ID}` },
        (payload) => {
          console.log('Data updated by another user:', payload);
          // Update local data with new changes
          if (payload.new) {
            this.data = {
              users: payload.new.users || {},
              favorites: payload.new.favorites || {},
              comments: payload.new.comments || [],
              itinerary: payload.new.itinerary || {},
              budget: payload.new.budget || { hotels: [], food: [], transport: [], activities: [], shopping: [] },
              photos: payload.new.photos || [],
              lastUpdated: payload.new.updated_at || new Date().toISOString()
            };
            callback(this.data);
          }
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
    if (!auth.isAuthenticated()) {
      console.warn('Must be logged in to toggle favorites');
      return;
    }

    const userEmail = auth.user.email;
    const favorites = this.data.favorites[userEmail];
    const index = favorites.indexOf(locationId);

    if (index === -1) {
      favorites.push(locationId);
    } else {
      favorites.splice(index, 1);
    }
  }

  isFavorited(locationId, userEmail = null) {
    if (!userEmail && auth.isAuthenticated()) {
      userEmail = auth.user.email;
    }
    if (!userEmail) return false;
    return this.data.favorites[userEmail]?.includes(locationId) || false;
  }

  addComment(locationId, text) {
    if (!auth.isAuthenticated()) {
      throw new Error('Must be logged in to add comments');
    }

    const comment = {
      id: 'c' + Date.now(),
      locationId: locationId,
      user: auth.user.email,
      userName: this.data.users[auth.user.email]?.name || auth.user.email.split('@')[0],
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
      addedBy: auth.user.email,
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
const dataManager = new SupabaseDataManager();
