import '../style.css'

async function fetchMenu() {
  try {
    const response = await fetch('http://localhost:4000/menu');
    const menu = await response.json();
    displayMenu(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    document.querySelector('#app').innerHTML = `
      <div>
        <p>Error loading menu. Please make sure the server is running on port 4000.</p>
      </div>
    `;
  }
}

function displayMenu(menu) {
  const app = document.querySelector('#app');
  let menuHTML = `
    <div>
      <h1>${menu.name}</h1>
      <div class="menu-container">
  `;

  menu.items.forEach(item => {
    menuHTML += `
      <div class="menu-item">
        <h2>${item.name}</h2>
        <p class="description">${item.description || ''}</p>
        <p class="price">SEK${item.price}</p>
      </div>
    `;
  });

  menuHTML += `
      </div>
    </div>
  `;

  app.innerHTML = menuHTML;
}

fetchMenu();
