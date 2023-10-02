import { createFastGLContext } from "../dist/fastgl.js";

const fastgl = createFastGLContext(document.querySelector("#canvas"));

fastgl.lineWidth = 100;
fastgl.setStrokeColor(0, 0, 100, 1)
fastgl.beginPath();
fastgl.dot(0, 0, 0);
fastgl.stroke();

fastgl.setStrokeColor(0, 0, 0, 1)
fastgl.beginPath();
fastgl.dot(500, 0, 0);
fastgl.lineTo(100, 100, 0)
fastgl.stroke();
