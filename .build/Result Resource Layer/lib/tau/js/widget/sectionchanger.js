/*
  * Copyright (c) 2013 Samsung Electronics Co., Ltd
  *
  * Licensed under the Flora License, Version 1.1 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *     http://floralicense.org/license/
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */

;(function(window, undefined) {
	var ns = tau;

( function ( ns, window, undefined ) {


if ( ns.Scroller ) {
	return;
}

// scroller.start event trigger when user try to move scroller
var eventType = {
	// scroller.move event trigger when scroller start
	START: "scrollstart",
	// scroller.move event trigger when scroller move
	//MOVE: "scroller.move",
	// scroller.move event trigger when scroller end
	END: "scrollend",
	// scroller.move event trigger when scroller canceled
	CANCEL: "scrollcancel",
},

Scroller = function ( elem, options ) {
	if ( arguments.length ) {
		this._create( elem, options );
	}
	return this;
};

Scroller.Orientation = {
	VERTICAL: 1,
	HORIZONTAL: 2
};

Scroller.prototype = {
	_create: function( elem, options ) {
		this.element = elem;
		this.options = {};

		if ( this.element.children.length !== 1 ) {
			throw "scroller has only one child.";
		}

		this.scroller = this.element.children[0];
		this.scrollerStyle = this.scroller.style;

		this.bouncingEffect = null;
		this.scrollbar = null;

		this.width = 0;
		this.height = 0;

		this.scrollerWidth = 0;
		this.scrollerHeight = 0;
		this.scrollerOffsetX = 0;
		this.scrollerOffsetY = 0;

		this.maxScrollX = 0;
		this.maxScrollY = 0;

		this.startTouchPointX = 0;
		this.startTouchPointY = 0;
		this.startScrollerOffsetX = 0;
		this.startScrollerOffsetY = 0;

		this.lastVelocity = 0;
		this.lastEstimatedPoint = 0;

		this.lastTouchPointX = -1;
		this.lastTouchPointY = -1;

		this.orientation;

		this.initiated = false;
		this.enabled = true;
		this.scrolled = false;
		this.moved = false;
		this.scrollCanceled = false;

		this.startTime;

		this._initOptions( options );
		this._bindEvents();
		this._init();
	},

	_initOptions: function( options ) {
		this.options = {
			scrollDelay: 300,
			threshold: 10,
			minThreshold: 5,
			flickThreshold: 30,
			scrollbar: false,
			useBouncingEffect: false,
			orientation: "vertical",		// vertical or horizontal,
			// TODO implement scroll momentum.
			momentum: true
		};

		this.setOptions( options );
	},

	_init: function() {
		this.width = this.element.offsetWidth;
		this.height = this.element.offsetHeight;

		this.scrollerWidth = this.scroller.offsetWidth;
		this.scrollerHeight = this.scroller.offsetHeight;

		this.maxScrollX = this.width - this.scrollerWidth;
		this.maxScrollY = this.height - this.scrollerHeight;

		this.orientation = this.options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL;

		this.initiated = false;
		this.scrolled = false;
		this.moved = false;
		this.touching = true;
		this.scrollCanceled = false;

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.height;
		} else {
			this.maxScrollX = 0;
			this.scrollerWidth = this.width;
		}

		this._initLayout();
		this._initScrollbar();
		this._initBouncingEffect();
	},

	_initLayout: function() {
		var elementStyle = this.element.style,
			scrollerStyle = this.scroller.style;

		elementStyle.overflow = "hidden";
		elementStyle.position = "relative";

		scrollerStyle.position = "absolute";
		scrollerStyle.top = "0px";
		scrollerStyle.left = "0px";
		scrollerStyle.width = this.scrollerWidth + "px";
		scrollerStyle.height = this.scrollerHeight + "px";
	},

	_initScrollbar: function() {
		var scrollbarType = this.options.scrollbar;

		if ( scrollbarType ) {
			this.scrollbar = new Scroller.Scrollbar(this.element, {
				type: scrollbarType,
				orientation: this.orientation
			});
		}
	},

	_initBouncingEffect: function() {
		var o = this.options;
		if ( o.useBouncingEffect ) {
			this.bouncingEffect = new Scroller.Effect.Bouncing(this.element, {
				maxScrollX: this.maxScrollX,
				maxScrollY: this.maxScrollY,
				orientation: this.orientation
			});
		}
	},

	_resetLayout: function() {
		var elementStyle = this.element.style;

		elementStyle.overflow = "";
		elementStyle.position = "";
	},

	_bindEvents: function( ) {
		if ("ontouchstart" in window) {
			this.scroller.addEventListener( "touchstart", this);
			this.scroller.addEventListener( "touchmove", this);
			this.scroller.addEventListener( "touchend", this);
			this.scroller.addEventListener( "touchcancel", this);
		} else {
			this.scroller.addEventListener( "mousedown", this);
			document.addEventListener( "mousemove", this);
			document.addEventListener( "mouseup", this);
			document.addEventListener( "mousecancel", this);
		}

		window.addEventListener( "resize", this);
	},

	_unbindEvents: function() {
		if ("ontouchstart" in window) {
			this.scroller.removeEventListener( "touchstart", this);
			this.scroller.removeEventListener( "touchmove", this);
			this.scroller.removeEventListener( "touchend", this);
			this.scroller.removeEventListener( "touchcancel", this);
		} else {
			this.scroller.removeEventListener( "mousedown", this);
			document.removeEventListener( "mousemove", this);
			document.removeEventListener( "mouseup", this);
			document.removeEventListener( "mousecancel", this);
		}

		window.removeEventListener( "resize", this);
	},

	/* jshint -W086 */
	handleEvent: function( event ) {
		var pos = this._getPointPositionFromEvent( event );

		switch (event.type) {
		case "mousedown":
			event.preventDefault();
		case "touchstart":
			this._start( event, pos );
			break;
		case "mousemove":
			event.preventDefault();
		case "touchmove":
			this._move( event, pos );
			break;
		case "mouseup":
		case "touchend":
			this._end( event, pos );
			break;
		case "mousecancel":
		case "touchcancel":
			this.cancel( event );
			break;
		case "resize":
			this.refresh();
			break;
		}
	},

	setOptions: function (options) {
		var name;
		for ( name in options ) {
			if ( options.hasOwnProperty(name) && !!options[name] ) {
				this.options[name] = options[name];
			}
		}
	},

	refresh: function () {
		this._clear();
		this._init();
	},

	scrollTo: function( x, y, duration ) {
		this._translate( x, y, duration );
		this._translateScrollbar( x, y, duration );
	},

	_translate: function( x, y, duration ) {
		var translate,
			transition,
			scrollerStyle = this.scrollerStyle;

		if ( !duration ) {
			transition = "none";
		} else {
			transition = "-webkit-transform " + duration / 1000 + "s ease-out";
		}
		translate = "translate3d(" + x + "px," + y + "px, 0)";

		this.scrollerOffsetX = window.parseInt(x, 10);
		this.scrollerOffsetY = window.parseInt(y, 10);

		scrollerStyle["-webkit-transform"] = translate;
		scrollerStyle["-webkit-transition"] = transition;
	},

	_translateScrollbar: function( x, y, duration ) {
		if ( !this.scrollbar ) {
			return;
		}

		this.scrollbar.translate( this.orientation === Scroller.Orientation.HORIZONTAL ? -x : -y, duration );
	},

	_getEstimatedCurrentPoint: function( current, last ) {
		var velocity,
			timeDifference = 15, /* pause time threshold.. tune the number to up if it is slow */
			estimated;

		if (last === current) {
			this.lastVelocity = 0;
			this.lastEstimatedPoint = current;
			return current;
		}

		velocity = ( current - last ) / 22; /*46.8 s_moveEventPerSecond*/
		estimated = current + ( timeDifference * velocity );

		// Prevent that point goes back even though direction of velocity is not changed.
		if ( (this.lastVelocity  * velocity >= 0) &&
				(!velocity || (velocity < 0 && estimated > this.lastEstimatedPoint) ||
					(velocity > 0 && estimated < this.lastEstimatedPoint)) ) {
			estimated = this.lastEstimatedPoint;
		}

		this.lastVelocity = velocity;
		this.lastEstimatedPoint = estimated;

		return estimated;
	},

	_getPointPositionFromEvent: function ( ev ) {
		return ev.type.search(/^touch/) !== -1 && ev.touches && ev.touches.length ?
				{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
				{x: ev.clientX, y: ev.clientY};
	},

	_start: function( e, pos ) {
		if ( this.initiated || !this.enabled ) {
			return;
		}

		this.startTime = (new Date()).getTime();

		this.startTouchPointX = pos.x;
		this.startTouchPointY = pos.y;
		this.startScrollerOffsetX = this.scrollerOffsetX;
		this.startScrollerOffsetY = this.scrollerOffsetY;
		this.lastTouchPointX = pos.x;
		this.lastTouchPointY = pos.y;

		this.initiated = true;
		this.scrollCanceled = false;
		this.scrolled = false;
		this.moved = false;
		this.touching = true;
	},

	_move: function( e, pos ) {
		var timestamp = (new Date()).getTime(),
			scrollDelay = this.options.scrollDelay || 0,
			threshold = this.options.threshold || 0,
			minThreshold = this.options.minThreshold || 0,
			distX = this.startTouchPointX - pos.x,
			distY = this.startTouchPointY - pos.y,
			absDistX = Math.abs( distX ),
			absDistY = Math.abs( distY ),
			maxDist = Math.max( absDistX, absDistY ),
			newX, newY;

		if ( !this.initiated || !this.touching || this.scrollCanceled ) {
			return;
		}

		this.lastTouchPointX = pos.x;
		this.lastTouchPointY = pos.y;

		// We need to move at least 10 pixels, delay 300ms for the scrolling to initiate
		if ( !this.scrolled &&
				( maxDist < minThreshold ||
						( maxDist < threshold && ( !scrollDelay || timestamp - this.startTime < scrollDelay ) ) ) ) {
			/* TODO if touchmove event is preventDefaulted, click event not performed.
			 * but to keep touch mode on android have to prevent default.
			 * some idea are using ua or to change webkit threshold.*/
			//e.preventDefault();
			return;
		}

		if ( !this.scrolled ) {
			switch ( this.orientation ) {
			case Scroller.Orientation.HORIZONTAL:
				if ( absDistX < absDistY ) {
					this.cancel();
					return;
				}
				break;
			case Scroller.Orientation.VERTICAL:
				if ( absDistY < absDistX ) {
					this.cancel();
					return;
				}
				break;
			}

			this._fireEvent( eventType.START );

			this.startTouchPointX = pos.x;
			this.startTouchPointY = pos.y;
		}

		this.scrolled = true;

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			newX = this.startScrollerOffsetX + this._getEstimatedCurrentPoint( pos.x, this.lastTouchPointX ) - this.startTouchPointX;
			newY = this.startScrollerOffsetY;
		} else {
			newX = this.startScrollerOffsetX;
			newY = this.startScrollerOffsetY + this._getEstimatedCurrentPoint( pos.y, this.lastTouchPointY ) - this.startTouchPointY;
		}

		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = newY > 0 ? 0 : this.maxScrollY;
		}

		if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
			this.moved = true;
			this._translate( newX, newY );
			this._translateScrollbar( newX, newY );
			// TODO to dispatch move event is too expansive. it is better to use callback.
			//this._fireEvent( eventType.MOVE );

			if ( this.bouncingEffect ) {
				this.bouncingEffect.hide();
			}
		} else {
			if ( this.bouncingEffect ) {
				this.bouncingEffect.drag( newX, newY );
			}
		}

		e.preventDefault(); //this function make overflow scroll don't used
	},

	_end: function( e ) {
		var lastX = Math.round(this.lastTouchPointX),
			lastY = Math.round(this.lastTouchPointY),
			distanceX = Math.abs(lastX - this.startTouchPointX),
			distanceY = Math.abs(lastY - this.startTouchPointY),
			distance = this.orientation === Scroller.Orientation.HORIZONTAL ? distanceX : distanceY,
			maxDistance = this.orientation === Scroller.Orientation.HORIZONTAL ? this.maxScrollX : this.maxScrollY,
			endOffset = this.orientation === Scroller.Orientation.HORIZONTAL ? this.scrollerOffsetX : this.scrollerOffsetY,
			requestScrollEnd = this.initiated && this.scrolled,
			endTime, duration;

		this.touching = false;

		if ( !requestScrollEnd || this.scrollCanceled ) {
			this.initiated = false;
			return;
		}

		// bouncing effect
		if ( this.bouncingEffect ) {
			this.bouncingEffect.dragEnd();
		}

		if ( !this.moved ) {
			this._endScroll();
			return;
		}

		endTime = (new Date()).getTime();
		duration = endTime - this.startTime;

		// start momentum animation if needed
		if ( this.options.momentum &&
				duration < 300 &&
				( endOffset < 0 && endOffset > maxDistance ) &&
				( distance > this.options.flickThreshold )) {
			this._startMomentumScroll();
		} else {
			this._endScroll();
		}

		e.preventDefault();
	},

	_endScroll: function() {
		if ( this.scrolled ) {
			this._fireEvent( eventType.END );
		}

		this.moved = false;
		this.scrolled = false;
		this.scrollCanceled = false;
		this.initiated = false;
	},

	cancel: function() {
		this.scrollCanceled = true;

		if ( this.initiated ) {
			this._translate( this.startScrollerOffsetX, this.startScrollerOffsetY );
			this._translateScrollbar( this.startScrollerOffsetX, this.startScrollerOffsetY );
			this._fireEvent( eventType.CANCEL );
		}

		this.initiated = false;
		this.scrolled = false;
		this.moved = false;
		this.touching = false;
	},

	// TODO implement _startMomentumScroll method
	_startMomentumScroll: function() {
		this._endMomentumScroll();
	},

	_endMomentumScroll: function() {
		this._endScroll();
	},

	_fireEvent: function(eventName, detail) {
		var evt = new CustomEvent(eventName, {
				"bubbles": true,
				"cancelable": true,
				"detail": detail
			});
		this.element.dispatchEvent(evt);
	},

	_clear: function() {
		this.initiated = false;
		this.scrolled = false;
		this.moved = false;
		this.scrollCanceled = false;
		this.touching = false;

		this._resetLayout();
		this._clearScrollbar();
		this._clearBouncingEffect();
	},

	_clearScrollbar: function() {
		if ( this.scrollbar ) {
			this.scrollbar.destroy();
		}
		this.scrollbar = null;
	},

	_clearBouncingEffect: function() {
		if ( this.bouncingEffect ) {
			this.bouncingEffect.destroy();
		}
		this.bouncingEffect = null;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	destroy: function() {
		this._clear();
		this._unbindEvents();
		this.scrollerStyle = null;
		this.scroller = null;
	}
};

//Export scroller to the namespace
ns.Scroller = Scroller;

} ( ns, window ) );


