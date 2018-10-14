/*
 * ES2015 accessible accordion system, using ARIA
 * Website: https://van11y.net/accessible-accordion/
 * License MIT: https://github.com/nico3333fr/van11y-accessible-accordion-aria/blob/master/LICENSE
 */
const loadConfig = () => {

    const CACHE = {};

    const set = (id, config) => {

        CACHE[id] = config;

    };
    const get = (id) => CACHE[id];
    const remove = (id) => CACHE[id];

    return {
        set,
        get,
        remove
    }
};

const DATA_HASH_ID = 'data-hashaccordion-id';

const pluginConfig = loadConfig();

/** Find an element based on an Id
 * @param  {String} id Id to find
 * @param  {String} hash hash id (not mandatory)
 * @return {Node} the element with the specified id
 */
const findById = (id, hash) => document.querySelector(`#${id}[${DATA_HASH_ID}="${hash}"]`);

/** add a class to a node
 * @param  {Node} el node to attach class
 * @param  {String} className the class to add
 */
const addClass = (el, className) => {
    if (el.classList) {
        el.classList.add(className); // IE 10+
    } else {
        el.className += ' ' + className; // IE 8+
    }
}

/** remove class from node
 * @param  {Node} el node to remove class
 * @param  {String} className the class to remove
 */
const removeClass = (el, className) => {
    if (el.classList) {
        el.classList.remove(className); // IE 10+
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' '); // IE 8+
    }
}

/** check if node has specified class
 * @param  {Node} el node to check
 * @param  {String} className the class
 */
const hasClass = (el, className) => {
    if (el.classList) {
        return el.classList.contains(className); // IE 10+
    } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className); // IE 8+ ?
    }
}

const setAttributes = (node, attrs) => {
    Object
        .keys(attrs)
        .forEach((attribute) => {
            node.setAttribute(attribute, attrs[attribute]);
        });
};

/** search if element is or is contained in another element with attribute data-hashaccordion-id
 * @param  {Node} el element (node)
 * @param  {String} hashId the attribute data-hashtooltip-id
 * @return {String} the value of attribute data-hashtooltip-id
 */
const searchParentHashId = (el, hashId) => {
    let found = false;

    let parentElement = el;
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
}
const searchParent = (el, parentClass, hashId) => {
    let found = false;

    let parentElement = el;
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
}

const unSelectHeaders = (elts, attrSelected) => {
    elts
        .forEach((header_node) => {
            setAttributes(header_node, {
                [attrSelected]: 'false'
            });
        });
}

const selectHeader = (el, attrSelected) => {
    el.setAttribute(attrSelected, true);
}

const selectHeaderInList = (elts, param, attrSelected) => {
    let indice_trouve;
    elts
        .forEach((header_node, index) => {

            if (header_node.getAttribute(attrSelected) === 'true') {
                indice_trouve = index;
            }

        });

    if (param === 'next') {
        selectHeader(elts[indice_trouve + 1]);
        setTimeout(function() {
            elts[indice_trouve + 1].focus();
        }, 0);
    }
    if (param === 'prev') {
        selectHeader(elts[indice_trouve - 1]);
        setTimeout(function() {
            elts[indice_trouve - 1].focus();
        }, 0);
    }

}


