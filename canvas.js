class NodesConfig {
    constructor(reduis, hoverdColor, lableColor) {
        this.reduis = reduis;
        this.lableColor = lableColor
        this.hoverdColor = hoverdColor
    }
}

// Graph Canvas ....
var canvas = document.getElementById('canvas');
canvas.width = 500; canvas.height = 600;
var ctx = canvas.getContext('2d');

// Zoom Canvas ....
var zoom_canvas = document.getElementById('canvas2');
zoom_canvas.width = 250; zoom_canvas.height = 250;
var zoomctx = zoom_canvas.getContext('2d');

// Create Image Element ...
var image = new Image();
image.src = "./xray.jpg";

// Set Sekected Node and Node Config
var SelectedNodeIndex = -1;
var config = new NodesConfig(5, "#FFFF00", "#FFFF00");

// Nodes ...
var Nodes = [
    { 'name': " ", "x": 323, "y": 121, "color": "green", "selected": false },
    { 'name': " ", "x": 350, "y": 203, "color": "green", "selected": false },
    { 'name': " ", "x": 374, "y": 286, "color": "green", "selected": false },
    { 'name': " ", "x": 442, "y": 358, "color": "green", "selected": false },
    { 'name': " ", "x": 400, "y": 400, "color": "green", "selected": false },
    { 'name': "Node 2", "x": 200, "y": 450, "color": "red", "selected": false },
    { 'name': "Node 2", "x": 300, "y": 200, "color": "red", "selected": false },
    { 'name': "Node 3", "x": 250, "y": 200, "color": "orange", "selected": false },
];

// Links Between Nodes ....
var Links = [
    { "src": 0, "des": 1 },
    { "src": 1, "des": 2 },
    { "src": 2, "des": 3 },
    { "src": 3, "des": 4 },
    { "src": 5, "des": 6 },
    { "src": 6, "des": 7 },
];

// Draw Graph Canvas
drawCanvas(canvas, ctx, Nodes, Links, image);

function drawCanvas(canvas, ctx, Nodes, Links) {
    // Clear Graphics from canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background Image ....
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    // Draw links between Nodes
    Links.map(link => drawLink(ctx, Nodes, link));
    // Draw nodes
    Nodes.map(node => drawNode(ctx, node, config));
}

function drawLink(ctx, nodes, link) {
    ctx.beginPath();
    ctx.moveTo(nodes[link["src"]]["x"], nodes[link["src"]]["y"]);
    ctx.lineTo(nodes[link["des"]]["x"], nodes[link["des"]]["y"]);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}
function drawNode(ctx, node, config) {
    ctx.beginPath();
    ctx.strokeStyle = node["selected"] ? config.hoverdColor : node["color"];
    ctx.arc(node["x"], node["y"], config.reduis, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = node["selected"] ? config.hoverdColor : node["color"];
    ctx.fill();
    ctx.fillStyle = config.lableColor;
    ctx.font = '11px Arial';
    ctx.fillText(node["name"], node["x"] - 15, node["y"] - 20);
}
function handelSelection(ctx, node, config) {
    node["selected"] = !node["selected"];
    drawNode(ctx, node, config)
}


canvas.onmousedown = function (event) {
    var r = canvas.getBoundingClientRect();
    var x = event.clientX - r.left;
    var y = event.clientY - r.top;
    console.log(x + " " + y);
    Nodes.map((n, index) => {
        if (x >= n["x"] - config.reduis && x <= n["x"] + config.reduis && y >= n["y"] - config.reduis && y <= n["y"] + config.reduis) {
            handelSelection(ctx, n, config);
            SelectedNodeIndex = index;
        }
    });
    return;
}
canvas.onmousemove = function (event) {
    var r = canvas.getBoundingClientRect();
    var x = event.clientX - r.left;
    var y = event.clientY - r.top;
    if (SelectedNodeIndex != -1) {
        Nodes[SelectedNodeIndex]["x"] = x;
        Nodes[SelectedNodeIndex]["y"] = y;
        drawCanvas(canvas, ctx, Nodes, Links, image);
    }
    zoomctx.save();
    zoomctx.translate(x * (zoom_canvas.width / canvas.width), y * (zoom_canvas.height / canvas.height));
    zoomctx.scale(3.1, 3.1);
    zoomctx.translate((-1 * x) * (zoom_canvas.width / canvas.width), (-1 * y) * (zoom_canvas.height / canvas.height));
    zoomctx.clearRect(0, 0, zoom_canvas.width, zoom_canvas.height);
    zoomctx.drawImage(canvas, 0, 0, 250, 250);
    zoomctx.restore();
}
canvas.onmouseup = function (event) {
    if (SelectedNodeIndex > -1) {
        handelSelection(ctx, Nodes[SelectedNodeIndex], config);
        SelectedNodeIndex = -1;
    }
}

