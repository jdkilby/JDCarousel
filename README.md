# JDCarousel

The live demo is available at http://jdcarousel.jdkilby.com.

I built this image carousel for my website and am putting the code out for others to use.

Using it has several requirements:

- [Font Awesome](http://fontawesome.io) for the navigation icons. These can be manually changed in the jdcarousel.js file in the js folder if you'd rather use something else.
- A copy of [jdutils](https://github.com/jdkilby/JDUtils), which is included but also available via my [GitHub page](https://github.com/jdkilby).
- Include the jdcarousel.css file (in the css folder) and the jdcarousel.js (in the js folder) in your HTML.

To use, simply create an empty elment like a <div> and give it a unique ID (as ID's should be). After the DOM has loaded, call `JDCAROUSEL.create` with three arguments:

- Argument #1 is the element ID that will contain the carousel.
- Argument #2 is an array of strings with the src attributes for the images.
- Argument #3 is the tallest height (in pixels) of all the images. This is set manually for performance / rendering reasons, but I will consider adding automatic detection in the future.

The design of the container and navigation arrows is both adaptive and responsive for mobile devices **except** for the images themselves. I plan on adding more sophisticated image support in the future, but for now, take this into consideration when deciding which images to use.

Please contact me via my website ([jdkilby.com](http://www.jdkilby.com)) if you run into issues.

Enjoy!