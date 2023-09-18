// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const codeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Dragonfly',
  tagline: 'An Open-source P2P-based Image and File Distribution System',
  url: 'https://d7y.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'dragonflyoss', // Usually your GitHub org/user name.
  projectName: 'd7y.io', // Usually your repo name.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      zh: {
        label: '简体中文',
      },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars/docs.js'),
          editUrl: function ({ locale, docPath }) {
            return `https://github.com/dragonflyoss/d7y.io/edit/main/docs/${docPath}`;
          },
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/dragonflyoss/d7y.io/tree/main/',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-TZ94NZD7TN',
          anonymizeIP: false,
        },
      },
    ],
  ],
  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'dragonfly, nydus, cncf, p2p, cloud-native, registry, containers, docker-image, accelerate-image',
      },
    ],
    algolia: {
      apiKey: '3ea338c2dd7e413e35e4075a48707fcb',
      appId: '50KU9JDRGZ',
      indexName: 'd7y.io',
      contextualSearch: true,
      algoliaOptions: {
        hitsPerPage: 10,
      },
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    navbar: {
      title: 'Dragonfly',
      logo: {
        alt: 'Dragonfly',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/next/',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left',
        },
        {
          to: 'videos/sessions/en/2023-05-02',
          activeBasePath: 'videos',
          label: 'Video',
          position: 'left',
        },
        {
          label: 'Community',
          position: 'left',
          href: 'https://github.com/dragonflyoss/Dragonfly2#community',
        },
        {
          label: 'Nydus',
          position: 'left',
          href: 'https://nydus.dev/',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },

        {
          href: 'https://github.com/dragonflyoss/Dragonfly2',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/next/',
            },
            {
              label: 'Setup',
              to: '/docs/next/setup/install/helm-charts',
            },
            {
              label: 'Reference',
              to: '/docs/next/reference/cli/dfdaemon',
            },
            {
              label: 'Contribute',
              to: '/docs/next/contribute/development-guide/development',
            },
            {
              label: 'Others',
              to: '/docs/next/others/faqs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Slack Channel',
              href: 'https://cloud-native.slack.com/messages/dragonfly/',
            },
            {
              html: '<div class="dingtalk"> <a class="dingtalk-label">DingTalk</a> <a class="dingtalk-img" aria-label="DingTalk"><img src="https://raw.githubusercontent.com/dragonflyoss/d7y.io/main/static/img/landing/dingtalk.jpg" alt="DingTalk Group"></div>',
            },
            {
              label: 'Discussion Group',
              href: 'mailto:dragonfly-discuss@googlegroups.com',
            },
            {
              label: 'Developer Group',
              href: 'mailto:dragonfly-developers@googlegroups.com',
            },
            {
              label: 'Github Discussions',
              href: 'https://github.com/dragonflyoss/Dragonfly2/discussions',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/dragonfly_oss',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/dragonflyoss/Dragonfly2',
            },
          ],
        },
      ],
      copyright: `
        <br />
        <strong>© Dragonfly Authors ${new Date().getFullYear()} | Documentation Distributed under <a href="https://creativecommons.org/licenses/by/4.0">CC-BY-4.0</a> </strong>
        <br />
        <br />
        © ${new Date().getFullYear()} The Linux Foundation. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our <a href="https://www.linuxfoundation.org/trademark-usage/"> Trademark Usage</a> page.
      `,
    },
    prism: {
      theme: codeTheme,
    },
  },
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'videos',
        path: 'videos',
        routeBasePath: 'videos',
        include: ['**/*.md'],
        sidebarPath: require.resolve('./sidebars/videos.js'),
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
      },
    ],
  ],
};

module.exports = config;
