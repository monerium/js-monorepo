import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './Layout.module.css';

export default function Home({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      // title={`${siteConfig.title}`}
      description="Monerium issues onchain fiat – directly transferable between your wallet and bank accounts."
    >
      <main className={styles.main}>{children}</main>
    </Layout>
  );
}
