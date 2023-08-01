window.galaxyAnimation = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Adjust canvas size to fill window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Define SVG namespace
    var svgns = "http://www.w3.org/2000/svg";
   
    // Create an SVG point
    var svg = document.createElementNS(svgns, "svg");
    var pt = svg.createSVGPoint();

    // Define the number of nodes, their size, speed, and near distance
    var nodeCount = 5;  // Adjust this to change the number of nodes
    var nodeSize = 3;   // Adjust this to change the size of the nodes
    var nodeSpeed = 5;   // Adjust this to change the speed of the nodes
    var nearDist = Math.sqrt(canvas.width*canvas.height)/5;  // Adjust this to change the near distance for connections

    // Define the nodes
    var nodes = [];
    for (var i = 0; i < nodeCount; i++) {
        nodes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * nodeSpeed,
            vy: (Math.random() - 0.5) * nodeSpeed,
        });
    }


   
    // Animation loop
    function animate() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (window.development)
        {
            // Parse the path data
            var pathData = window.bouncingPath.getAttribute("d");
            var points = parsePathData(pathData);

            var previous_point = {x:0, y:0}

            
            // Draw the points
            ctx.beginPath();
            for (var i = 0; i < points.length; i++) {
                var windowPoint = mapSvgToWindow(points[i].x, points[i].y);
                var x = windowPoint.x;
                var y = windowPoint.y;
                if (i == 0) {
                    ctx.moveTo(x, y);
                } else {
                    // if (i == 3) console.log(x,y)
                    x = x + previous_point.x;
                    y = y + previous_point.y;
                    ctx.lineTo(x, y);
                }
                previous_point.x = x;
                previous_point.y = y;
            }
            ctx.lineTo(mapSvgToWindow(points[0].x, points[0].y).x, mapSvgToWindow(points[0].x, points[0].y).y)
            ctx.strokeStyle = 'antiquewhite';
            ctx.lineWidth = 5;
            ctx.stroke();
        }

        // Update positions and draw each node
        nodes.forEach(function(node, i) {
            // Update the node's position
            node.x += node.vx;
            node.y += node.vy;

            // Wrap the node's position when it goes off the edge of the canvas
            if (node.x < 0) node.x = canvas.width;
            if (node.x > canvas.width) node.x = 0;
            if (node.y < 0) node.y = canvas.height;
            if (node.y > canvas.height) node.y = 0;


            // Draw the node
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = 'antiquewhite';
            ctx.fill();
        });

        // Draw lines to nearby nodes
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                var dx = nodes[i].x - nodes[j].x;
                var dy = nodes[i].y - nodes[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < nearDist) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = 'antiquewhite';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Request the next frame
        requestAnimationFrame(animate);
    }

    // Start the animation
    animate();
};


// Function to map SVG coordinates to window coordinates
function mapSvgToWindow(svgX, svgY) {
    // Scale the coordinates according to the SVG's viewbox
    var windowX = svgX * window.svgScaleFactorX;
    var windowY = svgY * window.svgScaleFactorY;

    // Return the window coordinates
    return {x: windowX, y: windowY};
}


function parsePathData(data) {
    var commands = data.split(/(?=[a-df-z])/i); // split on command letters
    var points = [];
    
    commands.forEach(function(command) {
        var commandType = command[0];
        var args = command.slice(1).trim().split(/[\s,]+/).map(parseFloat);
        
        // For "M", "L", and "C" commands, add points to the list
        if (commandType.toUpperCase() === "M" || commandType.toUpperCase() === "L") {
            for (var i = 0; i < args.length; i += 2) {
                points.push({x: args[i], y: args[i + 1]});
            }
        } else if (commandType.toUpperCase() === "C") {
            for (var i = 0; i < args.length; i += 6) {
                points.push({x: args[i + 4], y: args[i + 5]});
            }
        }
    });
    
    return points;
}

window.ParseFunction = parsePathData
