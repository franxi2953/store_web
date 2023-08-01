// Development mode
var development = false;
window.development = development;


// Get SVG objects and containers
var restingSvgObject = document.getElementById('restingSvg');
var activeSvgObject = document.getElementById('activeSvg');
var restingSvgContainer = document.getElementById('restingSvgContainer');
var activeSvgContainer = document.getElementById('activeSvgContainer');


restingSvgObject.addEventListener('load', function() {
    var svgDocument = restingSvgObject.contentDocument;  // Get the SVG document
    var triggerPath = svgDocument.getElementById('trigger');  // Get the path element

    // compute conversions between svg coordinates and window coordinates.
    
    var svgElement = svgDocument.rootElement;
    // Get the SVG viewbox
    var viewBox = svgElement.viewBox.baseVal;
    // Calculate the scale factors
    var scaleFactorX = window.innerWidth / viewBox.width;
    var scaleFactorY = window.innerHeight / viewBox.height;

    window.svgScaleFactorX = scaleFactorX;
    window.svgScaleFactorY = scaleFactorY;
    
    window.bouncingPath = triggerPath;
    window.svgElement = svgElement;

    // console.log(svgElement.getBoundingClientRect(), viewBox)

    // Start the animation
    galaxyAnimation();

    // Make the trigger path visible in development mode
    if (development) {
        triggerPath.style.stroke = 'red';
        triggerPath.style.fill = 'red';
    } else {
        triggerPath.style.stroke = 'transparent';
        triggerPath.style.fill = 'transparent';
    }

    triggerPath.addEventListener('mouseenter', function() {
        activeSvgContainer.style.display = 'block';
    });
});

activeSvgObject.addEventListener('load', function() {
    var svgDocument = activeSvgObject.contentDocument;  // Get the SVG document
    var triggerPath = svgDocument.getElementById('trigger');  // Get the path element

    // Make the trigger path visible in development mode
    if (development) {
        triggerPath.style.stroke = 'red';
        triggerPath.style.fill = 'red';
    } else {
        triggerPath.style.stroke = 'transparent';
        triggerPath.style.fill = 'transparent';
    }

    var mouseLeaveHandler = function() {
        activeSvgContainer.style.display = 'none';
    };

    triggerPath.addEventListener('mouseleave', mouseLeaveHandler);

    triggerPath.addEventListener('click', function() {
        // Remove the mouseleave event listener
        triggerPath.removeEventListener('mouseleave', mouseLeaveHandler);

        var menu = document.getElementById('product_menu');
        menu.style.display = 'block';  // Show the menu

        // Load the HTML content
        fetch('products/qByte.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('#menu_content').innerHTML = html;
        });

        var closeButton = document.getElementById('product_menu_close');
        closeButton.addEventListener('click', function() {
            menu.style.display = 'none';  // Hide the menu
            activeSvgContainer.style.display = 'none';  // Hide the activeSvgContainer
            triggerPath.addEventListener('mouseleave', mouseLeaveHandler);  // Re-attach the mouseleave event listener
        });
    });
});