( function( ns, window, undefined ) {


var Scroller = ns.Scroller;

if ( Scroller.Scrollbar ) {
	return;
}

Scroller.Scrollbar = function( scrollElement, options ) {

	this.element = null;
	this.barElement = null;

	this.container = null;
	this.clip = null;

	this.options = {};
	this.type = null;

	this.maxScroll;
	this.started = false;
	this.displayDelayTimeoutId = null;

	this._create( scrollElement, options );
};

Scroller.Scrollbar.prototype = {
	_create: function( scrollElement, options ) {
		this.container = scrollElement;
		this.clip = scrollElement.children[0];

		this._initOptions(options);
		this._init();
	},

	_initOptions: function( options ) {
		options = ns.extendObject({
			type: false,
			displayDelay: 700,
			sections: null,
			orientation: Scroller.Orientation.VERTICAL
		}, options);

		this.setOptions( options );
	},

	_init: function() {
		var type = this.options.type;

		if ( !type ) {
			return;
		}

		this.type = Scroller.Scrollbar.Type[type];
		if ( !this.type ) {
			throw "Bad options. [type : " + this.options.type + "]";
		}

		this._createScrollbar();
	},

	_createScrollbar: function() {
		var sections = this.options.sections,
			orientation = this.options.orientation,
			wrapper = document.createElement("DIV"),
			bar = document.createElement("span");

		wrapper.appendChild(bar);

		this.type.insertAndDecorate({
			orientation: orientation,
			wrapper: wrapper,
			bar: bar,
			container: this.container,
			clip: this.clip,
			sections: sections
		});

		this.element = wrapper;
		this.barElement = bar;
	},

	_removeScrollbar: function() {
		if ( this.element ) {
			this.element.parentNode.removeChild(this.element);
		}

		this.element = null;
		this.barElement = null;
	},

	setOptions: function (options) {
		ns.extendObject(this.options, options);
	},

	refresh: function () {
		this.clear();
		this.init();
	},

	translate: function( offset, duration ) {
		var orientation = this.options.orientation,
			translate, transition, barStyle, endDelay;

		if ( !this.element || !this.type ) {
			return;
		}

		offset = this.type.offset( orientation, offset );

		barStyle = this.barElement.style;
		if ( !duration ) {
			transition = "none";
		} else {
			transition = "-webkit-transform " + duration / 1000 + "s ease-out";
		}

		translate = "translate3d(" + offset.x + "px," + offset.y + "px, 0)";

		barStyle["-webkit-transform"] = translate;
		barStyle["-webkit-transition"] = transition;

		if ( !this.started ) {
			this._start();
		}

		endDelay = ( duration || 0 ) + this.options.displayDelay;
		if ( this.displayDelayTimeoutId !== null ) {
			window.clearTimeout( this.displayDelayTimeoutId );
		}
		this.displayDelayTimeoutId = window.setTimeout(this._end.bind(this), endDelay);
	},

	_start: function() {
		this.type.start(this.element, this.barElement);
		this.started = true;
	},

	_end : function() {
		this.started = false;
		this.displayDelayTimeoutId = null;

		if ( this.type ) {
			this.type.end(this.element, this.barElement);
		}
	},

	_clear: function() {
		this._removeScrollbar();

		this.started = false;
		this.type = null;
		this.element = null;
		this.barElement = null;
		this.displayDelayTimeoutId = null;
	},

	destroy: function() {
		this._clear();

		this.options = null;
		this.container = null;
		this.clip = null;
	}
};

Scroller.Scrollbar.Type = {};

//interface Scroller.Indicator.Type 
Scroller.Scrollbar.Type.Interface = {
	insertAndDecorate: function(/* options */) {},
	start: function(/* scrollbarElement, barElement */) {},
	end: function(/* scrollbarElement, barElement */) {},
	offset: function(/* orientation, offset  */) {}
};

Scroller.Scrollbar.Type.bar = ns.extendObject( {}, Scroller.Scrollbar.Type.Interface, {
	options: {
		wrapperClass: "ui-scrollbar-bar-type",
		barClass: "ui-scrollbar-indicator",
		orientationClass: "ui-scrollbar-",
		margin: 2,
		animationDuration: 500
	},

	insertAndDecorate: function( data ) {
		var scrollbarElement = data.wrapper,
			barElement = data.bar,
			container = data.container,
			clip = data.clip,
			orientation = data.orientation,
			margin = this.options.margin,
			clipSize = orientation === Scroller.Orientation.VERTICAL ? clip.offsetHeight : clip.offsetWidth,
			containerSize = orientation === Scroller.Orientation.VERTICAL ? container.offsetHeight : container.offsetWidth,
			orientationClass = this.options.orientationClass + (orientation === Scroller.Orientation.VERTICAL ? "vertical" : "horizontal"),
			barStyle = barElement.style;

		this.containerSize = containerSize;
		this.maxScrollOffset = clipSize - containerSize;
		this.scrollZoomRate = containerSize / clipSize;
		this.barSize = window.parseInt( containerSize / (clipSize/containerSize)  ) - ( margin * 2 );

		scrollbarElement.className = this.options.wrapperClass + " " + orientationClass;
		barElement.className = this.options.barClass;

		if ( orientation === Scroller.Orientation.VERTICAL ) {
			barStyle.height =  this.barSize + "px";
			barStyle.top = "0px";
		} else {
			barStyle.width =  this.barSize + "px";
			barStyle.left = "0px";
		}

		container.appendChild(scrollbarElement);
	},

	offset: function( orientation, offset ) {
		var x, y, offset;

		offset = offset !== this.maxScrollOffset ?
				offset * this.scrollZoomRate :
				this.containerSize - this.barSize - this.options.margin * 2;

		if ( orientation === Scroller.Orientation.VERTICAL ) {
			x = 0;
			y = offset;
		} else {
			x = offset;
			y = 0;
		}

		return {
			x: x,
			y: y
		};
	},

	start: function( scrollbarElement/*, barElement */) {
		var style = scrollbarElement.style,
		duration = this.options.animationDuration;
		style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
		style.opacity = 1;
	},

	end: function( scrollbarElement/*, barElement */) {
		var style = scrollbarElement.style,
		duration = this.options.animationDuration;
		style["-webkit-transition"] = "opacity " + duration / 1000 + "s ease";
		style.opacity = 0;
	}
});

Scroller.Scrollbar.Type.tab = ns.extendObject( {}, Scroller.Scrollbar.Type.Interface, {
	options: {
		wrapperClass: "ui-scrollbar-tab-type",
		barClass: "ui-scrollbar-indicator",
		margin: 1
	},

	insertAndDecorate: function( data ) {
		var scrollbarElement = data.wrapper,
			barElement = data.bar,
			container = data.container,
			clip = data.clip,
			sections = data.sections,
			orientation = data.orientation,
			margin = this.options.margin,
			clipWidth = clip.offsetWidth,
			clipHeight = clip.offsetHeight,
			containerWidth = container.offsetWidth,
			containerHeight = container.offsetHeight,
			clipSize = orientation === Scroller.Orientation.VERTICAL ? clipHeight : clipWidth,
			containerSize = orientation === Scroller.Orientation.VERTICAL ? containerHeight : containerWidth,
			sectionSize = clipSize / containerSize,
			height,  barHeight, i, len;

		this.containerSize = containerWidth;
		this.maxScrollOffset = clipSize - containerSize;
		this.scrollZoomRate = containerWidth / clipSize;
		this.barSize = window.parseInt( (containerWidth - margin * 2 * (sectionSize-1)) / sectionSize  );

		scrollbarElement.className = this.options.wrapperClass;
		barElement.className = this.options.barClass;

		barElement.style.width = this.barSize + "px";
		barElement.style.left = "0px";

		container.insertBefore(scrollbarElement, clip);

		// reset page container and section layout.
		barHeight = barElement.offsetHeight;
		height = clipHeight - barHeight;
		clip.style.height = height + "px";
		if ( sections && sections.length ) {
			for ( i=0, len=sections.length; i <len; i++ ) {
				sections[i].style.height = height + "px";
			}
		}
	},

	offset: function( orientation, offset ) {
		return {
			x: offset === 0 ? -1 :
				offset !== this.maxScrollOffset ? offset * this.scrollZoomRate :
					this.containerSize - this.barSize - this.options.margin,
			y: 0
		};
	}

});

} ( ns, window ) );



