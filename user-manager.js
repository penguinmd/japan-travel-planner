// User Manager - Handles user identification and session
class UserManager {
  constructor() {
    this.user = null;
    this.STORAGE_KEY = 'japan_travel_user';
  }

  // Initialize user session
  async init() {
    // Check if user is already identified in localStorage
    const storedUser = localStorage.getItem(this.STORAGE_KEY);

    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        return this.user;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    // No user found, need to identify
    return null;
  }

  // Show user identification modal
  showIdentificationModal() {
    return new Promise((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.id = 'user-modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      // Create modal
      const modal = document.createElement('div');
      modal.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      `;

      modal.innerHTML = `
        <h2 style="margin: 0 0 10px 0; color: #333;">Welcome to Japan Travel Planner</h2>
        <p style="color: #666; margin-bottom: 20px;">Enter your name to add recommendations and favorites:</p>
        <input
          type="text"
          id="user-name-input"
          placeholder="Your name (e.g., Alice, Bob)"
          style="
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
            box-sizing: border-box;
            margin-bottom: 15px;
          "
        />
        <button
          id="user-submit-btn"
          style="
            width: 100%;
            padding: 12px;
            background: #c9a961;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
          "
        >Continue</button>
        <div id="user-error" style="color: #dc3545; margin-top: 10px; display: none;"></div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      const input = document.getElementById('user-name-input');
      const button = document.getElementById('user-submit-btn');
      const errorDiv = document.getElementById('user-error');

      // Focus input
      input.focus();

      const submit = async () => {
        const name = input.value.trim();

        if (!name) {
          errorDiv.textContent = 'Please enter your name';
          errorDiv.style.display = 'block';
          return;
        }

        if (name.length > 100) {
          errorDiv.textContent = 'Name must be 100 characters or less';
          errorDiv.style.display = 'block';
          return;
        }

        // Disable button during API call
        button.disabled = true;
        button.textContent = 'Identifying...';

        try {
          const user = await this.identifyUser(name);

          // Save to localStorage
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
          this.user = user;

          // Remove modal
          document.body.removeChild(overlay);
          resolve(user);

        } catch (error) {
          errorDiv.textContent = 'Error: ' + error.message;
          errorDiv.style.display = 'block';
          button.disabled = false;
          button.textContent = 'Continue';
        }
      };

      button.addEventListener('click', submit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          submit();
        }
      });
    });
  }

  // Identify user via API
  async identifyUser(name) {
    const response = await fetch('/api/users/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to identify user');
    }

    return data.user;
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Check if user is identified
  isIdentified() {
    return this.user !== null;
  }

  // Change user name
  async changeName() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.user = null;
    return await this.showIdentificationModal();
  }

  // Get user ID
  getUserId() {
    return this.user?.id;
  }

  // Get user name
  getUserName() {
    return this.user?.name;
  }
}

// Global user manager instance
const userManager = new UserManager();
