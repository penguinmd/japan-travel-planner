// ui-components.js

function createFavoriteButton(locationId) {
  const button = document.createElement('button');
  button.className = 'favorite-btn';
  button.innerHTML = '☆';
  button.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer; float: right;';
  button.title = 'Loading...';

  // Load favorite status asynchronously
  apiClient.isFavorited(locationId).then(isFavorited => {
    button.innerHTML = isFavorited ? '⭐' : '☆';
    button.title = isFavorited ? 'Unfavorite' : 'Favorite';
  });

  button.onclick = async (e) => {
    e.stopPropagation();

    if (!auth.isAuthenticated()) {
      alert('Please login to favorite locations');
      return;
    }

    if (!userManager.isIdentified()) {
      await userManager.showIdentificationModal();
    }

    try {
      button.disabled = true;
      const result = await apiClient.toggleFavorite(locationId);
      button.innerHTML = result.favorited ? '⭐' : '☆';
      button.title = result.favorited ? 'Unfavorite' : 'Favorite';
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      button.disabled = false;
    }
  };

  return button;
}

function createCommentButton(locationId) {
  const button = document.createElement('button');
  button.textContent = '💬 Add Recommendation';
  button.className = 'nav-btn';
  button.style.cssText = 'margin-top: 10px; padding: 8px 16px; font-size: 0.9em;';

  button.onclick = async () => {
    if (!auth.isAuthenticated()) {
      alert('Please login to add recommendations');
      return;
    }

    if (!userManager.isIdentified()) {
      await userManager.showIdentificationModal();
    }

    const text = prompt('Enter your recommendation:');
    if (text) {
      try {
        button.disabled = true;
        button.textContent = 'Adding...';

        await apiClient.addRecommendation(locationId, text);
        await renderCommentsForLocation(locationId);

      } catch (error) {
        alert('Error: ' + error.message);
      } finally {
        button.disabled = false;
        button.textContent = '💬 Add Recommendation';
      }
    }
  };

  return button;
}

async function renderCommentsForLocation(locationId) {
  const container = document.getElementById(`comments-${locationId}`);
  if (!container) return;

  try {
    const recommendations = await apiClient.getRecommendations(locationId);
    container.innerHTML = '';

    if (recommendations.length === 0) {
      return;
    }

    recommendations.forEach(rec => {
      const commentDiv = document.createElement('div');
      commentDiv.style.cssText = 'background: #f0f0f0; padding: 10px; margin: 5px 0; border-radius: 5px; position: relative;';

      // Build rating stars if rating exists
      let starsHtml = '';
      if (rec.rating) {
        starsHtml = '<span style="color: #c9a961; margin-left: 10px;">' + '⭐'.repeat(rec.rating) + '</span>';
      }

      // Add delete button if it's the current user's recommendation
      let deleteButton = '';
      if (userManager.isIdentified() && rec.userId === userManager.getUserId()) {
        deleteButton = `<button
          onclick="deleteRecommendation(${rec.id}, '${locationId}')"
          style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 0.8em;
          "
        >Delete</button>`;
      }

      commentDiv.innerHTML = `
        ${deleteButton}
        <strong style="color: #333;">${rec.userName}</strong>${starsHtml}
        <small style="color: #666; margin-left: 10px;">${new Date(rec.createdAt).toLocaleDateString()}</small>
        <p style="margin: 5px 0 0 0; color: #555;">${rec.text}</p>
      `;
      container.appendChild(commentDiv);
    });
  } catch (error) {
    console.error('Error rendering recommendations:', error);
    container.innerHTML = '<p style="color: #dc3545;">Error loading recommendations</p>';
  }
}

// Global function to delete recommendation
async function deleteRecommendation(id, locationId) {
  if (!confirm('Delete this recommendation?')) {
    return;
  }

  try {
    await apiClient.deleteRecommendation(id, locationId);
    await renderCommentsForLocation(locationId);
  } catch (error) {
    alert('Error deleting recommendation: ' + error.message);
  }
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

    // Render existing recommendations (async)
    renderCommentsForLocation(locationId);

    // Render existing photos (if data manager exists)
    if (typeof dataManager !== 'undefined' && dataManager.data) {
      renderPhotosForLocation(locationId);
    }
  });
}