( function ( ns, window, undefined ) {


var Scroller = ns.Scroller;

if ( Scroller.Effect ) {
	return;
}

Scroller.Effect = {};
Scroller.Effect.Bouncing = function( scrollerElement, options ) {

	this.orientation;
	this.maxValue;

	this.container;
	this.minEffectElement;
	this.maxEffectElement;
	this.targetElement;

	this.isShow = false;
	this.isDrag = false;
	this.isShowAnimating = false;
	this.isHideAnimating = false;

	this._create( scrollerElement, options );
};

Scroller.Effect.Bouncing.prototype = {
	options : {
		className: "ui-scrollbar-bouncing-effect",
		duration: 500
	},

	_create: function(scrollerElement, options) {
		this.container = scrollerElement;

		this.orientation = options.orientation;
		this.maxValue = this._getValue( options.maxScrollX, options.maxScrollY);

		this._initLayout();
	},

	_initLayout: function() {
		var minElement = this.minEffectElement = document.createElement("DIV"),
			maxElement = this.maxEffectElement = document.createElement("DIV"),
			className = this.options.className;

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			minElement.className = className + " ui-left";
			maxElement.className = className + " ui-right";
		} else {
			minElement.className = className + " ui-top";
			maxElement.className = className + " ui-bottom";
		}

		this.container.appendChild( minElement );
		this.container.appendChild( maxElement );

		minElement.addEventListener("webkitAnimationEnd", this);
		maxElement.addEventListener("webkitAnimationEnd", this);
	},

	drag: function( x, y ) {
		this.isDrag = true;
		this._checkAndShow( x, y );
	},

	dragEnd: function() {
		if ( this.isShow && !this.isShowAnimating && !this.isHideAnimating ) {
			this._beginHide();
		}

		this.isDrag = false;
	},

	end: function(x, y) {
		this._checkAndShow( x, y );
	},

	show: function() {
		if ( this.targetElement ) {
			this.isShow = true;
			this._beginShow();
		}
	},

	hide: function() {
		if ( this.isShow ) {
			this.minEffectElement.style.display = "none";
			this.maxEffectElement.style.display = "none";
			this.targetElement.classList.remove("ui-hide");
			this.targetElement.classList.remove("ui-show");
		}
		this.isShow = false;
		this.isShowAnimating = false;
		this.isHideAnimating = false;
		this.targetElement = null;
	},

	_checkAndShow: function( x, y ) {
		var val = this._getValue(x, y);
		if ( !this.isShow ) {
			if ( val >= 0 ) {
				this.targetElement = this.minEffectElement;
				this._beginShow();
			} else if ( val <= this.maxValue ) {
				this.targetElement = this.maxEffectElement;
				this._beginShow();
			}

		} else if ( this.isShow && !this.isDrag && !this.isShowAnimating && !this.isHideAnimating ) {
			this._beginHide();
		}
	},

	_getValue: function(x, y) {
		return this.orientation === Scroller.Orientation.HORIZONTAL ? x : y;
	},

	_beginShow: function() {
		if ( !this.targetElement || this.isShowAnimating ) {
			return;
		}

		this.targetElement.style.display = "block";

		this.targetElement.classList.remove("ui-hide");
		this.targetElement.classList.add("ui-show");

		this.isShow = true;
		this.isShowAnimating = true;
		this.isHideAnimating = false;
	},

	_finishShow: function() {
		this.isShowAnimating = false;
		if ( !this.isDrag ) {
			this.targetElement.classList.remove("ui-show");
			this._beginHide();
		}
	},

	_beginHide: function() {
		if ( this.isHideAnimating ) {
			return;
		}

		this.targetElement.classList.remove("ui-show");
		this.targetElement.classList.add("ui-hide");

		this.isHideAnimating = true;
		this.isShowAnimating = false;
	},

	_finishHide: function() {
		this.isHideAnimating = false;
		this.targetElement.classList.remove("ui-hide");
		this.hide();
		this._checkAndShow();
	},

	handleEvent: function( event ) {
		switch (event.type) {
		case "webkitAnimationEnd":
			if ( this.isShowAnimating ) {
				this._finishShow();
			} else if ( this.isHideAnimating ) {
				this._finishHide();
			}
			break;
		}
	},

	destroy: function() {
		this.minEffectElement.removeEventListener("webkitAnimationEnd", this);
		this.maxEffectElement.removeEventListener("webkitAnimationEnd", this);

		this.container.removeChild( this.minEffectElement );
		this.container.removeChild( this.maxEffectElement );

		this.container = null;
		this.minEffectElement = null;
		this.maxEffectElement = null;
		this.targetElement = null;

		this.isShow = null;
		this.orientation = null;
		this.maxValue = null;
	}
};

} ( ns, window ) );



