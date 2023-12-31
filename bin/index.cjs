"use strict";

const { resolve } = require("node:path");

const dynamicPath = resolve(__dirname, "..", "dist");

exports.dynamicPath = dynamicPath;
