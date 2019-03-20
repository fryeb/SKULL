const WORLD_WIDTH = 40;
const WORLD_HEIGHT = 30;
let canvas = null;

let useGL = false;

function initializeGraphics() {
	// Create new canvas, so we get a new context
	canvas = document.getElementById('c');
	let new_canvas = canvas.cloneNode(false);
	canvas.parentNode.replaceChild(new_canvas, canvas);
	canvas = new_canvas;
	canvas.addEventListener('click', clickEscape); // Keep responding to click

	let dpi = window.devicePixelRatio;

	// Get CSS Dimensions
	let style_height = 
		+getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	let style_width =
		+getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

	// Scale the canvas
	canvas.setAttribute('width', style_width * dpi);
	tile_size = Math.round((style_width * dpi) / WORLD_WIDTH);
	canvas.setAttribute('height', WORLD_HEIGHT * tile_size);

	let renderer = document.querySelector('input[name="renderer"]:checked').value; 
	console.log("Renderer: " + renderer);
	
	useGL = renderer == "gl";

	if (useGL)
		initializeGL();
	else
		initializeCanvas();
}

function draw() {
	if (useGL) {
		drawGL();
	} else {
		drawCanvas();
	}
}
