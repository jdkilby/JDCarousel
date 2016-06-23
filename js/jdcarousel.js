/**
 * JDCarousel: Image Carousel
 * For more information, visit jdkilby.com.
 */
var JDCAROUSEL = JDCAROUSEL || {};

/**
 * Array of carousels active on page
 */
JDCAROUSEL._carousels = [];

/**
 * The only public-facing function, it takes the id of the element that will contain the carousel,
 * an array of strings indicated the sources of the images to be used, and the largest picture height
 * (specified manually for performance / rendering reasons)
 */
JDCAROUSEL.create = function(carouselElementId, imageList, largestPictureHeight) {
	// begin parameter error checking and handling
	if ( arguments.length !== 3 ) {
		console.error("JDCAROUSEL.create - Incorrect number of arguments, need an DOM element id (string) for first argument, an array of file locations (strings) for the second argument, and the height of the largest image (number) for the third argument");
		return;
	}
	if ( typeof carouselElementId !== "string" ) {
		console.error("JDCAROUSEL.create - First argument should be a DOM element id (string)");
		return;
	}
	if ( imageList.constructor !== Array ) {
		console.error("JDCAROUSEL.create - Second argument should be an array of file locations (strings)");
		return;
	}
	if ( imageList.every(function(arrayElement) { return typeof arrayElement === "string"; } ) === false ) {
		console.error("JDCAROUSEL.create - At least one of the supplied image file locations (second argument) is not a string");
		return;
	}
	if ( imageList.length === 0 ) {
		console.error("JDCAROUSEL.create - No images specified in array (second argument)");
		return;
	}
	if ( typeof largestPictureHeight !== "number" || largestPictureHeight <= 0 ) {
		console.error("JDCAROUSEL.create - Third argument is not a postive number specifying the height of the largest picture to be used in this carousel");
	}
	if ( JDCAROUSEL._carousels.some(function(arrayElement) { return arrayElement.carouselElementId === carouselElementId;} ) === true ) {
		console.error("JDCAROUSEL.create - Element with ID \"" + carouselElementId + "\" already has a JDCarousel attached to it, cannot create new one");
		return;
	}
	// store a reference to the carousel element itself (needed for one final check and later use)
	var carouselElement = document.getElementById(carouselElementId);
	if ( carouselElement === null ) {
		console.error("JDCAROUSEL.create - Element with ID \"" + carouselElementId + "\" was not found in document");
		return;
	}

	// all checks passed, start constructing carousel

	// need at least 7 images in order to property render carousel; duplicate image list elements if needed
	while ( imageList.length < 7 ) {
		imageList = imageList.concat(imageList.slice(0));
	}

	carouselElement.classList.add("jdcarousel");
	// default value (will adjust later to account for padding and border)
	carouselElement.style.height = parseInt(largestPictureHeight) + "px";
	
	// generate buttons
	var newButton, newIcon, buttonElements = [];
	// generate left button
	newButton = document.createElement("div");
	newButton.classList.add("jdcarousel-button", "jdcarousel-button-left");
	newIcon = document.createElement("span");
	newIcon.classList.add("fa", "fa-3x", "fa-chevron-left");
	newButton.appendChild(newIcon);
	carouselElement.appendChild(newButton);
	newButton.addEventListener("click", JDCAROUSEL._moveLeft, false);
	buttonElements.push(newButton);
	// generate right button
	newButton = document.createElement("div");
	newButton.classList.add("jdcarousel-button", "jdcarousel-button-right");
	newIcon = document.createElement("span");
	newIcon.classList.add("fa", "fa-3x", "fa-chevron-right");
	newButton.appendChild(newIcon);
	carouselElement.appendChild(newButton);
	newButton.addEventListener("click", JDCAROUSEL._moveRight, false);
	buttonElements.push(newButton);

	// generate images
	var newImage, imageElements = [];
	for ( var i = 0; i < imageList.length; i ++ ) {
		newImage = document.createElement("img");
		newImage.src = imageList[i];
		newImage.classList.add("imageInit");
		newImage.addEventListener(JDUTILS.compat.getTransitionEndEventName(), JDCAROUSEL._imageAnimationComplete, false);
		carouselElement.appendChild(newImage);
		imageElements.push(newImage);
	}

	// apply appropriate classes to images
	JDCAROUSEL._updateImages(imageElements, 0);

	// store reference to carousel information for future use
	var carouselData = {
		carouselElementId: carouselElementId,
		buttonElements: buttonElements,
		imageElements: imageElements,
		activeImageElementIndex: 0,
		elementsAnimating: 0,
		animationTriggered: false
	};
	JDCAROUSEL._carousels.push(carouselData);

	// give the browser a moment to set the padding and border properties via the specified CSS
	//  so we can adjust the carousel to the proper height
	setTimeout(function() {
		carouselElement.style.height = parseInt( largestPictureHeight + JDUTILS.dt.calculatePropertiesSize(carouselElement, ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]) ) + "px";
	}, 1);

	// pause long enough for any transitions to run during initial applicaiton of classes;
	// remove the imageInit class to reveal carousel images
	setTimeout(function() {
		for ( var i = 0; i < imageElements.length; i ++ ) {
			imageElements[i].classList.remove("imageInit")
		}
	}, 150);
}

/**
 * Prepare to shift carousel images to the left
 */
