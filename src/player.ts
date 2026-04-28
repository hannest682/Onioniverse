export class Player {
  x: number;
  y: number;
  speed: number = 2;
  moving: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update(keys: Set<string>) {
    this.moving = false;

    if (keys.has('ArrowUp')) {
      this.y -= this.speed;
      this.moving = true;
    }
    if (keys.has('ArrowDown')) {
      this.y += this.speed;
      this.moving = true;
    }
    if (keys.has('ArrowLeft')) {
      this.x -= this.speed;
      this.moving = true;
    }
    if (keys.has('ArrowRight')) {
      this.x += this.speed;
      this.moving = true;
    }
  }
}