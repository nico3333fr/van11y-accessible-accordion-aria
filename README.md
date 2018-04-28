# Van11y ES2015 accessible accordion system, using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will transform a simple list of Hx/contents into shiny and accessible accordion, using ARIA.

The demo is here: https://van11y.net/downloads/accordion/demo/index.html

Website is here: https://van11y.net/accessible-accordion/

La page existe aussi en français : https://van11y.net/fr/accordeon-accessible/

## How it works

Basically it will transform this:
```
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
```
<div class="your-prefix-class"
   data-accordion-prefix-classes="your-prefix-class"
   role="tablist" aria-multiselectable="true">

 <button id="accordion1_tab1"
     class="js-accordion__header your-prefix-class__header"
     aria-controls="accordion1_panel1" aria-expanded="false"
     role="tab" aria-selected="true" type="button">
       First tab
 </button>

 <div id="accordion1_panel1"
     class="js-accordion__panel your-prefix-class__panel"
     aria-labelledby="accordion1_tab1"
     role="tabpanel" aria-hidden="true">

   <h2 class="your-prefix-class__title" tabindex="0">First tab</h2>
   <p>Content of 1st tab</p>

 </div>
 … etc…
</div>
```

The script will do the rest (all ids, ARIA attributes, buttons are generated on the fly).

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on ```<div id="newContent">your accordion source</div>```:

```van11yAccessibleAccordionAria(document.getElementById('newContent'));```


## How to use it

You may use npm command: ```npm i van11y-accessible-accordion-aria```.

You may also use bower: ```bower install van11y-accessible-accordion-aria```.

Then, follow the conventions given in this minimal example.
```
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
```
.your-prefix-class__panel[aria-hidden=true] {
  display: none;
}
```

## How to style it (nicely)

In this example page, I’ve used ```data-accordion-prefix-classes="minimalist-accordion"```, so all the generated classes will start with ```.minimalist-accordion``` (```.minimalist-accordion__header```, ```.minimalist-accordion__panel``` and ```.minimalist-accordion__title```).
```
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

If you focus on accordion content:

- use Ctrl Up to set focus on the accordion button for the currently displayed accordion content
- use Ctrl PageUp to set focus on the previous accordion button for the currently displayed accordion content
- use Ctrl PageDown to set focus on the next accordion button for the currently displayed accordion content

Warning: Ctrl+PageUp/PageDown combination could activate for some browsers a switch of browser tabs. Nothing to do for this, as far as I know (if you have a solution, let me know).

## Bonuses

__Content opened by default__

If you want to have an accordion content opened by default, just add the attribute data-accordion-opened="true" on a hx, example:
```
<h2 class="js-accordion__header" data-accordion-opened="true">
 Second tab
</h2>
```
And the script will open its content.

__Nested accordions and cooler selectors__

By default, the script supports nested accordions (since 2.1.0 version). To do this, the script is going to search for direct children of `js-accordion`. However, it is possible to activate a less strict mode if your site requires some `div` between `js-accordion` and `js-accordion__header`, this can be achieved using `data-accordion-cool-selectors="1"` attribute, to put onto `js-accordion` element. [The first demo illustrates this feature](https://van11y.net/downloads/accordion/demo/index.html).

__Other options__

The ARIA Design Pattern for accordions allows to have several accordion panels opened at the same time (which is shown by the attribute ```aria-multiselectable="true"```). However, you might need to avoid this for design purposes or client request. To do this, you may set this attribute on the accordion container: ```data-accordion-multiselectable="none"```. Example:
```
<div class="js-accordion" data-accordion-multiselectable="none" …>
```
This option will set up ```aria-multiselectable="false"``` and the script will allow only one panel to be opened at the same time.
