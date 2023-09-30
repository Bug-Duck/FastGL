export class Savior {
  x: number;
  y: number;
  z: number;
  lineWidth: number;
  constructor(options: { x: number; y: number; z: number; lineWidth: number }) {
    this.x = options.x;
    this.y = options.y;
    this.z = options.z;
    this.lineWidth = options.lineWidth;
  }
}
