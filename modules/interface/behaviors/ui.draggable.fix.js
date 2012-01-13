$.ui.draggable.prototype._getParentOffset = function () {
  //Get the offsetParent and cache its position
  this.offsetParent = this.helper.offsetParent();
  var po = this.offsetParent.offset();

  // This is a special case where we need to modify a offset calculated on start, since the following happened:
  // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
  // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
  //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
  if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
    po.left += this.scrollParent.scrollLeft();
    po.top += this.scrollParent.scrollTop();
  }

  if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
  || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
    po = { top: 0, left: 0 };

  return {
    top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
    left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
  };
}

$.ui.draggable.prototype._setContainment = function () {
  var o = this.options;
  if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
  if(o.containment == 'document' || o.containment == 'window') this.containment = [
    0 - this.offset.relative.left - this.offset.parent.left,
    0 - this.offset.relative.top - this.offset.parent.top,
    $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
    ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
  ];

  if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
    var ce = $(o.containment)[0]; if(!ce) return;
    var co = $(o.containment).offset();
    var over = ($(ce).css("overflow") != 'hidden');

    this.containment = [
      co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
      co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
      co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
      co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
    ];
  } else if(o.containment.constructor == Array) {
    this.containment = o.containment;
  }
}

$.ui.draggable.prototype._convertPositionTo = function(d, pos) {
  if(!pos) pos = this.position;
  var mod = d == "absolute" ? 1 : -1;
  var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

  return {
    top: (
      pos.top                                 // The absolute mouse position
      + this.offset.relative.top * mod                    // Only for relative positioned nodes: Relative offset from element to offset parent
      + this.offset.parent.top * mod                      // The offsetParent's offset without borders (offset + border)
      - ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
    ),
    left: (
      pos.left                                // The absolute mouse position
      + this.offset.relative.left * mod                   // Only for relative positioned nodes: Relative offset from element to offset parent
      + this.offset.parent.left * mod                     // The offsetParent's offset without borders (offset + border)
      - ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)


    )
  };
}

$.ui.draggable.prototype._generatePosition = function(event) {
  var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

  // This is another very weird special case that only happens for relative elements:
  // 1. If the css position is relative
  // 2. and the scroll parent is the document or similar to the offset parent
  // we have to refresh the relative offset during the scroll so there are no jumps
  if(this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
    this.offset.relative = this._getRelativeOffset();
  }

  var pageX = event.pageX;
  var pageY = event.pageY;

  /*
   * - Position constraining -
   * Constrain the position to a mix of grid, containment.
   */

  if(this.originalPosition) { //If we are not dragging yet, we won't check for options

    if(this.containment) {
      if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
      if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
      if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
      if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
    }

    if(o.grid) {
      var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
      pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

      var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
      pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
    }

  }

  return {
    top: (
      pageY                               // The absolute mouse position
      - this.offset.click.top                         // Click offset (relative to the element)
      - this.offset.relative.top                        // Only for relative positioned nodes: Relative offset from element to offset parent
      - this.offset.parent.top                        // The offsetParent's offset without borders (offset + border)
      + ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
    ),
    left: (
      pageX                               // The absolute mouse position
      - this.offset.click.left                        // Click offset (relative to the element)
      - this.offset.relative.left                       // Only for relative positioned nodes: Relative offset from element to offset parent
      - this.offset.parent.left                       // The offsetParent's offset without borders (offset + border)
      + ($.browser.safari && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
    )
  };
}