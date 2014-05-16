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

	if ( ns.IndexScrollbar ) {
		return;
	}

/*********************************************************
 * IndexScrollbar widget
 *
 * offers 1depth/2depth index scrollbar
 *
 *********************************************************/

/*********************************************************
 * IndexBar
 * Shows merged index list on the bar, and returns index and value from the touch position
 *
 * Spec
 *  - Get index array
 *  - draw index list on the bar
 *  - show/hide
 *  - calculate pressed index
 *********************************************************/
function IndexBar(element, options) {
	this.element = element;
	this.options = ns.extendObject(options, this._options, false);
	this.container = this.options.container;

	this.indices = {
		original: this.options.index,
		merged: []
	};

	this._init();

	return this;
}
IndexBar.prototype = {
	_options: {
		container: null,
		offsetLeft: 0,
		index: [],
		verticalCenter: false,
		moreChar: "*",
		indexHeight: 36,
		selectedClass: "ui-state-selected",
		ulClass: null
	},
	_init: function() {
		this.indices.original = this.options.index;
		this.maxIndexLen = 0;
		this.indexLookupTable = [];
		this.indexElements = null;
		this.selectedIndex = -1;

		this._setMaxIndexLen();
		this._makeMergedIndices();
		this._drawDOM();
		this._appendToContainer();
		if(this.options.verticalCenter) {
			this._adjustVerticalCenter();
		}
		this._setIndexCellInfo();
	},

	_clear: function() {
		while(this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}

		this.indices.merged.length = 0;
		this.indexLookupTable.length = 0;
		this.indexElements = null;
		this.selectedIndex = -1;
	},

	refresh: function() {
		this._clear();
		this._init();
	},

	destroy: function() {
		this._clear();
		this.element = null;
	},

	show: function() {
		this.element.style.visibility="visible";
	},

	hide: function() {
		this.element.style.visibility="hidden";
	},

	_setMaxIndexLen: function() {
		var maxIndexLen,
			containerHeight = this.container.offsetHeight;
		maxIndexLen = Math.floor( containerHeight / this.options.indexHeight );
		if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
			maxIndexLen -= 1;	// Ensure odd number
		}
		this.maxIndexLen = maxIndexLen;
	},

	_makeMergedIndices: function() {
		var origIndices = this.indices.original,
			origIndexLen = origIndices.length,
			visibleIndexLen = Math.min(this.maxIndexLen, origIndexLen),
			totalLeft = origIndexLen - visibleIndexLen,
			nIndexPerItem = parseInt(totalLeft / parseInt(visibleIndexLen/2, 10), 10),
			leftItems = totalLeft % parseInt(visibleIndexLen/2, 10),
			indexItemSize = [],
			mergedIndices = [],
			i, len, position=0;

		for(i = 0, len = visibleIndexLen; i < len; i++) {
			indexItemSize[i] = 1;
			if(i % 2) {	// even number: omitter
				indexItemSize[i] += nIndexPerItem + (leftItems-- > 0 ? 1 : 0);
			}
			position +=  indexItemSize[i];
			mergedIndices.push( {
				start: position-1,
				length: indexItemSize[i]
			});
		}
		this.indices.merged = mergedIndices;
	},

	_drawDOM: function() {
		var origIndices = this.indices.original,
			indices = this.indices.merged,
			indexLen = indices.length,
			//container = this.container,
			//containerHeight = container.offsetHeight,
			indexHeight = this.options.indexHeight,
			//maxIndexLen = Math.min(this.maxIndexLen, indices.length),
			indexHeight = this.options.indexHeight,
			moreChar = this.options.moreChar,
			addMoreCharLineHeight = 9,
			text,
			frag,
			li,
			i,
			m;

		frag = document.createDocumentFragment();
		for(i=0; i < indexLen; i++) {
			m = indices[i];
			text = m.length === 1 ? origIndices[m.start] : moreChar;
			li = document.createElement("li");
			li.innerText = text.toUpperCase();
			li.style.height = indexHeight + "px";
			li.style.lineHeight = text === moreChar ? indexHeight + addMoreCharLineHeight + "px" : indexHeight + "px";
			frag.appendChild(li);
		}
		this.element.appendChild(frag);

		if(this.options.ulClass) {
			this.element.classList.add( this.options.ulClass );
		}
	},

	_adjustVerticalCenter: function() {
		var nItem = this.indices.merged.length,
			totalIndexLen = nItem * this.options.indexHeight,
			vPadding = parseInt((this.container.offsetHeight - totalIndexLen) / 2, 10);
		this.element.style.paddingTop = vPadding + "px";
	},

	_appendToContainer: function() {
		this.container.appendChild(this.element);
		this.element.style.left = this.options.offsetLeft + "px";
	},

	setPaddingTop: function(paddingTop) {
		var height = this.element.clientHeight,
			oldPaddingTop = this.element.style.paddingTop,
			oldPaddingBottom = this.element.style.paddingBottom,
			containerHeight = this.container.clientHeight;

		if(oldPaddingTop === "") {
			oldPaddingTop = 0;
		} else {
			oldPaddingTop = parseInt(oldPaddingTop, 10);
		}
		if(oldPaddingBottom === "") {
			oldPaddingBottom = 0;
		} else {
			oldPaddingBottom = parseInt(oldPaddingBottom, 10);
		}

		height = height - oldPaddingTop - oldPaddingBottom;

		if(paddingTop + height > containerHeight) {
			paddingTop -= (paddingTop + height - containerHeight);
		}
		this.element.style.paddingTop = paddingTop + "px";

		this._setIndexCellInfo();	// update index cell info
	},

	// Return index DOM element's offsetTop of given index
	getOffsetTopByIndex: function(index) {
		var cellIndex = this.indexLookupTable[index].cellIndex,
			el = this.indexElements[cellIndex],
			offsetTop = el.offsetTop;

		return offsetTop;
	},

	_setIndexCellInfo: function() {
		var element = this.element,
			mergedIndices = this.indices.merged,
			containerOffsetTop = ns.dom.getOffset(this.container).top,
			listitems = this.element.querySelectorAll("LI"),
			lookupTable = [];

		[].forEach.call(listitems, function(node, idx) {
			var m = mergedIndices[idx],
			i = m.start,
			len = i + m.length,
			top = containerOffsetTop + node.offsetTop,
			height = node.offsetHeight / m.length;

			for ( ; i < len; i++ ) {
				lookupTable.push({
					cellIndex: idx,
					top: top,
					range: height
				});
				top += height;
			}
		});
		this.indexLookupTable = lookupTable;
		this.indexElements = element.children;
	},

	getIndexByPosition: function(posY) {
		var table = this.indexLookupTable,
			info,
			i, len, range;

		// boundary check
		if( table[0] ) {
			info = table[0];
			if(posY < info.top) {
				return 0;
			}
		}
		if( table[table.length -1] ) {
			info = table[table.length -1];
			if(posY >= info.top + info.range) {
				return table.length - 1;
			}
		}
		for ( i=0, len=table.length; i < len; i++) {
			info = table[i];
			range = posY - info.top;
			if ( range >= 0 && range < info.range ) {
				return i;
			}
		}
		return 0;
	},

	getValueByIndex: function(idx) {
		if(idx < 0) { idx = 0; }
		return this.indices.original[idx];
	},

	select: function(idx) {
		var cellIndex,
			eCell;

		this.clearSelected();

		if(this.selectedIndex === idx) {
			return;
		}
		this.selectedIndex = idx;

		cellIndex = this.indexLookupTable[idx].cellIndex;
		eCell = this.indexElements[cellIndex];
		eCell.classList.add(this.options.selectedClass);
	},

	/* Clear selected class
	 */
	clearSelected: function() {
		var el = this.element,
			selectedClass = this.options.selectedClass,
			selectedElement = el.querySelectorAll("."+selectedClass);

		[].forEach.call(selectedElement, function(node) {
			node.classList.remove(selectedClass);
		});
		this.selectedIndex = -1;
	}
};

