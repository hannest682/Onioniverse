import { Player } from './player';
import { Map } from './map';
import { Onion } from './onion';
import { Renderer } from './ui';

export class Game {
  canvas: HTMLCanvasElement;
  player: Player;
  map: Map;
  onions: Onion[] = [];
  score: number = 0;
  renderer: Renderer;
  keys: Set<string> = new Set();

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.map = new Map(canvas.width, canvas.height);
    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.renderer = new Renderer(canvas);
    this.setupInput();
    this.spawnOnion();
    this.gameLoop();
  }

  setupInput() {
    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    // Touch controls for mobile
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      this.player.x = touch.clientX - rect.left;
      this.player.y = touch.clientY - rect.top;
    });
  }

  spawnOnion() {
    const x = Math.random() * this.map.width;
    const y = Math.random() * this.map.height;
    this.onions.push(new Onion(x, y));
  }

  update() {
    this.player.update(this.keys);
    // Keep player in bounds
    this.player.x = Math.max(0, Math.min(this.map.width, this.player.x));
    this.player.y = Math.max(0, Math.min(this.map.height, this.player.y));
    // Check collection
    this.onions.forEach(onion => {
      if (!onion.collected && Math.abs(this.player.x - onion.x) < 15 && Math.abs(this.player.y - onion.y) < 15) {
        onion.collected = true;
        this.score++;
        setTimeout(() => this.spawnOnion(), 1000); // Spawn new after 1s
      }
    });
  }

  render() {
    const cameraX = this.player.x - this.canvas.width / 2;
    const cameraY = this.player.y - this.canvas.height / 2;

    this.renderer.clear();
    this.renderer.drawBackground(cameraX, cameraY);
    this.renderer.drawPlayer();
    this.onions.forEach(onion => this.renderer.drawOnion(onion, cameraX, cameraY));
    this.renderer.drawScore(this.score);
  }

  gameLoop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.gameLoop);
  }
}