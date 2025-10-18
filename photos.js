// photos.js

async function uploadPhoto(locationId, file) {
  if (!auth.isAuthenticated()) {
    alert('Please login to upload photos');
    return;
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Resize image if too large (max 500KB)
  const resizedImage = await resizeImage(file, 1200, 0.8);

  // Generate filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${locationId}-${timestamp}.${extension}`;

  try {
    // Convert to base64
    const base64 = await fileToBase64(resizedImage);

    // Upload to GitHub
    const octokit = auth.getOctokit();
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: CONFIG.github.owner,
      repo: CONFIG.github.repo,
      path: `images/${filename}`,
      message: `Add photo for ${locationId}`,
      content: base64,
      branch: CONFIG.github.branch
    });

    // Add to data.json
    const caption = prompt('Add a caption (optional):') || '';
    dataManager.data.photos.push({
      locationId,
      filename,
      uploadedBy: auth.user.email,
      userName: auth.user.name,
      caption,
      timestamp: new Date().toISOString()
    });

    // Render photo
    renderPhotosForLocation(locationId);
    updateUnsavedChangesIndicator();

    alert('Photo uploaded! Click Save Changes to update.');
  } catch (error) {
    console.error('Upload error:', error);
    alert('Failed to upload photo: ' + error.message);
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImage(file, maxWidth, quality) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type, quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function createPhotoUploadButton(locationId) {
  const container = document.createElement('div');
  container.style.marginTop = '10px';

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  input.id = `photo-input-${locationId}`;
  input.onchange = (e) => {
    if (e.target.files[0]) {
      uploadPhoto(locationId, e.target.files[0]);
    }
  };

  const button = document.createElement('button');
  button.textContent = '📷 Add Photo';
  button.className = 'nav-btn';
  button.style.cssText = 'padding: 8px 16px; font-size: 0.9em;';
  button.onclick = () => input.click();

  container.appendChild(input);
  container.appendChild(button);

  return container;
}

function renderPhotosForLocation(locationId) {
  const container = document.getElementById(`photos-${locationId}`);
  if (!container) return;

  const photos = dataManager.data.photos.filter(p => p.locationId === locationId);
  container.innerHTML = '';

  if (photos.length === 0) return;

  const photosDiv = document.createElement('div');
  photosDiv.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;';

  photos.forEach(photo => {
    const photoCard = document.createElement('div');
    photoCard.style.cssText = 'position: relative; cursor: pointer;';

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/${CONFIG.github.owner}/${CONFIG.github.repo}/${CONFIG.github.branch}/images/${photo.filename}`;
    img.alt = photo.caption;
    img.style.cssText = 'width: 100%; height: 150px; object-fit: cover; border-radius: 5px;';
    img.onclick = () => {
      window.open(img.src, '_blank');
    };

    photoCard.appendChild(img);

    if (photo.caption) {
      const caption = document.createElement('div');
      caption.textContent = photo.caption;
      caption.style.cssText = 'font-size: 0.8em; margin-top: 5px; color: #666;';
      photoCard.appendChild(caption);
    }

    photosDiv.appendChild(photoCard);
  });

  container.appendChild(photosDiv);
}
