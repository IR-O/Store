// Theme JavaScript for Aristial Perfumes

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Aristial Perfumes theme loaded');
  
  // Initialize all components
  initCart();
  initProductImages();
  initAccordions();
  initQuantitySelectors();
  initForms();
  initAnimations();
  initCurrencyFormatter();
});

// Cart functionality
function initCart() {
  // Update cart count
  function updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
          element.textContent = cart.item_count;
        });
      })
      .catch(error => console.error('Error fetching cart:', error));
  }

  // Update cart on page load
  updateCartCount();

  // Listen for cart updates
  document.addEventListener('cart:updated', updateCartCount);
}

// Product image gallery
function initProductImages() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainProductImage');

  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main image
        const img = this.querySelector('img');
        if (img) {
          mainImage.src = img.src.replace('_100x100', '_800x800');
          mainImage.alt = img.alt;
        }
      });
    });
  }
}

// Accordion functionality
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = content.style.maxHeight;

      // Close all accordions
      document.querySelectorAll('.accordion-content').forEach(item => {
        item.style.maxHeight = null;
      });
      document.querySelectorAll('.accordion-icon').forEach(icon => {
        icon.textContent = '+';
      });

      // Open clicked accordion if it was closed
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        this.querySelector('.accordion-icon').textContent = '−';
      }
    });
  });
}

// Quantity selector functionality
function initQuantitySelectors() {
  document.querySelectorAll('.quantity-input').forEach(input => {
    const minusBtn = input.parentElement.querySelector('.quantity-minus');
    const plusBtn = input.parentElement.querySelector('.quantity-plus');

    if (minusBtn) {
      minusBtn.addEventListener('click', function() {
        let value = parseInt(input.value);
        if (value > parseInt(input.min || 1)) {
          input.value = value - 1;
          input.dispatchEvent(new Event('change'));
        }
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener('click', function() {
        let value = parseInt(input.value);
        if (value < parseInt(input.max || 10)) {
          input.value = value + 1;
          input.dispatchEvent(new Event('change'));
        }
      });
    }
  });
}

// Form validation and submission
function initForms() {
  // Newsletter form
  const newsletterForm = document.getElementById('footerNewsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      
      if (validateEmail(email)) {
        // Submit form (you would typically send this to your backend)
        showNotification('Thank you for subscribing!', 'success');
        this.reset();
      } else {
        showNotification('Please enter a valid email address', 'error');
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('input[name="name"]').value;
      const email = this.querySelector('input[name="email"]').value;
      const message = this.querySelector('textarea[name="message"]').value;
      
      if (name && validateEmail(email) && message) {
        // Submit form
        showNotification('Message sent successfully!', 'success');
        this.reset();
      } else {
        showNotification('Please fill in all fields correctly', 'error');
      }
    });
  }
}

// Animations
function initAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document.querySelectorAll('.fade-in, .slide-up').forEach(element => {
    observer.observe(element);
  });

  // Sticky header
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }
}

// Currency formatting for INR
function initCurrencyFormatter() {
  window.formatINR = function(amount) {
    // Convert from paise to rupees if needed
    if (amount > 1000) {
      amount = amount / 100;
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
}

// Utility functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1.5rem 2rem;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Product variant selection
function updateVariantSelection(variantId) {
  const form = document.querySelector('.product-form');
  if (form) {
    const hiddenInput = form.querySelector('input[name="id"]');
    if (hiddenInput) {
      hiddenInput.value = variantId;
    }
  }
}

// Add to cart with AJAX
async function addToCart(variantId, quantity = 1) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          id: variantId,
          quantity: quantity
        }]
      })
    });

    if (response.ok) {
      const cart = await response.json();
      
      // Update cart count
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      // Show success notification
      showNotification('Product added to cart!', 'success');
      
      return cart;
    } else {
      throw new Error('Failed to add to cart');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('Failed to add product to cart', 'error');
    throw error;
  }
}

// Remove from cart
async function removeFromCart(variantId) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 0
      })
    });

    if (response.ok) {
      const cart = await response.json();
      
      // Update cart count
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      // Show success notification
      showNotification('Product removed from cart', 'info');
      
      return cart;
    } else {
      throw new Error('Failed to remove from cart');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    showNotification('Failed to remove product from cart', 'error');
    throw error;
  }
}

// Update cart quantity
async function updateCartQuantity(variantId, quantity) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    });

    if (response.ok) {
      const cart = await response.json();
      
      // Update cart count
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      return cart;
    } else {
      throw new Error('Failed to update cart');
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    showNotification('Failed to update cart', 'error');
    throw error;
  }
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for global use
window.AristialTheme = {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  showNotification,
  formatINR
};
