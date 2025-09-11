"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MediaFrame;
const jsx_runtime_1 = require("react/jsx-runtime");
function toAspect(r) {
    switch (r) {
        case '1x1':
            return '1 / 1';
        case '4x3':
            return '4 / 3';
        case '16x9':
            return '16 / 9';
        case '3x4':
            return '3 / 4';
        case '21x9':
            return '21 / 9';
        case '5x3':
            return '5 / 3';
        default:
            return undefined;
    }
}
function ratioToNumber(r) {
    switch (r) {
        case '1x1':
            return 1;
        case '4x3':
            return 4 / 3;
        case '16x9':
            return 16 / 9;
        case '3x4':
            return 3 / 4;
        case '21x9':
            return 21 / 9;
        case '5x3':
            return 5 / 3;
        default:
            return undefined;
    }
}
function MediaFrame({ src, alt, ratio = '16x9', fit = 'cover', style, className, background, heightPx }) {
    const aspect = toAspect(ratio);
    const ratioNum = ratioToNumber(ratio);
    const heightMode = typeof heightPx === 'number' && heightPx > 0 && ratioNum;
    const computedWidth = heightMode ? heightPx * ratioNum : undefined;
    return ((0, jsx_runtime_1.jsx)("div", { className: className, style: {
            position: 'relative',
            width: heightMode ? `${computedWidth}px` : '100%',
            aspectRatio: heightMode ? undefined : aspect,
            height: heightMode ? `${heightPx}px` : undefined,
            overflow: 'hidden',
            background: background ?? 'transparent',
            ...style,
        }, children: (0, jsx_runtime_1.jsx)("img", { src: src, alt: alt || '', loading: 'lazy', decoding: 'async', style: {
                width: '100%',
                height: '100%',
                objectFit: fit,
                display: 'block',
            } }) }));
}
