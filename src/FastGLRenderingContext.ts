/* eslint-disable object-shorthand */
import { mat4 } from "gl-matrix";

import { Savior } from "./Savior";
import { compile } from "./compile";
import { dot } from "./dot";
import { lineStroke } from "./lineStroke";

export class FastGLRenderingContext {
  #element: HTMLCanvasElement;
  #webGLContext: WebGLRenderingContext | undefined;
  #program: WebGLProgram | null | undefined;
  #memory: Savior[] = [];
  #trajectory: {
    type: "lineTo" | "moveTo" | "dot";
    from?: [number, number, number]; // Only `lineTo` type.
    to?: [number, number, number]; // Only `lineTo` type.
    x?: number;
    y?: number;
    z?: number;
  }[] = [];
  #projMat4: mat4 | null = null;

  x = 0;
  y = 0;
  z = 0;
  lineWidth = 1;
  r = 0;
  g = 0;
  b = 0;
  a = 1;

  constructor(element: HTMLCanvasElement) {
    this.#element = element;
    if (this.#element.getContext) {
      this.#webGLContext = this.#element.getContext("webgl")!;
      this.#webGLContext?.viewport(
        0,
        0,
        this.#element.width,
        this.#element.height,
      );
      this.#projMat4 = mat4.create();
      this.#program = this.#webGLContext.createProgram();
      mat4.ortho(
        this.#projMat4,
        0,
        this.#element.width,
        this.#element.height,
        0,
        1.0,
        -1.0,
      );
    }
  }

  save() {
    this.#memory.push(
      new Savior({
        x: this.x,
        y: this.y,
        z: this.z,
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a,
        lineWidth: this.lineWidth,
      }),
    );
  }

  restore() {
    this.x = this.#memory[length - 1].x;
    this.y = this.#memory[length - 1].y;
    this.z = this.#memory[length - 1].z;
    this.r = this.#memory[length - 1].r;
    this.g = this.#memory[length - 1].g;
    this.b = this.#memory[length - 1].b;
    this.a = this.#memory[length - 1].a;
    this.lineWidth = this.#memory[length - 1].lineWidth;
  }

  dot(x: number, y: number, z: number) {
    this.#trajectory.push({
      type: "dot",
      x: x,
      y: y,
      z: z,
    });
  }

  lineTo(x: number, y: number, z: number) {
    this.#trajectory.push({
      type: "lineTo",
      from: [this.x, this.y, this.z],
      to: [x, y, z],
    });
    this.x = x;
    this.y = y;
    this.z = z;
  }

  beginPath() {
    this.#trajectory = [];
  }

  stroke() {
    for (const i of this.#trajectory) {
      if (i.type === "lineTo") {
        lineStroke(this, i.from!, i.to!);
        this.#program = this.#webGLContext?.createProgram();
      } else if (i.type === "dot") {
        dot(this, i.x!, i.y!, i.z!)
        this.#program = this.#webGLContext?.createProgram();
      }
    }
  }

  moveTo(x: number, y: number, z: number) {
    this.#trajectory.push({
      type: "moveTo",
      to: [x, y, z],
    });
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setStrokeColor(r: number, g: number, b: number, a: number) {
    this.r = r / 255;
    this.g = g / 255;
    this.b = b / 255;
    this.a = a;
  }

  setLineWidth(value: number) {
    this.lineWidth = value;
  }

  get program() {
    return this.#program;
  }

  get webgl() {
    return this.#webGLContext;
  }

  get proj() {
    return this.#projMat4;
  }
}
