import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import GitHubButton from 'react-github-btn';
import YouTube from 'react-youtube';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const videoOpts = {
    height: '390',
    width: '640',
  };

  return (
    <Layout>
      <header className={clsx('hero', styles.heroBanner)}>
        <div className="container">
          <div className={styles.heroLogoWrapper}>
            <img className={styles.heroLogo} src={useBaseUrl('img/logo.png')} alt="Dragonfly Logo" />
          </div>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <GitHubButton
            href="https://github.com/dragonflyoss/Dragonfly2"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star dragonflyoss/Dragonfly2 on GitHub"
          >
            Star
          </GitHubButton>
          <p className={styles.tagline}>{siteConfig.tagline}</p>
        </div>
        <div className={styles.buttonWrapper}>
          <Button href={useBaseUrl('docs/')}>
            <Translate>Get Started</Translate>
          </Button>
          <Button href={useBaseUrl('docs/concepts/terminology/architecture')}>
            <Translate>Learn More</Translate>
          </Button>
        </div>
      </header>

      <BasicInfo />

      <main className={clsx('hero', styles.hero)}>
        <div className="container">
          <div className="row">
            <h1 className={styles.featureTitle}>
              <Translate>Why Dragonfly</Translate>
            </h1>
          </div>
          <div className={clsx('row', styles.introSubtitleWrapper)}>
            <p className={styles.featureSubtitle}>
              <Translate>
                Originally it was born to solve distribution at large scales, such as file distribution, log
                distribution, image distribution, etc. It solves the following problems:
              </Translate>
            </p>
          </div>
          <div className={clsx('row', styles.cardWrapper)}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>
                <img className={styles.icon} src={useBaseUrl('img/icon/transfer.svg')} alt="transfer" />
                <Translate>A P2P-Based File Distribution System</Translate>
              </p>
              <p className={styles.cardSubtitle}>
                <Translate>
                  By harnessing the power of P2P technology, it supports large-scale file distribution with improved
                  downloading speed and success rate and lower consumption of bandwidth, especially cross-IDC bandwidth.
                </Translate>
              </p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>
                <img className={styles.icon} src={useBaseUrl('img/icon/support.svg')} alt="support" />
                <Translate>Non-Invasive Support for Various Container Technologies</Translate>
              </p>
              <p className={styles.cardSubtitle}>
                <Translate>
                  Get it up and running with a few simple configurations, without touching the code of container
                  services.
                </Translate>
              </p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>
                <img className={styles.icon} src={useBaseUrl('img/icon/cdn.svg')} alt="cdn" />
                <Translate>Passive CDN</Translate>
              </p>
              <p className={styles.cardSubtitle}>
                <Translate>
                  It avoids downloading the same files repeatedly by taking advantage of the CDN technology.
                </Translate>
              </p>
            </div>
          </div>
          <div className={clsx('row', styles.cardWrapper)}>
            <div className={styles.card}>
              <p className={styles.cardTitle}>
                <img className={styles.icon} src={useBaseUrl('img/icon/traffic.svg')} alt="traffic" />
                <Translate>Host-Level Traffic Throttling</Translate>
              </p>
              <p className={styles.cardSubtitle}>
                <Translate>
                  Cap the total traffic of all jobs on a host at a certain level. Implement P2P files distribution with
                  various storage types through a unified back-to-source adapter layer.
                </Translate>
              </p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>
                <img className={styles.icon} src={useBaseUrl('img/icon/pressure.svg')} alt="pressure" />
                <Translate>Little Pressure upon File Sources</Translate>
              </p>
              <p className={styles.cardSubtitle}>
                <Translate>
                  Normally only cdn and dfdaemon download from the source, hence little pressure upon file sources.
                </Translate>
              </p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>
                <img className={styles.icon} src={useBaseUrl('img/icon/flexible.svg')} alt="flexible" />
                <Translate>Ecosystem</Translate>
              </p>
              <p className={styles.cardSubtitle}>
                <a href="https://goharbor.io/">Harbor</a>{' '}
                <Translate>
                  can distribute and preheat images based on the Dragonfly. Image acceleration based on
                </Translate>{' '}
                <a href="https://nydus.dev/">Nydus</a>{' '}
                <Translate>container runtime can use Dragonfly for data distribution.</Translate>
              </p>
            </div>
          </div>

          <div className={clsx('row', styles.introWrapper)}>
            <div className="row">
              <h1 className={styles.title}>
                <Translate>Intro To Dragonfly</Translate>
              </h1>
            </div>
            <div className={clsx('row', styles.introSubtitleWrapper)}>
              <p className={styles.subtitle}>
                <Translate>
                  Want to learn more about how dragonfly works ? Watch this video to explain the new evolution of
                  dragonfly. The content will also cover how to deploy dragonfly and practice examples.
                </Translate>
              </p>
            </div>
            <div className={clsx('row', styles.introVideoWrapper)}>
              <YouTube videoId="YJUZKUtqSFg" opts={videoOpts} />
              <YouTube videoId="ul2e-srHRr4" opts={videoOpts} />
            </div>
          </div>

          <div className={clsx('row', styles.userWrapper)}>
            <div className="row">
              <h1 className={styles.title}>
                <Translate>Who Is Using Dragonfly</Translate>
              </h1>
            </div>
            <div className={clsx('row', styles.userImageWrapper)}>
              <img className={styles.userImage} src={useBaseUrl('img/user/alibaba-group.svg')} alt="alibaba-group" />
              <img className={styles.userImage} src={useBaseUrl('img/user/alibaba-cloud.png')} alt="alibaba-cloud" />
              <img className={styles.userImage} src={useBaseUrl('img/user/ant-group.png')} alt="ant-group" />
              <img className={styles.userImage} src={useBaseUrl('img/user/amap.png')} alt="amap" />
              <img className={styles.userImage} src={useBaseUrl('img/user/yahoo.svg')} alt="yahoo" />
              <img className={styles.userImage} src={useBaseUrl('img/user/vivo.svg')} alt="vivo" />
            </div>
            <div className={clsx('row', styles.userImageWrapper)}>
              <img className={styles.userImage} src={useBaseUrl('img/user/lazada.svg')} alt="lazada" />
              <img className={styles.userImage} src={useBaseUrl('img/user/meituan.svg')} alt="meituan" />
              <img className={styles.userImage} src={useBaseUrl('img/user/jd.png')} alt="jd" />
              <img className={styles.userImage} src={useBaseUrl('img/user/qunar.svg')} alt="qunar" />
              <img className={styles.userImage} src={useBaseUrl('img/user/iflytek.png')} alt="iflytek" />
              <img className={styles.userImage} src={useBaseUrl('img/user/china-mobile.svg')} alt="china-mobile" />
            </div>
            <div className={clsx('row', styles.userImageWrapper)}>
              <img className={styles.userImage} src={useBaseUrl('img/user/xiaomi.png')} alt="xiaomi" />
              <img className={styles.userImage} src={useBaseUrl('img/user/cainiao.svg')} alt="cainiao" />
              <img className={styles.userImage} src={useBaseUrl('img/user/didi.png')} alt="didi" />
              <img className={styles.userImage} src={useBaseUrl('img/user/huya.png')} alt="huya" />
            </div>
          </div>
        </div>
      </main>

      <div className={clsx('hero', styles.hero)}>
        <div className="container text--center">
          <h3 className="hero__subtitle">
            <Translate>Dragonfly is a</Translate> <a href="https://cncf.io/">Cloud Native Computing Foundation</a>{' '}
            <Translate>incubating project</Translate>
          </h3>
          <div className={clsx('cncf-logo', styles.cncfLogo)} />
        </div>
      </div>
    </Layout>
  );
}

