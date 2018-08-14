const world_width = 40;
const world_height = 30;

// Globals
let ctx = null;
let canvas = null;
let enemy_sprite = null;
let player_sprite = null;
let target_sprite = null;
let poop_sprite = null;
let game_state_icon = null;
let tile_size = 0;

function initializeGraphics() {
	canvas = document.getElementById('c');
	let dpi = window.devicePixelRatio;

	// Get CSS Dimensions
	let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

	// Scale the canvas
	canvas.setAttribute('width', style_width * dpi);
	tile_size = Math.round((style_width * dpi) / world_width);
	canvas.setAttribute('height', world_height * tile_size);

	ctx = canvas.getContext('2d');

	function loadSymbol(code) {
		let img = new Image();
		let DOMURL = window.URL || window.webkitURL || window;
		let data = '<svg xmlns="http://www.w3.org/2000/svg"' +
			' width="20" height="20">' +
           		'<foreignObject font-size="15" width="20" height="20"> ' +
	   		code +
           		' </foreignObject>' +
           		'</svg>';
		let svg = new Blob([data], {type: 'image/svg+xml'});
		let url = DOMURL.createObjectURL(svg);
		img.src = url;
		return img;
	}

	// Load Sprites & Icons
	enemy_sprite = loadSymbol('&#x1f480;');
	player_sprite = loadSymbol('&#x1f603;');
	target_sprite = loadSymbol('&#x2b50;');
	poop_sprite = loadSymbol('&#x1f4a9;');
	game_state_icon = {
		"Launch": loadSymbol('&#x25b6;'),
		// "Play": null,
		"Paused": loadSymbol('&#x23f8;'),
		"Restart" : loadSymbol('&#x1f504;')
	}
}
window.onresize = initializeGraphics;
initializeGraphics();

function drawSprite(sprite, x, y) {
	ctx.drawImage(
		sprite,
		tile_size * x + 0.5 * sprite.width,
		tile_size * y + 0.5 * sprite.height,
		sprite.width,
		sprite.height);
}

function draw() {
	ctx.fillStyle = '#44444488';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Score
	ctx.font = "100px Arial";
	ctx.fillStyle = "#888";
	let score_string = score.toString();
	let score_width = ctx.measureText(score_string).width;
	ctx.fillText(
		score_string,
		canvas.width/2 - score_width/2,
		100);

	// Player
	let ps = (game_state != "Restart") ? player_sprite : poop_sprite;
	drawSprite(ps, player.x, player.y);

	// Target
	drawSprite(target_sprite, target.x, target.y);

	// Enemies
	enemies.forEach(function(enemy) {
		drawSprite(enemy_sprite, enemy.x, enemy.y);
	});

	if (game_state != "Play") {
		ctx.fillStyle = "#aaa";
		ctx.globalAlpha = 0.5;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1.0;
		let icon = game_state_icon[game_state];
		let icon_width = icon.width * 5;
		let icon_height = icon.height * 5;
		ctx.drawImage(
			icon,
			canvas.width/2 - icon_width/2,
			canvas.height/2 - icon_height/2,
			icon_width,
			icon_height);
	}
}
