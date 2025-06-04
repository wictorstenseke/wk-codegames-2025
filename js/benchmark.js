/**
 * Benchmark Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map
  initMap();
  
  // Initialize business selection
  initBusinessSelection();
  
  // Initialize view toggle
  initViewToggle();
  
  // Restore selected count from localStorage
  const storedCount = localStorage.getItem('selectedCompaniesCount');
  if (storedCount !== null) {
    const compareBtn = document.querySelector('.companies-section .btn-primary');
    if (compareBtn) {
      compareBtn.textContent = `Compare ${storedCount} Selected`;
      compareBtn.disabled = storedCount === '0';
      if (storedCount === '0') {
        compareBtn.classList.add('btn-disabled');
      }
    }
  }
  
  // Restore view mode from localStorage
  const storedViewMode = localStorage.getItem('viewMode');
  if (storedViewMode) {
    isShowingDifferences = storedViewMode === 'differences';
    const actualValuesBtn = document.getElementById('actual-values-btn');
    const differencesBtn = document.getElementById('differences-btn');
    
    if (actualValuesBtn && differencesBtn) {
      if (isShowingDifferences) {
        differencesBtn.classList.add('active');
        actualValuesBtn.classList.remove('active');
      } else {
        actualValuesBtn.classList.add('active');
        differencesBtn.classList.remove('active');
      }
    }
  }
});

// Global variables for tracking state
let map;
let userBusinessMarker;
let originalMarkers = [];
let fishRestaurantMarkers = [];
let isShowingFishRestaurants = false;
let isShowingDifferences = false;

/**
 * Initialize the map with Leaflet.js
 */
function initMap() {
  // Create a map centered on a default location (Gothenburg, Sweden)
  map = L.map('map-container').setView([57.7089, 11.9746], 14);
  
  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add a marker for the user's business
  userBusinessMarker = L.marker([57.7089, 11.9746])
    .addTo(map)
    .bindPopup('<strong>Fisch & Wurst</strong><br>Your Company<br>Restaurant')
    .openPopup();
  
  // Sample data for nearby businesses
  const nearbyBusinesses = [
    { name: 'Harvest & Co.', lat: 57.7055, lng: 11.9690 },
    { name: 'Tablefront', lat: 57.7110, lng: 11.9780 },
    { name: 'Forkline', lat: 57.7070, lng: 11.9830 },
    { name: 'Grain & Grit', lat: 57.7025, lng: 11.9700 },
    { name: 'Plateform', lat: 57.7150, lng: 11.9650 },
    { name: 'Civetta Group', lat: 57.7095, lng: 11.9600 },
    { name: 'Brass & Bloom', lat: 57.7130, lng: 11.9720 }
  ];
  
  // Add markers for nearby businesses
  nearbyBusinesses.forEach(business => {
    const marker = L.marker([business.lat, business.lng])
      .addTo(map)
      .bindPopup(`<strong>${business.name}</strong>`);
    originalMarkers.push(marker);
  });
  
  // Create fish restaurant markers (but don't add them to the map yet)
  const fishRestaurants = [
    { name: 'Salt & Sea', lat: 57.7020, lng: 11.9750 },
    { name: 'Ocean Plate', lat: 57.7120, lng: 11.9800 },
    { name: 'Maritime Catch', lat: 57.7065, lng: 11.9850 }
  ];
  
  fishRestaurants.forEach(restaurant => {
    const marker = L.marker([restaurant.lat, restaurant.lng])
      .bindPopup(`<strong>${restaurant.name}</strong><br>Fish Restaurant`);
    fishRestaurantMarkers.push(marker);
  });
  
  // Handle search functionality
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      performFishRestaurantSearch();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performFishRestaurantSearch();
      }
    });
  }
}

/**
 * Function to perform fish restaurant search
 * No matter what the user searches for, show fish restaurants
 */
function performFishRestaurantSearch() {
  // Get the search input
  const searchInput = document.querySelector('.search-input');
  const searchQuery = searchInput.value.trim();
  
  if (searchQuery === '') {
    return; // Don't do anything if the search is empty
  }
  
  // Always show fish restaurants regardless of the search term
  showFishRestaurants();
  
  // Show a notification with what was searched
  showNotification(`Showing fish restaurants near Gothenburg`);
  
  // Clear the search input
  searchInput.value = '';
}

/**
 * Function to show the fish restaurants and hide original companies
 */
