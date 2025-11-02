import React from 'react'
import { Icon as Iconify } from '@iconify/react'

export type IconName = string

export type IconProps = {
  name: IconName
  size?: number | string
  color?: string
  className?: string
  title?: string
}

// Map simple names to icon sets (lucide for actions, simple-icons for brands)
function resolveIcon(name: string): string {
  const n = name.toLowerCase()
  // explicit prefix support
  if (n.includes(':')) return n
  // brand guesses
  const brandList = [
    'instagram','tiktok','facebook','twitter','x','youtube','linkedin','snapchat','pinterest',
    'whatsapp','messenger','telegram','signal','yelp','spotify','apple','google','waze','discord'
  ]
  if (brandList.includes(n)) {
    // special cases
    if (n === 'x' || n === 'twitter') return 'simple-icons:x'
    if (n === 'apple') return 'simple-icons:apple'
    if (n === 'google') return 'simple-icons:google'
    return `simple-icons:${n}`
  }
  // action aliases
  const alias: Record<string,string> = {
    'phone':'lucide:phone',
    'email':'lucide:mail',
    'mail':'lucide:mail',
    'map':'lucide:map-pin',
    'maps':'lucide:map-pin',
    'directions':'lucide:route',
    'calendar':'lucide:calendar',
    'book':'lucide:calendar-check',
    'link':'lucide:link',
    'download':'lucide:download',
    'share':'lucide:share-2'
  }
  return alias[n] || `lucide:${n}`
}

export function Icon({ name, size = '1em', color = 'currentColor', className, title }: IconProps) {
  // Check if size contains CSS variables
  const hasVariables = typeof size === 'string' && size.includes('var(')
  
  if (hasVariables) {
    // Use a wrapper div with CSS variables for size
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          color: color,
        }}
        aria-hidden={title ? undefined : true}
      >
        <Iconify
          icon={resolveIcon(name)}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </span>
    )
  }
  
  // Normal case - direct size values
  return (
    <Iconify
      icon={resolveIcon(name)}
      style={{
        width: size,
        height: size,
        color: color,
      }}
      className={className}
      aria-hidden={title ? undefined : true}
    />
  )
}

export default Icon


