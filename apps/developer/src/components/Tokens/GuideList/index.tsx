import { FC } from 'react';
import styles from './GuideList.module.css';
export const GuidesList: FC = () => (
  <div className={styles.guides}>
    <h6>Need gas?</h6>
    <ul>
      <li>
        <a href="https://sepolia-faucet.pk910.de"> Sepolia faucet</a> to get
        sepETH
      </li>
      <li>
        <a href="https://faucet.chiadochain.net/"> Chiado faucet</a> to get test
        xDAI
      </li>
      <li>
        <a href="https://faucet.polygon.technology/">Amoy faucet</a> or{' '}
        <a href="https://www.alchemy.com/faucets/polygon-amoy">
          Alchecmy's faucet
        </a>{' '}
        to get test Matic
      </li>
    </ul>
  </div>
);
