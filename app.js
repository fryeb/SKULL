const tile_size = 20;
var now, prev, fpsInterval, elapsed;
var score = 0;
var enemies, target, player;

var key = {
	left: false,
	up: false,
	right: false,
	down: false
};

var GameState = {
	LAUNCH: { name: "Launch", icon: drawSymbol('&#x25b6;') },
	PLAY: { name: "Play", icon: null },
	PAUSED: { name: "Paused", icon: drawSymbol('&#x23f8;') },
	RESTART: { name: "Restart", icon: drawSymbol('&#x1F595;') } // ('&#x1F504;') }
};

var game_state = GameState.LAUNCH;

var canvas = document.getElementById('c');
var ctx = c.getContext('2d');

var enemy_sprite = drawSymbol('&#x1f480;');
var player_sprite = drawSymbol('&#x1f603;');
var target_sprite = drawSymbol('&#x2b50;');
var poop_sprite = drawSymbol('&#x1f4a9;');

fpsInterval = 1000 / 60;
prev = Date.now();
reset();
play();

window.addEventListener('keydown', function(code) {
	if (code.key == 'w' || code.key == 'ArrowUp') key.up = true;
	else if (code.key == 'a' || code.key == 'ArrowLeft') key.left = true;
	else if (code.key == 's' || code.key == 'ArrowDown') key.down = true;
	else if (code.key == 'd' || code.key == 'ArrowRight') key.right = true;
	else if (code.key == "Escape") {
		if (game_state == GameState.PAUSED)
			game_state = GameState.PLAY;
		else if (game_state == GameState.PLAY)
			game_state = GameState.PAUSED;
	}
});

window.addEventListener('keyup', function(code) {
	if (code.key == 'w' || code.key == 'ArrowUp') key.up = false;
	else if (code.key == 'a' || code.key == 'ArrowLeft') key.left = false;
	else if (code.key == 's' || code.key == 'ArrowDown') key.down = false;
	else if (code.key == 'd' || code.key == 'ArrowRight') key.right = false;
});

canvas.addEventListener('click', function() {
	if (game_state == GameState.LAUNCH) {
		game_state = GameState.PLAY;
		reset();
	} else if (game_state == GameState.PLAY)
		game_state = GameState.PAUSED;
	else if (game_state == GameState.PAUSED) {
		game_state = GameState.PLAY;
	} else { // game_state == GameState.RESTART
		game_state = GameState.PLAY;
		reset();
	}
});

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

function reset() {
	score = 0;

	enemies = [{
		px: 400,
		py: 300,
		vx: -0.1,
		vy: 0.0
	}];
	player = {
		px: 200,
		py: 300
	};
	target = {
		px: canvas.height,
		py: 300
	};
}

function play() {
	requestID = requestAnimationFrame(play);
	now = Date.now();
	elapsed = now - prev;

	if (elapsed > fpsInterval) {
		// Prepare for next frame and adjust for fps interval not being a multiple of the browsers interval;
		prev = now - (elapsed % fpsInterval);

		if (game_state == GameState.PLAY)
			move();

		draw();
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Score
	ctx.font = "100px Arial";
	ctx.fillStyle = "#888";
	ctx.fillText(score.toString(), 350, 100);

	// Player
	var ps = (game_state != GameState.RESTART) ? player_sprite : poop_sprite;
	ctx.drawImage(ps, player.px, player.py, tile_size, tile_size);
	// Target
	ctx.drawImage(target_sprite, target.px, target.py, tile_size, tile_size);
	// Enemies
	enemies.forEach(function(enemy) {
		ctx.drawImage(enemy_sprite, enemy.px, enemy.py, tile_size, tile_size);
	});

	if (game_state != GameState.PLAY) {
		ctx.fillStyle = "#aaa";
		ctx.globalAlpha = 0.5;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 1.0;
		ctx.drawImage(game_state.icon, 350, 250, 100, 100);
	}
}

function move() {
	// Player
	if (key.left && !key.right && (player.px - 0.2 * elapsed) > 0)
		player.px -= 0.2 * elapsed;
	else if (key.right && (canvas.width - (player.px + 0.1 * elapsed) > tile_size)) // && !key.left
		player.px += 0.2 * elapsed;

	if (key.up && !key.down && (player.py - 0.2 * elapsed) > 0)
		player.py -= 0.2 * elapsed;
	else if (key.down && (canvas.height - (player.py + 0.1 * elapsed) > tile_size)) // && !key.up
		player.py += 0.2 * elapsed;

	// Enemies
	enemies.forEach(function(enemy) {
		// Move
		enemy.px += enemy.vx * elapsed;
		enemy.py += enemy.vy * elapsed;

		// Detect Walls
		if (canvas.width - enemy.px <= 2 * tile_size)
			enemy.vx *= -1;
		else if (enemy.px <= tile_size)
			enemy.vx *= -1;

		if (canvas.height - enemy.py <= 2 * tile_size)
			enemy.vy *= -1;
		else if (enemy.py <= tile_size)
			enemy.vy *= -1;

		// Detect Player
		if (Math.abs(enemy.px - player.px) <= tile_size && Math.abs(enemy.py - player.py) <= tile_size)
			game_state = GameState.RESTART;
	});

	// Target
	if (Math.abs(player.px - target.px) <= tile_size && Math.abs(player.py - target.py) <= tile_size) // Player has hit target
	{
		// Increment Score
		score += 1;

		// Move Target
		target.px = Math.floor((Math.random() * 700) + 50);
		target.py = Math.floor((Math.random() * 500) + 50);

		// Spawn a new Enemy
		var enemy = {};
		enemy.px = Math.floor((Math.random() * 700) + 50);
		enemy.py = Math.floor((Math.random() * 500) + 50);
		enemy.vx = (Math.random() < 0.5) ? 0.1 : -0.1;
		enemy.vy = (Math.random() < 0.5) ? 0.1 : -0.1;

		enemies.push(enemy);
	}
}
