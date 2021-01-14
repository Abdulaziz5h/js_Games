const canvas = document.getElementById('canvas');
const width = innerWidth > 500 ? innerWidth : 500;
const height = innerHeight > 500 ? innerHeight : 500;
const ctx = canvas.getContext('2d');

const speed = 10;

const streetHeight = 25;
const road_height = height /100 * 25;
let street = [];


canvas.width = width;
canvas.height = height;


class Rect{
  constructor(x, y, w, h, c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }
  drow(){
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  update(){
    this.x += speed;
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}


class Player {
  constructor(x, y, cImg){
    this.x = x;
    this.y = y;
    this.cImg = cImg;
  }
  drow(){
    const drawing = new Image();
    drawing.src = `./images/cars/${this.cImg}.png`;
    drawing.onload = function() {
      ctx.drawImage(drawing, this.x, this.y);
    }.bind(this);
  }
}

new Player(64, road_height + streetHeight + 32, 'main').drow();

function drowStreet(){
  new Rect(0, 0, width, road_height, "#ccc").drow();
  new Rect(0, height - road_height, width, road_height, "#ccc").drow();
  const streetWidth = width / 20;
  let color = 1;
  let InvColor = 0;
  for(let i = 0; i <= 21; i++){
    color = !color;
    InvColor = !InvColor;
    street.push(new Rect(streetWidth * i, road_height, streetWidth, streetHeight,`rgba(${255 * color}, ${255 * color}, ${255 * color})`));
    street.push(new Rect(streetWidth * i, height - road_height - streetHeight, streetWidth, streetHeight,`rgba(${255 * InvColor}, ${255 * InvColor}, ${255 * InvColor})`));
  }
  const roadtop = road_height + streetHeight;
  const roadHeight = height - (road_height  *2 + streetHeight*2);
  new Rect(0, roadtop, width, roadHeight, "#777").drow();
  for(let i = 0; i < 10; i++){
    new Rect(200 * i, roadtop + roadHeight/2 - 5, 100, 10,`rgba(255, 255, 255)`).drow();
    const index = Math.ceil(Math.random()*3);
    const revIndex = 3 + index;
    drawing = new Image();
    drawing.src = `./images/trees/tree_${index}.png`;
    drawing.onload = function() {
      ctx.drawImage(drawing, 140 * i, road_height - 64);
    };
    revDrawingImg = new Image();
    revDrawingImg.src = `./images/trees/tree_${revIndex}.png`;
    revDrawingImg.onload = function() {
      ctx.drawImage(revDrawingImg, 140 * i, road_height + roadHeight + 50);
    };
  }
}


function animate(){
  street.forEach(street => {
    street.drow();
  })

  requestAnimationFrame(animate);
}
drowStreet()
animate();