import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  typedocSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'doc',
        id: 'getting-started',
      },
      items: [
        {
          type: 'category',
          label: 'Whitelabel',
          link: { type: 'doc', id: 'whitelabel' },
          items: ['kyc-guide-individuals', 'kyb-guide-corporates'],
        },
        'oauth',
        'private',
      ],
    },
    {
      type: 'doc',
      id: 'sandbox',
      label: 'Sandbox',
    },
    {
      type: 'doc',
      id: 'identifiers-and-formats',
      label: 'Conventions',
    },
    {
      type: 'category',
      label: 'Tokens',
      link: {
        type: 'doc',
        id: 'tokens',
      },
      items: ['token-integration', 'contracts-v2'],
    },
    {
      type: 'link',
      label: 'API Documentation',
      href: '/api',
    },
    {
      type: 'category',
      label: 'SDK',
      link: {
        type: 'doc',
        id: 'packages/sdk/index',
      },
      items: require('./docs/packages/sdk/typedoc-sidebar.cjs'),
    },
    {
      type: 'category',
      label: 'SDK React Provider',
      link: {
        type: 'doc',
        id: 'packages/sdk-react-provider/index',
      },
      items: require('./docs/packages/sdk-react-provider/typedoc-sidebar.cjs'),
    },
    {
      type: 'doc',
      id: 'MigrationGuide',
    },
  ],
};

export default sidebars;
