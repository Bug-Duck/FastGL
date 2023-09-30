import { createFastGLContext } from "../dist/fastgl.js";

const fastgl = createFastGLContext(document.querySelector("#canvas"));

fastgl.dot(0, 0, 0, 100);
