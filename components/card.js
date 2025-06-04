/**
 * Card Component
 * 
 * Usage:
 * const cardElement = Card.create({
 *   title: 'Card Title',
 *   content: 'Card content goes here',
 *   footer: 'Optional footer',
 *   className: 'additional-class'
 * });
 * 
 * document.querySelector('.container').appendChild(cardElement);
 */

const Card = {
  /**
   * Create a card component
   * @param {Object} options - Card options
   * @param {string} options.title - Card title
   * @param {string|HTMLElement} options.content - Card content
   * @param {string|HTMLElement} options.footer - Card footer
   * @param {string} options.className - Additional CSS classes
   * @returns {HTMLElement} Card element
   */
  create: function(options = {}) {
    const card = document.createElement('div');
    card.className = 'card';
    
    if (options.className) {
      card.className += ` ${options.className}`;
    }
    
    // Card header
    if (options.title) {
      const header = document.createElement('div');
      header.className = 'card-header';
      
      const title = document.createElement('h3');
      title.className = 'card-title';
      title.textContent = options.title;
      
      header.appendChild(title);
      card.appendChild(header);
    }
    
    // Card content
    const content = document.createElement('div');
    content.className = 'card-content';
    
    if (options.content) {
      if (typeof options.content === 'string') {
        content.innerHTML = options.content;
      } else if (options.content instanceof HTMLElement) {
        content.appendChild(options.content);
      }
    }
    
    card.appendChild(content);
    
    // Card footer
    if (options.footer) {
      const footer = document.createElement('div');
      footer.className = 'card-footer';
      
      if (typeof options.footer === 'string') {
        footer.innerHTML = options.footer;
      } else if (options.footer instanceof HTMLElement) {
        footer.appendChild(options.footer);
      }
      
      card.appendChild(footer);
    }
    
    return card;
  },
  
  /**
   * Create a card with a button
   * @param {string} title - Card title
   * @param {string} content - Card content
   * @param {Object} buttonOptions - Button options
   * @param {string} buttonOptions.text - Button text
   * @param {string} buttonOptions.type - Button type (primary, secondary, action)
   * @param {Function} buttonOptions.onClick - Click handler
   * @returns {HTMLElement} Card element with button in footer
   */
  createWithButton: function(title, content, buttonOptions) {
    const button = document.createElement('button');
    button.className = `btn btn-${buttonOptions.type || 'primary'}`;
    button.textContent = buttonOptions.text || 'Button';
    
    if (buttonOptions.onClick) {
      button.addEventListener('click', buttonOptions.onClick);
    }
    
    return this.create({
      title: title,
      content: content,
      footer: button
    });
  }
}; 