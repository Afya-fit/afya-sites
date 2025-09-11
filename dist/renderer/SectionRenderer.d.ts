import type { SectionUnion, SiteConfig } from './types';
type SectionRendererProps = {
    sections: SectionUnion[];
    data?: {
        site_config?: SiteConfig;
    } & Record<string, unknown>;
};
export default function SectionRenderer(props: SectionRendererProps): import("react/jsx-runtime").JSX.Element | null;
export {};
