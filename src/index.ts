import { FastGLRenderingContext } from "./FastGLRenderingContext";

export const createFastGLContext = (element: HTMLCanvasElement) =>
  new FastGLRenderingContext(element);
