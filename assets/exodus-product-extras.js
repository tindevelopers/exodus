/**
 * Exodus Product Extras
 * Handles:
 *  1. Variant card selection (AG1-style cards)
 *  2. Selling plan picker (Subscribe & Save / Buy one time)
 */

(function () {
  'use strict';

  /* ── Variant Cards ── */
  function initVariantCards() {
    const cards = document.querySelectorAll('.exodus-vc__card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const variantId = this.dataset.variantId;
        if (!variantId || this.disabled) return;

        // Update active state
        cards.forEach(function (c) { c.classList.remove('exodus-vc__card--active'); });
        this.classList.add('exodus-vc__card--active');

        // Update hidden variant input in the product form
        const variantInputs = document.querySelectorAll('input.product-variant-id');
        variantInputs.forEach(function (input) {
          input.value = variantId;
          input.disabled = false;
        });

        // Also update the hidden Dawn variant picker to keep it in sync
        const hiddenPicker = document.querySelector('.exodus-hidden-variant-picker');
        if (hiddenPicker) {
          // Find the variant-selects custom element
          const variantSelects = hiddenPicker.querySelector('variant-selects');
          if (variantSelects) {
            // Try to find the matching variant data from the JSON script
            const jsonScript = variantSelects.querySelector('script[data-selected-variant]');
            if (jsonScript) {
              // We need to trigger Dawn's variant change mechanism
              // The simplest way is to dispatch a change event on the section
            }
          }
        }

        // Dispatch a custom event for other components to react
        document.dispatchEvent(new CustomEvent('exodus:variant:change', {
          detail: { variantId: variantId }
        }));

        // Trigger URL update
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variantId);
        window.history.replaceState({}, '', url.toString());

        // Trigger section re-render by fetching the new variant's section HTML
        refreshSection(variantId);
      });
    });
  }

  function refreshSection(variantId) {
    const sectionId = document.querySelector('product-info')?.dataset?.section
      || document.querySelector('[id^="ProductInfo-"]')?.id?.replace('ProductInfo-', '');

    if (!sectionId) return;

    const url = window.location.pathname + '?variant=' + variantId + '&section_id=' + sectionId;

    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Update price
        const newPrice = doc.querySelector('#price-' + sectionId);
        const currentPrice = document.querySelector('#price-' + sectionId);
        if (newPrice && currentPrice) {
          currentPrice.innerHTML = newPrice.innerHTML;
        }

        // Update buy button state
        const newBtn = doc.querySelector('#ProductSubmitButton-' + sectionId);
        const currentBtn = document.querySelector('#ProductSubmitButton-' + sectionId);
        if (newBtn && currentBtn) {
          currentBtn.disabled = newBtn.disabled;
          currentBtn.querySelector('span').textContent = newBtn.querySelector('span')?.textContent || '';
        }

        // Update variant input
        const newInput = doc.querySelector('input.product-variant-id');
        const currentInputs = document.querySelectorAll('input.product-variant-id');
        if (newInput) {
          currentInputs.forEach(function (input) {
            input.value = newInput.value;
            input.disabled = newInput.disabled;
          });
        }

        // Update media gallery if available
        const newMedia = doc.querySelector('.product__media-wrapper');
        const currentMedia = document.querySelector('.product__media-wrapper');
        if (newMedia && currentMedia) {
          currentMedia.innerHTML = newMedia.innerHTML;
        }

        // Re-init selling plan prices for new variant
        updateSellingPlanPricesForVariant();

        // Re-init variant cards active state
        const cards = document.querySelectorAll('.exodus-vc__card');
        cards.forEach(function (c) {
          c.classList.toggle('exodus-vc__card--active', c.dataset.variantId === variantId);
        });
      })
      .catch(function (err) {
        console.warn('Exodus: section refresh failed', err);
      });
  }

  /* ── Selling Plan Picker ── */
  function initSellingPlanPicker() {
    const options = document.querySelectorAll('.exodus-sp__option');
    if (!options.length) return;

    options.forEach(function (option) {
      const radio = option.querySelector('.exodus-sp__radio');
      if (!radio) return;

      option.addEventListener('click', function (e) {
        // Don't double-trigger if clicking the radio itself
        if (e.target === radio) return;
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      });

      radio.addEventListener('change', function () {
        // Update active states
        options.forEach(function (o) { o.classList.remove('exodus-sp__option--active'); });
        option.classList.add('exodus-sp__option--active');

        // Update hidden selling_plan input in the form
        const planId = this.value || '';
        const planInputs = document.querySelectorAll('.exodus-selling-plan-input');
        planInputs.forEach(function (input) {
          input.value = planId;
        });

        document.dispatchEvent(new CustomEvent('exodus:sellingplan:change', {
          detail: { sellingPlanId: planId }
        }));
      });
    });

    // Set initial selling plan value
    const checkedRadio = document.querySelector('.exodus-sp__radio:checked');
    if (checkedRadio) {
      const planInputs = document.querySelectorAll('.exodus-selling-plan-input');
      planInputs.forEach(function (input) {
        input.value = checkedRadio.value || '';
      });
    }
  }

  function updateSellingPlanPricesForVariant() {
    // This would need product JSON data to update subscription prices per variant
    // For now, the page refresh handles it
  }

  /* ── Init ── */
  function init() {
    initVariantCards();
    initSellingPlanPicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
