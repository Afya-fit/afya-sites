import type { SectionUnion } from './types'

export type RenderPolicy = 'always' | 'only_selected' | 'preview_only' | 'public_only'

type SectionRule = {
  renderPolicy: RenderPolicy
  singleton?: boolean
  defaultPosition?: 'top' | 'bottom'
  conflictsWith?: Array<SectionUnion['type']>
  addable?: boolean
}

const rules: Record<SectionUnion['type'], SectionRule> = {
  hero: { renderPolicy: 'always', addable: true },
  content_block: { renderPolicy: 'always', addable: true },
  business_data: { renderPolicy: 'always', addable: true },
  special_offers: { renderPolicy: 'always', addable: false },
  links_page: { renderPolicy: 'only_selected', singleton: true, defaultPosition: 'top', addable: true },
  schedule: { renderPolicy: 'always', addable: true },
}

export function getRule(type: SectionUnion['type']): SectionRule {
  return rules[type] || { renderPolicy: 'always' }
}

export function isAddable(type: SectionUnion['type']): boolean {
  const r = getRule(type)
  return r.addable !== false
}

export function shouldRender(section: SectionUnion, index: number, ctx: { selectedIndex: number | null; isPreview: boolean }): boolean {
  const r = getRule(section.type)
  if (r.renderPolicy === 'only_selected') {
    return ctx.selectedIndex === index
  }
  if (r.renderPolicy === 'preview_only' && !ctx.isPreview) return false
  if (r.renderPolicy === 'public_only' && ctx.isPreview) return false
  return true
}

export function normalizeSections(sections: SectionUnion[]): SectionUnion[] {
  const seen = new Set<SectionUnion['type']>()
  const out: SectionUnion[] = []
  // Pass 1: collect non-links and ensure singletons only once
  for (const s of sections) {
    const rule = getRule(s.type)
    if (rule.singleton) {
      if (seen.has(s.type)) continue
      seen.add(s.type)
    }
    if (s.type !== 'links_page') out.push(s)
  }
  // Pass 2: add one links_page at top if present in original
  const hasLinks = sections.some(s => s.type === 'links_page')
  if (hasLinks) {
    const firstLinks = sections.find(s => s.type === 'links_page')!
    out.unshift(firstLinks)
  }
  return out
}


