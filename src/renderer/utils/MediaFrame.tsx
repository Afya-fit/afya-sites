import React from 'react'

type Ratio = '1x1' | '4x3' | '16x9' | '3x4' | '21x9' | '5x3'
type Fit = 'cover' | 'contain'

export type MediaFrameProps = {
  src: string
  alt?: string
  ratio?: Ratio
  fit?: Fit
  style?: React.CSSProperties
  className?: string
  background?: string
  heightPx?: number
}

function toAspect(r: Ratio | undefined): string | undefined {
  switch (r) {
    case '1x1':
      return '1 / 1'
    case '4x3':
      return '4 / 3'
    case '16x9':
      return '16 / 9'
    case '3x4':
      return '3 / 4'
    case '21x9':
      return '21 / 9'
    case '5x3':
      return '5 / 3'
    default:
      return undefined
  }
}

function ratioToNumber(r: Ratio | undefined): number | undefined {
  switch (r) {
    case '1x1':
      return 1
    case '4x3':
      return 4 / 3
    case '16x9':
      return 16 / 9
    case '3x4':
      return 3 / 4
    case '21x9':
      return 21 / 9
    case '5x3':
      return 5 / 3
    default:
      return undefined
  }
}

export default function MediaFrame({ src, alt, ratio = '16x9', fit = 'cover', style, className, background, heightPx }: MediaFrameProps) {
  const aspect = toAspect(ratio)
  const isFixedSize = typeof heightPx === 'number' && heightPx > 0;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: isFixedSize ? `${heightPx}px` : 'auto',
        maxHeight: isFixedSize ? `${heightPx}px` : undefined,
        aspectRatio: aspect,
        overflow: 'hidden',
        background: background ?? 'transparent',
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ''}
        loading='lazy'
        decoding='async'
        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
        }}
      />
    </div>
  )
}


