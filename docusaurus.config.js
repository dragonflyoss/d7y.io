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
  clientModules: [require.resolve('./src/clientModules.js')],
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
          to: 'videos/sessions/en/2024-03-23',
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
          href: 'https://github.com/dragonflyoss/Dragonfly2',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          items: [
            {
              html: `
              <a href="/" class="footer-logo-wrapper">
                <img src="/img/logo.svg" alt="dragonfly" class="footer-logo" />
                <b>dragonfly</b>
              </a>
              `,
            },
          ],
        },
        {
          items: [
            {
              html: `
                <div class="footer-content">
                <a class="footer-items" href="/">
                  Home
                </a>
                <a class="footer-items" href="/docs/next/">
                  Docs
                </a>
                <a class="footer-items" href="/blog">
                  Blog
                </a>
                <a class="footer-items" href="/videos/sessions/en/2023-05-02">
                  Video
                </a>
              </div>`,
            },
          ],
        },
        {
          items: [
            {
              html: `
              <a href="https://twitter.com/dragonfly_oss" target="_blank">
               <img class="socials" src="/img/icon/footer-twitter.svg" alt="youtube icon" />
              </a>
               `,
            },
            {
              html: `
              <a href="https://github.com/dragonflyoss/Dragonfly2" target="_blank">
               <img class="socials" src="/img/icon/footer-github.svg" alt="github icon" />
              </a>
              `,
            },
            {
              html: `
              <a href="https://cloud-native.slack.com/messages/dragonfly/" target="_blank">
               <img class="socials" src="/img/icon/footer-slack.svg" alt="linkedin icon" />
              </a>
              `,
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
