import { mat4 } from "gl-matrix";

import { Savior } from "./Savior";
import { compile } from "./compile";

export class FastGLRenderingContext {
  #element: HTMLCanvasElement;
  #webGLContext: WebGLRenderingContext | undefined;
  #projMat4: mat4 | null = null;
  #program: WebGLProgram | null | undefined;
  #memory: Savior[] = [];
  #trajectory: {
    type: "lineTo" | "moveTo";
    from?: [number, number, number]; // Only `lineTo` type.
    to?: [number, number, number]; // Only `lineTo` type.
  }[] = [];

  x = 0;
  y = 0;
  z = 0;
  lineWidth = 1;

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
        lineWidth: this.lineWidth,
      }),
    );
  }

  restore() {
    this.x = this.#memory[length - 1].x;
    this.y = this.#memory[length - 1].y;
    this.z = this.#memory[length - 1].z;
    this.lineWidth = this.#memory[length - 1].lineWidth;
  }

  dot(x: number, y: number, z: number, size?: number) {
    size = size ?? 1;
    compile(
      `
    attribute vec3 position;
    uniform mat4 proj;

    void main(void) {
      gl_Position = proj * vec4(position,1.0);
      gl_PointSize = ${size}.0;
    }
    `,
      this.#webGLContext!.VERTEX_SHADER,
      this.#webGLContext!,
      this.#program!,
    );
    compile(
      `
    void main(){
      gl_FragColor = vec4(0,0,1.0,1.0);
    }
    `,
      this.#webGLContext!.FRAGMENT_SHADER,
      this.#webGLContext!,
      this.#program!,
    );
    const position = this.#webGLContext!.getAttribLocation(
      this.#program!,
      "position",
    );
    const point = new Float32Array([x, y, z]);
    this.#webGLContext?.vertexAttrib3fv(position, point);
    const uniforproj = this.#webGLContext!.getUniformLocation(
      this.#program!,
      "proj",
    );
    this.#webGLContext!.uniformMatrix4fv(
      uniforproj,
      false,
      this.#projMat4 as Float32Array,
    );
    this.#webGLContext?.drawArrays(this.#webGLContext.POINTS, 0, 1);
    this.#program = this.#webGLContext?.createProgram();
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

  stroke() {
    for (const i of this.#trajectory) {
      if (i.type === "lineTo") {
        compile(
          `
          attribute vec3 position;
          uniform mat4 proj;
      
          void main(void) {
            gl_Position = proj * vec4(position,1.0);
            gl_PointSize = ${this.lineWidth}.0;
          }
          `,
          this.#webGLContext!.VERTEX_SHADER,
          this.#webGLContext!,
          this.#program!,
        );
        compile(
          `
          void main(){
            gl_FragColor = vec4(0,0,1.0,1.0);
          }
          `,
          this.#webGLContext!.FRAGMENT_SHADER,
          this.#webGLContext!,
          this.#program!,
        );
        const position = this.#webGLContext!.getAttribLocation(
          this.#program!,
          "position",
        );
        const lineData = new Float32Array([
          i.from![0],
          i.from![1],
          i.from![2],
          i.to![0],
          i.to![1],
          i.to![2],
        ]);
        const buffer = this.#webGLContext?.createBuffer();
        const uniforproj = this.#webGLContext!.getUniformLocation(
          this.#program!,
          "proj",
        );
        this.#webGLContext!.uniformMatrix4fv(
          uniforproj,
          false,
          this.#projMat4 as Float32Array,
        );
        this.#webGLContext!.bindBuffer(
          this.#webGLContext!.ARRAY_BUFFER,
          buffer!,
        );
        this.#webGLContext!.bufferData(
          this.#webGLContext!.ARRAY_BUFFER,
          lineData,
          this.#webGLContext!.STATIC_DRAW,
        );
        this.#webGLContext!.enableVertexAttribArray(position);
        this.#webGLContext!.vertexAttribPointer(
          position,
          3,
          this.#webGLContext!.FLOAT,
          false,
          0,
          0,
        );
        this.#webGLContext!.drawArrays(this.#webGLContext!.LINES, 0, 2);
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
}
