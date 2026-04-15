import React from 'react';
import styles from './styles.module.css';

interface StatusProps {
  children?: React.ReactNode;
}

export function Yes({ children }: StatusProps) {
  return (
    <span className={children ? styles.statusWrapper : undefined}>
      <span className={styles.yes}>✓</span>
      {children && <span className={styles.statusLabel}>{children}</span>}
    </span>
  );
}

export function No({ children }: StatusProps) {
  return (
    <span className={children ? styles.statusWrapper : undefined}>
      <span className={styles.no}>✕</span>
      {children && <span className={styles.statusLabel}>{children}</span>}
    </span>
  );
}

interface FeatureProps {
  children: React.ReactNode;
  desc: string;
}

export function Feature({ children, desc }: FeatureProps) {
  return (
    <span className={styles.feature}>
      <span className={styles.featureTitle}>{children}</span>
      <span className={styles.featureDesc}>{desc}</span>
    </span>
  );
}
