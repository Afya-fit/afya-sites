import { PropsWithChildren } from 'react';
import type { SiteConfig } from '../types';
type Props = PropsWithChildren<{
    config: SiteConfig | undefined | null;
}>;
export declare function BrandThemeProvider({ config, children }: Props): import("react/jsx-runtime").JSX.Element;
export default BrandThemeProvider;
