let canvas = document.getElementById('c');
let tile_size = canvas.width / width;
canvas.height = height * tile_size;
let ctx = canvas.getContext('2d');

let enemy_sprite = drawSymbol('&#x1f480;');
let player_sprite = drawSymbol('&#x1f603;');
let target_sprite = drawSymbol('&#x2b50;');
let poop_sprite = drawSymbol('&#x1f4a9;');

let game_state_icon = {
	"Launch": drawSymbol('&#x25b6;'),
	"Play": null,
	"Paused": drawSymbol('&#x23f8;'),
	"Restart" : drawSymbol('&#x1f504;')
}

function drawSymbol(code) {
	var img = new Image();

	var DOMURL = window.URL || window.webkitURL || window;
	var data = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">' +
           '<foreignObject width="100%" height="100%"> ' +
	   	code +
           ' </foreignObject>' +
           '</svg>';
	var svg = new Blob([data], {type: 'image/svg+xml'});
	var url = DOMURL.createObjectURL(svg);
	img.src = url;
	return img;
}

function drawSprite(sprite, x, y) {
	ctx.drawImage(
		sprite,
		tile_size * x + 0.5 * tile_size,
		tile_size * y + 0.5 * tile_size,
		tile_size,
		tile_size);
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Score
	ctx.font = "100px Arial";
	ctx.fillStyle = "#888";
	let score_string = score.toString();
	let dims = ctx.measureText(score_string);
	ctx.fillText(
		score_string,
		canvas.width/2 - dims.width/2,
		100);

	// Player
	var ps = (game_state != "Restart") ? player_sprite : poop_sprite;
	drawSprite(ps, player.px, player.py);
	// Target
	drawSprite(target_sprite, target.px, target.py);
	// Enemies
	enemies.forEach(function(enemy) {
		drawSprite(enemy_sprite, enemy.px, enemy.py);
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