( function ( ns, window, undefined ) {


if ( ns.SectionChanger ) {
	return;
}

var Scroller = ns.Scroller,

eventType = {
	CHANGE: "sectionchange"
};

function SectionChanger( elem, options ) {
	this._create( elem, options );
	return this;
}

ns.inherit(SectionChanger, Scroller, {
	_create: function( elem, options ) {

		this.sections = null;
		this.sectionPositions = [];
		this.activeIndex = 0;

		this._super( elem, options );
	},

	_initOptions : function( options ) {
		options = options || {};
		options.items = options.items || "section";
		options.activeClass = options.activeClass || "section-active";
		options.circular = options.circular || false;
		options.animate = options.animate || true;
		options.animateDuration = options.animateDuration || 100;
		options.orientation = options.orientation || "horizontal";
		options.changeThreshold = options.changeThreshold || -1;

		this._super( options );
	},

	_init: function() {
		var sectionLength, i, className;

		this.sections = typeof this.options.items === "string" ?
			this.scroller.querySelectorAll( this.options.items ) :
			this.options.items;

		sectionLength = this.sections.length;

		if (  this.options.circular && sectionLength < 3 ) {
			throw "if you use circular option, you must have at least three sections.";
		}

		if ( this.activeIndex >= sectionLength ) {
			this.activeIndex = sectionLength - 1;
		}

		for( i = 0; i < sectionLength; i++ ) {
			className = this.sections[i].className;
			if ( className && className.indexOf( this.options.activeClass ) > -1 ) {
				this.activeIndex = i;
			}

			this.sectionPositions[i] = i;
		}

		this.setActiveSection( this.activeIndex );
		this._prepareLayout();
		this._super();
		this._repositionSections( true );

		// set corret options values.
		if ( !this.options.animate ) {
			this.options.animateDuration = 0;
		}
		if ( this.options.changeThreshold < 0 ) {
			this.options.changeThreshold = this.width / 3;
		}

		if ( sectionLength > 1 ) {
			this.enable();
		} else {
			this.disable();
		}
	},

	_prepareLayout: function() {
		var sectionLength = this.sections.length,
			width = this.element.offsetWidth,
			height = this.element.offsetHeight,
			orientation = this.options.orientation === "horizontal" ? Scroller.Orientation.HORIZONTAL : Scroller.Orientation.VERTICAL,
			scrollerStyle = this.scroller.style;

		// circular option is false.
		if ( orientation === Scroller.Orientation.HORIZONTAL ) {
			scrollerStyle.width = width * sectionLength + "px"; //set Scroller width
			scrollerStyle.height = height + "px"; //set Scroller width
		} else {
			scrollerStyle.width = width + "px"; //set Scroller width
			scrollerStyle.height = height * sectionLength + "px"; //set Scroller width
		}
	},

	_initLayout: function() {
		var sectionStyle = this.sections.style,
			i, sectionLength, top, left;

		//section element has absolute position
		for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
			//Each section set initialize left position
			sectionStyle = this.sections[i].style;

			sectionStyle.position = "absolute";
			sectionStyle.width = this.width + "px";
			sectionStyle.height = this.height + "px";
			if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
				top = 0;
				left = this.width * i;
			} else {
				top = this.height * i;
				left = 0;
			}

			sectionStyle.top = top + "px";
			sectionStyle.left = left + "px";
		}

		this._super();
	},

	_initScrollbar: function() {
		var scrollbarType = this.options.scrollbar;

		if ( scrollbarType ) {
			this.scrollbar = new Scroller.Scrollbar(this.element, {
				type: scrollbarType,
				orientation: this.orientation,
				sections: this.sections
			});
		}
	},

	_initBouncingEffect: function() {
		var o = this.options;
		if ( o.useBouncingEffect && !o.circular ) {
			this.bouncingEffect = new Scroller.Effect.Bouncing(this.element, {
				maxScrollX: this.maxScrollX,
				maxScrollY: this.maxScrollY,
				orientation: this.orientation
			});
		}
	},

	_translateScrollbar: function( x, y, duration ) {
		var offset, preOffset, fixedOffset;

		if ( !this.scrollbar ) {
			return;
		}

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			preOffset = this.sectionPositions[this.activeIndex] * this.width;
			offset = this.activeIndex * this.width;
			fixedOffset = offset - preOffset;
			offset = -x + fixedOffset;
		} else {
			preOffset = this.sectionPositions[this.activeIndex] * this.height;
			offset = this.activeIndex * this.height;
			fixedOffset = offset - preOffset;
			offset = -y + fixedOffset;
		}

		this.scrollbar.translate( offset, duration );
	},

	_translateScrollbarWithPageIndex: function(pageIndex, duration) {
		var offset;

		if ( !this.scrollbar ) {
			return;
		}

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			offset = pageIndex * this.width;
		} else {
			offset = pageIndex * this.height;
		}

		this.scrollbar.translate( offset, duration );
	},

	_resetLayout: function() {
		var scrollerStyle = this.scroller.style,
			sectionStyle = this.sections.style,
			i, sectionLength;

		scrollerStyle.width = "";
		scrollerStyle.height = "";

		for( i = 0, sectionLength = this.sections.length; i < sectionLength; i++ ){
			sectionStyle = this.sections[i].style;

			sectionStyle.position = "";
			sectionStyle.width = "";
			sectionStyle.height = "";
			sectionStyle.top = "";
			sectionStyle.left = "";
		}

		this._super();
	},

	_bindEvents: function() {
		this._super();
		this.scroller.addEventListener( "webkitTransitionEnd", this);
	},

	_unbindEvents: function() {
		this._super();
		this.scroller.removeEventListener( "webkitTransitionEnd", this);
	},

	handleEvent: function( event ) {
		this._super( event );
		switch (event.type) {
		case "webkitTransitionEnd":
			this._endScroll();
			break;
		}
	},

	setActiveSection: function( index, duration ) {
		var activeClass = this.options.activeClass,
			scrollbarIndex, section, sectionLength, position, newX, newY, i;

		sectionLength = this.sections.length;
		position = this.sectionPositions[ index ];

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			newY = 0;
			newX = -this.width * position;
		} else {
			newY = -this.height * position;
			newX = 0;
		}

		// scrollbar index when circular option is true.
		if ( this.activeIndex - index > 1 ) {
			scrollbarIndex = this.activeIndex + 1;
		} else if ( this.activeIndex - index < -1 ) {
			scrollbarIndex = this.activeIndex - 1;
		} else {
			scrollbarIndex = index;
		}

		this.activeIndex = index;

		for ( i=0; i < sectionLength; i++) {
			section = this.sections[i];
			section.classList.remove(activeClass);
			if (i === this.activeIndex) {
				section.classList.add(activeClass);
			}
		}

		if ( newX !== this.scrollerOffsetX || newY !== this.scrollerOffsetY ) {
			this._translate( newX, newY, duration);
			this._translateScrollbarWithPageIndex( scrollbarIndex, duration);
		} else {
			this._endScroll();
		}
	},

	getActiveSectionIndex: function() {
		return this.activeIndex;
	},

	_end: function(/* e */) {
		var lastX = Math.round(this.lastTouchPointX),
			lastY = Math.round(this.lastTouchPointY),
			distX = this.lastTouchPointX - this.startTouchPointX,
			distY = this.lastTouchPointY - this.startTouchPointY,
			dist = this.orientation === Scroller.Orientation.HORIZONTAL ? distX : distY,
			distanceX = Math.abs(lastX - this.startTouchPointX),
			distanceY = Math.abs(lastY - this.startTouchPointY),
			distance = this.orientation === Scroller.Orientation.HORIZONTAL ? distanceX : distanceY,
			maxDistance = this.orientation === Scroller.Orientation.HORIZONTAL ? this.maxScrollX : this.maxScrollY,
			endOffset = this.orientation === Scroller.Orientation.HORIZONTAL ? this.scrollerOffsetX : this.scrollerOffsetY,
			endTime = (new Date()).getTime(),
			duration = endTime - this.startTime,
			flick = duration < 300 && endOffset <= 0 && endOffset >= maxDistance && distance > this.options.flickThreshold,
			requestScrollEnd = this.initiated && ( this.moved || flick ),
			sectionLength = this.sections.length,
			changeThreshold = this.options.changeThreshold,
			cancel = !flick && changeThreshold > distance,
			newIndex=0;

		this.touching = false;

		// bouncing effect
		if ( this.bouncingEffect ) {
			this.bouncingEffect.dragEnd();
		}

		if ( !requestScrollEnd ) {
			this._endScroll();
			return;
		}

		if ( !cancel && dist < 0 ) {
			newIndex = this.activeIndex + 1;
		} else if ( !cancel && dist > 0 ){
			newIndex = this.activeIndex - 1;
		} else {
			// canceled
			newIndex = this.activeIndex;
		}

		if (this.options.circular) {
			newIndex = (sectionLength + newIndex) % sectionLength;
		} else {
			newIndex = newIndex < 0 ? 0 : (newIndex > sectionLength - 1 ? sectionLength - 1 : newIndex);
		}

		this.setActiveSection( newIndex, this.options.animateDuration );
	},

	_endScroll: function() {
		this._repositionSections();
		this._fireEvent( eventType.CHANGE, {
			active: this.activeIndex
		});
		this._super();
	},

	_repositionSections: function( init ) {
		// if developer set circular option is true, this method used when webkitTransitionEnd event fired
		var sectionLength = this.sections.length,
			curPosition = this.sectionPositions[this.activeIndex],
			centerPosition = window.parseInt(sectionLength/2, 10),
			circular = this.options.circular,
			i, sectionStyle, sIdx, top, left, newX, newY;

		if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
			newX = -(this.width * ( circular ? centerPosition : this.activeIndex) );
			newY = 0;
		} else {
			newX = 0;
			newY = -(this.height * ( circular ? centerPosition : this.activeIndex) );
		}

		this._translateScrollbarWithPageIndex(this.activeIndex);

		if ( init || ( curPosition === 0 || curPosition === sectionLength - 1) ) {

			this._translate( newX, newY );

			if ( circular ) {
				for ( i = 0; i < sectionLength; i++ ) {
					sIdx = ( sectionLength + this.activeIndex - centerPosition + i ) % sectionLength;
					sectionStyle = this.sections[ sIdx ].style;

					this.sectionPositions[sIdx] = i;

					if ( this.orientation === Scroller.Orientation.HORIZONTAL ) {
						top = 0;
						left = this.width * i;
					} else {
						top = this.height * i;
						left = 0;
					}

					sectionStyle.top = top + "px";
					sectionStyle.left = left + "px";
				}
			}
		}
	},

	_clear: function() {
		this._super();
		this.sectionPositions.length = 0;
	}
});

//Export SectionChanger to the namespace
ns.SectionChanger = SectionChanger;

} ( ns, window ) );


})(this);