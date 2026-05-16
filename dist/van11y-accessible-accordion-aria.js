"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * ES2015 accessible accordion system, using ARIA
 * Website: https://van11y.net/accessible-accordion/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-accordion-aria/blob/master/LICENSE
 */
var loadConfig = function loadConfig() {
  var CACHE = {};
  var set = function set(id, config) {
    CACHE[id] = config;
  };
  var get = function get(id) {
    return CACHE[id];
  };
  var remove = function remove(id) {
    return CACHE[id];
  };
  return {
    set: set,
    get: get,
    remove: remove
  };
};
var DATA_HASH_ID = 'data-hashaccordion-id';
var pluginConfig = loadConfig();

/** Find an element based on an Id
 * @param  {String} id Id to find
 * @param  {String} hash hash id (not mandatory)
 * @return {Node} the element with the specified id
 */
var findById = function findById(id, hash) {
  return document.querySelector("#".concat(id, "[").concat(DATA_HASH_ID, "=\"").concat(hash, "\"]"));
};

/** add a class to a node
 * @param  {Node} el node to attach class
 * @param  {String} className the class to add
 */
var addClass = function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className); // IE 10+
  } else {
    el.className += ' ' + className; // IE 8+
  }
};

/** remove class from node
 * @param  {Node} el node to remove class
 * @param  {String} className the class to remove
 */
var removeClass = function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className); // IE 10+
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
  }
};

/** check if node has specified class
 * @param  {Node} el node to check
 * @param  {String} className the class
 */
var hasClass = function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className); // IE 10+
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
  }
};
var setAttributes = function setAttributes(node, attrs) {
  Object.keys(attrs).forEach(function (attribute) {
    node.setAttribute(attribute, attrs[attribute]);
  });
};

/** search if element is or is contained in another element with attribute data-hashaccordion-id
 * @param  {Node} el element (node)
 * @param  {String} hashId the attribute data-hashtooltip-id
 * @return {String} the value of attribute data-hashtooltip-id
 */
