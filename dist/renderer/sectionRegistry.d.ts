import type { SectionUnion } from './types';
export type RenderPolicy = 'always' | 'only_selected' | 'preview_only' | 'public_only';
type SectionRule = {
    renderPolicy: RenderPolicy;
    singleton?: boolean;
    defaultPosition?: 'top' | 'bottom';
    conflictsWith?: Array<SectionUnion['type']>;
    addable?: boolean;
};
export declare function getRule(type: SectionUnion['type']): SectionRule;
export declare function isAddable(type: SectionUnion['type']): boolean;
export declare function shouldRender(section: SectionUnion, index: number, ctx: {
    selectedIndex: number | null;
    isPreview: boolean;
}): boolean;
export declare function normalizeSections(sections: SectionUnion[]): SectionUnion[];
export {};
