'use client';

import { ThemeModeToggle } from './ThemeModeToggle';

/* ThemeModeToggle wrapper */
const ThemeModeToggleWrapper = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '12px',
        zIndex: 99999,
      }}
    >
      <ThemeModeToggle />
    </div>
  );
};

ThemeModeToggleWrapper.displayName = 'ThemeModeToggleWrapper';

export default ThemeModeToggleWrapper;
