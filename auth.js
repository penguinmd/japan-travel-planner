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
