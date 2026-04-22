export class Player {
  x: number;
  y: number;
  speed: number = 4;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(keys: Set<string>) {
    if (keys.has('ArrowUp')) this.y -= this.speed;
    if (keys.has('ArrowDown')) this.y += this.speed;
    if (keys.has('ArrowLeft')) this.x -= this.speed;
    if (keys.has('ArrowRight')) this.x += this.speed;
  }
}