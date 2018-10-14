/*
 * ES2015 accessible accordion system, using ARIA
 * Website: https://van11y.net/accessible-accordion/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-accordion-aria/blob/master/LICENSE
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    return document.querySelector('#' + id + '[' + DATA_HASH_ID + '="' + hash + '"]');
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
    var indice_trouve = undefined;
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
    var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var CONFIG = _extends({
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
        var node = arguments.length <= 0 || arguments[0] === undefined ? document : arguments[0];
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
                var _setAttributes2, _setAttributes3;

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
                setAttributes(accordionButton, (_setAttributes2 = {}, _defineProperty(_setAttributes2, CONFIG.ATTR_ROLE, CONFIG.ACCORDION_ROLE_TAB), _defineProperty(_setAttributes2, 'id', CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_BUTTON_ID + indexHeaderLisible), _defineProperty(_setAttributes2, CONFIG.ATTR_CONTROLS, CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_PANEL_ID + indexHeaderLisible), _defineProperty(_setAttributes2, CONFIG.ATTR_SELECTED, 'false'), _defineProperty(_setAttributes2, 'type', 'button'), _defineProperty(_setAttributes2, DATA_HASH_ID, HASH_ID), _setAttributes2));

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
                setAttributes(accordionPanel, (_setAttributes3 = {}, _defineProperty(_setAttributes3, CONFIG.ATTR_ROLE, CONFIG.ACCORDION_ROLE_TABPANEL), _defineProperty(_setAttributes3, CONFIG.ATTR_LABELLEDBY, CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_BUTTON_ID + indexHeaderLisible), _defineProperty(_setAttributes3, 'id', CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_PANEL_ID + indexHeaderLisible), _defineProperty(_setAttributes3, DATA_HASH_ID, HASH_ID), _setAttributes3));

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
                (function () {

                    // loading config from element
                    var CONFIG = pluginConfig.get(hashId);

                    // focus on button
                    if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'focus') {
                        (function () {
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
                        })();
                    }

                    // click on button
                    if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'click') {
                        (function () {
                            var buttonTag = e.target;
                            var accordionContainer = findById(searchParent(buttonTag, CONFIG.ACCORDION_JS, hashId), hashId);
                            var coolSelectors = accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                            var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
                            var accordionMultiSelectable = accordionContainer.getAttribute(CONFIG.ATTR_MULTISELECTABLE);
                            var destination = findById(buttonTag.getAttribute(CONFIG.ATTR_CONTROLS), hashId);
                            var stateButton = buttonTag.getAttribute(CONFIG.ATTR_EXPANDED);

                            if (coolSelectors === false) {
                                $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
                                    return element.parentNode.parentNode === accordionContainer;
                                });
                            }

                            // if closed
                            if (stateButton === 'false') {
                                buttonTag.setAttribute(CONFIG.ATTR_EXPANDED, true);
                                destination.removeAttribute(CONFIG.ATTR_HIDDEN);
                            } else {
                                buttonTag.setAttribute(CONFIG.ATTR_EXPANDED, false);
                                destination.setAttribute(CONFIG.ATTR_HIDDEN, true);
                            }

                            if (accordionMultiSelectable === 'false') {
                                $accordionAllHeaders.forEach(function (header_node) {

                                    var destinationPanel = findById(header_node.getAttribute(CONFIG.ATTR_CONTROLS), hashId);

                                    if (header_node !== buttonTag) {
                                        header_node.setAttribute(CONFIG.ATTR_SELECTED, false);
                                        header_node.setAttribute(CONFIG.ATTR_EXPANDED, false);
                                        destinationPanel.setAttribute(CONFIG.ATTR_HIDDEN, true);
                                    } else {
                                        header_node.setAttribute(CONFIG.ATTR_SELECTED, true);
                                    }
                                });
                            }

                            setTimeout(function () {
                                buttonTag.focus();
                            }, 0);
                            e.preventDefault();
                        })();
                    }

                    // keyboard management for headers
                    if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'keydown') {
                        (function () {
                            var buttonTag = e.target;
                            var idAccordionContainer = searchParent(buttonTag, CONFIG.ACCORDION_JS, hashId);
                            var accordionContainer = findById(idAccordionContainer, hashId);

                            var coolSelectors = accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                            var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));

                            if (coolSelectors === false) {
                                $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
                                    return element.parentNode.parentNode === accordionContainer;
                                });
                            }

                            // strike home on a tab => 1st tab
                            if (e.keyCode === 36) {
                                unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
                                selectHeader($accordionAllHeaders[0], CONFIG.ATTR_SELECTED);
                                setTimeout(function () {
                                    $accordionAllHeaders[0].focus();
                                }, 0);
                                e.preventDefault();
                            }
                            // strike end on the tab => last tab
                            else if (e.keyCode === 35) {
                                    unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
                                    selectHeader($accordionAllHeaders[$accordionAllHeaders.length - 1], CONFIG.ATTR_SELECTED);
                                    setTimeout(function () {
                                        $accordionAllHeaders[$accordionAllHeaders.length - 1].focus();
                                    }, 0);
                                    e.preventDefault();
                                }
                                // strike up or left on the tab => previous tab
                                else if ((e.keyCode === 37 || e.keyCode === 38) && !e.ctrlKey) {

                                        // if first selected = select last
                                        if ($accordionAllHeaders[0].getAttribute(CONFIG.ATTR_SELECTED) === 'true') {
                                            unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
                                            selectHeader($accordionAllHeaders[$accordionAllHeaders.length - 1], CONFIG.ATTR_SELECTED);
                                            setTimeout(function () {
                                                $accordionAllHeaders[$accordionAllHeaders.length - 1].focus();
                                            }, 0);
                                            e.preventDefault();
                                        } else {
                                            selectHeaderInList($accordionAllHeaders, 'prev', CONFIG.ATTR_SELECTED);
                                            e.preventDefault();
                                        }
                                    }
                                    // strike down or right in the tab => next tab
                                    else if ((e.keyCode === 40 || e.keyCode === 39) && !e.ctrlKey) {

                                            // if last selected = select first
                                            if ($accordionAllHeaders[$accordionAllHeaders.length - 1].getAttribute(CONFIG.ATTR_SELECTED) === 'true') {
                                                unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
                                                selectHeader($accordionAllHeaders[0], CONFIG.ATTR_SELECTED);
                                                setTimeout(function () {
                                                    $accordionAllHeaders[0].focus();
                                                }, 0);
                                                e.preventDefault();
                                            } else {
                                                selectHeaderInList($accordionAllHeaders, 'next', CONFIG.ATTR_SELECTED);
                                                e.preventDefault();
                                            }
                                        }
                        })();
                    }
                })();
            }
        }, true);
    });

    return plugin;
};

window.van11yAccessibleAccordionAria = main();

var onLoad = function onLoad() {
    var expand_default = window.van11yAccessibleAccordionAria();
    expand_default.attach();

    document.removeEventListener('DOMContentLoaded', onLoad);
};

document.addEventListener('DOMContentLoaded', onLoad);