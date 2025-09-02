export class Trail {
  constructor(width = 512, height = 512) {
    this.width = Math.max(1, Math.floor(width));
    this.height = Math.max(1, Math.floor(height));
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("2D context unavailable");
    this.ctx = ctx;

    // initial black background (we use white-on-black trail)
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.fadeAlpha = 0.02;
  }

  update(mouse) {
    // fade previous trail
    this.ctx.fillStyle = `rgba(0,0,0,${this.fadeAlpha})`;
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (!mouse || typeof mouse.x !== "number" || typeof mouse.y !== "number") return;

    const x = Math.max(0, Math.min(this.width, mouse.x));
    const y = Math.max(0, Math.min(this.height, mouse.y));
    const radius = Math.max(6, this.width * 0.12);

    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.7)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  getTextureCanvas() {
    return this.canvas;
  }

  // alias so other code that expects getTexture() works too
  getTexture() {
    return this.canvas;
  }
}
