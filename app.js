// Constants
const enemy_speed = 10;
const player_speed = 20;
const NUM_PARTICLES = 5;
const PARTICLE_SPEED = 5;
const PARTICLE_ACCELERATION = 10;

// Globals
var score = 0;
var enemies, target, player;
var particles;

let game_state = "Launch";

var key = {
	left: false,
	up: false,
	right: false,
	down: false
};

// Input handling
window.addEventListener('keydown', function(code) {
	if (code.key == 'w' || code.key == 'k' || code.key == 'ArrowUp')
		key.up = true;
	if (code.key == 'a' || code.key == 'h' || code.key == 'ArrowLeft')
		key.left = true;
	if (code.key == 's' || code.key == 'j' || code.key == 'ArrowDown')
		key.down = true;
	if (code.key == 'd' || code.key == 'l' || code.key == 'ArrowRight')
		key.right = true;
	if (code.key == "Escape") {
		clickEscape();
	}
	if (code.key == "Space") {
		clickSpace();
	}
});

window.addEventListener('keyup', function(code) {
	if (code.key === 'w' || code.key === 'k' || code.key === 'ArrowUp')
		key.up = false;
	if (code.key === 'a' || code.key === 'h' || code.key === 'ArrowLeft')
		key.left = false;
	if (code.key === 's' || code.key ===  'j' || code.key === 'ArrowDown')
		key.down = false;
	if (code.key === 'd' || code.key ===  'l' || code.key ==='ArrowRight')
		key.right = false;
});

window.onresize = initializeGraphics;
initializeGraphics();

// What happens when the player clicks the canvas or presses space
function clickEscape () {
	if (game_state == "Launch") {
		game_state = "Play";
		reset();
	} else if (game_state == "Play") {
		game_state = "Paused";
	} else if (game_state == "Paused") {
		game_state = "Play";
	} else { // game_state == "Restart"
		game_state = "Play";
		reset();
	}
}

document.getElementById('c').addEventListener('click', clickEscape);

document.querySelectorAll('input[name="renderer"]').forEach(it => {
	it.onclick = initializeGraphics;
	return it;
});

function reset() {
	score = 0;

	enemies = [{
		x: 20,
		y: 15,
		vx: -enemy_speed,
		vy: 0
	}];
	player = {
		x: 10,
		y: 15
	};
	target = {
		x: 30,
		y: 15
	};
	particles = [];
}

reset();

// Compute next frame
function update(dt) {
	// Helper functions
	function did_hit(a, b) {
		let xd = (a.x-b.x);
		let yd = (a.y-b.y);
		return (xd*xd + yd*yd) < 1;
	}

	function clamp(x, min, max) {
		if (x < min)      return min;
		else if (x > max) return max;
		else              return x;
	}

	// Update Particles
	for (let particle of particles) {
		particle.x += particle.vx * dt;
		particle.y += particle.vy * dt;
		particle.vy += PARTICLE_ACCELERATION * dt;
	}

	{ // Update Player
		let dx = 0;
		let dy = 0;
		if (key.left)
			dx -= dt;
		if (key.right)
			dx += dt;
		if (key.up)
			dy -= dt;
		if (key.down)
			dy += dt;

		player.x = clamp(dx * player_speed + player.x, 0, WORLD_WIDTH - 1);
		player.y = clamp(dy * player_speed + player.y, 0, WORLD_HEIGHT - 1);
	}


	// Update Enemies
	for (let it of enemies) {
		// Move
		it.x += it.vx * dt;
		it.y += it.vy * dt;

		// Detect Walls
		if (WORLD_WIDTH - it.x <= 2 || it.x <= 0)
			it.vx *= -1;
		if (WORLD_HEIGHT - it.y <= 1 || it.y <= 0)
			it.vy *= -1;

		// Detect Player
		if (did_hit(player, it))
			game_state = "Restart";
	};

	// Target
	if (did_hit(player, target)) {
		// Increment Score
		score += 1;

		// Spawn Particles
		for (let i = 0; i < NUM_PARTICLES; i++) {
			let vx = 1 - 2*Math.random();
			let vy = -Math.random();
			let v = Math.sqrt(vx*vx + vy*vy);
			let particle = {};
			particle.x = target.x;
			particle.y = target.y;
			particle.vx = vx/v * PARTICLE_SPEED;
			particle.vy = vy/v * PARTICLE_SPEED;
			particles.push(particle);
		}

		// Move Target
		target.x = Math.floor((Math.random() * 30) + 2.5);
		target.y = Math.floor((Math.random() * 25) + 2.5);

		// Spawn a new Enemy
		{
			let enemy = {};
			enemy.x = Math.floor((Math.random() * 30) + 2.5);
			enemy.y = Math.floor((Math.random() * 25) + 2.5);
			// Velocity should have random direction, but constant magnitude
			let vx = 1 - 2*Math.random();
			let vy = 1 - 2*Math.random();
			let v = Math.sqrt(vx*vx + vy*vy);
			enemy.vx = vx/v * enemy_speed;
			enemy.vy = vy/v * enemy_speed;

			enemies.push(enemy);
		}
	}
}

// Main game loop
let prev = Date.now();
function play() {
	requestID = requestAnimationFrame(play);
	let now = Date.now();
	elapsed = now - prev; // Time between frames (in milliseconds)
	let dt = elapsed / 1000; // Elapsed time in seconds

	if (game_state == "Play")
		update(dt);

	draw();
	prev = now;
}
window.onready = play();
