(function ($) {
  $.ui.resizable.prototype._mouseStart = function(event) {
  
      var o = this.options, iniPos = this.element.position(), el = this.element;
      o.resizing = true;
      o.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };
  
      // bugfix #1749
      if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
        el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
      }
  
      //Opera fixing relative position
      if ($.browser.opera && (/relative/).test(el.css('position')))
        el.css({ position: 'relative', top: 'auto', left: 'auto' });
  
      this._renderProxy();
  
      var curleft = num(this.helper.css('left'));
      var curtop = num(this.helper.css('top'));
  
      if (o.containment) {
        curleft += $(o.containment).scrollLeft()||0;
        curtop += $(o.containment).scrollTop()||0;
      }
  
      //Store needed variables
      this.offset = this.helper.offset();
      this.position = { left: curleft, top: curtop };
      this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
      this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
      this.originalPosition = { left: curleft, top: curtop };
      this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
      this.originalMousePosition = { left: event.pageX, top: event.pageY };
  
      //Aspect Ratio
      o.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height)||1);
  
      if (o.preserveCursor) {
          var cursor = $('.ui-resizable-' + this.axis).css('cursor');
          $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);
      }
  
      this._propagate("start", event);
      return true;
  }
  
var num = function(v) {
  return parseInt(v, 10) || 0;
};
})(jQuery);
