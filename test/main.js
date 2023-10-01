import { createFastGLContext } from "../dist/fastgl.js";

const fastgl = createFastGLContext(document.querySelector("#canvas"));

let r = 0;
setInterval(() => {
  fastgl.setStrokeColor(r, r, r, 1);
  for (let i = 0; i <= 100; i += 20) {
    for (let n = 0; n <= 100; n += 20) {
      fastgl.dot(n + 10, i + 10, 0, 10);
    }
  }
  if (r !== 255) {
    r += 2;
  }
}, 1000 / 60);
