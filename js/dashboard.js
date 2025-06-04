/**
 * Dashboard Scripts
 * Handles dashboard functionality including charts, date updates, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Set last update date
  updateLastUpdatedDate();
  
  // Initialize charts
  initializeLineChart();
  initializeBarChart();
  
  // Initialize onboarding item actions
  initializeOnboardingActions();
});

/**
 * Updates the last updated date with today's date in appropriate format
 */
function updateLastUpdatedDate() {
  const lastUpdateElement = document.getElementById('lastUpdateDate');
  if (lastUpdateElement) {
    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    lastUpdateElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

/**
 * Initializes the revenue vs expenses line chart using Chart.js
 */
function initializeLineChart() {
  const lineChartCanvas = document.getElementById('metricsLineChart');
  if (!lineChartCanvas) return;
  
  // Sample data - in a real app, this would come from an API
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (€1,000)',
        data: [320, 340, 360, 380, 400, 420],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expenses (€1,000)',
        data: [280, 290, 300, 310, 320, 330],
        borderColor: '#1976D2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };
  
  // Create the chart
  new Chart(lineChartCanvas, {
    type: 'line',
    data: monthlyData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '€' + value;
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += '€' + context.parsed.y.toString();
              }
              return label;
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

/**
 * Initializes the quarterly performance bar chart using Chart.js
 */
function initializeBarChart() {
  const barChartCanvas = document.getElementById('metricsBarChart');
  if (!barChartCanvas) return;
  
  // Sample data - in a real app, this would come from an API
  const quarterlyData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Net Profit (€1,000)',
        data: [85, 95, 105, 115],
        backgroundColor: '#9013FE',
        borderColor: '#7B00E0',
        borderWidth: 1
      },
      {
        label: 'Revenue Growth (%)',
        data: [5, 8, 7, 10],
        backgroundColor: '#F5A623',
        borderColor: '#E09600',
        borderWidth: 1
      }
    ]
  };
  
  // Create the chart
  new Chart(barChartCanvas, {
    type: 'bar',
    data: quarterlyData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value, index, values) {
              // First dataset shows values in EUR, second in %
              return value;
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                if (context.datasetIndex === 0) {
                  label += '€' + context.parsed.y.toString();
                } else {
                  label += context.parsed.y.toString() + '%';
                }
              }
              return label;
            }
          }
        }
      }
    }
  });
}

/**
 * Initialize onboarding checklist interactions
 */
function initializeOnboardingActions() {
  const onboardingItems = document.querySelectorAll('.onboarding-item');
  
  onboardingItems.forEach(item => {
    item.addEventListener('click', function() {
      const currentStatus = this.getAttribute('data-status');
      const iconElement = this.querySelector('.onboarding-checkbox i');
      
      // Toggle between completed and pending
      if (currentStatus === 'completed') {
        // Change to pending
        this.setAttribute('data-status', 'pending');
        this.classList.remove('completed');
        iconElement.classList.remove('fa-check-circle');
        iconElement.classList.add('fa-circle');
      } else {
        // Change to completed
        this.setAttribute('data-status', 'completed');
        this.classList.add('completed');
        iconElement.classList.remove('fa-circle');
        iconElement.classList.add('fa-check-circle');
      }
      
      // Update progress
      updateOnboardingProgress();
    });
  });
}

/**
 * Update the onboarding progress bar and text
 */
function updateOnboardingProgress() {
  const totalItems = document.querySelectorAll('.onboarding-item').length;
  const completedItems = document.querySelectorAll('.onboarding-item.completed').length;
  
  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (progressFill && progressText) {
    const percentComplete = (completedItems / totalItems) * 100;
    progressFill.style.width = percentComplete + '%';
    progressText.textContent = `${completedItems}/${totalItems} Complete`;
  }
} 