/****************************************************
 * IndexIndicator
 * Card indicator shown when the indexBar is pressed
 *
 * Spec
 *   - Get text
 *   - Show/hide
 ****************************************************/
function IndexIndicator(element, options) {
	this.element = element;
	this.options = ns.extendObject(options, this._options, false);
	this.value = null;

	this._init();

	return this;
}
IndexIndicator.prototype = {
	_options: {
		className: "ui-indexscrollbar-indicator",
		selectedClass: "ui-selected",
		container: null
	},
	_init: function() {
		var element = this.element;
		element.className = this.options.className;
		element.innerHTML = "<span></span>";

		// Add to DOM tree
		this.options.container.appendChild(element);
		this.fitToContainer();
	},

	fitToContainer: function() {
		var element = this.element,
			container = this.options.container,
			containerPosition = window.getComputedStyle(container).position;

		element.style.width = container.offsetWidth + "px";
		element.style.height = container.offsetHeight + "px";

		if ( containerPosition !== "absolute" && containerPosition !== "relative" ) {
			element.style.top = container.offsetTop + "px";
			element.style.left = container.offsetLeft + "px";
		}
	},

	setValue: function( value ) {
		this.value = value;	// remember value
		value = value.toUpperCase();

		var selected = value.substr(value.length - 1),
			remained = value.substr(0, value.length - 1),
			inner = "<span>" + remained + "</span><span class=\"ui-selected\">" + selected + "</span>";
		this.element.firstChild.innerHTML = inner;	// Set indicator text
	},

	show: function() {
		//this.element.style.visibility="visible";
		this.element.style.display="block";
	},
	hide: function() {
		this.element.style.display="none";
	},
	destroy: function() {
		while(this.element.firstChild) {
			this.element.removeChild(this.element.firstChild);
		}
		this.element = null;	// unreference element
	}
};


