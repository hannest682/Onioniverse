import { Player } from './player';
import { Onion } from './onion';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawPlayer(player: Player) {
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(player.x - 10, player.y - 10, 20, 20);
  }

  drawOnion(onion: Onion) {
    if (!onion.collected) {
      this.ctx.fillStyle = 'yellow';
      this.ctx.fillRect(onion.x - 5, onion.y - 5, 10, 10);
    }
  }

  drawScore(score: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${score}`, 10, 30);
  }
}