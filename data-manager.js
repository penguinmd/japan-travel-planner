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
