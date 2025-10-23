// API Client - Replaces localStorage-based data manager
// Handles all API calls to Neon database
class ApiClient {
  constructor() {
    this.baseUrl = '';
    this.cache = {
      recommendations: {},
      favorites: null
    };
  }

  // Get recommendations for a location
  async getRecommendations(locationId) {
    try {
      const response = await fetch(`/api/recommendations?locationId=${encodeURIComponent(locationId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recommendations');
      }

      // Update cache
      this.cache.recommendations[locationId] = data.recommendations;

      return data.recommendations;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  // Add recommendation
  async addRecommendation(locationId, text, rating = null) {
    if (!userManager.isIdentified()) {
      throw new Error('Must be identified to add recommendations');
    }

    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locationId,
        userId: userManager.getUserId(),
        userName: userManager.getUserName(),
        text,
        rating
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add recommendation');
    }

    // Invalidate cache for this location
    delete this.cache.recommendations[locationId];

    return data.recommendation;
  }

  // Delete recommendation
  async deleteRecommendation(id, locationId) {
    const response = await fetch(`/api/recommendations/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete recommendation');
    }

    // Invalidate cache
    delete this.cache.recommendations[locationId];

    return data;
  }

  // Get user's favorites
  async getFavorites() {
    if (!userManager.isIdentified()) {
      return [];
    }

    try {
      const response = await fetch(`/api/favorites?userId=${userManager.getUserId()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch favorites');
      }

      // Update cache
      this.cache.favorites = data.favorites;

      return data.favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  // Toggle favorite
  async toggleFavorite(locationId) {
    if (!userManager.isIdentified()) {
      throw new Error('Must be identified to toggle favorites');
    }

    // Get current favorites
    const favorites = await this.getFavorites();
    const existing = favorites.find(f => f.locationId === locationId);

    if (existing) {
      // Remove favorite
      const response = await fetch(`/api/favorites/${existing.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove favorite');
      }

      // Invalidate cache
      this.cache.favorites = null;

      return { favorited: false };

    } else {
      // Add favorite
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId,
          userId: userManager.getUserId(),
          userName: userManager.getUserName()
        })
      });

      const data = await response.json();

      if (!response.ok && response.status !== 409) {
        throw new Error(data.error || 'Failed to add favorite');
      }

      // Invalidate cache
      this.cache.favorites = null;

      return { favorited: true };
    }
  }

  // Check if location is favorited
  async isFavorited(locationId) {
    if (!userManager.isIdentified()) {
      return false;
    }

    const favorites = await this.getFavorites();
    return favorites.some(f => f.locationId === locationId);
  }

  // Clear cache
  clearCache() {
    this.cache = {
      recommendations: {},
      favorites: null
    };
  }
}

// Global API client instance
const apiClient = new ApiClient();
