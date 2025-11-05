// Import CSS - webpack will inject it into the page
import './style.css';

// Import the widget code
import { initWidget } from './widget.js';

// Export the widget initialization function
function initStoreLocatorWidget(options = {}) {
  // Allow configuration of API URL
  if (options.apiUrl) {
    window.__STORE_LOCATOR_API_URL__ = options.apiUrl;
  }

  // Initialize the widget
  initWidget();

  // Return the widget API
  return window.storeLocatorWidget;
}

// Auto-initialize when loaded as a script tag
if (typeof window !== 'undefined') {
  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initStoreLocatorWidget();
    });
  } else {
    initStoreLocatorWidget();
  }
}

export default initStoreLocatorWidget;

