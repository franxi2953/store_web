document.addEventListener('DOMContentLoaded', function() {
    var currentPage = window.location.pathname.split('/').pop();
    var menuItems = document.getElementsByClassName('menuItem');

    for (var i = 0; i < menuItems.length; i++) {
        var menuItem = menuItems[i];
        var menuItemPage = menuItem.getAttribute('href');

        // If this menu item's href matches the current page, highlight it
        if (menuItemPage === currentPage) {
            menuItem.classList.add('menuItemCurrent');
        }
        else {
            menuItem.classList.remove('menuItemCurrent');
        }
    }

    // Load the initial page
    loadPage('catalog');
});

function loadPage(pageName) {
    fetch(pageName + '.html')
    .then(response => response.text())
    .then(html => {
        var content = document.querySelector('#content');
        content.innerHTML = html;

        // Get the scripts to load
        var scriptDataElement = content.querySelector('#script-data');
        var scriptsToLoad = scriptDataElement.getAttribute('data-scripts').split(',');

        // Remove any old scripts
        var oldScripts = document.querySelectorAll('.dynamic-script');
        oldScripts.forEach(function(oldScript) {
            oldScript.parentNode.removeChild(oldScript);
        });

        // Add the new scripts
        scriptsToLoad.forEach(script => {
            if (script) { // Skip if the script name is an empty string
                const scriptTag = document.createElement('script');
                scriptTag.src = script + '.js';
                scriptTag.classList.add('dynamic-script');
                content.appendChild(scriptTag);
            }
        });

        // Dispatch a custom event
        var event = new Event('pageLoaded');
        document.dispatchEvent(event);

        // Get the target menu item and highlight it
        highlightMenuItem(pageName);
    });
}


function highlightMenuItem(target) {
    var menuItems = document.getElementsByClassName('menuItem');

    for (menuItem of menuItems) {
        menuItem.classList.remove('menuItemCurrent');
        if (menuItem.innerHTML.toLowerCase() == target) menuItem.classList.add('menuItemCurrent');
    }
    
}
