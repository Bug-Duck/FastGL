import { mat4 } from "gl-matrix";

export class FastGLRenderingContext {
  #element: HTMLCanvasElement;
  #webGLContext: WebGLRenderingContext | undefined;
  #projMat4: mat4 | null = null;
  #program: WebGLProgram | null | undefined;

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

  compile(code: string, shaderType: number) {
    const shader = this.#webGLContext!.createShader(shaderType);
    this.#webGLContext!.shaderSource(shader!, code);
    this.#webGLContext!.compileShader(shader!);
    this.#webGLContext!.attachShader(this.#program!, shader!);
    this.#webGLContext!.linkProgram(this.#program!);
    this.#webGLContext!.useProgram(this.#program!);
  }

  dot(x: number, y: number, z: number, size?: number) {
    size = size ?? 1;
    this.compile(
      `
    attribute vec3 position;
    uniform mat4 proj;

    void main(void) {
      gl_Position = vec4(position,1.0);
      gl_PointSize = ${size}.0;
    }
    `,
      this.#webGLContext!.VERTEX_SHADER,
    );
    this.compile(
      `
    void main(){
      gl_FragColor = vec4(0,0,1.0,1.0);
    }
    `, this.#webGLContext!.FRAGMENT_SHADER);
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
  }
}
