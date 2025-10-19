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

    // Add null checks to prevent errors if DOM elements are missing
    if (!loggedOutView || !loggedInView) {
      console.warn('Auth UI elements not found');
      return;
    }

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
