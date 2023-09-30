import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const babelConfig = {
  babelHelpers: "bundled",
  extensions: [".js", ".ts"],
  presets: ["@babel/preset-typescript"],
};

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
  {
    input: "./src/index.ts",
    output: {
      format: "esm",
      sourcemap: true,
      file: "./dist/fastgl.js",
    },
    plugins: [
      typescript(),
      nodeResolve({ browser: true }),
      commonjs(),
      babel(babelConfig),
    ],
    treeshake: true,
  },
  {
    input: "./src/index.ts",
    output: {
      format: "esm",
      sourcemap: true,
      file: "./dist/fastgl.min.js",
    },
    plugins: [typescript(), terser({ ecma: 2015 })],
    treeshake: true,
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/fastgl.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
];
