import BrowserOnly from '@docusaurus/BrowserOnly';
import OriginalRedoc from '@theme-original/Redoc';

/**
 * redocusaurus' Redoc component calls `useColorMode()` (via useSpecOptions)
 * unconditionally during render. On Docusaurus 3.10's static site generation
 * pass this throws "Hook useColorMode is called outside the <ColorModeProvider>"
 * because the redoc layout renders outside the classic theme's provider.
 *
 * Rendering the Redoc client-side only means `useColorMode` is never invoked
 * during SSG — the page shell (Layout) is still statically generated and the
 * spec renders once the browser hydrates.
 */
export default function Redoc(props) {
  return <BrowserOnly>{() => <OriginalRedoc {...props} />}</BrowserOnly>;
}