var searchParentHashId = function searchParentHashId(el, hashId) {
  var found = false;
  var parentElement = el;
  while (parentElement.nodeType === 1 && parentElement && found === false) {
    if (parentElement.hasAttribute(hashId) === true) {
      found = true;
    } else {
      parentElement = parentElement.parentNode;
    }
  }
  if (found === true) {
    return parentElement.getAttribute(hashId);
  } else {
    return '';
  }
};
var searchParent = function searchParent(el, parentClass, hashId) {
  var found = false;
  var parentElement = el;
  while (parentElement && found === false) {
    if (hasClass(parentElement, parentClass) === true && parentElement.getAttribute(DATA_HASH_ID) === hashId) {
      found = true;
    } else {
      parentElement = parentElement.parentNode;
    }
  }
  if (found === true) {
    return parentElement.getAttribute('id');
  } else {
    return '';
  }
};
var unSelectHeaders = function unSelectHeaders(elts, attrSelected) {
  elts.forEach(function (header_node) {
    setAttributes(header_node, _defineProperty({}, attrSelected, 'false'));
  });
};
var selectHeader = function selectHeader(el, attrSelected) {
  el.setAttribute(attrSelected, true);
};
var selectHeaderInList = function selectHeaderInList(elts, param, attrSelected) {
  var indice_trouve;
  elts.forEach(function (header_node, index) {
    if (header_node.getAttribute(attrSelected) === 'true') {
      indice_trouve = index;
    }
  });
  if (param === 'next') {
    selectHeader(elts[indice_trouve + 1]);
    setTimeout(function () {
      elts[indice_trouve + 1].focus();
    }, 0);
  }
  if (param === 'prev') {
    selectHeader(elts[indice_trouve - 1]);
    setTimeout(function () {
      elts[indice_trouve - 1].focus();
    }, 0);
  }
};
var plugin = function plugin() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var CONFIG = _objectSpread({
    ACCORDION_JS: 'js-accordion',
    ACCORDION_JS_HEADER: 'js-accordion__header',
    ACCORDION_JS_PANEL: 'js-accordion__panel',
    ACCORDION_DATA_PREFIX_CLASS: 'data-accordion-prefix-classes',
    ACCORDION_DATA_OPENED: 'data-accordion-opened',
    ACCORDION_DATA_MULTISELECTABLE: 'data-accordion-multiselectable',
    ACCORDION_DATA_COOL_SELECTORS: 'data-accordion-cool-selectors',
    ACCORDION_PREFIX_IDS: 'accordion',
    ACCORDION_BUTTON_ID: '_tab',
    ACCORDION_PANEL_ID: '_panel',
    ACCORDION_STYLE: 'accordion',
    ACCORDION_TITLE_STYLE: 'accordion__title',
    ACCORDION_HEADER_STYLE: 'accordion__header',
    ACCORDION_PANEL_STYLE: 'accordion__panel',
    ACCORDION_ROLE_TABLIST: 'tablist',
    ACCORDION_ROLE_TAB: 'tab',
    ACCORDION_ROLE_TABPANEL: 'tabpanel',
    ATTR_ROLE: 'role',
    ATTR_MULTISELECTABLE: 'aria-multiselectable',
    ATTR_EXPANDED: 'aria-expanded',
    ATTR_LABELLEDBY: 'aria-labelledby',
    ATTR_HIDDEN: 'aria-hidden',
    ATTR_CONTROLS: 'aria-controls',
    ATTR_SELECTED: 'aria-selected'
  }, config);
  var HASH_ID = Math.random().toString(32).slice(2, 12);
  pluginConfig.set(HASH_ID, CONFIG);
  /**
   * Find all accordions inside a container
   * @param  {Node} node Default document
   * @return {Array}
   */
  var $listAccordions = function $listAccordions() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    return [].slice.call(node.querySelectorAll('.' + CONFIG.ACCORDION_JS));
  }; //[...node.querySelectorAll('.' + CONFIG.ACCORDION_JS)]; // that does not work on IE when transpiled :-(

  /**
   * Build accordions for a container
   * @param  {Node} node
   * @param  {addListeners} boolean
   */
  var attach = function attach(node) {
    $listAccordions(node).forEach(function (accordion_node) {
      var iLisible = 'z' + Math.random().toString(32).slice(2, 12); // avoid selector exception when starting by a number
      var prefixClassName = accordion_node.hasAttribute(CONFIG.ACCORDION_DATA_PREFIX_CLASS) === true ? accordion_node.getAttribute(CONFIG.ACCORDION_DATA_PREFIX_CLASS) + '-' : '';
      var coolSelectors = accordion_node.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;

      // Init attributes accordion
      if (accordion_node.getAttribute(CONFIG.ACCORDION_DATA_MULTISELECTABLE) === 'none') {
        accordion_node.setAttribute(CONFIG.ATTR_MULTISELECTABLE, 'false');
      } else {
        accordion_node.setAttribute(CONFIG.ATTR_MULTISELECTABLE, 'true');
      }
      accordion_node.setAttribute(CONFIG.ATTR_ROLE, CONFIG.ACCORDION_ROLE_TABLIST);
      accordion_node.setAttribute('id', iLisible);
      accordion_node.setAttribute(DATA_HASH_ID, HASH_ID);
      addClass(accordion_node, prefixClassName + CONFIG.ACCORDION_STYLE);
      var $listAccordionsHeader = [].slice.call(accordion_node.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
      $listAccordionsHeader.forEach(function (header_node, index_header) {
        // if we do not have cool selectors enabled,
        // it is not a direct child, we ignore it
        if (header_node.parentNode !== accordion_node && coolSelectors === false) {
          return;
        }
        var indexHeaderLisible = index_header + 1;
        var accordionPanel = header_node.nextElementSibling;
        var accordionHeaderText = header_node.innerHTML;
        var accordionButton = document.createElement("BUTTON");
        var accordionOpenedAttribute = header_node.hasAttribute(CONFIG.ACCORDION_DATA_OPENED) === true ? header_node.getAttribute(CONFIG.ACCORDION_DATA_OPENED) : '';

        // set button with attributes
        accordionButton.innerHTML = accordionHeaderText;
        addClass(accordionButton, CONFIG.ACCORDION_JS_HEADER);
        addClass(accordionButton, prefixClassName + CONFIG.ACCORDION_HEADER_STYLE);
        setAttributes(accordionButton, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, CONFIG.ATTR_ROLE, CONFIG.ACCORDION_ROLE_TAB), 'id', CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_BUTTON_ID + indexHeaderLisible), CONFIG.ATTR_CONTROLS, CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_PANEL_ID + indexHeaderLisible), CONFIG.ATTR_SELECTED, 'false'), 'type', 'button'), DATA_HASH_ID, HASH_ID));

        // place button
        header_node.innerHTML = '';
        header_node.appendChild(accordionButton);

        // move title into panel
        //accordionPanel.insertBefore(header_node, accordionPanel.firstChild);
        // set title with attributes
        addClass(header_node, prefixClassName + CONFIG.ACCORDION_TITLE_STYLE);
        removeClass(header_node, CONFIG.ACCORDION_JS_HEADER);

        // set attributes to panels
        addClass(accordionPanel, prefixClassName + CONFIG.ACCORDION_PANEL_STYLE);
        setAttributes(accordionPanel, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, CONFIG.ATTR_ROLE, CONFIG.ACCORDION_ROLE_TABPANEL), CONFIG.ATTR_LABELLEDBY, CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_BUTTON_ID + indexHeaderLisible), 'id', CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_PANEL_ID + indexHeaderLisible), DATA_HASH_ID, HASH_ID));
        if (accordionOpenedAttribute === 'true') {
          accordionButton.setAttribute(CONFIG.ATTR_EXPANDED, 'true');
          header_node.removeAttribute(CONFIG.ACCORDION_DATA_OPENED);
          accordionPanel.setAttribute(CONFIG.ATTR_HIDDEN, 'false');
        } else {
          accordionButton.setAttribute(CONFIG.ATTR_EXPANDED, 'false');
          accordionPanel.setAttribute(CONFIG.ATTR_HIDDEN, 'true');
        }
      });
    });
  };
  return {
    attach: attach
    /*,
            destroy*/
  };
};
var main = function main() {
  /* listeners for all configs */
  ['click', 'keydown', 'focus'].forEach(function (eventName) {
    document.body.addEventListener(eventName, function (e) {
      var hashId = searchParentHashId(e.target, DATA_HASH_ID); //e.target.dataset.hashId;
      // search if click on button or on element in a button contains data-hash-id (it is needed to load config and know which class to search)

      if (hashId !== '') {
        // loading config from element
        var CONFIG = pluginConfig.get(hashId);

        // focus on button
        if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'focus') {
          var buttonTag = e.target;
          var accordionContainer = findById(searchParent(buttonTag, CONFIG.ACCORDION_JS, hashId), hashId);
          var coolSelectors = accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
          var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
          if (coolSelectors === false) {
            $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
              return element.parentNode.parentNode === accordionContainer;
            });
          }
          unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
          selectHeader(buttonTag, CONFIG.ATTR_SELECTED);
        }

        // click on button
        if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'click') {
          var _buttonTag = e.target;
          var _accordionContainer = findById(searchParent(_buttonTag, CONFIG.ACCORDION_JS, hashId), hashId);
          var _coolSelectors = _accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
          var _$accordionAllHeaders = [].slice.call(_accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
          var accordionMultiSelectable = _accordionContainer.getAttribute(CONFIG.ATTR_MULTISELECTABLE);
          var destination = findById(_buttonTag.getAttribute(CONFIG.ATTR_CONTROLS), hashId);
          var stateButton = _buttonTag.getAttribute(CONFIG.ATTR_EXPANDED);
          if (_coolSelectors === false) {
            _$accordionAllHeaders = _$accordionAllHeaders.filter(function (element) {
              return element.parentNode.parentNode === _accordionContainer;
            });
          }

          // if closed
          if (stateButton === 'false') {
            _buttonTag.setAttribute(CONFIG.ATTR_EXPANDED, true);
            destination.removeAttribute(CONFIG.ATTR_HIDDEN);
          } else {
            _buttonTag.setAttribute(CONFIG.ATTR_EXPANDED, false);
            destination.setAttribute(CONFIG.ATTR_HIDDEN, true);
          }
          if (accordionMultiSelectable === 'false') {
            _$accordionAllHeaders.forEach(function (header_node) {
              var destinationPanel = findById(header_node.getAttribute(CONFIG.ATTR_CONTROLS), hashId);
              if (header_node !== _buttonTag) {
                header_node.setAttribute(CONFIG.ATTR_SELECTED, false);
                header_node.setAttribute(CONFIG.ATTR_EXPANDED, false);
                destinationPanel.setAttribute(CONFIG.ATTR_HIDDEN, true);
              } else {
                header_node.setAttribute(CONFIG.ATTR_SELECTED, true);
              }
            });
          }
          setTimeout(function () {
            _buttonTag.focus();
          }, 0);
          e.preventDefault();
        }

        // keyboard management for headers
        if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'keydown') {
          var _buttonTag2 = e.target;
          var idAccordionContainer = searchParent(_buttonTag2, CONFIG.ACCORDION_JS, hashId);
          var _accordionContainer2 = findById(idAccordionContainer, hashId);
          var _coolSelectors2 = _accordionContainer2.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
          var _$accordionAllHeaders2 = [].slice.call(_accordionContainer2.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
          if (_coolSelectors2 === false) {
            _$accordionAllHeaders2 = _$accordionAllHeaders2.filter(function (element) {
              return element.parentNode.parentNode === _accordionContainer2;
            });
          }

          // strike home on a tab => 1st tab
          if (e.keyCode === 36) {
            unSelectHeaders(_$accordionAllHeaders2, CONFIG.ATTR_SELECTED);
            selectHeader(_$accordionAllHeaders2[0], CONFIG.ATTR_SELECTED);
            setTimeout(function () {
              _$accordionAllHeaders2[0].focus();
            }, 0);
            e.preventDefault();
          }
          // strike end on the tab => last tab
          else if (e.keyCode === 35) {
            unSelectHeaders(_$accordionAllHeaders2, CONFIG.ATTR_SELECTED);
            selectHeader(_$accordionAllHeaders2[_$accordionAllHeaders2.length - 1], CONFIG.ATTR_SELECTED);
            setTimeout(function () {
              _$accordionAllHeaders2[_$accordionAllHeaders2.length - 1].focus();
            }, 0);
            e.preventDefault();
          }
          // strike up or left on the tab => previous tab
          else if ((e.keyCode === 37 || e.keyCode === 38) && !e.ctrlKey) {
            // if first selected = select last
            if (_$accordionAllHeaders2[0].getAttribute(CONFIG.ATTR_SELECTED) === 'true') {
              unSelectHeaders(_$accordionAllHeaders2, CONFIG.ATTR_SELECTED);
              selectHeader(_$accordionAllHeaders2[_$accordionAllHeaders2.length - 1], CONFIG.ATTR_SELECTED);
              setTimeout(function () {
                _$accordionAllHeaders2[_$accordionAllHeaders2.length - 1].focus();
              }, 0);
              e.preventDefault();
            } else {
              selectHeaderInList(_$accordionAllHeaders2, 'prev', CONFIG.ATTR_SELECTED);
              e.preventDefault();
            }
          }
          // strike down or right in the tab => next tab
          else if ((e.keyCode === 40 || e.keyCode === 39) && !e.ctrlKey) {
            // if last selected = select first
            if (_$accordionAllHeaders2[_$accordionAllHeaders2.length - 1].getAttribute(CONFIG.ATTR_SELECTED) === 'true') {
              unSelectHeaders(_$accordionAllHeaders2, CONFIG.ATTR_SELECTED);
              selectHeader(_$accordionAllHeaders2[0], CONFIG.ATTR_SELECTED);
              setTimeout(function () {
                _$accordionAllHeaders2[0].focus();
              }, 0);
              e.preventDefault();
            } else {
              selectHeaderInList(_$accordionAllHeaders2, 'next', CONFIG.ATTR_SELECTED);
              e.preventDefault();
            }
          }
        }
      }
    }, true);
  });
  return plugin;
};
window.van11yAccessibleAccordionAria = main();
var _onLoad = function onLoad() {
  var expand_default = window.van11yAccessibleAccordionAria();
  expand_default.attach();
  document.removeEventListener('DOMContentLoaded', _onLoad);
};
document.addEventListener('DOMContentLoaded', _onLoad);