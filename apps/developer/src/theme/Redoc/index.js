import BrowserOnly from '@docusaurus/BrowserOnly';
import { ColorModeProvider } from '@docusaurus/theme-common/internal';
import OriginalRedoc from '@theme-original/Redoc';

/**
 * redocusaurus' Redoc component calls `useColorMode()` (via useSpecOptions)
 * during render, but its /api/ page renders outside the classic theme's
 * ColorModeProvider. On Docusaurus 3.10 this throws
 * "Hook useColorMode is called outside the <ColorModeProvider>":
 *  - during static site generation (the build), and
 *  - at runtime in the browser.
 *
 * Rendering client-side only skips the SSG crash, and wrapping in
 * ColorModeProvider gives the runtime render the provider it needs.
 */
export default function Redoc(props) {
  return (
    <BrowserOnly>
      {() => (
        <ColorModeProvider>
          <OriginalRedoc {...props} />
        </ColorModeProvider>
      )}
    </BrowserOnly>
  );
}