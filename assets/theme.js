window.theme = window.theme || {};

/* ================ SLATE ================ */
window.theme = window.theme || {};

theme.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on("shopify:section:load", this._onSectionLoad.bind(this))
    .on("shopify:section:unload", this._onSectionUnload.bind(this))
    .on("shopify:section:select", this._onSelect.bind(this))
    .on("shopify:section:deselect", this._onDeselect.bind(this))
    .on("shopify:block:select", this._onBlockSelect.bind(this))
    .on("shopify:block:deselect", this._onBlockDeselect.bind(this));
};

theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype, {
  _createInstance: function (container, constructor) {
    var $container = $(container);
    var id = $container.attr("data-section-id");
    var type = $container.attr("data-section-type");

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container,
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function (evt) {
    var container = $("[data-section-id]", evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function (evt) {
    this.instances = _.filter(this.instances, function (instance) {
      var isEventInstance = instance.id === evt.detail.sectionId;

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function (evt) {
    // eslint-disable-next-line no-shadow
    var instance = _.find(this.instances, function (instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function (type, constructor) {
    this.constructors[type] = constructor;

    $("[data-section-type=" + type + "]").each(
      function (index, container) {
        this._createInstance(container, constructor);
      }.bind(this)
    );
  },
});

window.slate = window.slate || {};

/**
 * Slate utilities
 * -----------------------------------------------------------------------------
 * A collection of useful utilities to help build your theme
 *
 *
 * @namespace utils
 */

slate.utils = {
  /**
   * Get the query params in a Url
   * Ex
   * https://mysite.com/search?q=noodles&b
   * getParameterByName('q') = "noodles"
   * getParameterByName('b') = "" (empty value)
   * getParameterByName('test') = null (absent)
   */
  getParameterByName: function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },

  resizeSelects: function ($selects) {
    $selects.each(function () {
      var $this = $(this);
      var arrowWidth = 10;
      // create test element
      var text = $this.find("option:selected").text();
      var $test = $("<span>").html(text);

      // add to body, get width, and get out
      $test.appendTo("body");
      var width = $test.width();
      $test.remove();

      // set select width
      $this.width(width + arrowWidth);
    });
  },

  keyboardKeys: {
    TAB: 9,
    ENTER: 13,
    ESCAPE: 27,
    LEFTARROW: 37,
    RIGHTARROW: 39,
  },
};

window.slate = window.slate || {};

/**
 * iFrames
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace iframes
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function (options) {
    options.$tables.wrap(
      '<div class="' + options.tableWrapperClass + '"></div>'
    );
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function (options) {
    options.$iframes.each(function () {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + options.iframeWrapperClass + '"></div>');

      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  },
};

window.slate = window.slate || {};

/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {
  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function ($element) {
    var focusClass = "js-focus-hidden";

    $element
      .first()
      .attr("tabIndex", "-1")
      .focus()
      .addClass(focusClass)
      .one("blur", callback);

    function callback() {
      $element.first().removeClass(focusClass).removeAttr("tabindex");
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function () {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function () {
    $("a[href*=#]").on(
      "click",
      function (evt) {
        this.pageLinkFocus($(evt.currentTarget.hash));
      }.bind(this)
    );
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function (options) {
    var eventsName = {
      focusin: options.namespace ? "focusin." + options.namespace : "focusin",
      focusout: options.namespace
        ? "focusout." + options.namespace
        : "focusout",
      keydown: options.namespace
        ? "keydown." + options.namespace
        : "keydown.handleFocus",
    };

    /**
     * Get every possible visible focusable element
     */
    var $focusableElements = options.$container.find(
      $(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      ).filter(":visible")
    );
    var firstFocusable = $focusableElements[0];
    var lastFocusable = $focusableElements[$focusableElements.length - 1];

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    function _manageFocus(evt) {
      if (evt.keyCode !== slate.utils.keyboardKeys.TAB) return;

      /**
       * On the last focusable element and tab forward,
       * focus the first element.
       */
      if (evt.target === lastFocusable && !evt.shiftKey) {
        evt.preventDefault();
        firstFocusable.focus();
      }
      /**
       * On the first focusable element and tab backward,
       * focus the last element.
       */
      if (evt.target === firstFocusable && evt.shiftKey) {
        evt.preventDefault();
        lastFocusable.focus();
      }
    }

    options.$container.attr("tabindex", "-1");
    options.$elementToFocus.focus();

    $(document).off("focusin");

    $(document).on(eventsName.focusout, function () {
      $(document).off(eventsName.keydown);
    });

    $(document).on(eventsName.focusin, function (evt) {
      if (evt.target !== lastFocusable && evt.target !== firstFocusable) return;

      $(document).on(eventsName.keydown, function (evt) {
        _manageFocus(evt);
      });
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function (options) {
    var eventName = options.namespace
      ? "focusin." + options.namespace
      : "focusin";

    if (options.$container && options.$container.length) {
      options.$container.removeAttr("tabindex");
    }

    $(document).off(eventName);
  },

  /**
   * Add aria-describedby attribute to external and new window links
   *
   * @param {object} options - Options to be used
   * @param {object} options.messages - Custom messages to be used
   * @param {jQuery} options.$links - Specific links to be targeted
   */
  accessibleLinks: function (options) {
    var body = document.querySelector("body");

    var idSelectors = {
      newWindow: "a11y-new-window-message",
      external: "a11y-external-message",
      newWindowExternal: "a11y-new-window-external-message",
    };

    if (options.$links === undefined || !options.$links.jquery) {
      options.$links = $("a[href]:not([aria-describedby])");
    }

    function generateHTML(customMessages) {
      if (typeof customMessages !== "object") {
        customMessages = {};
      }

      var messages = $.extend(
        {
          newWindow: "Opens in a new window.",
          external: "Opens external website.",
          newWindowExternal: "Opens external website in a new window.",
        },
        customMessages
      );

      var container = document.createElement("ul");
      var htmlMessages = "";

      for (var message in messages) {
        htmlMessages +=
          "<li id=" + idSelectors[message] + ">" + messages[message] + "</li>";
      }

      container.setAttribute("hidden", true);
      container.innerHTML = htmlMessages;

      body.appendChild(container);
    }

    function _externalSite($link) {
      var hostname = window.location.hostname;

      return $link[0].hostname !== hostname;
    }

    $.each(options.$links, function () {
      var $link = $(this);
      var target = $link.attr("target");
      var rel = $link.attr("rel");
      var isExternal = _externalSite($link);
      var isTargetBlank = target === "_blank";

      if (isExternal) {
        $link.attr("aria-describedby", idSelectors.external);
      }
      if (isTargetBlank) {
        if (rel === undefined || rel.indexOf("noopener") === -1) {
          $link.attr("rel", function (i, val) {
            var relValue = val === undefined ? "" : val + " ";
            return relValue + "noopener";
          });
        }
        $link.attr("aria-describedby", idSelectors.newWindow);
      }
      if (isExternal && isTargetBlank) {
        $link.attr("aria-describedby", idSelectors.newWindowExternal);
      }
    });

    generateHTML(options.messages);
  },
};

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

theme.Images = (function () {
  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === "string") {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback
   */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

  /**
   * +++ Useful
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(
      /.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\\.@]/
    );

    if (match !== null) {
      if (match[2] !== undefined) {
        return match[1] + match[2];
      } else {
        return match[1];
      }
    } else {
      return null;
    }
  }

  /**
   * +++ Useful
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === "master") {
      return this.removeProtocol(src);
    }

    var match = src.match(
      /\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i
    );

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + "_" + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, "");
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol,
  };
})();

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 * Alternatives
 * - Accounting.js - http://openexchangerates.github.io/accounting.js/
 *
 */

theme.Currency = (function () {
  var moneyFormat = "${{amount}}"; // eslint-disable-line camelcase

  function formatMoney(cents, format) {
    if (typeof cents === "string") {
      cents = cents.replace(".", "");
    }
    var value = "";
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ",";
      decimal = decimal || ".";

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split(".");
      var dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        "$1" + thousands
      );
      var centsAmount = parts[1] ? decimal + parts[1] : "";

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
        value = formatWithDelimiters(cents, 2);
        break;
      case "amount_no_decimals":
        value = formatWithDelimiters(cents, 0);
        break;
      case "amount_with_comma_separator":
        value = formatWithDelimiters(cents, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        value = formatWithDelimiters(cents, 0, ".", ",");
        break;
      case "amount_no_decimals_with_space_separator":
        value = formatWithDelimiters(cents, 0, " ");
        break;
      case "amount_with_apostrophe_separator":
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney,
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist.  Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function () {
  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on(
      "change",
      this._onSelectChange.bind(this)
    );
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function () {
      var currentOptions = _.map(
        $(this.singleOptionSelector, this.$container),
        function (element) {
          var $element = $(element);
          var type = $element.attr("type");
          var currentOption = {};

          if (type === "radio" || type === "checkbox") {
            if ($element[0].checked) {
              currentOption.value = $element.val();
              currentOption.index = $element.data("index");

              return currentOption;
            } else {
              return false;
            }
          } else {
            currentOption.value = $element.val();
            currentOption.index = $element.data("index");

            return currentOption;
          }
        }
      );

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = _.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function () {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = _.find(variants, function (variant) {
        return selectedValues.every(function (values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function () {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: "variantChange",
        variant: variant,
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function (variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (
        !variant.featured_image ||
        variantImage.src === currentVariantImage.src
      ) {
        return;
      }

      this.$container.trigger({
        type: "variantImageChange",
        variant: variant,
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function (variant) {
      if (
        variant.price === this.currentVariant.price &&
        variant.compare_at_price === this.currentVariant.compare_at_price
      ) {
        return;
      }

      this.$container.trigger({
        type: "variantPriceChange",
        variant: variant,
      });
    },

    /**
     * Trigger event when variant sku changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantSKUChange
     */
    _updateSKU: function (variant) {
      if (variant.sku === this.currentVariant.sku) {
        return;
      }

      this.$container.trigger({
        type: "variantSKUChange",
        variant: variant,
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function (variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?variant=" +
        variant.id;
      window.history.replaceState({ path: newurl }, "", newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function (variant) {
      $(this.originalSelectorId, this.$container).val(variant.id);
    },
  });

  return Variants;
})();

/* ================ GLOBAL ================ */
/*============================================================================
  Drawer modules
==============================================================================*/
theme.Drawers = (function () {
  function Drawer(id, position, options) {
    var DEFAULT_OPEN_CLASS = "js-drawer-open";
    var DEFAULT_CLOSE_CLASS = "js-drawer-close";

    var defaults = {
      selectors: {
        openVariant: "." + DEFAULT_OPEN_CLASS + "-" + position,
        close: "." + DEFAULT_CLOSE_CLASS,
      },
      classes: {
        open: DEFAULT_OPEN_CLASS,
        openVariant: DEFAULT_OPEN_CLASS + "-" + position,
      },
      withPredictiveSearch: false,
    };

    this.nodes = {
      $parent: $("html").add("body"),
      $page: $("#PageContainer"),
    };

    this.config = $.extend(defaults, options);
    this.position = position;
    this.$drawer = $("#" + id);

    if (!this.$drawer.length) {
      return false;
    }

    this.drawerIsOpen = false;
    this.init();
  }

  Drawer.prototype.init = function () {
    $(this.config.selectors.openVariant).on("click", $.proxy(this.open, this));
    this.$drawer.on(
      "click",
      this.config.selectors.close,
      $.proxy(this.close, this)
    );
  };

  Drawer.prototype.open = function (evt) {
    // Keep track if drawer was opened from a click, or called by another function
    var externalCall = false;

    // Prevent following href if link is clicked
    if (evt) {
      evt.preventDefault();
    } else {
      externalCall = true;
    }

    // Without this, the drawer opens, the click event bubbles up to nodes.$page
    // which closes the drawer.
    if (evt && evt.stopPropagation) {
      evt.stopPropagation();
      // save the source of the click, we'll focus to this on close
      this.$activeSource = $(evt.currentTarget);
    }

    if (this.drawerIsOpen && !externalCall) {
      return this.close();
    }

    // Add is-transitioning class to moved elements on open so drawer can have
    // transition for close animation
    if (!this.config.withPredictiveSearch) {
      this.$drawer.prepareTransition();
    }

    this.nodes.$parent.addClass(
      this.config.classes.open + " " + this.config.classes.openVariant
    );
    this.drawerIsOpen = true;

    // Run function when draw opens if set
    if (
      this.config.onDrawerOpen &&
      typeof this.config.onDrawerOpen === "function"
    ) {
      if (!externalCall) {
        this.config.onDrawerOpen();
      }
    }

    if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
      this.$activeSource.attr("aria-expanded", "true");
    }

    // Set focus on drawer
    var trapFocusConfig = {
      $container: this.$drawer,
      namespace: "drawer_focus",
    };
    if (this.config.$elementToFocusOnOpen) {
      trapFocusConfig.$elementToFocus = this.config.$elementToFocusOnOpen;
    }

    slate.a11y.trapFocus(trapFocusConfig);

    this.bindEvents();

    return this;
  };

  Drawer.prototype.close = function () {
    if (!this.drawerIsOpen) {
      // don't close a closed drawer
      return;
    }

    // deselect any focused form elements
    $(document.activeElement).trigger("blur");

    // Ensure closing transition is applied to moved elements, like the nav
    if (!this.config.withPredictiveSearch) {
      this.$drawer.prepareTransition();
    }

    this.nodes.$parent.removeClass(
      this.config.classes.open + " " + this.config.classes.openVariant
    );

    if (this.$activeSource && this.$activeSource.attr("aria-expanded")) {
      this.$activeSource.attr("aria-expanded", "false");
    }

    this.drawerIsOpen = false;

    // Remove focus on drawer
    slate.a11y.removeTrapFocus({
      $container: this.$drawer,
      namespace: "drawer_focus",
    });

    this.unbindEvents();

    // Run function when draw closes if set
    if (
      this.config.onDrawerClose &&
      typeof this.config.onDrawerClose === "function"
    ) {
      this.config.onDrawerClose();
    }
  };

  Drawer.prototype.bindEvents = function () {
    this.nodes.$parent.on(
      "keyup.drawer",
      $.proxy(function (evt) {
        // close on 'esc' keypress
        if (evt.keyCode === 27) {
          this.close();
          return false;
        } else {
          return true;
        }
      }, this)
    );

    // Lock scrolling on mobile
    this.nodes.$page.on("touchmove.drawer", function () {
      return false;
    });

    this.nodes.$page.on(
      "click.drawer",
      $.proxy(function () {
        this.close();
        return false;
      }, this)
    );
  };

  Drawer.prototype.unbindEvents = function () {
    this.nodes.$page.off(".drawer");
    this.nodes.$parent.off(".drawer");
  };

  return Drawer;
})();

theme.Helpers = (function () {
  var touchDevice = false;

  function setTouch() {
    touchDevice = true;
  }

  function isTouch() {
    return touchDevice;
  }
  return {
    setTouch: setTouch,
    isTouch: isTouch,
  };
})();

theme.LibraryLoader = (function () {
  var types = {
    link: "link",
    script: "script",
  };

  var status = {
    requested: "requested",
    loaded: "loaded",
  };

  var cloudCdn = "https://cdn.shopify.com/shopifycloud/";

  var libraries = {
    youtubeSdk: {
      tagId: "youtube-sdk",
      src: "https://www.youtube.com/iframe_api",
      type: types.script,
    },
    plyrShopifyStyles: {
      tagId: "plyr-shopify-styles",
      src: cloudCdn + "shopify-plyr/v1.0/shopify-plyr.css",
      type: types.link,
    },
    modelViewerUiStyles: {
      tagId: "shopify-model-viewer-ui-styles",
      src: cloudCdn + "model-viewer-ui/assets/v1.0/model-viewer-ui.css",
      type: types.link,
    },
  };

  function load(libraryName, callback) {
    var library = libraries[libraryName];

    if (!library) return;
    if (library.status === status.requested) return;

    callback = callback || function () {};
    if (library.status === status.loaded) {
      callback();
      return;
    }

    library.status = status.requested;

    var tag;

    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }

    tag.id = library.tagId;
    library.element = tag;

    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function createScriptTag(library, callback) {
    var tag = document.createElement("script");
    tag.src = library.src;
    tag.addEventListener("load", function () {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  function createLinkTag(library, callback) {
    var tag = document.createElement("link");
    tag.href = library.src;
    tag.rel = "stylesheet";
    tag.type = "text/css";
    tag.addEventListener("load", function () {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  return {
    load: load,
  };
})();

/* ================ MODULES ================ */

theme.FormStatus = (function () {
  var selectors = {
    statusMessage: "[data-form-status]",
  };

  function init() {
    this.$statusMessage = $(selectors.statusMessage);

    if (!this.$statusMessage) return;

    this.$statusMessage.attr("tabindex", -1).focus();

    this.$statusMessage.on("blur", handleBlur.bind(this));
  }

  function handleBlur() {
    this.$statusMessage.removeAttr("tabindex");
  }

  return {
    init: init,
  };
})();

/* ================ TEMPLATES ================ */

theme.customerTemplates = (function () {
  var selectors = {
    RecoverHeading: "#RecoverHeading",
    RecoverEmail: "#RecoverEmail",
    LoginHeading: "#LoginHeading",
  };

  function initEventListeners() {
    this.$RecoverHeading = $(selectors.RecoverHeading);
    this.$RecoverEmail = $(selectors.RecoverEmail);
    this.$LoginHeading = $(selectors.LoginHeading);

    // Show reset password form
    $("#RecoverPassword").on(
      "click",
      function (evt) {
        evt.preventDefault();
        showRecoverPasswordForm();
        this.$RecoverHeading.attr("tabindex", "-1").focus();
      }.bind(this)
    );

    // Hide reset password form
    $("#HideRecoverPasswordLink").on(
      "click",
      function (evt) {
        evt.preventDefault();
        hideRecoverPasswordForm();
        this.$LoginHeading.attr("tabindex", "-1").focus();
      }.bind(this)
    );

    this.$RecoverHeading.on("blur", function () {
      $(this).removeAttr("tabindex");
    });

    this.$LoginHeading.on("blur", function () {
      $(this).removeAttr("tabindex");
    });
  }

  /**
   *
   *  Show/Hide recover password form
   *
   */

  function showRecoverPasswordForm() {
    $("#RecoverPasswordForm").removeClass("hide");
    $("#CustomerLoginForm").addClass("hide");

    if (this.$RecoverEmail.attr("aria-invalid") === "true") {
      this.$RecoverEmail.focus();
    }
  }

  function hideRecoverPasswordForm() {
    $("#RecoverPasswordForm").addClass("hide");
    $("#CustomerLoginForm").removeClass("hide");
  }

  /**
   *
   *  Show reset password success message
   *
   */
  function resetPasswordSuccess() {
    var $formState = $(".reset-password-success");

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $("#ResetSuccess").removeClass("hide").focus();
  }

  /**
   *
   *  Show/hide customer address forms
   *
   */
  function customerAddressForm() {
    var $newAddressForm = $("#AddressNewForm");
    var $newAddressFormButton = $("#AddressNewButton");

    if (!$newAddressForm.length) {
      return;
    }

    // Initialize observers on address selectors, defined in shopify_common.js
    if (Shopify) {
      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(
        "AddressCountryNew",
        "AddressProvinceNew",
        {
          hideElement: "AddressProvinceContainerNew",
        }
      );
    }

    // Initialize each edit form's country/province selector
    $(".address-country-option").each(function () {
      var formId = $(this).data("form-id");
      var countrySelector = "AddressCountry_" + formId;
      var provinceSelector = "AddressProvince_" + formId;
      var containerSelector = "AddressProvinceContainer_" + formId;

      // eslint-disable-next-line no-new
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: containerSelector,
      });
    });

    // Toggle new/edit address forms
    $(".address-new-toggle").on("click", function () {
      var isExpanded = $newAddressFormButton.attr("aria-expanded") === "true";

      $newAddressForm.toggleClass("hide");
      $newAddressFormButton.attr("aria-expanded", !isExpanded).focus();
    });

    $(".address-edit-toggle").on("click", function () {
      var formId = $(this).data("form-id");
      var $editButton = $("#EditFormButton_" + formId);
      var $editAddress = $("#EditAddress_" + formId);
      var isExpanded = $editButton.attr("aria-expanded") === "true";

      $editAddress.toggleClass("hide");
      $editButton.attr("aria-expanded", !isExpanded).focus();
    });

    $(".address-delete").on("click", function () {
      var $el = $(this);
      var target = $el.data("target");
      var confirmMessage = $el.data("confirm-message");

      // eslint-disable-next-line no-alert
      if (
        confirm(
          confirmMessage || "Are you sure you wish to delete this address?"
        )
      ) {
        Shopify.postLink(target, {
          parameters: { _method: "delete" },
        });
      }
    });
  }

  /**
   *
   *  Check URL for reset password hash
   *
   */
  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === "#recover") {
      showRecoverPasswordForm.bind(this)();
    }
  }

  return {
    init: function () {
      initEventListeners();
      checkUrlHash();
      resetPasswordSuccess();
      customerAddressForm();
    },
  };
})();

/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.Cart = (function () {
  var selectors = {
    cartCount: "[data-cart-count]",
    cartCountBubble: "[data-cart-count-bubble]",
    cartDiscount: "[data-cart-discount]",
    cartDiscountTitle: "[data-cart-discount-title]",
    cartDiscountAmount: "[data-cart-discount-amount]",
    cartDiscountWrapper: "[data-cart-discount-wrapper]",
    cartErrorMessage: "[data-cart-error-message]",
    cartErrorMessageWrapper: "[data-cart-error-message-wrapper]",
    cartItem: "[data-cart-item]",
    cartItemDetails: "[data-cart-item-details]",
    cartItemDiscount: "[data-cart-item-discount]",
    cartItemDiscountedPriceGroup: "[data-cart-item-discounted-price-group]",
    cartItemDiscountTitle: "[data-cart-item-discount-title]",
    cartItemDiscountAmount: "[data-cart-item-discount-amount]",
    cartItemDiscountList: "[data-cart-item-discount-list]",
    cartItemFinalPrice: "[data-cart-item-final-price]",
    cartItemImage: "[data-cart-item-image]",
    cartItemLinePrice: "[data-cart-item-line-price]",
    cartItemOriginalPrice: "[data-cart-item-original-price]",
    cartItemPrice: "[data-cart-item-price]",
    cartItemPriceList: "[data-cart-item-price-list]",
    cartItemProperty: "[data-cart-item-property]",
    cartItemPropertyName: "[data-cart-item-property-name]",
    cartItemPropertyValue: "[data-cart-item-property-value]",
    cartItemRegularPriceGroup: "[data-cart-item-regular-price-group]",
    cartItemRegularPrice: "[data-cart-item-regular-price]",
    cartItemTitle: "[data-cart-item-title]",
    cartItemOption: "[data-cart-item-option]",
    cartLineItems: "[data-cart-line-items]",
    cartNote: "[data-cart-notes]",
    cartQuantityErrorMessage: "[data-cart-quantity-error-message]",
    cartQuantityErrorMessageWrapper:
      "[data-cart-quantity-error-message-wrapper]",
    cartRemove: "[data-cart-remove]",
    cartStatus: "[data-cart-status]",
    cartSubtotal: "[data-cart-subtotal]",
    cartTableCell: "[data-cart-table-cell]",
    cartWrapper: "[data-cart-wrapper]",
    emptyPageContent: "[data-empty-page-content]",
    quantityInput: "[data-quantity-input]",
    quantityInputMobile: "[data-quantity-input-mobile]",
    quantityInputDesktop: "[data-quantity-input-desktop]",
    quantityLabelMobile: "[data-quantity-label-mobile]",
    quantityLabelDesktop: "[data-quantity-label-desktop]",
    inputQty: "[data-quantity-input]",
    thumbnails: ".cart__image",
    unitPrice: "[data-unit-price]",
    unitPriceBaseUnit: "[data-unit-price-base-unit]",
    unitPriceGroup: "[data-unit-price-group]",
  };

  var classes = {
    cartNoCookies: "cart--no-cookies",
    cartRemovedProduct: "cart__removed-product",
    hide: "hide",
    inputError: "input--error",
  };

  var attributes = {
    cartItemIndex: "data-cart-item-index",
    cartItemKey: "data-cart-item-key",
    cartItemQuantity: "data-cart-item-quantity",
    cartItemTitle: "data-cart-item-title",
    cartItemUrl: "data-cart-item-url",
    quantityItem: "data-quantity-item",
  };

  theme.breakpoints = theme.breakpoints || {};

  if (
    isNaN(theme.breakpoints.medium) ||
    theme.breakpoints.medium === undefined
  ) {
    theme.breakpoints.medium = 750;
  }

  var mediumUpQuery = "(min-width: " + theme.breakpoints.medium + "px)";

  function Cart(container) {
    this.$container = $(container);
    this.$thumbnails = $(selectors.thumbnails, this.$container);
    this.ajaxEnabled = this.$container.data("ajax-enabled");

    if (!this.cookiesEnabled()) {
      this.$container.addClass(classes.cartNoCookies);
    }

    this.$thumbnails.css("cursor", "pointer");
    this.$container.on(
      "click",
      selectors.thumbnails,
      this._handleThumbnailClick
    );

    this.$container.on(
      "change",
      selectors.inputQty,
      $.debounce(500, this._handleInputQty.bind(this))
    );

    this.mql = window.matchMedia(mediumUpQuery);
    this.mql.addListener(this.setQuantityFormControllers.bind(this));
    this.setQuantityFormControllers();

    if (this.ajaxEnabled) {
      /**
       * Because the entire cart is recreated when a cart item is updated,
       * we cannot cache the elements in the cart. Instead, we add the event
       * listeners on the cart's container to allow us to retain the event
       * listeners after rebuilding the cart when an item is updated.
       */

      this.$container.on(
        "change",
        selectors.cartNote,
        this._onNoteChange.bind(this)
      );

      this.$container.on(
        "click",
        selectors.cartRemove,
        this._onRemoveItem.bind(this)
      );

      this._setupCartTemplates();
    }
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    _setupCartTemplates: function () {
      this.$itemTemplate = $(selectors.cartItem, this.$container)
        .first()
        .clone();
      this.$itemDiscountTemplate = $(
        selectors.cartItemDiscount,
        this.$itemTemplate
      ).clone();
      this.$itemOptionTemplate = $(
        selectors.cartItemOption,
        this.$itemTemplate
      ).clone();
      this.$itemPropertyTemplate = $(
        selectors.cartItemProperty,
        this.$itemTemplate
      ).clone();
      this.$itemPriceListTemplate = $(
        selectors.cartItemPriceList,
        this.$itemTemplate
      ).clone();
      this.$itemLinePriceTemplate = $(
        selectors.cartItemLinePrice,
        this.$itemTemplate
      ).clone();
      this.$cartDiscountTemplate = $(
        selectors.cartDiscount,
        this.$container
      ).clone();
    },

    _handleInputQty: function (evt) {
      var $input = $(evt.target);
      var itemIndex = $input.data("quantity-item");
      var $itemElement = $input.closest(selectors.cartItem);
      var $itemQtyInputs = $("[data-quantity-item=" + itemIndex + "]");
      var value = parseInt($input.val());
      var isValidValue = !(value < 0 || isNaN(value));
      $itemQtyInputs.val(value);

      this._hideCartError();
      this._hideQuantityErrorMessage();

      if (!isValidValue) {
        this._showQuantityErrorMessages($itemElement);
        return;
      }

      if (isValidValue && this.ajaxEnabled) {
        this._updateItemQuantity(
          itemIndex,
          $itemElement,
          $itemQtyInputs,
          value
        );
      }
    },

    _updateItemQuantity: function (
      itemIndex,
      $itemElement,
      $itemQtyInputs,
      value
    ) {
      var key = $itemElement.attr(attributes.cartItemKey);
      var index = $itemElement.attr(attributes.cartItemIndex);

      var params = {
        url: "/cart/change.js",
        data: { quantity: value, line: index },
        dataType: "json",
      };

      $.post(params)
        .done(
          function (state) {
            if (state.item_count === 0) {
              this._emptyCart();
            } else {
              this._createCart(state);

              if (value === 0) {
                this._showRemoveMessage($itemElement.clone());
              } else {
                var $lineItem = $('[data-cart-item-key="' + key + '"]');
                var item = this.getItem(key, state);

                $(selectors.quantityInput, $lineItem).focus();
                this._updateLiveRegion(item);
              }
            }

            this._setCartCountBubble(state.item_count);
          }.bind(this)
        )
        .fail(
          function () {
            this._showCartError($itemQtyInputs);
          }.bind(this)
        );
    },

    getItem: function (key, state) {
      return state.items.find(function (item) {
        return item.key === key;
      });
    },

    _liveRegionText: function (item) {
      // Dummy content for live region
      var liveRegionText =
        theme.strings.update +
        ": [QuantityLabel]: [Quantity], [Regular] [$$] [DiscountedPrice] [$]. [PriceInformation]";

      // Update Quantity
      liveRegionText = liveRegionText
        .replace("[QuantityLabel]", theme.strings.quantity)
        .replace("[Quantity]", item.quantity);

      // Update pricing information
      var regularLabel = "";
      var regularPrice = theme.Currency.formatMoney(
        item.original_line_price,
        theme.moneyFormat
      );
      var discountLabel = "";
      var discountPrice = "";
      var discountInformation = "";

      if (item.original_line_price > item.final_line_price) {
        regularLabel = theme.strings.regularTotal;

        discountLabel = theme.strings.discountedTotal;
        discountPrice = theme.Currency.formatMoney(
          item.final_line_price,
          theme.moneyFormat
        );

        discountInformation = theme.strings.priceColumn;
      }

      liveRegionText = liveRegionText
        .replace("[Regular]", regularLabel)
        .replace("[$$]", regularPrice)
        .replace("[DiscountedPrice]", discountLabel)
        .replace("[$]", discountPrice)
        .replace("[PriceInformation]", discountInformation)
        .trim();

      return liveRegionText;
    },

    _updateLiveRegion: function (item) {
      var $liveRegion = $(selectors.cartStatus);
      $liveRegion.html(this._liveRegionText(item)).attr("aria-hidden", false);

      // hide content from accessibility tree after announcement
      setTimeout(function () {
        $liveRegion.attr("aria-hidden", true);
      }, 1000);
    },

    _createCart: function (state) {
      var cartDiscountList = this._createCartDiscountList(state);

      $(selectors.cartLineItems, this.$container).html(
        this._createLineItemList(state)
      );

      this.setQuantityFormControllers();

      $(selectors.cartNote, this.$container).val(state.note);

      if (cartDiscountList.length === 0) {
        $(selectors.cartDiscountWrapper, this.$container)
          .html("")
          .addClass(classes.hide);
      } else {
        $(selectors.cartDiscountWrapper, this.$container)
          .html(cartDiscountList)
          .removeClass(classes.hide);
      }

      $(selectors.cartSubtotal, this.$container).html(
        theme.Currency.formatMoney(
          state.total_price,
          theme.moneyFormatWithCurrency
        )
      );
    },

    _createCartDiscountList: function (cart) {
      return $.map(
        cart.cart_level_discount_applications,
        function (discount) {
          var $discount = this.$cartDiscountTemplate.clone();
          $discount.find(selectors.cartDiscountTitle).text(discount.title);
          $discount
            .find(selectors.cartDiscountAmount)
            .html(
              theme.Currency.formatMoney(
                discount.total_allocated_amount,
                theme.moneyFormat
              )
            );
          return $discount[0];
        }.bind(this)
      );
    },

    _createLineItemList: function (state) {
      return $.map(
        state.items,
        function (item, index) {
          var $item = this.$itemTemplate.clone();
          var $itemPriceList = this.$itemPriceListTemplate.clone();

          this._setLineItemAttributes($item, item, index);
          this._setLineItemImage($item, item.featured_image);

          $(selectors.cartItemTitle, $item)
            .text(item.product_title)
            .attr("href", item.url);

          var productDetailsList = this._createProductDetailsList(
            item.product_has_only_default_variant,
            item.options_with_values,
            item.properties
          );
          this._setProductDetailsList($item, productDetailsList);

          this._setItemRemove($item, item.title);

          $itemPriceList.html(
            this._createItemPrice(
              item.original_price,
              item.final_price,
              this.$itemPriceListTemplate
            )
          );

          if (item.unit_price_measurement) {
            $itemPriceList.append(
              this._createUnitPrice(
                item.unit_price,
                item.unit_price_measurement,
                this.$itemPriceListTemplate
              )
            );
          }

          this._setItemPrice($item, $itemPriceList);

          var itemDiscountList = this._createItemDiscountList(item);
          this._setItemDiscountList($item, itemDiscountList);

          this._setQuantityInputs($item, item, index);

          var itemLinePrice = this._createItemPrice(
            item.original_line_price,
            item.final_line_price,
            this.$itemLinePriceTemplate
          );
          this._setItemLinePrice($item, itemLinePrice);

          return $item[0];
        }.bind(this)
      );
    },

    _setLineItemAttributes: function ($item, item, index) {
      $item
        .attr(attributes.cartItemKey, item.key)
        .attr(attributes.cartItemUrl, item.url)
        .attr(attributes.cartItemTitle, item.title)
        .attr(attributes.cartItemIndex, index + 1)
        .attr(attributes.cartItemQuantity, item.quantity);
    },

    _setLineItemImage: function ($item, featuredImage) {
      var $image = $(selectors.cartItemImage, $item);

      var sizedImageUrl =
        featuredImage.url !== null
          ? theme.Images.getSizedImageUrl(featuredImage.url, "x190")
          : null;

      if (sizedImageUrl) {
        $image
          .attr("alt", featuredImage.alt)
          .attr("src", sizedImageUrl)
          .removeClass(classes.hide);
      } else {
        $image.remove();
      }
    },

    _setProductDetailsList: function ($item, productDetailsList) {
      var $itemDetails = $(selectors.cartItemDetails, $item);

      if (productDetailsList.length === 0) {
        $itemDetails.addClass(classes.hide).text("");
      } else {
        $itemDetails.removeClass(classes.hide).html(productDetailsList);
      }
    },

    _setItemPrice: function ($item, price) {
      $(selectors.cartItemPrice, $item).html(price);
    },

    _setItemDiscountList: function ($item, discountList) {
      var $itemDiscountList = $(selectors.cartItemDiscountList, $item);

      if (discountList.length === 0) {
        $itemDiscountList.html("").addClass(classes.hide);
      } else {
        $itemDiscountList.html(discountList).removeClass(classes.hide);
      }
    },

    _setItemRemove: function ($item, title) {
      $(selectors.cartRemove, $item).attr(
        "aria-label",
        theme.strings.removeLabel.replace("[product]", title)
      );
    },

    _setQuantityInputs: function ($item, item, index) {
      $(selectors.quantityInputMobile, $item)
        .attr("id", "updates_" + item.key)
        .attr(attributes.quantityItem, index + 1)
        .val(item.quantity);

      $(selectors.quantityInputDesktop, $item)
        .attr("id", "updates_large_" + item.key)
        .attr(attributes.quantityItem, index + 1)
        .val(item.quantity);

      $(selectors.quantityLabelMobile, $item).attr(
        "for",
        "updates_" + item.key
      );

      $(selectors.quantityLabelDesktop, $item).attr(
        "for",
        "updates_large_" + item.key
      );
    },

    setQuantityFormControllers: function () {
      if (this.mql.matches) {
        $(selectors.quantityInputDesktop).attr("name", "updates[]");
        $(selectors.quantityInputMobile).removeAttr("name");
      } else {
        $(selectors.quantityInputMobile).attr("name", "updates[]");
        $(selectors.quantityInputDesktop).removeAttr("name");
      }
    },

    _setItemLinePrice: function ($item, price) {
      $(selectors.cartItemLinePrice, $item).html(price);
    },

    _createProductDetailsList: function (
      product_has_only_default_variant,
      options,
      properties
    ) {
      var optionsPropertiesHTML = [];

      if (!product_has_only_default_variant) {
        optionsPropertiesHTML = optionsPropertiesHTML.concat(
          this._getOptionList(options)
        );
      }

      if (properties !== null && Object.keys(properties).length !== 0) {
        optionsPropertiesHTML = optionsPropertiesHTML.concat(
          this._getPropertyList(properties)
        );
      }

      return optionsPropertiesHTML;
    },

    _getOptionList: function (options) {
      return $.map(
        options,
        function (option) {
          var $optionElement = this.$itemOptionTemplate.clone();

          $optionElement
            .text(option.name + ": " + option.value)
            .removeClass(classes.hide);

          return $optionElement[0];
        }.bind(this)
      );
    },

    _getPropertyList: function (properties) {
      var propertiesArray =
        properties !== null ? Object.entries(properties) : [];

      return $.map(
        propertiesArray,
        function (property) {
          var $propertyElement = this.$itemPropertyTemplate.clone();

          // Line item properties prefixed with an underscore are not to be displayed
          if (property[0].charAt(0) === "_") return;

          // if the property value has a length of 0 (empty), don't display it
          if (property[1].length === 0) return;

          $propertyElement
            .find(selectors.cartItemPropertyName)
            .text(property[0]);

          if (property[0].indexOf("/uploads/") === -1) {
            $propertyElement
              .find(selectors.cartItemPropertyValue)
              .text(": " + property[1]);
          } else {
            $propertyElement
              .find(selectors.cartItemPropertyValue)
              .html(
                ': <a href="' +
                  property[1] +
                  '"> ' +
                  property[1].split("/").pop() +
                  "</a>"
              );
          }

          $propertyElement.removeClass(classes.hide);

          return $propertyElement[0];
        }.bind(this)
      );
    },

    _createItemPrice: function (original_price, final_price, $priceTemplate) {
      if (original_price !== final_price) {
        var $discountedPrice = $(
          selectors.cartItemDiscountedPriceGroup,
          $priceTemplate
        ).clone();

        $(selectors.cartItemOriginalPrice, $discountedPrice).html(
          theme.Currency.formatMoney(original_price, theme.moneyFormat)
        );
        $(selectors.cartItemFinalPrice, $discountedPrice).html(
          theme.Currency.formatMoney(final_price, theme.moneyFormat)
        );
        $discountedPrice.removeClass(classes.hide);

        return $discountedPrice[0];
      } else {
        var $regularPrice = $(
          selectors.cartItemRegularPriceGroup,
          $priceTemplate
        ).clone();

        $(selectors.cartItemRegularPrice, $regularPrice).html(
          theme.Currency.formatMoney(original_price, theme.moneyFormat)
        );

        $regularPrice.removeClass(classes.hide);

        return $regularPrice[0];
      }
    },

    _createUnitPrice: function (
      unitPrice,
      unitPriceMeasurement,
      $itemPriceGroup
    ) {
      var $unitPriceGroup = $(
        selectors.unitPriceGroup,
        $itemPriceGroup
      ).clone();

      var unitPriceBaseUnit =
        (unitPriceMeasurement.reference_value !== 1
          ? unitPriceMeasurement.reference_value
          : "") + unitPriceMeasurement.reference_unit;

      $(selectors.unitPriceBaseUnit, $unitPriceGroup).text(unitPriceBaseUnit);
      $(selectors.unitPrice, $unitPriceGroup).html(
        theme.Currency.formatMoney(unitPrice, theme.moneyFormat)
      );

      $unitPriceGroup.removeClass(classes.hide);

      return $unitPriceGroup[0];
    },

    _createItemDiscountList: function (item) {
      return $.map(
        item.line_level_discount_allocations,
        function (discount) {
          var $discount = this.$itemDiscountTemplate.clone();
          $discount
            .find(selectors.cartItemDiscountTitle)
            .text(discount.discount_application.title);
          $discount
            .find(selectors.cartItemDiscountAmount)
            .html(
              theme.Currency.formatMoney(discount.amount, theme.moneyFormat)
            );
          return $discount[0];
        }.bind(this)
      );
    },

    _showQuantityErrorMessages: function (itemElement) {
      $(selectors.cartQuantityErrorMessage, itemElement).text(
        theme.strings.quantityMinimumMessage
      );

      $(selectors.cartQuantityErrorMessageWrapper, itemElement).removeClass(
        classes.hide
      );

      $(selectors.inputQty, itemElement).addClass(classes.inputError).focus();
    },

    _hideQuantityErrorMessage: function () {
      var $errorMessages = $(
        selectors.cartQuantityErrorMessageWrapper
      ).addClass(classes.hide);

      $(selectors.cartQuantityErrorMessage, $errorMessages).text("");

      $(selectors.inputQty, this.$container).removeClass(classes.inputError);
    },

    _handleThumbnailClick: function (evt) {
      var url = $(evt.target).closest(selectors.cartItem).data("cart-item-url");

      window.location.href = url;
    },

    _onNoteChange: function (evt) {
      var note = evt.currentTarget.value;
      this._hideCartError();
      this._hideQuantityErrorMessage();

      var params = {
        url: "/cart/update.js",
        data: { note: note },
        dataType: "json",
      };

      $.post(params).fail(
        function () {
          this._showCartError(evt.currentTarget);
        }.bind(this)
      );
    },

    _showCartError: function (elementToFocus) {
      $(selectors.cartErrorMessage).text(theme.strings.cartError);

      $(selectors.cartErrorMessageWrapper).removeClass(classes.hide);

      elementToFocus.focus();
    },

    _hideCartError: function () {
      $(selectors.cartErrorMessageWrapper).addClass(classes.hide);
      $(selectors.cartErrorMessage).text("");
    },

    _onRemoveItem: function (evt) {
      evt.preventDefault();
      var $remove = $(evt.target);
      var $lineItem = $remove.closest(selectors.cartItem);
      var index = $lineItem.attr(attributes.cartItemIndex);
      this._hideCartError();

      var params = {
        url: "/cart/change.js",
        data: { quantity: 0, line: index },
        dataType: "json",
      };

      $.post(params)
        .done(
          function (state) {
            if (state.item_count === 0) {
              this._emptyCart();
            } else {
              this._createCart(state);
              this._showRemoveMessage($lineItem.clone());
            }

            this._setCartCountBubble(state.item_count);
          }.bind(this)
        )
        .fail(
          function () {
            this._showCartError(null);
          }.bind(this)
        );
    },

    _showRemoveMessage: function (lineItem) {
      var index = lineItem.data("cart-item-index");
      var removeMessage = this._getRemoveMessage(lineItem);
      var $lineItemAtIndex;

      if (index - 1 === 0) {
        $lineItemAtIndex = $('[data-cart-item-index="1"]', this.$container);
        $(removeMessage).insertBefore($lineItemAtIndex);
      } else {
        $lineItemAtIndex = $(
          '[data-cart-item-index="' + (index - 1) + '"]',
          this.$container
        );
        removeMessage.insertAfter($lineItemAtIndex);
      }
      removeMessage.focus();
    },

    _getRemoveMessage: function (lineItem) {
      var formattedMessage = this._formatRemoveMessage(lineItem);

      var $tableCell = $(selectors.cartTableCell, lineItem).clone();
      $tableCell
        .removeClass()
        .addClass(classes.cartRemovedProduct)
        .attr("colspan", "4")
        .html(formattedMessage);

      lineItem.attr("role", "alert").html($tableCell).attr("tabindex", "-1");

      return lineItem;
    },

    _formatRemoveMessage: function (lineItem) {
      var quantity = lineItem.data("cart-item-quantity");
      var url = lineItem.attr(attributes.cartItemUrl);
      var title = lineItem.attr(attributes.cartItemTitle);

      return theme.strings.removedItemMessage
        .replace("[quantity]", quantity)
        .replace(
          "[link]",
          "<a " +
            'href="' +
            url +
            '" class="text-link text-link--accent">' +
            title +
            "</a>"
        );
    },

    _setCartCountBubble: function (quantity) {
      this.$cartCountBubble =
        this.$cartCountBubble || $(selectors.cartCountBubble);
      this.$cartCount = this.$cartCount || $(selectors.cartCount);

      if (quantity > 0) {
        this.$cartCountBubble.removeClass(classes.hide);
        this.$cartCount.html(quantity);
      } else {
        this.$cartCountBubble.addClass(classes.hide);
        this.$cartCount.html("");
      }
    },

    _emptyCart: function () {
      this.$emptyPageContent =
        this.$emptyPageContent ||
        $(selectors.emptyPageContent, this.$container);
      this.$cartWrapper =
        this.$cartWrapper || $(selectors.cartWrapper, this.$container);

      this.$emptyPageContent.removeClass(classes.hide);
      this.$cartWrapper.addClass(classes.hide);
    },

    cookiesEnabled: function () {
      var cookieEnabled = navigator.cookieEnabled;

      if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie") !== -1;
      }
      return cookieEnabled;
    },
  });

  return Cart;
})();

window.theme = window.theme || {};

$(document).ready(function () {
  var sections = new theme.Sections();

  sections.register("cart-template", theme.Cart);
});

theme.init = function () {
  theme.customerTemplates.init();

  // Theme-specific selectors to make tables scrollable
  var tableSelectors = ".rte table," + ".custom__item-inner--html table";

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: "scrollable-wrapper",
  });

  // Theme-specific selectors to make iframes responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"],' +
    '.custom__item-inner--html iframe[src*="youtube.com/embed"],' +
    '.custom__item-inner--html iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: "video-wrapper",
  });

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $(".in-page-link").on("click", function (evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  $('a[href="#"]').on("click", function (evt) {
    evt.preventDefault();
  });

  slate.a11y.accessibleLinks({
    messages: {
      newWindow: theme.strings.newWindow,
      external: theme.strings.external,
      newWindowExternal: theme.strings.newWindowExternal,
    },
    $links: $("a[href]:not([aria-describedby], .product-single__thumbnail)"),
  });

  theme.FormStatus.init();

  var selectors = {
    image: "[data-image]",
    imagePlaceholder: "[data-image-placeholder]",
    imageWithPlaceholderWrapper: "[data-image-with-placeholder-wrapper]",
    lazyloaded: ".lazyloaded",
  };

  var classes = {
    hidden: "hide",
  };

  $(document).on("lazyloaded", function (e) {
    var $target = $(e.target);

    if ($target.data("bgset")) {
      var $image = $target.find(selectors.lazyloaded);
      if ($image.length) {
        var alt = $target.data("alt");
        var src = $image.data("src") ? $image.data("src") : $target.data("bg");

        $image.attr("alt", alt ? alt : "");
        $image.attr("src", src ? src : "");
      }
    }

    if (!$target.is(selectors.image)) {
      return;
    }

    $target
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  });

  // When the theme loads, lazysizes might load images before the "lazyloaded"
  // event listener has been attached. When this happens, the following function
  // hides the loading placeholders.
  function onLoadHideLazysizesAnimation() {
    $(selectors.image + ".lazyloaded")
      .closest(selectors.imageWithPlaceholderWrapper)
      .find(selectors.imagePlaceholder)
      .addClass(classes.hidden);
  }

  onLoadHideLazysizesAnimation();
  $(document).one("touchstart", function () {
    theme.Helpers.setTouch();
  });
};

$(theme.init);
