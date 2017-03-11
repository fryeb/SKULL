const tile_size = 20;
var canvas = document.getElementById('c');
var ctx = c.getContext('2d');
var now, prev, fpsInterval, elapsed;

var key = {left: false, up: false, right: false, down: false};
var score = 0;

window.addEventListener('keydown', function (code) {
  if      (code.key == 'w' || code.key == 'ArrowUp') key.up = true;
  else if (code.key == 'a' || code.key == 'ArrowLeft') key.left = true;
  else if (code.key == 's' || code.key == 'ArrowDown') key.down = true;
  else if (code.key == 'd' || code.key == 'ArrowRight') key.right = true;
});

window.addEventListener('keyup', function (code) {
  if      (code.key == 'w' || code.key == 'ArrowUp') key.up = false;
  else if (code.key == 'a' || code.key == 'ArrowLeft') key.left = false;
  else if (code.key == 's' || code.key == 'ArrowDown') key.down = false;
  else if (code.key == 'd' || code.key == 'ArrowRight') key.right = false;
});

var sprite_count = 0;
function load_sprite(code)  {
  sprite_count++;
  var sprite = new Image();
  sprite.src = 'http://emojione.com/wp-content/uploads/assets/emojis/' + code + '.svg';
  sprite.onload = function ()
  {
    sprite_count--;
    if (sprite_count <= 0)
    {
      startAnimating();
    }
  }
  return sprite;
}

var scull_sprite = load_sprite('1f480');
var player_sprite = load_sprite('1f603');
var target_sprite = load_sprite('2b50');

function startAnimating ()  {
  fpsInterval = 1000/60;
  animate();
  prev = Date.now();
}

function animate() {
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - prev;

  if (elapsed > fpsInterval) {
    // Prepare for next frame and adjust for fps interval not being a multiple of the browsers interval;
    prev = now - (elapsed % fpsInterval);
    drawFore();
  }
}

var enemies = [{px: 200, py: 300, vx: 0.05, vy: 0.05}];
var player = {px: 300, py: 400};
var target = {px: 300, py: 300};

function drawEnemies () {
  enemies.forEach(function(enemy) {
    // Move Enemy
    enemy.px += enemy.vx * elapsed;
    enemy.py += enemy.vy * elapsed;

    // Detect & React to Collisions
    if (800 - enemy.px <= 2 * tile_size)
      enemy.vx *= -1;
    else if (enemy.px <= tile_size)
      enemy.vx *= -1;

    if (600 - enemy.py <= 2 * tile_size)
      enemy.vy *= -1;
    else if (enemy.py <= tile_size)
      enemy.vy *= -1;

    if (Math.abs(enemy.px - player.px) <= tile_size && Math.abs(enemy.py - player.py) <= tile_size)
    {
      if(!alert('Alert For your User!'))
        window.location.reload();
    }

    // Draw Enemy
    ctx.drawImage(scull_sprite, enemy.px, enemy.py, tile_size, tile_size);
  });
}

function drawPlayer() {
  if (key.left && !key.right && (player.px - 0.2 * elapsed) > tile_size)
    player.px -= 0.2 * elapsed;
  else if (key.right && (800 - (player.px + 0.1 * elapsed) > 2 * tile_size))
    player.px += 0.2 * elapsed;

  if (key.up && !key.down && (player.py - 0.2 * elapsed) > tile_size)
    player.py -= 0.2 * elapsed;
  else if (key.down && (600 - (player.py + 0.1 * elapsed) > 2 * tile_size)) // && !key.up
    player.py += 0.2 * elapsed;

  ctx.drawImage(player_sprite, player.px, player.py, tile_size, tile_size);
}

function drawTarget () {
  ctx.drawImage(target_sprite, target.px, target.py, tile_size, tile_size);
  if (Math.abs(player.px - target.px) <= tile_size && Math.abs(player.py - target.py) <= tile_size) // Player has hit target
  {
    score += 1;
    document.getElementById("score").innerHTML = score;
    target.px = Math.floor((Math.random() * 700) + 50);
    target.py = Math.floor((Math.random() * 500) + 50);

    var enemy = {};
    enemy.px = Math.floor((Math.random() * 700) + 50);
    enemy.py = Math.floor((Math.random() * 500) + 50);
    enemy.vx = (Math.random() < 0.5) ? 0.1 : -0.1;
    enemy.vy = (Math.random() < 0.5) ? 0.1 : -0.1;

    enemies.push(enemy);
  }
}

function drawFore ()  {
  // Draw Borders
  ctx.fillStyle = "#AAAAAA";
  ctx.fillRect(0,0, 800, 600);
  ctx.clearRect(tile_size, tile_size, 800 - (2 * tile_size), 600 - (2 * tile_size));
  drawEnemies();
  drawPlayer();
  drawTarget();
}
