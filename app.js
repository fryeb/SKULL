const tile_size = 20;
var canvas = document.getElementById('c');
var ctx = c.getContext('2d');

var drawSprites;

var sprite_count = 0;
function load_sprite(code)
{
  sprite_count++;
  var sprite = new Image();
  sprite.src = 'http://emojione.com/wp-content/uploads/assets/emojis/' + code + '.svg';
  sprite.onload = function ()
  {
    sprite_count--;
    if (sprite_count <= 0)
    {
      drawBack();
      requestAnimationFrame(drawFore);
    }
  }
  return sprite;
}

var scull_sprite = load_sprite('1f480');
var smiley_sprite = load_sprite('1f603');

function drawBack () {
  ctx.fillStyle = "#AAAAAA";
  ctx.fillRect(0,0, 800, 600);
}

function drawFore ()
{
  ctx.clearRect(tile_size, tile_size, 800 - (2 * tile_size), 600 - (2 * tile_size));
  ctx.drawImage(scull_sprite, 300, 300, tile_size, tile_size);
  ctx.drawImage(smiley_sprite, 400, 300, tile_size, tile_size);

}
