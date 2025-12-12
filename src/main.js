// API'dan mahsulotlarni yuklash va ko'rsatish
async function loadProducts() {
  const container = document.getElementById('products-container');
  
  if (!container) {
    console.error('Products container not found');
    return;
  }

  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div>Yuklanmoqda...</div></div>';

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('API xatosi');
    
    const products = await response.json();
    renderProducts(products, container);
  } catch (error) {
    container.innerHTML = `
      <div class="error">
        ❌ Xatolik: ${error.message}
        <br><br>
        <button class="btn btn-primary" onclick="location.reload()">Qayta urinish</button>
      </div>
    `;
  }
}

function renderProducts(products, container) {
  const html = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${escapeHtml(p.title)}" class="product-image"/>
      <h3 class="product-title">${escapeHtml(p.title)}</h3>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <button class="btn btn-primary add-to-cart-btn" data-product='${JSON.stringify({id: p.id, title: p.title, price: p.price, image: p.image})}'>
        Add to Cart
      </button>
    </div>
  `).join('');

  container.innerHTML = `<div class="products-grid">${html}</div>`;

  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const product = JSON.parse(e.target.dataset.product);
      window.dispatchEvent(new CustomEvent('addToCart', { detail: product }));
      
      e.target.textContent = '✓ Added!';
      e.target.style.backgroundColor = '#48bb78';
      
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.style.backgroundColor = '';
      }, 1000);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProducts);
} else {
  loadProducts();
}