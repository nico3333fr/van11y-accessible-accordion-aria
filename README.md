# Van11y ES2015 accessible accordion system, using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will transform a simple list of Hx/contents into shiny and accessible accordion, using ARIA.

The demo is here: https://van11y.net/downloads/accordion/demo/index.html

Website is here: https://van11y.net/accessible-accordion/

La page existe aussi en français : https://van11y.net/fr/accordeon-accessible/

## How it works

Basically it will transform this:
```html
<div class="js-accordion" data-accordion-prefix-classes="your-prefix-class">
 <h2 class="js-accordion__header">First tab</h2>
 <div class="js-accordion__panel">
   <p>Content of 1st tab</p>
 </div>
 <h2 class="js-accordion__header">Second tab</h2>
 <div class="js-accordion__panel">
   <p>Content of 2nd tab</p>
 </div>
 <h2 class="js-accordion__header">Third tab</h2>
 <div class="js-accordion__panel">
   <p>Content of 3rd tab</p>
 </div>
</div>
```
Into this:
```html
<div class="your-prefix-class"
   data-accordion-prefix-classes="your-prefix-class"
   role="tablist" aria-multiselectable="true">

 <h2 class="your-prefix-class-accordion__title">
   <button id="accordion1_tab1"
     class="js-accordion__header your-prefix-class__header"
     aria-controls="accordion1_panel1" aria-expanded="false"
     role="tab" aria-selected="true" type="button">
       First tab
   </button>
 </h2>

 <div id="accordion1_panel1"
     class="js-accordion__panel your-prefix-class__panel"
     aria-labelledby="accordion1_tab1"
     role="tabpanel" aria-hidden="true">

   <p>Content of 1st tab</p>

 </div>
 … etc…
</div>
```

The script will do the rest (all ids, ARIA attributes, buttons are generated on the fly).

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on ```<div id="newContent">your accordion source</div>```:

```js
var my_accordion = van11yAccessibleAccordionAria();
my_accordion.attach(document.getElementById('newContent'));
```



## How to use it

You may use npm command: ```npm i van11y-accessible-accordion-aria```.

You may also use bower: ```bower install van11y-accessible-accordion-aria```.

Then, follow the conventions given in this minimal example.
```html
<div class="js-accordion" data-accordion-prefix-classes="your-prefix-class">
 <h2 class="js-accordion__header">First tab</h2>
 <div class="js-accordion__panel">
   <p>Content of 1st tab</p>
 </div>
 <h2 class="js-accordion__header">Second tab</h2>
 <div class="js-accordion__panel">
   <p>Content of 2nd tab</p>
 </div>
 <h2 class="js-accordion__header">Third tab</h2>
 <div class="js-accordion__panel">
   <p>Content of 3rd tab</p>
 </div>
</div>
```
The minimal style needed is:
```css
.your-prefix-class__panel[aria-hidden=true] {
  display: none;
}
```

## How to style it (nicely)

In this example page, I’ve used ```data-accordion-prefix-classes="minimalist-accordion"```, so all the generated classes will start with ```.minimalist-accordion``` (```.minimalist-accordion__header```, ```.minimalist-accordion__panel``` and ```.minimalist-accordion__title```).
```css
.minimalist-accordion__panel[aria-hidden=true] {
  display: none;
}

.minimalist-accordion__header {
  display: block;
}

/* title opened */
.minimalist-accordion__header[aria-expanded="true"]:before {
  content: "- ";
}
/* title closed */
.minimalist-accordion__header[aria-expanded="false"]:before {
  content: "+ ";
}

/* title selected */
.minimalist-accordion__header[aria-selected="true"]:after {
  content: " (sel)";
}
/* title non selected */
.minimalist-accordion__header[aria-selected="false"]:after {
  content: " (unselc)";
}
```

## Keyboard shortcuts

Keyboard navigation is supported too, here are the shortcuts:

If you focus on the accordion “buttons”:

- use Up/Left to put focus on previous accordion button,
- use Down/Right to put focus on next accordion button
- use Home to put focus on first accordion button (wherever you are in accordion buttons)
- use End to put focus on last accordion button (wherever you are in accordion buttons)

And strike space or return on an accordion button to open/close it.


## Bonuses

__Content opened by default__

If you want to have an accordion content opened by default, just add the attribute data-accordion-opened="true" on a hx, example:
```html
<h2 class="js-accordion__header" data-accordion-opened="true">
 Second tab
</h2>
```
And the script will open its content.

__Nested accordions and cooler selectors__

By default, the script supports nested accordions (since 2.1.0 version). To do this, the script is going to search for direct children of `js-accordion`. However, it is possible to activate a less strict mode if your site requires some `div` between `js-accordion` and `js-accordion__header`, this can be achieved using `data-accordion-cool-selectors="1"` attribute, to put onto `js-accordion` element. [The first demo illustrates this feature](https://van11y.net/downloads/accordion/demo/index.html).

__Default config__

```js
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
```

If you need to use another configuration, you may call the plugin like this:

```js
var other_accordion = van11yAccessibleAccordionAria({
    ACCORDION_PREFIX_IDS: 'peekaboo_',
    ACCORDION_JS: 'js-accordion2'
});
other_accordion.attach();
```

__Other options__

The ARIA Design Pattern for accordions allows to have several accordion panels opened at the same time (which is shown by the attribute ```aria-multiselectable="true"```). However, you might need to avoid this for design purposes or client request. To do this, you may set this attribute on the accordion container: ```data-accordion-multiselectable="none"```. Example:
```html
<div class="js-accordion" data-accordion-multiselectable="none" …>
```
This option will set up ```aria-multiselectable="false"``` and the script will allow only one panel to be opened at the same time.