function showFishRestaurants() {
  if (isShowingFishRestaurants) return; // Already showing fish restaurants
  
  // Hide original companies list and show fish restaurants list
  const originalList = document.getElementById('original-companies');
  const fishList = document.getElementById('fish-restaurants');
  
  if (originalList && fishList) {
    originalList.style.display = 'none';
    fishList.style.display = 'block';
  } else {
    createFishRestaurantList();
  }
  
  // Update heading
  const heading = document.querySelector('.company-list-heading');
  if (heading) {
    heading.textContent = 'We found these fish restaurants near your location:';
  }
  
  // Remove original markers from the map
  originalMarkers.forEach(marker => map.removeLayer(marker));
  
  // Add fish restaurant markers to the map
  fishRestaurantMarkers.forEach(marker => marker.addTo(map));
  
  // Update the selected count to reflect the new visible items
  updateSelectedCount();
  
  // Update the flag
  isShowingFishRestaurants = true;
}

/**
 * Create fish restaurant list if it doesn't exist
 * This is a fallback in case the HTML structure is not modified
 */
function createFishRestaurantList() {
  const originalList = document.querySelector('.company-list');
  if (!originalList) return;
  
  originalList.style.display = 'none';
  
  const fishList = document.createElement('ul');
  fishList.className = 'company-list';
  fishList.id = 'fish-restaurants';
  
  // Create fish restaurant items
  const fishRestaurants = [
    { id: 'fish1', name: 'Salt & Sea', percentage: '31%' },
    { id: 'fish2', name: 'Ocean Plate', percentage: '28%' },
    { id: 'fish3', name: 'Maritime Catch', percentage: '35%' }
  ];
  
  fishRestaurants.forEach(restaurant => {
    const li = document.createElement('li');
    li.className = 'company-item fish-restaurant';
    
    li.innerHTML = `
      <div class="company-checkbox">
        <input type="checkbox" id="${restaurant.id}" name="${restaurant.id}" checked>
      </div>
      <div class="company-info">
        <div class="company-name">${restaurant.name}</div>
        <div class="percentage">${restaurant.percentage} <span class="arrow-icon"><i class="fas fa-arrow-up"></i></span></div>
      </div>
    `;
    
    fishList.appendChild(li);
  });
  
  // Add fish list after original list
  originalList.parentNode.insertBefore(fishList, originalList.nextSibling);
  
  // Add styling for fish restaurants
  addFishRestaurantStyles();
}

/**
 * Add CSS styles for fish restaurants if they don't exist
 */
