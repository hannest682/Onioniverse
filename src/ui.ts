import { Player } from './player';
import { Onion } from './onion';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: HTMLImageElement;
  playerImage: HTMLImageElement;
  onionImage: HTMLImageElement;
  backgroundZoom = 1.25;

  constructor(canvas: HTMLCanvasElement, onBackgroundLoaded?: (width: number, height: number) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.background = new Image();
    this.background.onload = () => {
      onBackgroundLoaded?.(this.background.naturalWidth, this.background.naturalHeight);
    };
    this.background.src = '/map_less_contrast.png';

    this.playerImage = new Image();
    this.playerImage.src = '/player_filled.png';

    this.onionImage = new Image();
    this.onionImage.src = '/onion_crying.png';
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getCamera(playerX: number, playerY: number, worldWidth: number, worldHeight: number) {
    const viewWidth = this.canvas.width / this.backgroundZoom;
    const viewHeight = this.canvas.height / this.backgroundZoom;
    const cameraX = Math.max(0, Math.min(worldWidth - viewWidth, playerX - viewWidth / 2));
    const cameraY = Math.max(0, Math.min(worldHeight - viewHeight, playerY - viewHeight / 2));
    return { x: cameraX, y: cameraY };
  }

  drawBackground(cameraX: number, cameraY: number) {
    if (!this.background.complete) {
      return;
    }

    const bgWidth = this.background.naturalWidth * this.backgroundZoom;
    const bgHeight = this.background.naturalHeight * this.backgroundZoom;
    const drawX = -cameraX * this.backgroundZoom;
    const drawY = -cameraY * this.backgroundZoom;

    this.ctx.drawImage(this.background, drawX, drawY, bgWidth, bgHeight);
  }

  drawPlayer(player: Player, cameraX: number, cameraY: number) {
    const drawX = (player.x - cameraX) * this.backgroundZoom;
    const drawY = (player.y - cameraY) * this.backgroundZoom;
    const iconSize = 50;
    const wobble = player.moving ? Math.sin(performance.now() / 100) * 3 : 0;
    const tilt = player.moving ? Math.sin(performance.now() / 120) * 0.08 : 0;

    this.ctx.save();
    this.ctx.translate(drawX, drawY + wobble);
    this.ctx.rotate(tilt);

    // Add shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    this.ctx.shadowBlur = 4;
    this.ctx.shadowOffsetX = 4;
    this.ctx.shadowOffsetY = 0;

    if (this.playerImage.complete && this.playerImage.naturalWidth > 0) {
      this.ctx.drawImage(this.playerImage, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
    } else {
      this.ctx.fillStyle = 'blue';
      this.ctx.fillRect(-10, -10, 20, 20);
    }

    this.ctx.restore();
  }

  drawOnion(onion: Onion, cameraX: number, cameraY: number) {
    if (!onion.collected) {
      const drawX = (onion.x - cameraX) * this.backgroundZoom;
      const drawY = (onion.y - cameraY) * this.backgroundZoom;
      const iconSize = 50;

      this.ctx.save();

      // Add shadow
      this.ctx.shadowColor = 'rgba(0, 0, 0, 1)';
      this.ctx.shadowBlur = 3;
      this.ctx.shadowOffsetX = 4;
      this.ctx.shadowOffsetY = 4;

      if (this.onionImage.complete && this.onionImage.naturalWidth > 0) {
        this.ctx.drawImage(this.onionImage, drawX - iconSize / 2, drawY - iconSize / 2, iconSize, iconSize);
      } else {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(drawX - 5, drawY - 5, 10, 10);
      }

      this.ctx.restore();
    }
  }

  drawScore(score: number) {
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Onions collected: ${score}`, 10, 30);
  }
}
