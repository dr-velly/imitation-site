/* ============================================
   AURUM — Main Script
   ============================================ */

const WHATSAPP_NUMBER = '91XXXXXXXXXX'; // Replace with actual number

// --- Page Loader ---
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.page-loader')?.classList.add('loaded');
  }, 800);
});

// --- Navigation ---
(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links?.classList.toggle('open');
    document.body.style.overflow = links?.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// --- Back to Top ---
(() => {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// --- Button Ripple Effect ---
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn, .product-card-buy');
  if (!btn) return;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = btn.getBoundingClientRect();
  ripple.style.left = (e.clientX - rect.left) + 'px';
  ripple.style.top = (e.clientY - rect.top) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// --- Scroll Reveal ---
(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();

// --- Format Price ---
function formatPrice(price) {
  return '₹' + Number(price).toLocaleString('en-IN');
}

// --- WhatsApp Link ---
function getWhatsAppLink(productName, price) {
  const message = encodeURIComponent(
    `Hello! I want to order:\n\nProduct: ${productName}\nPrice: ${formatPrice(price)}\n\nPlease share more details.`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// --- WhatsApp SVG Icon ---
function whatsappSVG(size = 16) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;
}

// --- Create Product Card HTML ---
function createProductCard(product, index) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.style.transitionDelay = `${(index % 8) * 0.08}s`;

  card.innerHTML = `
    <a href="product.html?id=${product.id}" class="product-card-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-card-actions">
        <button class="product-card-action-btn" title="Quick View" onclick="event.preventDefault(); window.location='product.html?id=${product.id}'">♡</button>
      </div>
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

  // Animate in
  requestAnimationFrame(() => {
    setTimeout(() => card.classList.add('show'), 50 + (index % 8) * 80);
  });

  return card;
}

// --- Load & Render Products ---
async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    if (!res.ok) throw new Error('Failed to load products');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// --- Home Page: Featured Products ---
async function initFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  const products = await loadProducts();
  const featured = products.slice(0, 8);

  featured.forEach((product, i) => {
    grid.appendChild(createProductCard(product, i));
  });
}

// --- Products Page: Full Grid + Filtering ---
async function initProductsPage() {
  const grid = document.getElementById('products-grid');
  const filterBar = document.getElementById('filter-bar');
  if (!grid) return;

  const products = await loadProducts();
  let activeFilter = 'All';

  // Build filter buttons
  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (filterBar) {
    filterBar.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-btn${cat === 'All' ? ' active' : ''}`;
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeFilter = cat;
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts();
      });
      filterBar.appendChild(btn);
    });
  }

  function renderProducts() {
    const filtered = activeFilter === 'All'
      ? products
      : products.filter(p => p.category === activeFilter);

    // Fade out existing cards
    const existing = grid.querySelectorAll('.product-card');
    existing.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
    });

    setTimeout(() => {
      grid.innerHTML = '';

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">✦</div>
            <div class="empty-state-text">No products found in this category</div>
          </div>`;
        return;
      }

      filtered.forEach((product, i) => {
        grid.appendChild(createProductCard(product, i));
      });
    }, 250);
  }

  // Handle URL category param
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam && categories.includes(catParam)) {
    activeFilter = catParam;
    filterBar?.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.textContent === catParam);
    });
  }

  renderProducts();
}

// --- Home Page: Category Count ---
async function initCategoryCounts() {
  const products = await loadProducts();
  const counts = {};
  products.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  document.querySelectorAll('[data-category-count]').forEach(el => {
    const cat = el.getAttribute('data-category-count');
    el.textContent = `${counts[cat] || 0} Pieces`;
  });
}

// --- Init based on page ---
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedProducts();
  initProductsPage();
  initCategoryCounts();

  // Re-observe reveals after dynamic content
  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)').forEach(el => {
      observer.observe(el);
    });
  }, 300);
});
