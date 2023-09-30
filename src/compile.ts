export function compile(
  code: string,
  shaderType: number,
  webGLContext: WebGLRenderingContext,
  program: WebGLProgram,
) {
  const shader = webGLContext.createShader(shaderType);
  webGLContext.shaderSource(shader!, code);
  webGLContext.compileShader(shader!);
  webGLContext.attachShader(program, shader!);
  webGLContext.linkProgram(program);
  webGLContext.useProgram(program);
}
