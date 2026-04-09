/* ============================================
   AURUM — Product Detail Script
   ============================================ */

const WHATSAPP_NUMBER = '91XXXXXXXXXX'; // Replace with actual number

function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

function whatsappSVG(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;
}

function getWhatsAppLink(productName, price) {
  const message = encodeURIComponent(
    `Hello! I want to order:\n\nProduct: ${productName}\nPrice: ${formatPrice(price)}\n\nPlease share more details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <a href="product.html?id=${product.id}" class="product-card-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </a>
    <div class="product-card-info">
      <div class="product-card-category">${product.category}</div>
      <a href="product.html?id=${product.id}" class="product-card-name">${product.name}</a>
      <div class="product-card-price">${formatPrice(product.price)}</div>
      <a href="${getWhatsAppLink(product.name, product.price)}" target="_blank" rel="noopener" class="product-card-buy">
        ${whatsappSVG()} Buy on WhatsApp
      </a>
    </div>
  `;
  requestAnimationFrame(() => {
    setTimeout(() => card.classList.add('show'), 100 + index * 100);
  });
  return card;
}

async function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));

  if (!productId) {
    window.location.href = 'products.html';
    return;
  }

  try {
    const res = await fetch('data/products.json');
    const products = await res.json();
    const product = products.find(p => p.id === productId);

    if (!product) {
      window.location.href = 'products.html';
      return;
    }

    // Fill detail
    const detailContainer = document.getElementById('product-detail');
    if (detailContainer) {
      detailContainer.innerHTML = `
        <div class="product-detail-grid">
          <div class="product-detail-image-wrap reveal-left">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="product-detail-info reveal-right">
            <div class="product-detail-breadcrumb">
              <a href="index.html">Home</a> / <a href="products.html">Shop</a> / <a href="products.html?category=${encodeURIComponent(product.category)}">${product.category}</a> / <span>${product.name}</span>
            </div>
            <h1 class="product-detail-name">${product.name}</h1>
            <div class="product-detail-price">${formatPrice(product.price)}</div>
            <div class="product-detail-divider"></div>
            <p class="product-detail-desc">${product.description}</p>
            <div class="product-detail-meta">
              <div class="product-detail-meta-row">
                <span class="product-detail-meta-label">Category</span>
                <span class="product-detail-meta-value">${product.category}</span>
              </div>
              <div class="product-detail-meta-row">
                <span class="product-detail-meta-label">Product ID</span>
                <span class="product-detail-meta-value">#AU-${String(product.id).padStart(4, '0')}</span>
              </div>
              <div class="product-detail-meta-row">
                <span class="product-detail-meta-label">Availability</span>
                <span class="product-detail-meta-value" style="color: #25D366;">In Stock</span>
              </div>
            </div>
            <div class="product-detail-buttons">
              <a href="${getWhatsAppLink(product.name, product.price)}" target="_blank" rel="noopener" class="btn btn-whatsapp">
                ${whatsappSVG(18)} Order on WhatsApp
              </a>
              <a href="tel:+${WHATSAPP_NUMBER}" class="btn btn-dark">
                Call Us
              </a>
            </div>
          </div>
        </div>
      `;

      // Trigger reveal animations
      setTimeout(() => {
        detailContainer.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
          el.classList.add('visible');
        });
      }, 100);
    }

    // Update page title
    document.title = `${product.name} — AURUM`;

    // Related products
    const relatedGrid = document.getElementById('related-grid');
    if (relatedGrid) {
      const related = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

      // If not enough in same category, fill from others
      if (related.length < 4) {
        const others = products.filter(p => p.id !== product.id && !related.includes(p));
        while (related.length < 4 && others.length > 0) {
          related.push(others.shift());
        }
      }

      related.forEach((p, i) => {
        relatedGrid.appendChild(createProductCard(p, i));
      });
    }

  } catch (err) {
    console.error('Error loading product:', err);
    window.location.href = 'products.html';
  }
}

document.addEventListener('DOMContentLoaded', initProductDetail);