const plugin = (config = {}) => {

    const CONFIG = {
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
        ATTR_SELECTED: 'aria-selected',
        ...config
    };

    const HASH_ID = Math.random().toString(32).slice(2, 12);

    pluginConfig.set(HASH_ID, CONFIG);
    /**
     * Find all accordions inside a container
     * @param  {Node} node Default document
     * @return {Array}
     */
    const $listAccordions = (node = document) => [].slice.call(node.querySelectorAll('.' + CONFIG.ACCORDION_JS)); //[...node.querySelectorAll('.' + CONFIG.ACCORDION_JS)]; // that does not work on IE when transpiled :-(


    /**
     * Build accordions for a container
     * @param  {Node} node
     * @param  {addListeners} boolean
     */
    const attach = (node) => {


        $listAccordions(node)
            .forEach((accordion_node) => {

                let iLisible = 'z' + Math.random().toString(32).slice(2, 12); // avoid selector exception when starting by a number
                let prefixClassName = accordion_node.hasAttribute(CONFIG.ACCORDION_DATA_PREFIX_CLASS) === true ? accordion_node.getAttribute(CONFIG.ACCORDION_DATA_PREFIX_CLASS) + '-' : '';
                let coolSelectors = accordion_node.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;

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

                let $listAccordionsHeader = [].slice.call(accordion_node.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
                $listAccordionsHeader
                    .forEach((header_node, index_header) => {

                        // if we do not have cool selectors enabled,
                        // it is not a direct child, we ignore it
                        if (header_node.parentNode !== accordion_node && coolSelectors === false) {
                            return;
                        }

                        let indexHeaderLisible = index_header + 1;
                        let accordionPanel = header_node.nextElementSibling;
                        let accordionHeaderText = header_node.innerHTML;
                        let accordionButton = document.createElement("BUTTON");
                        let accordionOpenedAttribute = header_node.hasAttribute(CONFIG.ACCORDION_DATA_OPENED) === true ? header_node.getAttribute(CONFIG.ACCORDION_DATA_OPENED) : '';

                        // set button with attributes
                        accordionButton.innerHTML = accordionHeaderText;
                        addClass(accordionButton, CONFIG.ACCORDION_JS_HEADER);
                        addClass(accordionButton, prefixClassName + CONFIG.ACCORDION_HEADER_STYLE);
                        setAttributes(accordionButton, {
                            [CONFIG.ATTR_ROLE]: CONFIG.ACCORDION_ROLE_TAB,
                            'id': CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_BUTTON_ID + indexHeaderLisible,
                            [CONFIG.ATTR_CONTROLS]: CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_PANEL_ID + indexHeaderLisible,
                            [CONFIG.ATTR_SELECTED]: 'false',
                            'type': 'button',
                            [DATA_HASH_ID]: HASH_ID
                        });

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
                        setAttributes(accordionPanel, {
                            [CONFIG.ATTR_ROLE]: CONFIG.ACCORDION_ROLE_TABPANEL,
                            [CONFIG.ATTR_LABELLEDBY]: CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_BUTTON_ID + indexHeaderLisible,
                            'id': CONFIG.ACCORDION_PREFIX_IDS + iLisible + CONFIG.ACCORDION_PANEL_ID + indexHeaderLisible,
                            [DATA_HASH_ID]: HASH_ID
                        });

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
        attach
        /*,
                destroy*/
    }
};

const main = () => {

    /* listeners for all configs */
    ['click', 'keydown', 'focus']
    .forEach(eventName => {

        document.body
            .addEventListener(eventName, e => {

                let hashId = searchParentHashId(e.target, DATA_HASH_ID); //e.target.dataset.hashId;
                // search if click on button or on element in a button contains data-hash-id (it is needed to load config and know which class to search)

                if (hashId !== '') {

                    // loading config from element
                    let CONFIG = pluginConfig.get(hashId);

                    // focus on button
                    if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'focus') {
                        let buttonTag = e.target;
                        let accordionContainer = findById(searchParent(buttonTag, CONFIG.ACCORDION_JS, hashId), hashId);
                        let coolSelectors = accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                        let $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));

                        if (coolSelectors === false) {
                            $accordionAllHeaders = $accordionAllHeaders.filter(element => element.parentNode.parentNode === accordionContainer);
                        }

                        unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);

                        selectHeader(buttonTag, CONFIG.ATTR_SELECTED);

                    }

                    // click on button
                    if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'click') {
                        let buttonTag = e.target;
                        let accordionContainer = findById(searchParent(buttonTag, CONFIG.ACCORDION_JS, hashId), hashId);
                        let coolSelectors = accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                        let $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));
                        let accordionMultiSelectable = accordionContainer.getAttribute(CONFIG.ATTR_MULTISELECTABLE);
                        let destination = findById(buttonTag.getAttribute(CONFIG.ATTR_CONTROLS), hashId);
                        let stateButton = buttonTag.getAttribute(CONFIG.ATTR_EXPANDED);

                        if (coolSelectors === false) {
                            $accordionAllHeaders = $accordionAllHeaders.filter(element => element.parentNode.parentNode === accordionContainer);
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
                            $accordionAllHeaders
                                .forEach((header_node) => {

                                    let destinationPanel = findById(header_node.getAttribute(CONFIG.ATTR_CONTROLS), hashId);

                                    if (header_node !== buttonTag) {
                                        header_node.setAttribute(CONFIG.ATTR_SELECTED, false);
                                        header_node.setAttribute(CONFIG.ATTR_EXPANDED, false);
                                        destinationPanel.setAttribute(CONFIG.ATTR_HIDDEN, true);
                                    } else {
                                        header_node.setAttribute(CONFIG.ATTR_SELECTED, true);
                                    }
                                });

                        }

                        setTimeout(function() {
                            buttonTag.focus();
                        }, 0);
                        e.preventDefault();

                    }

                    // keyboard management for headers
                    if (hasClass(e.target, CONFIG.ACCORDION_JS_HEADER) === true && eventName === 'keydown') {
                        let buttonTag = e.target;
                        let idAccordionContainer = searchParent(buttonTag, CONFIG.ACCORDION_JS, hashId);
                        let accordionContainer = findById(idAccordionContainer, hashId);

                        let coolSelectors = accordionContainer.hasAttribute(CONFIG.ACCORDION_DATA_COOL_SELECTORS) === true ? true : false;
                        let $accordionAllHeaders = [].slice.call(accordionContainer.querySelectorAll('.' + CONFIG.ACCORDION_JS_HEADER));

                        if (coolSelectors === false) {
                            $accordionAllHeaders = $accordionAllHeaders.filter(element => element.parentNode.parentNode === accordionContainer);
                        }

                        // strike home on a tab => 1st tab
                        if (e.keyCode === 36) {
                            unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
                            selectHeader($accordionAllHeaders[0], CONFIG.ATTR_SELECTED);
                            setTimeout(function() {
                                $accordionAllHeaders[0].focus();
                            }, 0);
                            e.preventDefault();
                        }
                        // strike end on the tab => last tab
                        else if (e.keyCode === 35) {
                            unSelectHeaders($accordionAllHeaders, CONFIG.ATTR_SELECTED);
                            selectHeader($accordionAllHeaders[$accordionAllHeaders.length - 1], CONFIG.ATTR_SELECTED);
                            setTimeout(function() {
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
                                setTimeout(function() {
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
                                setTimeout(function() {
                                    $accordionAllHeaders[0].focus();
                                }, 0);
                                e.preventDefault();
                            } else {
                                selectHeaderInList($accordionAllHeaders, 'next', CONFIG.ATTR_SELECTED);
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

const onLoad = () => {
    const expand_default = window.van11yAccessibleAccordionAria();
    expand_default.attach();

    document.removeEventListener('DOMContentLoaded', onLoad);
}

document.addEventListener('DOMContentLoaded', onLoad);
