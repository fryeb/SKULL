// Globals
let ctx = null;
let enemy_sprite = null;
let player_sprite = null;
let target_sprite = null;
let poop_sprite = null;
let game_state_icon = null;
let tile_size = 0;

function initializeCanvas() {
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

function drawSprite(sprite, x, y) {
	ctx.drawImage(
			sprite,
			tile_size * x + 0.5 * sprite.width,
			tile_size * y + 0.5 * sprite.height,
			sprite.width,
			sprite.height);
}

function drawCanvas() {
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
	for (let enemy of enemies) {
		drawSprite(enemy_sprite, enemy.x, enemy.y);
	}

	// Particles
	for (let particle of particles) {
		let scale = 0.75 * 1/(Math.max(1, particle.vy - 1.2*PARTICLE_SPEED));
		let width = scale * target_sprite.width;
		let height = scale * target_sprite.height;
		ctx.drawImage(
				target_sprite,
				tile_size * particle.x + 0.5 * width,
				tile_size * particle.y + 0.5 * height,
				width,
				height);
	}

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
