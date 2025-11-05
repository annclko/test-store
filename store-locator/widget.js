(function() {
  'use strict';

  // Widget configuration
  const WIDGET_ID = 'store-locator-widget';
  const WIDGET_URL = 'http://localhost:4001';

  // Create unique namespace for this widget
  const widgetNamespace = {
    stores: [],
    filteredStores: [],
    selectedStore: null,
    searchTimeout: null
  };

  // Load CSS
  function loadCSS() {
    if (document.getElementById('store-locator-css')) return;

    const link = document.createElement('link');
    link.id = 'store-locator-css';
    link.rel = 'stylesheet';
    link.href = `${WIDGET_URL}/style.css`;
    document.head.appendChild(link);
  }

  // Create widget HTML
  function createWidgetHTML() {
    const container = document.getElementById(WIDGET_ID) || document.body;

    const widgetHTML = `
      <div class="store-locator">
        <div class="header">
          <h1>Store Locator</h1>
          <div class="search-container">
            <input
              type="text"
              id="storeLocatorSearchInput"
              placeholder="Search by city, state, or zip code..."
            >
            <button id="storeLocatorSearchBtn">Search</button>
          </div>
        </div>
        <div class="content">
          <div class="stores-list" id="storeLocatorStoresList">
            <div class="loading">Loading stores...</div>
          </div>
          <div class="store-details" id="storeLocatorStoreDetails">
            <div class="empty">Select a store to view details</div>
          </div>
        </div>
      </div>
    `;

    if (container.id === WIDGET_ID) {
      container.innerHTML = widgetHTML;
    } else {
      const div = document.createElement('div');
      div.id = WIDGET_ID;
      div.innerHTML = widgetHTML;
      container.appendChild(div);
    }
  }

  // Load stores from API
  async function loadStores() {
    const listEl = document.getElementById('storeLocatorStoresList');
    if (!listEl) {
      console.error('Store locator list element not found');
      return;
    }

    try {
      console.log('Fetching stores from:', `${WIDGET_URL}/locations`);
      const response = await fetch(`${WIDGET_URL}/locations`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received stores data:', data?.length || 'No data');

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      widgetNamespace.stores = data;
      widgetNamespace.filteredStores = widgetNamespace.stores;
      renderStores();
    } catch (error) {
      console.error('Error fetching stores:', error);
      listEl.innerHTML =
        `<div class="error">Error loading stores: ${error.message}<br>Make sure the server is running on ${WIDGET_URL}</div>`;
    }
  }

  // Render stores list
  function renderStores() {
    const listEl = document.getElementById('storeLocatorStoresList');
    if (!listEl) {
      console.error('Store locator list element not found');
      return;
    }

    if (!widgetNamespace.filteredStores || widgetNamespace.filteredStores.length === 0) {
      listEl.innerHTML = '<div class="empty">No stores found</div>';
      return;
    }

    listEl.innerHTML = widgetNamespace.filteredStores.map(store => {
      const city = store.address?.city?.[0]?.name || 'N/A';
      const state = store.address?.state?.[0]?.name || 'N/A';
      const zip = store.address?.zip || '';
      const street = store.address?.street || '';

      return `
        <div class="store-item ${widgetNamespace.selectedStore?.storeId === store.storeId ? 'selected' : ''}"
             onclick="window.storeLocatorWidget.selectStore('${store.storeId}')">
          <h3>${store.name}</h3>
          <div class="address">
            ${street}<br>
            ${city}, ${state} ${zip}
          </div>
          <div class="contact">
            ${store.contact?.phone || ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // Select a store
  function selectStore(storeId) {
    widgetNamespace.selectedStore = widgetNamespace.stores.find(s => s.storeId === storeId);
    renderStoreDetails();
    renderStores();
  }

  // Render store details
  function renderStoreDetails() {
    const detailsEl = document.getElementById('storeLocatorStoreDetails');

    if (!widgetNamespace.selectedStore) {
      detailsEl.innerHTML = '<div class="empty">Select a store to view details</div>';
      return;
    }

    const city = widgetNamespace.selectedStore.address?.city?.[0]?.name || 'N/A';
    const state = widgetNamespace.selectedStore.address?.state?.[0]?.name || 'N/A';
    const zip = widgetNamespace.selectedStore.address?.zip || '';
    const street = widgetNamespace.selectedStore.address?.street || '';
    const country = widgetNamespace.selectedStore.address?.country?.[0]?.name || '';

    let hoursHtml = '';
    if (widgetNamespace.selectedStore.openingHours?.regular) {
      hoursHtml = widgetNamespace.selectedStore.openingHours.regular.map(day => {
        return `${day.day}: ${day.open || 'Closed'}`;
      }).join('<br>');
    }

    detailsEl.innerHTML = `
      <h2>${widgetNamespace.selectedStore.name}</h2>

      <div class="section">
        <h3>Address</h3>
        <div class="info">
          ${street}<br>
          ${city}, ${state} ${zip}<br>
          ${country}
        </div>
      </div>

      ${widgetNamespace.selectedStore.shortDescription ? `
      <div class="section">
        <h3>Description</h3>
        <div class="info">${widgetNamespace.selectedStore.shortDescription}</div>
      </div>
      ` : ''}

      ${widgetNamespace.selectedStore.contact ? `
      <div class="section">
        <h3>Contact</h3>
        <div class="info">
          ${widgetNamespace.selectedStore.contact.phone ? `Phone: ${widgetNamespace.selectedStore.contact.phone}<br>` : ''}
          ${widgetNamespace.selectedStore.contact.email ? `Email: ${widgetNamespace.selectedStore.contact.email}<br>` : ''}
          ${widgetNamespace.selectedStore.contact.website ? `Website: <a href="${widgetNamespace.selectedStore.contact.website}" target="_blank">${widgetNamespace.selectedStore.contact.website}</a>` : ''}
        </div>
      </div>
      ` : ''}

      ${hoursHtml ? `
      <div class="section">
        <h3>Opening Hours</h3>
        <div class="info hours">${hoursHtml}</div>
      </div>
      ` : ''}

      ${widgetNamespace.selectedStore.geoLocation ? `
      <div class="section">
        <h3>Location</h3>
        <div class="info">
          Lat: ${widgetNamespace.selectedStore.geoLocation.lat}, Lon: ${widgetNamespace.selectedStore.geoLocation.lon}
        </div>
      </div>
      ` : ''}
    `;
  }

  // Search stores
  function searchStores() {
    const query = document.getElementById('storeLocatorSearchInput').value.toLowerCase().trim();

    if (!query) {
      widgetNamespace.filteredStores = widgetNamespace.stores;
    } else {
      widgetNamespace.filteredStores = widgetNamespace.stores.filter(store => {
        const city = store.address?.city?.[0]?.name?.toLowerCase() || '';
        const state = store.address?.state?.[0]?.name?.toLowerCase() || '';
        const zip = store.address?.zip?.toLowerCase() || '';
        const name = store.name?.toLowerCase() || '';
        const street = store.address?.street?.toLowerCase() || '';

        return city.includes(query) ||
               state.includes(query) ||
               zip.includes(query) ||
               name.includes(query) ||
               street.includes(query);
      });
    }

    widgetNamespace.selectedStore = null;
    renderStores();
    renderStoreDetails();
  }

  // Debounce search
  function debounceSearch() {
    clearTimeout(widgetNamespace.searchTimeout);
    widgetNamespace.searchTimeout = setTimeout(() => {
      searchStores();
    }, 300);
  }

  // Initialize widget
  function init() {
    loadCSS();
    createWidgetHTML();

    // Set up event listeners
    const searchInput = document.getElementById('storeLocatorSearchInput');
    const searchBtn = document.getElementById('storeLocatorSearchBtn');

    if (searchBtn) {
      searchBtn.addEventListener('click', searchStores);
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(widgetNamespace.searchTimeout);
          searchStores();
        }
      });

      searchInput.addEventListener('input', debounceSearch);
    }

    // Load stores
    loadStores();
  }

  // Expose widget API
  window.storeLocatorWidget = {
    selectStore: selectStore,
    searchStores: searchStores,
    init: init
  };

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

