import { Player } from './player';
import { Onion } from './onion';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: HTMLImageElement;
  backgroundZoom = 3;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.background = new Image();
    this.background.src = '/map_less_contrast.png';
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground(playerX: number, playerY: number) {
    if (!this.background.complete) {
      return;
    }

    const bgWidth = this.canvas.width * this.backgroundZoom;
    const bgHeight = this.canvas.height * this.backgroundZoom;
    const maxOffsetX = bgWidth - this.canvas.width;
    const maxOffsetY = bgHeight - this.canvas.height;
    const offsetX = -Math.max(0, Math.min(maxOffsetX, (playerX / this.canvas.width) * maxOffsetX));
    const offsetY = -Math.max(0, Math.min(maxOffsetY, (playerY / this.canvas.height) * maxOffsetY));

    this.ctx.drawImage(this.background, offsetX, offsetY, bgWidth, bgHeight);
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
    this.ctx.fillText(`Onions collected: ${score}`, 10, 30);
  }
}