function addFishRestaurantStyles() {
  if (document.getElementById('fish-restaurant-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'fish-restaurant-styles';
  style.textContent = `
    .company-item.fish-restaurant {
      border-left: 3px solid #50E3C2;
      padding-left: 8px;
      background-color: rgba(80, 227, 194, 0.05);
    }
    
    .fish-restaurant-label {
      display: inline-block;
      background-color: #50E3C2;
      color: white;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: 8px;
      vertical-align: middle;
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Search for a location (simulated for prototype)
 * @param {string} query - The search query
 * @param {L.Map} map - The Leaflet map instance
 */
function searchLocation(query, map) {
  // This is now replaced by the fish restaurant search functionality
  performFishRestaurantSearch();
}

/**
 * Show a temporary notification
 * @param {string} message - The message to display
 */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'alert alert-info';
  notification.style.position = 'absolute';
  notification.style.zIndex = '1000';
  notification.style.top = '80px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.padding = '12px 24px';
  notification.style.backgroundColor = '#4A90E2';
  notification.style.color = 'white';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

/**
 * Initialize business selection functionality
 */
function initBusinessSelection() {
  const checkboxes = document.querySelectorAll('.company-checkbox input');
  const compareBtn = document.querySelector('.companies-section .btn-primary');
  
  if (checkboxes.length) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateSelectedCount();
      });
    });
  }
  
  if (compareBtn) {
    compareBtn.addEventListener('click', function() {
      updateComparisonTable();
    });
  }
  
  // Initial count update
  updateSelectedCount();
}

/**
 * Update the count of selected businesses
 */
function updateSelectedCount() {
  // Get all company items that are both visible and their parent list is visible
  const visibleCompanyItems = Array.from(document.querySelectorAll('.company-item')).filter(item => {
    const parentList = item.closest('.company-list');
    return window.getComputedStyle(item).display !== 'none' && 
           window.getComputedStyle(parentList).display !== 'none';
  });
  
  let selectedCount = 0;
  
  visibleCompanyItems.forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      selectedCount++;
    }
  });
  
  // Update the compare button
  const compareBtn = document.querySelector('.companies-section .btn-primary');
  if (compareBtn) {
    compareBtn.textContent = `Compare ${selectedCount} Selected`;
    
    // Disable button if no companies are selected
    if (selectedCount === 0) {
      compareBtn.disabled = true;
      compareBtn.classList.add('btn-disabled');
    } else {
      compareBtn.disabled = false;
      compareBtn.classList.remove('btn-disabled');
    }
  }
  
  // Store the count in localStorage
  localStorage.setItem('selectedCompaniesCount', selectedCount);
}

/**
 * Initialize the view toggle functionality
 */
function initViewToggle() {
  const actualValuesBtn = document.getElementById('actual-values-btn');
  const differencesBtn = document.getElementById('differences-btn');
  
  if (actualValuesBtn && differencesBtn) {
    actualValuesBtn.addEventListener('click', function() {
      if (!actualValuesBtn.classList.contains('active')) {
        actualValuesBtn.classList.add('active');
        differencesBtn.classList.remove('active');
        isShowingDifferences = false;
        localStorage.setItem('viewMode', 'actual');
        updateComparisonTable();
      }
    });
    
    differencesBtn.addEventListener('click', function() {
      if (!differencesBtn.classList.contains('active')) {
        differencesBtn.classList.add('active');
        actualValuesBtn.classList.remove('active');
        isShowingDifferences = true;
        localStorage.setItem('viewMode', 'differences');
        updateComparisonTable();
      }
    });
  }
}

/**
 * Update the comparison table based on selected businesses
 */
function updateComparisonTable() {
  // Get all checked businesses
  const selectedBusinesses = [];
  const checkboxes = document.querySelectorAll('.company-checkbox input');
  
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedBusinesses.push(checkbox.id);
    }
  });
  
  // Show the metrics card if it's hidden
  const metricsCard = document.getElementById('performance-metrics');
  if (metricsCard) {
    metricsCard.style.display = 'block';
    
    // First, capture original values if not already stored
    storeOriginalValues();
    
    // Show/hide appropriate columns based on what we're displaying
    if (isShowingFishRestaurants) {
      // Hide regular company columns and show fish restaurant columns
      const originalCompanyCols = document.querySelectorAll('.company-header.original-company, .original-company-cell');
      const fishRestaurantCols = document.querySelectorAll('.company-header.fish-restaurant-col, .fish-restaurant-cell');
      
      originalCompanyCols.forEach(col => col.style.display = 'none');
      fishRestaurantCols.forEach(col => col.style.display = '');
    } else {
      // Default behavior - show original companies and hide fish restaurants
      const originalCompanyCols = document.querySelectorAll('.company-header.original-company, .original-company-cell');
      const fishRestaurantCols = document.querySelectorAll('.company-header.fish-restaurant-col, .fish-restaurant-cell');
      
      originalCompanyCols.forEach(col => col.style.display = '');
      fishRestaurantCols.forEach(col => col.style.display = 'none');
      
      // Filter based on selected checkboxes
      const companyHeaders = document.querySelectorAll('.company-header.original-company');
      
      companyHeaders.forEach((header, index) => {
        const businessId = `company${index + 1}`;
        const companyName = header.textContent.trim();
        
        // Find all cells for this company using row-based selection instead of nth-child
        const companyCellsSelector = `.metric-row .original-company-cell:nth-of-type(${index + 1})`;
        const companyCells = document.querySelectorAll(companyCellsSelector);
        
        if (selectedBusinesses.includes(businessId)) {
          header.style.display = '';
          companyCells.forEach(cell => cell.style.display = '');
        } else {
          header.style.display = 'none';
          companyCells.forEach(cell => cell.style.display = 'none');
        }
      });
    }
    
    // Update the values based on the current view mode
    updateTableValues();
    
    metricsCard.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Store original values for all cells in data attributes
 */
function storeOriginalValues() {
  // Get all company cells (both original and fish restaurant)
  const allCells = document.querySelectorAll('.original-company-cell, .fish-restaurant-cell');
  
  allCells.forEach(cell => {
    // Only store if not already stored
    if (!cell.hasAttribute('data-original-value')) {
      const text = cell.textContent.trim();
      // Extract just the value without indicators
      const value = text.split(' ')[0];
      cell.setAttribute('data-original-value', value);
    }
  });
}

/**
 * Update the table values based on the current view mode (actual or differences)
 */
function updateTableValues() {
  // Get your company's cells
  const yourCompanyCells = document.querySelectorAll('.your-company-cell');
  if (!yourCompanyCells.length) return;
  
  // Get your company's values
  const yourValues = Array.from(yourCompanyCells).map(cell => {
    const value = cell.textContent.trim();
    if (value.startsWith('$')) {
      return parseFloat(value.replace(/[$,]/g, ''));
    } else if (value.endsWith('%')) {
      return parseFloat(value) / 100;
    } else {
      return parseFloat(value);
    }
  });
  
  // Process all visible company cells (both original and fish restaurant)
  const metricRows = document.querySelectorAll('.metric-row');
  
  metricRows.forEach((row, rowIndex) => {
    // Find all visible company cells in this row
    const visibleCells = row.querySelectorAll('td.original-company-cell:not([style*="display: none"]), td.fish-restaurant-cell:not([style*="display: none"])');
    
    visibleCells.forEach(cell => {
      // Get the original value from the data attribute
      const originalValue = cell.getAttribute('data-original-value');
      if (!originalValue) return;
      
      // Get any existing indicator
      const indicator = cell.querySelector('.metric-indicator');
      
      if (isShowingDifferences) {
        // Calculate and display differences
        let value;
        if (originalValue.startsWith('$')) {
          value = parseFloat(originalValue.replace(/[$,]/g, ''));
          const diff = value - yourValues[rowIndex];
          
          // Format dollar values without rounding
          let formattedDiff;
          if (Math.abs(diff) >= 1000000) {
            const millions = Math.abs(diff) / 1000000;
            formattedDiff = diff >= 0 
              ? `+$${millions.toFixed(2)}M` 
              : `-$${millions.toFixed(2)}M`;
          } else {
            formattedDiff = diff >= 0 
              ? `+$${Math.abs(diff).toLocaleString(undefined, {maximumFractionDigits: 2})}` 
              : `-$${Math.abs(diff).toLocaleString(undefined, {maximumFractionDigits: 2})}`;
          }
          
          cell.textContent = formattedDiff;
          cell.classList.add(diff >= 0 ? 'positive-diff' : 'negative-diff');
        } else if (originalValue.endsWith('%')) {
          value = parseFloat(originalValue) / 100;
          const diff = value - yourValues[rowIndex];
          // Show percentages with 2 decimal places instead of rounding to 1
          const formattedDiff = diff >= 0 
            ? `+${(diff * 100).toFixed(2)}%` 
            : `${(diff * 100).toFixed(2)}%`;
          cell.textContent = formattedDiff;
          cell.classList.add(diff >= 0 ? 'positive-diff' : 'negative-diff');
        } else {
          value = parseFloat(originalValue);
          const diff = value - yourValues[rowIndex];
          // Show numbers with up to 2 decimal places without forced rounding
          const formattedDiff = diff >= 0 
            ? `+${diff.toLocaleString(undefined, {maximumFractionDigits: 2})}` 
            : `${diff.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
          cell.textContent = formattedDiff;
          cell.classList.add(diff >= 0 ? 'positive-diff' : 'negative-diff');
        }
      } else {
        // Show actual values with better formatting
        if (originalValue.startsWith('$')) {
          const numValue = parseFloat(originalValue.replace(/[$,]/g, ''));
          // Remove the millions formatting and always show full number
          cell.textContent = `$${numValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`;
        } else if (originalValue.endsWith('%')) {
          const percentValue = parseFloat(originalValue);
          cell.textContent = `${percentValue.toFixed(2)}%`;
        } else {
          const numValue = parseFloat(originalValue);
          cell.textContent = numValue.toLocaleString(undefined, {maximumFractionDigits: 3});
        }
        cell.classList.remove('positive-diff', 'negative-diff');
      }
      
      // Add back the indicator if it existed
      if (indicator) {
        cell.appendChild(indicator);
      }
    });
  });
}

/**
 * Add fish restaurant rows to the comparison table if they don't exist
 * This function is no longer needed with the new horizontal layout
 * but kept for backward compatibility
 */
function addFishRestaurantRows() {
  // Fish restaurant data is now part of the HTML structure
  // This function is kept for backward compatibility
  console.log('Fish restaurant data is already included in the table structure');
} 