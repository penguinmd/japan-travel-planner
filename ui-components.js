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

    // Add photo upload button
    const photoUploadBtn = createPhotoUploadButton(locationId);
    card.appendChild(photoUploadBtn);

    // Add photos container
    const photosDiv = document.createElement('div');
    photosDiv.id = `photos-${locationId}`;
    card.appendChild(photosDiv);

    // Render existing comments
    if (dataManager.data) {
      renderCommentsForLocation(locationId);
    }

    // Render existing photos
    if (dataManager.data) {
      renderPhotosForLocation(locationId);
    }
  });
}
