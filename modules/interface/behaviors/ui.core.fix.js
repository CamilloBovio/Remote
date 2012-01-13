// JavaScript Document
$.ui.mouse._mouseMove = function(event) {
    // IE mouseup check - mouseup happened when mouse was out of window
    if ($.browser.msie && $.browser.version < 8 && !event.button) {
      return this._mouseUp(event);
    }

    if (this._mouseStarted) {
      this._mouseDrag(event);
      return event.preventDefault();
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted =
        (this._mouseStart(this._mouseDownEvent, event) !== false);
      (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
    }

    return !this._mouseStarted;
  }

$.ui.mouse._mouseDown = function (event) {
  if ($.browser.msie) {
    event.stopPropagation();
  };

  // don't let more than one widget handle mouseStart
  // TODO: figure out why we have to use originalEvent
  event.originalEvent = event.originalEvent || {};
  if (event.originalEvent.mouseHandled) { return; }
  
	// we may have missed mouseup (out of window)
	(this._mouseStarted && this._mouseUp(event));

	this._mouseDownEvent = event;

	var self = this,
		btnIsLeft = (event.which == 1),
		elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
	if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
		return true;
	}

	this.mouseDelayMet = !this.options.delay;
	if (!this.mouseDelayMet) {
		this._mouseDelayTimer = setTimeout(function() {
			self.mouseDelayMet = true;
		}, this.options.delay);
	}

	if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
		this._mouseStarted = (this._mouseStart(event) !== false);
		if (!this._mouseStarted) {
			event.preventDefault();
			return true;
		}
	}

	// these delegates are required to keep context
	this._mouseMoveDelegate = function(event) {
		return self._mouseMove(event);
	};
	this._mouseUpDelegate = function(event) {
		return self._mouseUp(event);
	};
	$(document)
		.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
		.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

	// preventDefault() is used to prevent the selection of text here -
	// however, in Safari, this causes select boxes not to be selectable
	// anymore, so this fix is needed
  ($.browser.safari || event.preventDefault());

  event.originalEvent.mouseHandled = true;
	return true;
}