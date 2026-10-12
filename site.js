/* SEAcare – shared navigation glue (front-end only).
   Links the pages together for elements that are not plain <a> tags. */
(function () {
  var PAGES = {
    home: 'index.html', shop: 'shopall.html', cart: 'cart.html',
    checkout: 'checkout.html', account: 'account.html',
    product: 'productdetails.html', order: 'order-details.html'
  };
  var go = function (url) { window.location.href = url; };
  var text = function (el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); };

  document.addEventListener('DOMContentLoaded', function () {

    /* 1) Header bag button -> cart page */
    document.querySelectorAll('header button').forEach(function (btn) {
      if (/^الحقيبة/.test(text(btn))) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', function () { go(PAGES.cart); });
      }
    });

    /* 2) Product cards -> product details page
          (clicking the image, title or empty area; buttons/links keep their own behaviour) */
    document.querySelectorAll('article').forEach(function (card) {
      if (card.closest('#cartItemsList')) return;
      if (!card.querySelector('h3') || !card.querySelector('img')) return;
      var hasAdd = Array.prototype.some.call(card.querySelectorAll('button'), function (b) {
        return /أضف/.test(text(b));
      });
      if (!hasAdd) return;
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('button, a, input, select, label')) return;
        go(PAGES.product);
      });
    });

    /* 3) Checkout confirm button -> order details page (demo flow) */
    document.querySelectorAll('button').forEach(function (btn) {
      if (/تأكيد الطلب/.test(text(btn))) {
        btn.addEventListener('click', function (e) { e.preventDefault(); go(PAGES.order); });
      }
    });

    /* 4) Order details: "back to orders" style buttons are anchors (handled in HTML) */

    /* 5) shopall.html#category -> pre-select that category filter */
    var catBoxes = document.querySelectorAll('.filter-checkbox-cat');
    if (catBoxes.length) {
      var applyHash = function () {
        var h = (location.hash || '').replace('#', '');
        if (!h) return;
        var target = null;
        catBoxes.forEach(function (cb) { if (cb.value === h) target = cb; });
        if (!target) return;                       // e.g. #gifts / #all -> show everything
        catBoxes.forEach(function (cb) { cb.checked = (cb === target); });
        target.dispatchEvent(new Event('change', { bubbles: true }));
        var grid = document.getElementById('productGrid');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      applyHash();
      window.addEventListener('hashchange', applyHash);
    }

    /* 6) Mobile filter panel toggle (shopall / category) */
    var fBtn = document.getElementById('mobileFilterToggleBtn');
    var fBox = document.getElementById('filterSidebar');
    if (fBtn && fBox) {
      fBtn.setAttribute('aria-expanded', 'false');
      fBtn.addEventListener('click', function (e) {
        e.stopImmediatePropagation();
        var open = fBox.classList.toggle('open');
        fBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) fBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, true);
    }
  });
})();