const Button = ({ children, href }) => {
  return (
    <div className="col col--2 margin-horiz--sm">
      <Link className="button button--outline button--primary button--lg" to={href}>
        {children}
      </Link>
    </div>
  );
};

const BasicInfo = () => (
  <div className={clsx('hero', styles.hero)}>
    <div className="container">
      <div className="row">
        <div className="col col--6">
          <div className="row">
            <h1 className={styles.basicTitle}>
              <img className={styles.questionIcon} src={useBaseUrl('img/icon/question.svg')} alt="question" />
              <Translate>What is Dragonfly ?</Translate>
            </h1>
          </div>

          <div className="row">
            <p className={clsx('hero__subtitle', styles.description)}>
              <Translate>
                Dragonfly is an open source intelligent P2P based image and file distribution system. Its goal is to
                tackle all distribution problems in cloud native scenarios. It is now hosted by the Cloud Native
                Computing Foundation (CNCF) as an Incubating Level Project. Originally it was born to solve all kinds of
                distribution at very large scales, such as application distribution, cache distribution, log
                distribution, image distribution, and so on.
              </Translate>
            </p>
          </div>

          <div className={clsx('row', styles.badgeWrapper)}>
            <GitHubButton
              href="https://github.com/dragonflyoss/Dragonfly2"
              data-icon="octicon-star"
              data-show-count="true"
              aria-label="Star dragonflyoss/Dragonfly2 on GitHub"
            >
              Star
            </GitHubButton>
            <GitHubButton
              href="https://github.com/dragonflyoss/Dragonfly2/subscription"
              data-icon="octicon-eye"
              data-show-count="true"
              aria-label="Watch dragonflyoss/Dragonfly2 on GitHub"
            >
              Watch
            </GitHubButton>
            <GitHubButton
              href="https://github.com/dragonflyoss/Dragonfly2/fork"
              data-icon="octicon-repo-forked"
              data-show-count="true"
              aria-label="Fork dragonflyoss/Dragonfly2 on GitHub"
            >
              Fork
            </GitHubButton>
          </div>
          <div className={clsx('row', styles.badgeWrapper)}>
            <a href="https://github.com/dragonflyoss/Dragonfly2/releases/">
              <img src="https://img.shields.io/github/release/dragonflyoss/Dragonfly2.svg" />
            </a>
            <a href="https://www.cncf.io/projects/">
              <img src="https://img.shields.io/badge/CNCF%20Status-Incubating-informational" />
            </a>
          </div>
        </div>

        <div className={clsx('col', styles.architectureImage)}>
          <img
            className={styles.architectureImage}
            src={useBaseUrl('img/landing/architecture.png')}
            align="right"
            alt="what is dragonfly"
          />
        </div>
      </div>
    </div>
  </div>
);
