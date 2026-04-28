export class Chef {
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  targetX: number;
  targetY: number;
  speed = 0.9;
  nextTargetTime = 0;
  nextSpeechTime = 0;
  speechEndTime = 0;
  currentSpeech: string | null = null;

  phrases = [
    'No potatoes no fries.',
    'Punk boys dont fry.',
    'If I were a potato, \nI`d marry a tomato.',
    'Gimme Gimme Gimme some \nFries After Midnight.',
    'Did columbus know about \nfries? I doubt it.',
  ];

  constructor(anchorX: number, anchorY: number) {
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.x = anchorX;
    this.y = anchorY;
    this.targetX = anchorX;
    this.targetY = anchorY;
    const now = performance.now();
    this.nextTargetTime = now + this.randomTargetDelay();
    this.nextSpeechTime = now + this.randomSpeechDelay();
  }

  update() {
    const now = performance.now();

    if (now >= this.nextTargetTime) {
      this.setRandomTarget();
      this.nextTargetTime = now + this.randomTargetDelay();
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance > 1) {
      const moveX = (dx / distance) * this.speed;
      const moveY = (dy / distance) * this.speed;
      this.x += moveX;
      this.y += moveY;
    }

    if (now >= this.nextSpeechTime) {
      this.currentSpeech = this.phrases[Math.floor(Math.random() * this.phrases.length)];
      this.speechEndTime = now + 3000 + Math.random() * 2000;
      this.nextSpeechTime = now + this.randomSpeechDelay();
    }

    if (this.currentSpeech && now >= this.speechEndTime) {
      this.currentSpeech = null;
    }
  }

  private randomTargetDelay() {
    return 100 + Math.random() * 100;
  }

  private randomSpeechDelay() {
    return 4000 + Math.random() * 3000;
  }

  private setRandomTarget() {
    const angle = Math.random() * Math.PI * 2;
    const radius = 40 + Math.random() * 30;
    this.targetX = this.anchorX + Math.cos(angle) * radius;
    this.targetY = this.anchorY + Math.sin(angle) * radius;
  }
}
