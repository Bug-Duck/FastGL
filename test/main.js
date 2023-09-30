import { createFastGLContext } from "../dist/fastgl.js";

const fastgl = createFastGLContext(document.querySelector("#canvas"));

fastgl.dot(200, 200, 0, 100);
// fastgl.dot(500, 0, 0, 100);
// fastgl.dot(0, 0, 0, 100);

fastgl.moveTo(400, 100, 0);
fastgl.lineTo(100, 100, 1);
fastgl.moveTo(500, 500, 0);
fastgl.lineTo(200, 300, 1);
fastgl.stroke();
