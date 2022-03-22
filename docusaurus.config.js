// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

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
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
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
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        apiKey: '3ea338c2dd7e413e35e4075a48707fcb',
        appId: '50KU9JDRGZ',
        indexName: 'd7y.io',
        contextualSearch: true,
        algoliaOptions: {
          hitsPerPage: 10,
        },
      },
      navbar: {
        title: 'Dragonfly',
        logo: {
          alt: 'Dragonfly',
          src: 'img/logo.svg',
        },
        items: [
          {
            to: 'docs/',
            label: 'Documentation',
            position: 'right',
          },
          {
            to: 'blog',
            label: 'Blog',
            position: 'right',
          },
          {
            label: 'Community',
            position: 'right',
            href: 'https://github.com/dragonflyoss/Dragonfly2#community',
          },
          {
            type: 'localeDropdown',
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
                to: '/docs/',
              },
              {
                label: 'Setup',
                to: '/docs/setup/install/kubernetes',
              },
              {
                label: 'Reference',
                to: '/docs/reference/cli/cdn',
              },
              {
                label: 'Contribute',
                to: '/docs/contribute/development-guide/development',
              },
              {
                label: 'Others',
                to: '/docs/others/faqs',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                html: '<div class="dingtalk"> <a class="dingtalk-label">DingTalk</a> <a class="dingtalk-img" aria-label="DingTalk"><img src="https://raw.githubusercontent.com/dragonflyoss/d7y.io/main/static/img/landing/dingtalk.jpg" alt="DingTalk Group"></div>',
              },
              {
                label: 'Discussions',
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
        copyright: `Copyright © ${new Date().getFullYear()} Dragonfly Authors.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
