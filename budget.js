// budget.js

function createBudgetSection() {
  const budgetSection = document.createElement('section');
  budgetSection.id = 'budget-tracker';
  budgetSection.className = 'content-section';
  budgetSection.innerHTML = `
    <h2>💰 Budget Tracker</h2>

    <div class="tip-card" style="background: #e8f5e9;">
      <h3 style="margin: 0;">Total Budget: $<span id="total-budget">0</span></h3>
      <p style="margin: 5px 0 0 0;">Per Person: $<span id="per-person-budget">0</span></p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
      <div class="budget-category">
        <h3>🏨 Hotels</h3>
        <div id="budget-hotels"></div>
        <button onclick="addBudgetItem('hotels')" class="nav-btn" style="margin-top: 10px;">+ Add Hotel</button>
      </div>

      <div class="budget-category">
        <h3>🍜 Food</h3>
        <div id="budget-food"></div>
        <button onclick="addBudgetItem('food')" class="nav-btn" style="margin-top: 10px;">+ Add Meal</button>
      </div>

      <div class="budget-category">
        <h3>🚄 Transport</h3>
        <div id="budget-transport"></div>
        <button onclick="addBudgetItem('transport')" class="nav-btn" style="margin-top: 10px;">+ Add Transport</button>
      </div>

      <div class="budget-category">
        <h3>🎭 Activities</h3>
        <div id="budget-activities"></div>
        <button onclick="addBudgetItem('activities')" class="nav-btn" style="margin-top: 10px;">+ Add Activity</button>
      </div>

      <div class="budget-category">
        <h3>🛍️ Shopping</h3>
        <div id="budget-shopping"></div>
        <button onclick="addBudgetItem('shopping')" class="nav-btn" style="margin-top: 10px;">+ Add Shopping</button>
      </div>
    </div>
  `;

  return budgetSection;
}

function addBudgetItem(category) {
  if (!auth.isAuthenticated()) {
    alert('Please login to add budget items');
    return;
  }

  const name = prompt(`Enter ${category.slice(0, -1)} name:`);
  if (!name) return;

  const cost = parseFloat(prompt('Enter cost in USD:'));
  if (isNaN(cost)) return;

  let item = { name, cost };

  // Special fields for hotels
  if (category === 'hotels') {
    const nights = parseInt(prompt('Number of nights:'));
    if (!isNaN(nights)) {
      item.nights = nights;
      item.cost = cost * nights;
    }
  }

  dataManager.addBudgetItem(category, item);
  renderBudgetCategory(category);
  updateBudgetTotals();
  updateUnsavedChangesIndicator();
}

function renderBudgetCategory(category) {
  const container = document.getElementById(`budget-${category}`);
  if (!container) return;

  const items = dataManager.data.budget[category];
  container.innerHTML = '';

  items.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.style.cssText = 'background: #f8f9ff; padding: 10px; margin: 5px 0; border-radius: 5px;';
    itemDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>${item.name}</strong>
          ${item.nights ? `<br><small>${item.nights} nights</small>` : ''}
        </div>
        <div style="text-align: right;">
          <strong>$${item.cost || item.estimatedCost || 0}</strong>
          <button onclick="removeBudgetItem('${category}', ${index})" style="background: #f5576c; color: white; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 0.8em; margin-left: 10px;">✕</button>
        </div>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function removeBudgetItem(category, index) {
  dataManager.data.budget[category].splice(index, 1);
  renderBudgetCategory(category);
  updateBudgetTotals();
  updateUnsavedChangesIndicator();
}

function updateBudgetTotals() {
  const total = dataManager.getTotalBudget();
  document.getElementById('total-budget').textContent = total.toFixed(2);
  document.getElementById('per-person-budget').textContent = (total / 2).toFixed(2);
}

function renderAllBudgetCategories() {
  ['hotels', 'food', 'transport', 'activities', 'shopping'].forEach(category => {
    renderBudgetCategory(category);
  });
  updateBudgetTotals();
}
