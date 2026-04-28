import { Player } from './player';
import { Onion } from './onion';

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  background: HTMLImageElement;
  playerImage: HTMLImageElement;
  onionImage: HTMLImageElement;
  chefImage: HTMLImageElement;
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
    this.playerImage.src = '/chef.png';
    this.onionImage = new Image();
    this.onionImage.src = '/onion_crying.png';
    this.chefImage = new Image();
    this.chefImage.src = '/pommes_chef.png';
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
      this.ctx.drawImage(this.playerImage, -iconSize, -iconSize, iconSize*2, iconSize*2);
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

  drawChef(chef: { x: number; y: number; currentSpeech: string | null }, cameraX: number, cameraY: number) {
    const drawX = (chef.x - cameraX) * this.backgroundZoom;
    const drawY = (chef.y - cameraY) * this.backgroundZoom;
    const iconWidth = 70;
    const iconHeight = 90;

    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0, 0, 0, 1)';
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetX = 4;
    this.ctx.shadowOffsetY = 4;

    if (this.chefImage.complete && this.chefImage.naturalWidth > 0) {
      this.ctx.drawImage(this.chefImage, drawX - iconWidth / 2, drawY - iconHeight / 2, iconWidth, iconHeight);
    } else {
      this.ctx.fillStyle = 'orange';
      this.ctx.fillRect(drawX - 15, drawY - 30, 30, 40);
    }

    this.ctx.restore();

    if (chef.currentSpeech) {
      const lines = chef.currentSpeech.split('\n');
      const bubbleWidth = 220;
      const bubbleHeight = 30 + lines.length * 24;
      const bubbleX = drawX - bubbleWidth / 2;
      const bubbleY = drawY - iconHeight / 2 - bubbleHeight - 10;

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 2;
      const radius = 12;
      this.ctx.beginPath();
      this.ctx.moveTo(bubbleX + radius, bubbleY);
      this.ctx.lineTo(bubbleX + bubbleWidth - radius, bubbleY);
      this.ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + radius);
      this.ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - radius);
      this.ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - radius, bubbleY + bubbleHeight);
      this.ctx.lineTo(bubbleX + radius, bubbleY + bubbleHeight);
      this.ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - radius);
      this.ctx.lineTo(bubbleX, bubbleY + radius);
      this.ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#222';
      this.ctx.font = '16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      lines.forEach((line, index) => {
        this.ctx.fillText(line, drawX, bubbleY + 20 + index * 24);
      });

      this.ctx.beginPath();
      this.ctx.moveTo(drawX - 10, bubbleY + bubbleHeight);
      this.ctx.lineTo(drawX + 5, bubbleY + bubbleHeight + 15);
      this.ctx.lineTo(drawX + 20, bubbleY + bubbleHeight);
      this.ctx.fill();
    }
  }

  drawScore(score: number) {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.fillText(`Onions collected: ${score}`, 10, 30);
  }

  drawPopup(message: string) {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Popup box
    const boxWidth = 500;
    const boxHeight = 200;
    const boxX = (this.canvas.width - boxWidth) / 2;
    const boxY = (this.canvas.height - boxHeight) / 2;

    this.ctx.fillStyle = 'rgba(50, 50, 50, 0.95)';
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Border
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Text
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    
    const lines = message.split('\n');
    const lineHeight = 30;
    const startY = boxY + 50;
    
    lines.forEach((line, index) => {
      this.ctx.fillText(line, this.canvas.width / 2, startY + index * lineHeight);
    });
  }
}