JDCAROUSEL._moveLeft = function() {
	var parentCarouselData = JDCAROUSEL._getCarouselData(this.parentNode.id);
	if ( parentCarouselData !== null && parentCarouselData.elementsAnimating === 0 ) {
		JDCAROUSEL._move(parentCarouselData, false);
	}
}

/**
 * Prepare to shift carousel images to the right
 */
JDCAROUSEL._moveRight = function() {
	var parentCarouselData = JDCAROUSEL._getCarouselData(this.parentNode.id);
	if ( parentCarouselData !== null && parentCarouselData.elementsAnimating === 0 ) {
		JDCAROUSEL._move(parentCarouselData, true);
	}
}

/**
 * Shift carousel images to the left
 */
JDCAROUSEL._move = function(carouselData, moveRight) {
	// reset counter of elements to wait for animation complete
	carouselData.elementsAnimating = 7;
	// deactivate buttons
	for ( var i = 0; i < carouselData.buttonElements.length; i ++ ) {
		carouselData.buttonElements[i].classList.add("inactiveButton");
	}
	// set new active image element index
	if ( moveRight === true ) {
		carouselData.activeImageElementIndex ++;
		if ( carouselData.activeImageElementIndex === carouselData.imageElements.length ) {
			carouselData.activeImageElementIndex = 0;
		}
	}
	else {
		carouselData.activeImageElementIndex --;
		if ( carouselData.activeImageElementIndex < 0 ) {
			carouselData.activeImageElementIndex = carouselData.imageElements.length - 1;
		}
	}

	// update class attributes on images
	JDCAROUSEL._updateImages(carouselData.imageElements, carouselData.activeImageElementIndex);

	// fallback functionality in case the ending transition event doesn't fire
	// (which appears to be buggy on some webkit browsers)
	carouselData.animationTriggered = true;
	setTimeout(function() { 
		if ( carouselData.animationTriggered === true ) {
			carouselData.elementsAnimating = 0;
			carouselData.animationTriggered = false;
			for ( var i = 0; i < carouselData.buttonElements.length; i ++ ) {
				carouselData.buttonElements[i].classList.remove("inactiveButton");
			}
		}
	}, 1250);
}

/**
 * Runs on completion of transition events for pictures
 */
JDCAROUSEL._imageAnimationComplete = function() {
	var carouselData = JDCAROUSEL._getCarouselData(this.parentNode.id);
	carouselData.elementsAnimating --;
	// if all elements have finished animating
	if ( carouselData.elementsAnimating === 0 ) {
		carouselData.animationTriggered = false;
		for ( var i = 0; i < carouselData.buttonElements.length; i ++ ) {
			carouselData.buttonElements[i].classList.remove("inactiveButton");
		}
	}
}

/**
 * Update the image classes based on their new positions
 */
JDCAROUSEL._updateImages = function(carouselImageElements, activeCarouselElementIndex) {
	var nextImageElement, carouselImageElementsLength = carouselImageElements.length;

	nextImageElement = carouselImageElements[activeCarouselElementIndex];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["active-image"], ["left-preview", "right-preview"]);

	nextImageElement = carouselImageElements[JDUTILS.at.findNeighborIndex(carouselImageElementsLength, activeCarouselElementIndex, -1)];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["left-preview"], ["active-image", "left-of-view", "right-of-view"]);

	nextImageElement = carouselImageElements[JDUTILS.at.findNeighborIndex(carouselImageElementsLength, activeCarouselElementIndex, 1)];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["right-preview"], ["active-image", "left-of-view", "right-of-view"]);

	nextImageElement = carouselImageElements[JDUTILS.at.findNeighborIndex(carouselImageElementsLength, activeCarouselElementIndex, -2)];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["left-of-view"], ["left-preview", "hidden-image-left"]);

	nextImageElement = carouselImageElements[JDUTILS.at.findNeighborIndex(carouselImageElementsLength, activeCarouselElementIndex, 2)];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["right-of-view"], ["right-preview", "hidden-image-right"]);

	nextImageElement = carouselImageElements[JDUTILS.at.findNeighborIndex(carouselImageElementsLength, activeCarouselElementIndex, -3)];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["hidden-image-left"], ["left-of-view", "hidden-image-neutral"]);

	nextImageElement = carouselImageElements[JDUTILS.at.findNeighborIndex(carouselImageElementsLength, activeCarouselElementIndex, 3)];
	JDUTILS.dt.updateElementClasses(nextImageElement, ["hidden-image-right"], ["right-of-view", "hidden-image-neutral"]);

	var remainingImageElements = JDUTILS.at.getElementsOutsideRange(carouselImageElements, activeCarouselElementIndex, 3);
	for ( var i = 0; i < remainingImageElements.length; i ++ ) {
		JDUTILS.dt.updateElementClasses(remainingImageElements[i], ["hidden-image-neutral"], ["hidden-image-left", "hidden-image-right"]);
	}
}

/**
 * Look up data about the carousels
 */
JDCAROUSEL._getCarouselData = function(carouselElementId) {
	for ( var i = 0; i < JDCAROUSEL._carousels.length; i ++ ) {
		if ( JDCAROUSEL._carousels[i].carouselElementId === carouselElementId ) {
			return JDCAROUSEL._carousels[i];
		}
	}
}