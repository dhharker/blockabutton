
/*
 * Copyright (c) 2012 David Harker (http://wtds.co.uk/)
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Version 0.3
 * 
 * A jQuery plugin for situations where a container element is designed to draw
 * attention to a single link within it (e.g. thumbnail and description block).
 * Where it is obvious to the user than the block can be clicked even without
 * the presence of an explicit link or button, will remove clutter by hiding
 * such a link/button and only showing it on hover, turning the whole container
 * element into a big button.
 * 
 * Removes the link from the flow, adds it to an overlay, sizes
 * the overlay to its parent, optionally makes the overlay into a link with the
 * same href as the link. Shows the overlay over the parent element, containing
 * the link in a specified position/size on hover. On mobile, visits link
 * immediately.
 * 
 * Overlay technique initially inspired by
 * http://stackoverflow.com/questions/3030988/jquery-image-hover-color-overlay
 *  - thanks!
 **/

;(function($){
    $.fn.extend({
        blockabutton: function(options) {
            this.defaults = {
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
            };
            var settings = $.extend({}, this.defaults, options);
            return this.each(function() {
                var $this = $(this);
                var $container = $(this), toGoUp = settings.goUp;
                while (toGoUp-- > 0) $container = $container.parent();
                var myHref = "";
                if (settings.overlayClickable) {
                    myHref = $this.attr('href');
                    if (myHref.length <= 1) myHref = false;
                }
                
                var $overlay = (!settings.overlayClickable ? $('<div />') : $('<a />'))
                    .text(' ')
                    .css({
                        'height': $container.height(),
                        'width': $container.width(),
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'opacity': 0,
                        'zIndex': settings.zIndex
                    })
                    .addClass (settings.overlayClass)
                    .prependTo ($container)
                ;
                
                if (settings.overlayClickable) {
                    if (!myHref)
                        $overlay.attr('nohref',true)
                    else
                        $overlay.attr('href',myHref)
                }
                
                $this
                    .addClass ('block-a-button') // ensures style is consistent in case not already present in base markup
                    .addClass (settings.buttonClass)
                    .appendTo ($overlay);
                    
                if (settings.hPos == 'left' || settings.hPos == 'right')
                    $this.css ({ 'float': settings.hPos });
                
                var resizeButtonFn = function(){};
                if (settings.vPos == 'bottom') {
                    resizeButtonFn = function () {
                        $this.css ({
                            position: 'relative',
                            top: $container.height() - $this.height() - parseFloat ($this.css('marginBottom'))
                        });
                    };
                }
                else if (settings.vPos == 'middle') {
                    resizeButtonFn = function () {
                        $this.css ({
                            position: 'relative',
                            top: ($container.outerHeight() / 2) - (($this.outerHeight() + parseFloat ($this.css('marginTop'))) / 2) - ($this.outerHeight() / 2)
                        });
                    };
                }
                else if (settings.vPos == 'fill') {
                    resizeButtonFn = function () {
                        var margin = ($this.outerHeight() - $this.height());
                        $this.css ({
                            'position': 'absolute',
                            'top': margin/2,
                            'bottom': margin/2,
                            'left': margin/2,
                            'right': margin/2,
                            'margin': 'none',
                            'float': 'none'
                        });
                    };
                }
                resizeButtonFn();
                
                $(window).on ('resize', function () {
                    $overlay.css({
                        'height': $container.outerHeight(),
                        'width': $container.outerWidth()
                    });
                    resizeButtonFn();
                });
                
                window.setTimeout("$(window).resize();",300);
                $(document).on('ready', function () {$(window).resize();});
                
                $container
                    .css({position:'relative'})
                    .hover (
                        function () {
                            $overlay.animate({
                                'opacity': 1
                            }, 'fast');
                        },
                        function() {
                            $overlay.animate({
                                'opacity': 0
                            }, 'fast');
                        }
                    )
                ;
            });
        }
    });
})(jQuery);