/*********************************************************
 * IndexScrollbar
 *
 * Shows an index scrollbar, and triggers 'select' event.
 *********************************************************/
function IndexScrollbar (element, options) {
	// Support calling without 'new' keyword
	if(ns === this) {
		return new IndexScrollbar(element);
	}

	if(!this._isValidElement(element)) {
		throw "Invalid element is given";
	}

	this.element = element;
	this.indicator = null;
	this.indexBar1 = null;	// First IndexBar. Always shown.
	this.indexBar2 = null;	// 2-depth IndexBar. shown if needed.


	this.index = null;
	this.touchAreaOffsetLeft = 0;
	this.indexElements = null;
	this.selectEventTriggerTimeoutId = null;
	this.ulMarginTop = 0;

	this.eventHandlers = {};

	this._setOptions(options);

	// Skip init when the widget is already extended
	if(!this._isExtended()) {
		this._create();
	}

	this._init();

	return this;
}

IndexScrollbar.prototype = {
	widgetName: "IndexScrollbar",
	widgetClass: "ui-indexscrollbar",

	_options: {
		moreChar: "*",
		selectedClass: "ui-state-selected",
		delimeter: ",",
		index: [
			"A", "B", "C", "D", "E", "F", "G", "H",
			"I", "J", "K", "L", "M", "N", "O", "P", "Q",
			"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
		],
		maxIndexLen: 0,
		indexHeight: 36,
		keepSelectEventDelay: 50,
		container: null,
		supplementaryIndex: null,
		supplementaryIndexMargin: 1
	},

	_create: function () {
		this._setInitialLayout();	// This is needed for creating sub objects
		this._createSubObjects();

		this._updateLayout();

		this._bindEvent();

		// Mark as extended
		this._extended(true);
	},

	_init: function () {

	},

	refresh: function () {
		if( this._isExtended() ) {
			this._unbindEvent();
			this.indicator.hide();
			this._extended( false );
		}

		this._updateLayout();
		this._extended( true );
	},

	destroy: function() {
		this._unbindEvent();
		this._extended( false );

		this._destroySubObjects();
		this.element = null;
		this.indicator = null;
		this.index = null;
		this.eventHandlers = null;
	},

	_setOptions: function (options) {
		this.options = ns.extendObject(options, this._options, false);

		// data-* attributes
		this.options.index = this._getIndex();
	},

	/* Create indexBar1 and indicator in the indexScrollbar
	 */
	_createSubObjects: function() {
		// indexBar1
		this.indexBar1 = new IndexBar( document.createElement("UL"), {
			container: this.element,
			offsetLeft: 0,
			index: this.options.index,
			verticalCenter: true,
			indexHeight: this.options.indexHeight
		});

		// indexBar2
		if(this.options.supplementaryIndex) {
			this.indexBar2 = new IndexBar( document.createElement("UL"), {
				container: this.element,
				offsetLeft: -this.element.clientWidth - this.options.supplementaryIndexMargin,
				index: [],	// empty index
				indexHeight: this.options.indexHeight,
				ulClass: "ui-indexscrollbar-supplementary"
			});
			this.indexBar2.hide();
		}

		// indicator
		this.indicator = new IndexIndicator(document.createElement("DIV"), {
			container: this._getContainer()
		});

	},

	_destroySubObjects: function() {
		var subObjs = {
				iBar1: this.indexBar1,
				iBar2: this.indexBar2,
				indicator: this.indicator
			},
			subObj,
			el,
			i;
		for(i in subObjs) {
			subObj = subObjs[i];
			if(subObj) {
				el = subObj.element;
				subObj.destroy();
				el.parentNode.removeChild(el);
			}
		}
	},

	/* Set initial layout
	 */
	_setInitialLayout: function () {
		var indexScrollbar = this.element,
			container = this._getContainer(),
			containerPosition = window.getComputedStyle(container).position;

		// Set the indexScrollbar's position, if needed
		if (containerPosition !== "absolute" && containerPosition !== "relative") {
			indexScrollbar.style.top = container.offsetTop + "px";
			indexScrollbar.style.height = container.style.height;
		}
	},

	/* Calculate maximum index length
	 */
	_setMaxIndexLen: function() {
		var maxIndexLen = this.options.maxIndexLen,
			container = this._getContainer(),
			containerHeight = container.offsetHeight;
		if(maxIndexLen <= 0) {
			maxIndexLen = Math.floor( containerHeight / this.options.indexHeight );
		}
		if(maxIndexLen > 0 && maxIndexLen%2 === 0) {
			maxIndexLen -= 1;	// Ensure odd number
		}
		this.options.maxIndexLen = maxIndexLen;
	},

	_updateLayout: function() {
		this._setInitialLayout();
		this._draw();

		this.touchAreaOffsetLeft = this.element.offsetLeft - 10;
	},

	/**	Draw additinoal sub-elements
	 *	@param {array} indices	List of index string
	 */
	_draw: function () {
		this.indexBar1.show();
		return this;
	},

	_removeIndicator: function() {
		var indicator = this.indicator,
			parentElem = indicator.element.parentNode;

		parentElem.removeChild(indicator.element);
		indicator.destroy();
		this.indicator = null;
	},

	_getEventReceiverByPosition: function( posX ) {
		var windowWidth = window.innerWidth,
			elementWidth = this.element.clientWidth,
			receiver;

		if( this.options.supplementaryIndex ) {
			if( windowWidth - elementWidth <= posX && posX <= windowWidth) {
				receiver = this.indexBar1;
			} else {
				receiver = this.indexBar2;
			}
		} else {
			receiver = this.indexBar1;
		}
		return receiver;
	},

	_updateIndicatorAndTriggerEvent: function( val ) {
		this.indicator.setValue( val );
		this.indicator.show();
		if(this.selectEventTriggerTimeoutId) {
			window.clearTimeout(this.selectEventTriggerTimeoutId);
		}
		this.selectEventTriggerTimeoutId = window.setTimeout(function() {
			this._trigger(this.element, "select", {index: val});
			this.selectEventTriggerTimeoutId = null;
		}.bind(this), this.options.keepSelectEventDelay);
	},

	_onTouchStartHandler: function( ev ) {
		if (ev.touches.length > 1) {
			ev.preventDefault();
			ev.stopPropagation();
			return;
		}
		var pos = this._getPositionFromEvent( ev ),
			// At touchstart, only indexbar1 is shown.
			iBar1 = this.indexBar1,
			idx = iBar1.getIndexByPosition( pos.y ),
			val = iBar1.getValueByIndex( idx );

		iBar1.select( idx );	// highlight selected value

		this._updateIndicatorAndTriggerEvent( val );
	},

	_onTouchMoveHandler: function( ev ) {
		if (ev.touches.length > 1) {
			ev.preventDefault();
			ev.stopPropagation();
			return;
		}

		var pos = this._getPositionFromEvent( ev ),
			iBar1 = this.indexBar1,
			iBar2 = this.indexBar2,
			idx,
			iBar,
			val;

		// Check event receiver: ibar1 or ibar2
		iBar = this._getEventReceiverByPosition( pos.x );
		if( iBar === iBar2 ) {
			iBar2.options.index = this.options.supplementaryIndex(iBar1.getValueByIndex(iBar1.selectedIndex));
			iBar2.refresh();
		}

		// get index and value from ibar1 or ibar2
		idx = iBar.getIndexByPosition( pos.y );
		val = iBar.getValueByIndex( idx );
		if(iBar === iBar2) {
			// Update val
			val = iBar1.getValueByIndex(iBar1.selectedIndex) + val;

			// Set iBar2's paddingTop
			iBar2.setPaddingTop( iBar1.getOffsetTopByIndex(iBar1.selectedIndex) );
		}

		// update ibars
		iBar.select(idx);	// highlight selected value
		iBar.show();
		if( iBar1 === iBar && iBar2 ) {
			iBar2.hide();
		}

		// update indicator
		this._updateIndicatorAndTriggerEvent( val );

		ev.preventDefault();
		ev.stopPropagation();
	},

	_onTouchEndHandler: function( ev ) {
		if (ev.touches.length > 0) {
			return;
		}

		this.indicator.hide();
		this.indexBar1.clearSelected();
		if(this.indexBar2) {
			this.indexBar2.clearSelected();
			this.indexBar2.hide();
		}
	},

	_bindEvent: function() {
		this._bindResizeEvent();
		this._bindEventToTriggerSelectEvent();
	},

	_unbindEvent: function() {
		this._unbindResizeEvent();
		this._unbindEventToTriggerSelectEvent();
	},

	_bindResizeEvent: function() {
		this.eventHandlers.onresize = function(/* ev */) {
			this.refresh();
		}.bind(this);

		window.addEventListener( "resize", this.eventHandlers.onresize );
	},

	_unbindResizeEvent: function() {
		if ( this.eventHandlers.onresize ) {
			window.removeEventListener( "resize", this.eventHandlers.onresize );
		}
	},

	_bindEventToTriggerSelectEvent: function() {
		this.eventHandlers.touchStart = this._onTouchStartHandler.bind(this);
		this.eventHandlers.touchEnd = this._onTouchEndHandler.bind(this);
		this.eventHandlers.touchMove = this._onTouchMoveHandler.bind(this);

		this.element.addEventListener("touchstart", this.eventHandlers.touchStart);
		this.element.addEventListener("touchmove", this.eventHandlers.touchMove);
		this.element.addEventListener("touchend", this.eventHandlers.touchEnd);
		document.addEventListener("touchcancel", this.eventHandlers.touchEnd);
	},

	_unbindEventToTriggerSelectEvent: function() {
		this.element.removeEventListener("touchstart", this.eventHandlers.touchStart);
		this.element.removeEventListener("touchmove", this.eventHandlers.touchMove);
		this.element.removeEventListener("touchend", this.eventHandlers.touchEnd);
		document.removeEventListener("touchcancel", this.eventHandlers.touchEnd);
	},

	/**
	 * Trgger a custom event to the give element
	 * @param {obj}		elem	element
	 * @param {string}	eventName	event name
	 * @param {obj}		detail	detail data of the custom event
	 */
	_trigger: function(elem, eventName, detail) {
		var ev;
		if(!elem || !elem.nodeType || elem.nodeType !== 1) {	// DOM element check
			throw "Given element is not a valid DOM element";
		}
		if("string" !== typeof eventName || eventName.length <= 0) {
			throw "Given eventName is not a valid string";
		}
		ev = new CustomEvent(
			eventName,
			{
				detail: detail,
				bubbles: true,
				cancelable: true
			}
		);
		elem.dispatchEvent(ev);

		return true;
	},

	_data: function (key, val) {
		var el = this.element,
			d = el.__data,
			idx;
		if(!d) {
			d = el.__data = {};
		}
		if(typeof key === "object") {
			// Support data collection
			for(idx in key) {
				this._data(idx, key[idx]);
			}
			return this;
		} else {
			if("undefined" === typeof val) {	// Getter
				return d[key];
			} else {	// Setter
				d[key] = val;
				return this;
			}
		}
	},

	_isValidElement: function (el) {
		return el.classList.contains(this.widgetClass);
	},

	_isExtended: function () {
		return !!this._data("extended");
	},

	_extended: function (flag) {
		this._data("extended", flag);
		return this;
	},

	_getIndex: function () {
		var el = this.element,
			options = this.options,
			indices = el.getAttribute("data-index");
		if(indices) {
			indices = indices.split(options.delimeter);	// Delimeter
		} else {
			indices = options.indices;
		}
		return indices;
	},

	_getOffset: function( el ) {
		var left=0, top=0 ;
		do {
			top += el.offsetTop;
			left += el.offsetLeft;
		} while (el = el.offsetParent);

		return {
			top: top,
			left: left
		};
	},

	_getContainer: function() {
		return this.options.container || this.element.parentNode;
	},

	_getPositionFromEvent: function( ev ) {
		return ev.type.search(/^touch/) !== -1 ?
				{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
				{x: ev.clientX, y: ev.clientY};
	},

	addEventListener: function (type, listener) {
		this.element.addEventListener(type, listener);
	},

	removeEventListener: function (type, listener) {
		this.element.removeEventListener(type, listener);
	},

};
// Export indexscrollbar to the namespace
ns.IndexScrollbar = IndexScrollbar;

} ( ns, window ) );


})(this);