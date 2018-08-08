var now, prev, fpsInterval, elapsed;
var score = 0;
var enemies, target, player;

var key = {
	left: false,
	up: false,
	right: false,
	down: false
};

let game_state = "Launch";

fpsInterval = 1000 / 60;
prev = Date.now();
reset();
window.onready = play();

window.addEventListener('keydown', function(code) {
	if (code.key == 'w' || code.key == 'k' || code.key == 'ArrowUp')
		key.up = true;
	else if (code.key == 'a' || code.key == 'h' || code.key == 'ArrowLeft')
		key.left = true;
	else if (code.key == 's' || code.key == 'j' || code.key == 'ArrowDown')
		key.down = true;
	else if (code.key == 'd' || code.key == 'l' || code.key == 'ArrowRight')
		key.right = true;
	else if (code.key == "Escape") {
		if (game_state == "Paused")
			game_state = "Play";
		else if (game_state == "Play")
			game_state = "Paused";
	}
});

window.addEventListener('keyup', function(code) {
	if (code.key == 'w' || code.key == 'k' || code.key == 'ArrowUp')
		key.up = false;
	else if (code.key == 'a' || code.key == 'h' || code.key == 'ArrowLeft')
		key.left = false;
	else if (code.key == 's' || code.key ==  'j' || code.key == 'ArrowDown')
		key.down = false;
	else if (code.key == 'd' || code.key ==  'l' || code.key =='ArrowRight')
		key.right = false;
});

document.getElementById('c').addEventListener('click', function() {
	if (game_state == "Launch") {
		game_state = "Play";
		reset();
	} else if (game_state == "Play")
		game_state = "Paused";
	else if (game_state == "Paused") {
		game_state = "Play";
	} else { // game_state == "Restart"
		game_state = "Play";
		reset();
	}
});

function reset() {
	score = 0;

	enemies = [{
		px: 20,
		py: 15,
		vx: -20,
		vy: 0
	}];
	player = {
		px: 10,
		py: 15,
		vx: 0,
		vy: 0,
	};
	target = {
		px: 30,
		py: 15
	};
}

function play() {
	requestID = requestAnimationFrame(play);
	now = Date.now();
	elapsed = now - prev; // Time between frames (in milliseconds)

	if (elapsed > fpsInterval) {
		// Prepare for next frame and adjust for fps interval not being a multiple of the browsers interval;

		if (game_state == "Play")
			move();

		draw();
	}
	prev = now;
}

function clamp(x, min, max) {
	if (x < min)
		return min;
	else if (x > max)
		return max;
	else
		return x;
}

function move() {
	// Player
	if (key.left && !key.right)
		player.vx = -40;
	else if (key.right) // && !key.left
		player.vx = 40;
	else
		player.vx = 0;

	if (key.up && !key.down)
		player.vy = -40;
	else if (key.down) // && !key.up
		player.vy = 40;
	else
	 	player.vy = 0;
	
	let dt = elapsed / 1000; // Elapsed time in seconds
	player.px += player.vx * dt;
	player.px = clamp(player.px, 0, world_width - 1);
	player.py += player.vy * dt;
	player.py = clamp(player.py, 0, world_height - 1);

	// Enemies
	enemies.forEach(function(enemy) {
		// Move
		enemy.px += enemy.vx * dt;
		enemy.py += enemy.vy * dt;

		// Detect Walls
		if (world_width - enemy.px <= 2)
			enemy.vx *= -1;
		else if (enemy.px <= 0)
			enemy.vx *= -1;

		if (world_height - enemy.py <= 1)
			enemy.vy *= -1;
		else if (enemy.py <= 1)
			enemy.vy *= -1;

		// Detect Player
		if (Math.abs(enemy.px - player.px) <= 1 && Math.abs(enemy.py - player.py) <= 1)
			game_state = "Restart";
	});

	// Target
	if (Math.abs(player.px - target.px) <= 1 && Math.abs(player.py - target.py) <= 1) // Player has hit target
	{
		// Increment Score
		score += 1;

		// Move Target
		target.px = Math.floor((Math.random() * 30) + 2.5);
		target.py = Math.floor((Math.random() * 25) + 2.5);

		// Spawn a new Enemy
		var enemy = {};
		enemy.px = Math.floor((Math.random() * 30) + 2.5);
		enemy.py = Math.floor((Math.random() * 25) + 2.5);
		enemy.vx = (Math.random() < 0.5) ? 10 : -10;
		enemy.vy = (Math.random() < 0.5) ? 10 : -10;

		enemies.push(enemy);
	}
}
