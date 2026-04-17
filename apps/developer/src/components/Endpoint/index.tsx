import React from 'react';
import styles from './styles.module.css';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type Props =
  | { method: Method; path: string; event?: never; href?: string }
  | { event: string; method?: never; path?: never; href?: string };

export function Endpoint({ method, path, event, href }: Props) {
  return (
    <div className={styles.wrapper}>
      {event ? (
        <>
          <span className={`${styles.method} ${styles.event}`}>EVENT</span>
          <span className={styles.path}>{event}</span>
        </>
      ) : (
        <>
          <span className={`${styles.method} ${styles[method.toLowerCase()]}`}>
            {method}
          </span>
          <span className={styles.path}>{path}</span>
        </>
      )}
      {href && (
        <a href={href} className={styles.apiRef} target="_blank" rel="noopener noreferrer">
          API Reference →
        </a>
      )}
    </div>
  );
}
