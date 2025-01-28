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
      label: 'Welcome',
      link: {
        type: 'doc',
        id: 'index',
      },
      items: ['index'],
    },
    {
      type: 'link',
      label: 'API Documentation',
      href: '/docs/api',
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
