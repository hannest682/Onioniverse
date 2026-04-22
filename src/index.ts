import { Game } from './game';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
new Game(canvas);