scroller._visible = scrollB._visible = false;
var mouseListener:Object = new Object();
Mouse.addListener(mouseListener);
// initial position of the clip to scroll
var yDistance:Number = toScroll._y;
// extra scroll when you use the mouse wheel
var extra:Number = 30;
// amount of text to scroll (text height - mask_mc height)
scrollAmount = scrollB._height - scroller._height;

function updateScrollAmount():Void {
	scrollAmount = scrollB._height - scroller._height;
	if (this.toScroll._height > this.mask_mc._height && this.showScrollBar) {
		scroller._visible = scrollB._visible = true;
		//this.onEnterFrame = scrollerControlled;
	}
	else {
		this.playlist.resetListItemsWidth();
		//this.onEnterFrame = scrollPlaylistItems;
	}
}
function scrollPlaylistItems() {
	if (mask_mc.hitTest(_root._xmouse, _root._ymouse, false)) {
		playlist._y = Math.round((mask_mc._y - mask_mc._ymouse) * ((playlist._height - mask_mc._height) / mask_mc._height));
	}
};

// initial postion of the scroller
currenty = scroller._y;

scrollB.useHandCursor = false;
scrollB.onPress = function() {
	
};

// scroll bar on press
scroller.onPress = function() {
	if (toScroll._height>mask_mc._height) {
		startDrag(this, false, this._x, currenty, this._x, currenty+scrollAmount);
	}
};
// on roll over effect
scroller.onRollOver = function() {
	
};
// on roll out - release outside effect
scroller.onRelease = scroller.onReleaseOutside = scroller.onRollOut=function () {
	stopDrag();
};
// scroll code
this.onEnterFrame = scrollerControlled;
function scrollerControlled() {
	var toScrollY:Number = toScroll._y;
	var por = (toScroll._height-mask_mc._height)/scrollAmount;
	var posi = -((scroller._y-currenty)*por)-toScrollY+yDistance;
	toScroll._y = Math.round(toScrollY+(posi/4));
};
//
// Scroll wheel
//
// on mose wheel movement
mouseListener.onMouseWheel = function(delta) {
	if(mask_mc.hitTest(_root._xmouse,_root._ymouse)){
		// if there is text to scroll
		if (toScroll._height>mask_mc._height) {
			// if there hasnt reached the top
			if (scroller._y<currenty+scrollAmount) {
				// if mouse going up
				if (delta<0) {
					// calculate if the scroller doesnt goes pass the bounderies
					final = scroller._y-delta+extra;
					if (final<currenty+scrollAmount) {
						// move the scroller
						scroller._y -= delta-extra;
					} else {
						// get the scroller into the top up position
						scroller._y = currenty+scrollAmount;
					}
				}
			}
			// the text hasnt reach the bottom   
			if (scroller._y>currenty) {
				// if mouse going down
				if (delta>0) {
					// calculate if the scroller doesnt goes pass the bounderies
					final = scroller._y-delta-extra;
					if (final>currenty) {
						// move the scroller
						scroller._y -= delta+extra;
					} else {
						// get the scroller into the top down position
						scroller._y = currenty;
					}
				}
			}
		}
	}
};
