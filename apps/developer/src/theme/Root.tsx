import { ColorModeProvider } from '@docusaurus/theme-common/internal';
import type { ReactNode } from 'react';

/**
 * redocusaurus' /api/ spec pages render outside the classic theme's
 * ColorModeProvider, which makes `useColorMode` throw during static
 * generation on Docusaurus 3.10+. Wrapping the site in a provider keeps
 * the static build working.
 */
export default function Root({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return <ColorModeProvider>{children}</ColorModeProvider>;
}