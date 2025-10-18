// itinerary.js

function createItinerarySection() {
  const itinerarySection = document.createElement('section');
  itinerarySection.id = 'itinerary-planner';
  itinerarySection.className = 'content-section';
  itinerarySection.innerHTML = `
    <h2>📅 Trip Itinerary</h2>
    <div style="margin-bottom: 20px;">
      <label>Trip Start Date: <input type="date" id="trip-start-date" /></label>
      <label style="margin-left: 20px;">Number of Days: <input type="number" id="trip-days" value="14" min="1" max="30" /></label>
      <button onclick="generateItinerary()" class="nav-btn" style="margin-left: 20px;">Generate Days</button>
    </div>
    <div id="itinerary-days-container"></div>
  `;

  return itinerarySection;
}

function generateItinerary() {
  const startDate = document.getElementById('trip-start-date').value;
  if (!startDate) {
    alert('Please select a start date');
    return;
  }

  const numDays = parseInt(document.getElementById('trip-days').value);
  const container = document.getElementById('itinerary-days-container');
  container.innerHTML = '';

  for (let i = 0; i < numDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    const dayCard = document.createElement('div');
    dayCard.className = 'tip-card';
    dayCard.style.marginBottom = '20px';
    dayCard.innerHTML = `
      <h3>Day ${i + 1} - ${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 15px;">
        <div>
          <strong>Morning</strong>
          <div id="day-${dateStr}-morning" class="itinerary-slot" style="min-height: 60px; background: #fff; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <button onclick="addToItinerary('${dateStr}', 'morning')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>
          </div>
        </div>
        <div>
          <strong>Afternoon</strong>
          <div id="day-${dateStr}-afternoon" class="itinerary-slot" style="min-height: 60px; background: #fff; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <button onclick="addToItinerary('${dateStr}', 'afternoon')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>
          </div>
        </div>
        <div>
          <strong>Evening</strong>
          <div id="day-${dateStr}-evening" class="itinerary-slot" style="min-height: 60px; background: #fff; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <button onclick="addToItinerary('${dateStr}', 'evening')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(dayCard);
  }

  // Render existing itinerary data
  renderExistingItinerary();
}

function addToItinerary(date, timeSlot) {
  if (!auth.isAuthenticated()) {
    alert('Please login to build your itinerary');
    return;
  }

  const activity = prompt('Enter activity/location name:');
  if (!activity) return;

  // Initialize date if not exists
  if (!dataManager.data.itinerary[date]) {
    dataManager.data.itinerary[date] = { morning: [], afternoon: [], evening: [] };
  }

  dataManager.data.itinerary[date][timeSlot].push(activity);
  renderItinerarySlot(date, timeSlot);
  updateUnsavedChangesIndicator();
}

function renderItinerarySlot(date, timeSlot) {
  const slotElement = document.getElementById(`day-${date}-${timeSlot}`);
  if (!slotElement) return;

  const activities = dataManager.data.itinerary[date]?.[timeSlot] || [];

  slotElement.innerHTML = `<button onclick="addToItinerary('${date}', '${timeSlot}')" class="nav-btn" style="font-size: 0.8em; padding: 5px 10px;">+ Add Activity</button>`;

  activities.forEach((activity, index) => {
    const activityDiv = document.createElement('div');
    activityDiv.style.cssText = 'background: #e3f2fd; padding: 8px; margin: 5px 0; border-radius: 3px; display: flex; justify-content: space-between; align-items: center;';
    activityDiv.innerHTML = `
      <span>${activity}</span>
      <button onclick="removeFromItinerary('${date}', '${timeSlot}', ${index})" style="background: #f5576c; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em;">✕</button>
    `;
    slotElement.appendChild(activityDiv);
  });
}

function removeFromItinerary(date, timeSlot, index) {
  dataManager.data.itinerary[date][timeSlot].splice(index, 1);
  renderItinerarySlot(date, timeSlot);
  updateUnsavedChangesIndicator();
}

function renderExistingItinerary() {
  for (const date in dataManager.data.itinerary) {
    for (const timeSlot of ['morning', 'afternoon', 'evening']) {
      renderItinerarySlot(date, timeSlot);
    }
  }
}
