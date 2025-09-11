"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSmallArt = isSmallArt;
function isSmallArt(width, height) {
    if (!width || !height)
        return true;
    const area = width * height;
    return area <= 200000; // heuristic ~ <= 447x447
}
