/**
 * Main JavaScript file for the web prototype
 */

// DOM Ready handler
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu toggle
  initMobileMenu();
  
  // Initialize any dynamic components
  initComponents();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const contentWrapper = document.querySelector('.content-wrapper');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      contentWrapper.classList.toggle('sidebar-open');
    });
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 639 && 
        !sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      contentWrapper.classList.remove('sidebar-open');
    }
  });
}

/**
 * Initialize any dynamic components on the page
 */
function initComponents() {
  // Initialize dropdown menus if any
  initDropdowns();
  
  // Initialize sidebar submenu
  initSidebarSubmenu();
  
  // Initialize form validation
  initFormValidation();
}

/**
 * Initialize dropdown menus
 */
function initDropdowns() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = this.nextElementSibling;
      
      // Close other open dropdowns
      document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
        if (menu !== dropdown) {
          menu.classList.remove('open');
        }
      });
      
      dropdown.classList.toggle('open');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
      menu.classList.remove('open');
    });
  });
}

/**
 * Initialize sidebar submenu toggle functionality
 */
function initSidebarSubmenu() {
  const submenuItems = document.querySelectorAll('.sidebar-menu-item-with-submenu');
  
  submenuItems.forEach(item => {
    const chevronEl = item.querySelector('.chevron');
    if (chevronEl) {
      // Make only the chevron clickable for toggling
      chevronEl.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        item.classList.toggle('expanded');
      });
      
      // If the menu item has a link and is clicked elsewhere, navigate there
      const linkEl = item.querySelector('a');
      if (linkEl) {
        linkEl.addEventListener('click', function(e) {
          // If clicking on the link but not on the chevron
          if (!e.target.closest('.chevron')) {
            // Allow normal navigation
          } else {
            e.preventDefault();
          }
        });
      }
    }
  });
}

/**
 * Initialize form validation
 */
function initFormValidation() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.className = 'alert alert-success';
        successMsg.textContent = 'Form submitted successfully!';
        
        // Remove any existing alerts
        const existingAlerts = contactForm.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Insert at the top of the form
        contactForm.insertBefore(successMsg, contactForm.firstChild);
        
        // Reset form
        contactForm.reset();
      }
    });
  }
}

/**
 * Component creation helpers
 */

/**
 * Create a button element
 * @param {string} text - Button text
 * @param {string} type - Button type (primary, secondary, action)
 * @param {Function} onClick - Click handler
 * @returns {HTMLElement} Button element
 */
function createButton(text, type = 'primary', onClick = null) {
  const button = document.createElement('button');
  button.className = `btn btn-${type}`;
  button.textContent = text;
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Create a card element
 * @param {string} title - Card title
 * @param {string} content - Card content
 * @param {Object} options - Additional options
 * @returns {HTMLElement} Card element
 */
function createCard(title, content, options = {}) {
  const card = document.createElement('div');
  card.className = 'card';
  
  if (options.className) {
    card.className += ` ${options.className}`;
  }
  
  if (title) {
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.marginBottom = 'var(--spacing-sm)';
    card.appendChild(titleEl);
  }
  
  if (content) {
    const contentEl = document.createElement('div');
    contentEl.className = 'card-content';
    
    if (typeof content === 'string') {
      contentEl.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      contentEl.appendChild(content);
    }
    
    card.appendChild(contentEl);
  }
  
  return card;
}

/**
 * Create a form input element
 * @param {string} type - Input type
 * @param {string} name - Input name
 * @param {string} label - Input label
 * @param {Object} options - Additional options
 * @returns {HTMLElement} Form group element containing label and input
 */
function createFormInput(type, name, label, options = {}) {
  const formGroup = document.createElement('div');
  formGroup.className = 'form-group';
  
  const labelEl = document.createElement('label');
  labelEl.className = 'form-label';
  labelEl.htmlFor = name;
  labelEl.textContent = label;
  formGroup.appendChild(labelEl);
  
  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.id = name;
  input.className = 'form-control';
  
  if (options.placeholder) {
    input.placeholder = options.placeholder;
  }
  
  if (options.value) {
    input.value = options.value;
  }
  
  if (options.required) {
    input.required = true;
  }
  
  formGroup.appendChild(input);
  
  return formGroup;
} 