/*
 * ES2015 accessible accordion system, using ARIA
 * Website: https://van11y.net/accessible-accordion/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-accordion-aria/blob/master/LICENSE
 */
'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function (doc) {

    'use strict';

    var ACCORDION_JS = 'js-accordion';
    var ACCORDION_JS_HEADER = 'js-accordion__header';
    var ACCORDION_JS_PANEL = 'js-accordion__panel';

    var ACCORDION_DATA_PREFIX_CLASS = 'data-accordion-prefix-classes';
    var ACCORDION_DATA_OPENED = 'data-accordion-opened';
    var ACCORDION_DATA_MULTISELECTABLE = 'data-accordion-multiselectable';
    var ACCORDION_DATA_COOL_SELECTORS = 'data-accordion-cool-selectors';

    var ACCORDION_PREFIX_IDS = 'accordion';
    var ACCORDION_BUTTON_ID = '_tab';
    var ACCORDION_PANEL_ID = '_panel';

    var ACCORDION_STYLE = 'accordion';
    var ACCORDION_TITLE_STYLE = 'accordion__title';
    var ACCORDION_HEADER_STYLE = 'accordion__header';
    var ACCORDION_PANEL_STYLE = 'accordion__panel';

    var ACCORDION_ROLE_TABLIST = 'tablist';
    var ACCORDION_ROLE_TAB = 'tab';
    var ACCORDION_ROLE_TABPANEL = 'tabpanel';

    var ATTR_ROLE = 'role';
    var ATTR_MULTISELECTABLE = 'aria-multiselectable';
    var ATTR_EXPANDED = 'aria-expanded';
    var ATTR_LABELLEDBY = 'aria-labelledby';
    var ATTR_HIDDEN = 'aria-hidden';
    var ATTR_CONTROLS = 'aria-controls';
    var ATTR_SELECTED = 'aria-selected';

    //const IS_OPENED_CLASS = 'is-opened';

    var findById = function findById(id) {
        return doc.getElementById(id);
    };

    var addClass = function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className); // IE 10+
        } else {
                el.className += ' ' + className; // IE 8+
            }
    };

    var removeClass = function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className); // IE 10+
        } else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
            }
    };

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

    var unSelectHeaders = function unSelectHeaders(elts) {
        elts.forEach(function (header_node) {
            var _setAttributes;

            setAttributes(header_node, (_setAttributes = {}, _defineProperty(_setAttributes, ATTR_SELECTED, 'false'), _defineProperty(_setAttributes, 'tabindex', '-1'), _setAttributes));
        });
    };

    var selectHeader = function selectHeader(el) {
        el.setAttribute(ATTR_SELECTED, true);
        el.removeAttribute('tabindex');
    };

    var selectHeaderInList = function selectHeaderInList(elts, param) {
        var indice_trouve = undefined;
        elts.forEach(function (header_node, index) {

            if (header_node.getAttribute(ATTR_SELECTED) === 'true') {
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

    /* gets an element el, search if it is child of parent class, returns id of the parent */
    var searchParent = function searchParent(el, parentClass) {
        var found = false;
        var parentElement = el.parentNode;
        while (parentElement && found === false) {
            if (hasClass(parentElement, parentClass) === true) {
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

    /**
     * Find all accordions inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    var $listAccordions = function $listAccordions() {
        var node = arguments.length <= 0 || arguments[0] === undefined ? doc : arguments[0];
        return [].slice.call(node.querySelectorAll('.' + ACCORDION_JS));
    };

    /**
     * Build accordions for a container
     * @param  {Node} node
     */
    var attach = function attach(node) {
        $listAccordions(node).forEach(function (accordion_node) {

            var iLisible = Math.random().toString(32).slice(2, 12);
            var prefixClassName = accordion_node.hasAttribute(ACCORDION_DATA_PREFIX_CLASS) === true ? accordion_node.getAttribute(ACCORDION_DATA_PREFIX_CLASS) + '-' : '';
            var coolSelectors = accordion_node.hasAttribute(ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;

            // Init attributes accordion
            if (accordion_node.getAttribute(ACCORDION_DATA_MULTISELECTABLE) === 'none') {
                accordion_node.setAttribute(ATTR_MULTISELECTABLE, 'false');
            } else {
                accordion_node.setAttribute(ATTR_MULTISELECTABLE, 'true');
            }
            accordion_node.setAttribute(ATTR_ROLE, ACCORDION_ROLE_TABLIST);
            addClass(accordion_node, prefixClassName + ACCORDION_STYLE);

            var $listAccordionsHeader = [].slice.call(accordion_node.querySelectorAll('.' + ACCORDION_JS_HEADER));
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
                var accordionOpenedAttribute = header_node.hasAttribute(ACCORDION_DATA_OPENED) === true ? header_node.getAttribute(ACCORDION_DATA_OPENED) : '';

                // set button with attributes
                accordionButton.innerHTML = accordionHeaderText;
                addClass(accordionButton, ACCORDION_JS_HEADER);
                addClass(accordionButton, prefixClassName + ACCORDION_HEADER_STYLE);
                setAttributes(accordionButton, (_setAttributes2 = {}, _defineProperty(_setAttributes2, ATTR_ROLE, ACCORDION_ROLE_TAB), _defineProperty(_setAttributes2, 'id', ACCORDION_PREFIX_IDS + iLisible + ACCORDION_BUTTON_ID + indexHeaderLisible), _defineProperty(_setAttributes2, ATTR_CONTROLS, ACCORDION_PREFIX_IDS + iLisible + ACCORDION_PANEL_ID + indexHeaderLisible), _defineProperty(_setAttributes2, ATTR_SELECTED, 'false'), _defineProperty(_setAttributes2, 'tabindex', '-1'), _defineProperty(_setAttributes2, 'type', 'button'), _setAttributes2));

                // place button
                accordionButton = header_node.parentNode.insertBefore(accordionButton, header_node);

                // move title into panel
                accordionPanel.insertBefore(header_node, accordionPanel.firstChild);
                // set title with attributes
                addClass(header_node, prefixClassName + ACCORDION_TITLE_STYLE);
                removeClass(header_node, ACCORDION_JS_HEADER);

                // set attributes to panels
                addClass(accordionPanel, prefixClassName + ACCORDION_PANEL_STYLE);
                setAttributes(accordionPanel, (_setAttributes3 = {}, _defineProperty(_setAttributes3, ATTR_ROLE, ACCORDION_ROLE_TABPANEL), _defineProperty(_setAttributes3, ATTR_LABELLEDBY, ACCORDION_PREFIX_IDS + iLisible + ACCORDION_BUTTON_ID + indexHeaderLisible), _defineProperty(_setAttributes3, 'id', ACCORDION_PREFIX_IDS + iLisible + ACCORDION_PANEL_ID + indexHeaderLisible), _setAttributes3));

                if (accordionOpenedAttribute === 'true') {
                    accordionButton.setAttribute(ATTR_EXPANDED, 'true');
                    header_node.removeAttribute(ACCORDION_DATA_OPENED);
                    accordionPanel.setAttribute(ATTR_HIDDEN, 'false');
                } else {
                    accordionButton.setAttribute(ATTR_EXPANDED, 'false');
                    accordionPanel.setAttribute(ATTR_HIDDEN, 'true');
                }

                // init first one focusable
                if (indexHeaderLisible === 1) {
                    accordionButton.removeAttribute('tabindex');
                }
            });
        });
    };

    /* listeners */
    ['click', 'keydown', 'focus'].forEach(function (eventName) {
        //let isCtrl = false;

        doc.body.addEventListener(eventName, function (e) {

            // focus on button
            if (hasClass(e.target, ACCORDION_JS_HEADER) === true && eventName === 'focus') {
                (function () {
                    var buttonTag = e.target;
                    var accordionContainer = buttonTag.parentNode;
                    var coolSelectors = accordionContainer.hasAttribute(ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                    var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + ACCORDION_JS_HEADER));

                    if (coolSelectors === false) {
                        $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
                            return element.parentNode === accordionContainer;
                        });
                    }

                    unSelectHeaders($accordionAllHeaders);

                    selectHeader(buttonTag);
                })();
            }

            // click on button
            if (hasClass(e.target, ACCORDION_JS_HEADER) === true && eventName === 'click') {
                (function () {
                    var buttonTag = e.target;
                    var accordionContainer = buttonTag.parentNode;
                    var coolSelectors = accordionContainer.hasAttribute(ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                    var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + ACCORDION_JS_HEADER));
                    var accordionMultiSelectable = accordionContainer.getAttribute(ATTR_MULTISELECTABLE);
                    var destination = findById(buttonTag.getAttribute(ATTR_CONTROLS));
                    var stateButton = buttonTag.getAttribute(ATTR_EXPANDED);

                    if (coolSelectors === false) {
                        $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
                            return element.parentNode === accordionContainer;
                        });
                    }

                    // if closed
                    if (stateButton === 'false') {
                        buttonTag.setAttribute(ATTR_EXPANDED, true);
                        destination.removeAttribute(ATTR_HIDDEN);
                    } else {
                        buttonTag.setAttribute(ATTR_EXPANDED, false);
                        destination.setAttribute(ATTR_HIDDEN, true);
                    }

                    if (accordionMultiSelectable === 'false') {
                        $accordionAllHeaders.forEach(function (header_node) {

                            var destinationPanel = findById(header_node.getAttribute(ATTR_CONTROLS));

                            if (header_node !== buttonTag) {
                                header_node.setAttribute(ATTR_SELECTED, false);
                                header_node.setAttribute(ATTR_EXPANDED, false);
                                destinationPanel.setAttribute(ATTR_HIDDEN, true);
                            } else {
                                header_node.setAttribute(ATTR_SELECTED, true);
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
            if (hasClass(e.target, ACCORDION_JS_HEADER) === true && eventName === 'keydown') {
                (function () {
                    var buttonTag = e.target;
                    var accordionContainer = buttonTag.parentNode;
                    var coolSelectors = accordionContainer.hasAttribute(ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                    var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + ACCORDION_JS_HEADER));

                    if (coolSelectors === false) {
                        $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
                            return element.parentNode === accordionContainer;
                        });
                    }

                    // strike home on a tab => 1st tab
                    if (e.keyCode === 36) {
                        unSelectHeaders($accordionAllHeaders);
                        selectHeader($accordionAllHeaders[0]);
                        setTimeout(function () {
                            $accordionAllHeaders[0].focus();
                        }, 0);
                        e.preventDefault();
                    }
                    // strike end on the tab => last tab
                    else if (e.keyCode === 35) {
                            unSelectHeaders($accordionAllHeaders);
                            selectHeader($accordionAllHeaders[$accordionAllHeaders.length - 1]);
                            setTimeout(function () {
                                $accordionAllHeaders[$accordionAllHeaders.length - 1].focus();
                            }, 0);
                            e.preventDefault();
                        }
                        // strike up or left on the tab => previous tab
                        else if ((e.keyCode === 37 || e.keyCode === 38) && !e.ctrlKey) {

                                // if first selected = select last
                                //if ( $accordionAllHeaders[ $accordionAllHeaders.length-1 ].getAttribute( ATTR_SELECTED ) === 'true' ) {
                                if ($accordionAllHeaders[0].getAttribute(ATTR_SELECTED) === 'true') {
                                    unSelectHeaders($accordionAllHeaders);
                                    selectHeader($accordionAllHeaders[$accordionAllHeaders.length - 1]);
                                    setTimeout(function () {
                                        $accordionAllHeaders[$accordionAllHeaders.length - 1].focus();
                                    }, 0);
                                    e.preventDefault();
                                } else {
                                    selectHeaderInList($accordionAllHeaders, 'prev');
                                    e.preventDefault();
                                }
                            }
                            // strike down or right in the tab => next tab
                            else if ((e.keyCode === 40 || e.keyCode === 39) && !e.ctrlKey) {

                                    // if last selected = select first
                                    if ($accordionAllHeaders[$accordionAllHeaders.length - 1].getAttribute(ATTR_SELECTED) === 'true') {
                                        unSelectHeaders($accordionAllHeaders);
                                        selectHeader($accordionAllHeaders[0]);
                                        setTimeout(function () {
                                            $accordionAllHeaders[0].focus();
                                        }, 0);
                                        e.preventDefault();
                                    } else {
                                        selectHeaderInList($accordionAllHeaders, 'next');
                                        e.preventDefault();
                                    }
                                }
                })();
            }

            // keyboard management for panels
            var id_panel = searchParent(e.target, ACCORDION_JS_PANEL);
            if (id_panel !== '' && eventName === 'keydown') {
                (function () {

                    var panelTag = findById(id_panel);
                    var accordionContainer = panelTag.parentNode;
                    var coolSelectors = accordionContainer.hasAttribute(ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                    var $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + ACCORDION_JS_HEADER));
                    var buttonTag = findById(panelTag.getAttribute(ATTR_LABELLEDBY));

                    if (coolSelectors === false) {
                        $accordionAllHeaders = $accordionAllHeaders.filter(function (element) {
                            return element.parentNode === accordionContainer;
                        });
                    }

                    // strike up + ctrl => go to header
                    if (e.keyCode === 38 && e.ctrlKey) {
                        unSelectHeaders($accordionAllHeaders);
                        selectHeader(buttonTag);
                        setTimeout(function () {
                            buttonTag.focus();
                        }, 0);
                        e.preventDefault();
                    }
                    // strike pageup + ctrl => go to prev header
                    if (e.keyCode === 33 && e.ctrlKey) {
                        // go to header
                        unSelectHeaders($accordionAllHeaders);
                        selectHeader(buttonTag);
                        buttonTag.focus();
                        e.preventDefault();
                        // then previous
                        if ($accordionAllHeaders[0].getAttribute(ATTR_SELECTED) === 'true') {
                            unSelectHeaders($accordionAllHeaders);
                            selectHeader($accordionAllHeaders[$accordionAllHeaders.length - 1]);
                            setTimeout(function () {
                                $accordionAllHeaders[$accordionAllHeaders.length - 1].focus();
                            }, 0);
                        } else {
                            selectHeaderInList($accordionAllHeaders, 'prev');
                        }
                    }
                    // strike pagedown + ctrl => go to next header
                    if (e.keyCode === 34 && e.ctrlKey) {
                        // go to header
                        unSelectHeaders($accordionAllHeaders);
                        selectHeader(buttonTag);
                        buttonTag.focus();
                        e.preventDefault();
                        // then next
                        if ($accordionAllHeaders[$accordionAllHeaders.length - 1].getAttribute(ATTR_SELECTED) === 'true') {
                            unSelectHeaders($accordionAllHeaders);
                            selectHeader($accordionAllHeaders[0]);
                            setTimeout(function () {
                                $accordionAllHeaders[0].focus();
                            }, 0);
                        } else {
                            selectHeaderInList($accordionAllHeaders, 'next');
                        }
                    }
                })();
            }
        }, true);
    });

    var onLoad = function onLoad() {
        attach();
        document.removeEventListener('DOMContentLoaded', onLoad);
    };

    document.addEventListener('DOMContentLoaded', onLoad);

    window.van11yAccessibleAccordionAria = attach;
})(document);