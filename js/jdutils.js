/**
 * JDUtils: General Utilities for JavaScript Development
 * For more information, visit jdkilby.com.
 */

/**
 * Basic module init
 */
var JDUTILS = JDUTILS || {};

/**
 * at (array tools) init
 */
JDUTILS.at = JDUTILS.at || {};

/**
 * Given an array's length and an index in that array, calculate
 * the index from the given offset (wrapping around if needed)
 */
JDUTILS.at.findNeighborIndex = function(sourceArrayLength, index, offset) {
	index += offset;
	if (index < 0) {
		index += Math.ceil(Math.abs(index) / sourceArrayLength) * sourceArrayLength;
	} else if (index >= sourceArrayLength) {
		index -= Math.floor(index / sourceArrayLength) * sourceArrayLength;
	}
	return index;
};

/**
 * Given an array, return the array elements that are outside of a range
 * from an index (wraping around if needed)
 */
JDUTILS.at.getElementsOutsideRange = function(sourceArray, index, range) {
	var result = [];

	if ( sourceArray.length - (2 * range) < 2 ) {
		return result;
	}

	var currentIndex = JDUTILS.at.findNeighborIndex(sourceArray.length, index, range + 1);
	var endIndex = JDUTILS.at.findNeighborIndex(sourceArray.length, index, -range);

	while ( currentIndex != endIndex ) {
		result.push(sourceArray[currentIndex]);
		currentIndex ++;
		if ( currentIndex >= sourceArray.length ) {
			currentIndex = 0;
		}
	}

	return result;
};

/**
 * dt (DOM tools) init
 */
JDUTILS.dt = JDUTILS.dt || {};

/**
 * Add classes specified by array to a DOM element
 */
JDUTILS.dt.addElementClasses = function(element, classesToAdd) {
	for ( var i = 0; i < classesToAdd.length; i ++ ) {
		element.classList.add(classesToAdd[i]);
	}
};

/**
 * Removes classes specified by array from a DOM element
 */

JDUTILS.dt.removeElementClasses = function (element, classesToRemove) {
	for ( var i = 0; i < classesToRemove.length; i ++ ) {
		element.classList.remove(classesToRemove[i]);
	}
};

/**
 * Gets the sum of the values of a series of properties on the
 * specified DOM element
 */
JDUTILS.dt.calculatePropertiesSize = function (element, propertiesToEvaluate) {
	var sum = 0,
		digitRegEx = /\d+/g,
		currentPropertyString;
	for ( var i = 0; i < propertiesToEvaluate.length; i ++ ) {
		currentPropertyValue = getComputedStyle(element).getPropertyValue(propertiesToEvaluate[i]);
		currentPropertyValue = currentPropertyValue.match(digitRegEx);
		if ( currentPropertyValue.length === 1 ) {
			sum += parseInt(currentPropertyValue[0]);
		}
	}
	return sum;
};

/**
 * Insert DOM element (newElement) after another (referenceElement);
 * solution taken from: http://stackoverflow.com/q/4793604/
 */
JDUTILS.dt.insertAfter = function(newElement, referenceElement) {
	referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
};

/*
 * Generate a DOM element and add classes specified in array to it
 */
JDUTILS.dt.generateElement = function(type, classes) {
	var newElement = document.createElement(type);
	for ( var i = 0; i < classes.length; i ++ ) {
		newElement.classList.add(classes[i]);
	}
	return newElement;
};

/**
 * For the given DOM element, add the classes specified in the first array
 * and then remove the classes specified in the second array
 */
JDUTILS.dt.updateElementClasses = function(element, classesToAdd, classesToRemove) {
	JDUTILS.dt.addElementClasses(element, classesToAdd);
	JDUTILS.dt.removeElementClasses(element, classesToRemove);
}

/**
 * compat (compatibility tools) init
 */
JDUTILS.compat = JDUTILS.compat || {};

/**
 * Get the correct event name for a transition end event;
 * solution based off of: https://davidwalsh.name/css-animation-callback
 */
JDUTILS.compat.getTransitionEndEventName = function() {
	var fakeElement = document.createElement("fake");
	var transitions = {
		"transition" : "transitionEnd",
		"WebkitTransition" :"webkitTransitionEnd",
		"MozTransition" : "transitionend",
		"MSTransition" : "msTransitionEnd",
		"OTransition" : "oTransitionEnd"
	};
	for ( var t in transitions ) {
		if ( fakeElement.style[t] !== undefined ) {
			return transitions[t];
		}
	}
}

/**
 * math (extended math tools) init
 */

JDUTILS.math = JDUTILS.math || {};

/**
 * random integer generator, implmentation taken from:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
JDUTILS.math.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}