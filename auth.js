// auth.js - Simple Shared Password Authentication
// Password: "Feels Like Fall"
class SimpleAuth {
  constructor() {
    this.isLoggedIn = false;
    this.CORRECT_PASSWORD = "Feels Like Fall";
    this.STORAGE_KEY = "japan_auth_logged_in";
  }

  async init() {
    // Check if user is already logged in (from localStorage)
    const storedLogin = localStorage.getItem(this.STORAGE_KEY);
    if (storedLogin === "true") {
      this.isLoggedIn = true;
      this.updateUI();
    }
  }

  async login(password) {
    if (password === this.CORRECT_PASSWORD) {
      this.isLoggedIn = true;
      localStorage.setItem(this.STORAGE_KEY, "true");
      this.updateUI();
      return true;
    } else {
      throw new Error("Incorrect password");
    }
  }

  async logout() {
    this.isLoggedIn = false;
    localStorage.removeItem(this.STORAGE_KEY);
    this.updateUI();
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  updateUI() {
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');

    // Add null checks to prevent errors if DOM elements are missing
    if (!loggedOutView || !loggedInView) {
      console.warn('Auth UI elements not found');
      return;
    }

    if (this.isLoggedIn) {
      loggedOutView.style.display = 'none';
      loggedInView.style.display = 'block';
    } else {
      loggedOutView.style.display = 'block';
      loggedInView.style.display = 'none';
    }
  }
}

// Global instance
const auth = new SimpleAuth();
