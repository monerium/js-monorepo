import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Trust',
    Svg: require('@site/static/img/icon-home-micro-economies.svg').default,

    description: (
      <>
        As an authorized and regulated issuer of fiat stablecoins (aka e-money)
        and the infrastructure to mint and manage them, we must ensure that we
        always provide the services we promise.
      </>
    ),
  },

  {
    title: 'Transparency',
    Svg: require('@site/static/img/icon-home-financing.svg').default,

    description: (
      <>
        Transparency fosters trust, and we promote transparency at every
        opportunity.
      </>
    ),
  },
  {
    title: 'Autonomy',
    Svg: require('@site/static/img/icon-home-issuance-trade.svg').default,

    description: (
      <>
        As a web3 company, we give users the fullest possible control of their
        property and identity whenever we can.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {Svg ? <Svg className={styles.featureSvg} role="img" /> : null}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
