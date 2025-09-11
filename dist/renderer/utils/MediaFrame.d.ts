import React from 'react';
type Ratio = '1x1' | '4x3' | '16x9' | '3x4' | '21x9' | '5x3';
type Fit = 'cover' | 'contain';
export type MediaFrameProps = {
    src: string;
    alt?: string;
    ratio?: Ratio;
    fit?: Fit;
    style?: React.CSSProperties;
    className?: string;
    background?: string;
    heightPx?: number;
};
export default function MediaFrame({ src, alt, ratio, fit, style, className, background, heightPx }: MediaFrameProps): import("react/jsx-runtime").JSX.Element;
export {};
