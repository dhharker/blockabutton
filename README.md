blockabutton
============

jQuery plugin to enhance links by making their entire parent clickable.

Example with default values:
    $('a#important-link').blockabutton({
        // Overlay not included in base markup so only applied when inited.
        overlayClass: 'block-a-button-overlay',
        // Make whole overlay clickable with same URL as button
        overlayClickable: true,
        // Added once inited so that non-js button can be styled separately from real one.
        buttonClass: 'block-a-button-inited',
        // Button alignment
        hPos: 'centre',
        vPos: 'middle',
        // Tweak if needed
        zIndex: 150,
        // Number of levels to traverse up the DOM
        goUp: 1
    });