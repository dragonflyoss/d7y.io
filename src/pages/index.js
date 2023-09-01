import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import GitHubButton from 'react-github-btn';
import BackgroundAnimate from './components/BackgroundAnimate';
import LottieCardBackground from './components/CardBackground';
import LottieContact from './components/Contact';
import LottieDistribution from './components/P2PFileDistribution';
import LottieIsolate from './components/IsolateAbnormalPeers';
import LottieNoninvasive from './components/Noninvasive';
import LottieConsistency from './components/Consistency';
import LottieEcosystem from './components/Ecosystem';
import LottieHostlevel from './components/PeerLevelControl';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const UserList = [
    {
      imgURL: 'img/user/alibaba-group.svg',
      alt: 'alibaba-group',
      herf: 'https://www.alibabagroup.com/',
      name: ' Alibaba Group',
    },
    {
      imgURL: 'img/user/alibaba-cloud.png',
      alt: 'alibaba-cloud',
      herf: 'https://us.alibabacloud.com/',
      name: 'Alibaba Cloud',
    },
    {
      imgURL: 'img/user/ant-group.png',
      alt: 'ant-group',
      herf: 'https://www.antgroup.com/',
      name: ' Ant Group',
    },
    {
      imgURL: 'img/user/amap.png',
      alt: 'amap',
      herf: 'https://mobile.amap.com/',
      name: 'Amap ',
    },
    {
      imgURL: 'img/user/baidu.svg',
      alt: 'baidu',
      herf: 'https://baidu.com/',
      name: 'Baidu',
    },
    {
      imgURL: 'img/user/bilibili.svg',
      alt: 'bilibili',
      herf: 'https://www.bilibili.com.cn/',
      name: 'Bilibili',
    },
    {
      imgURL: 'img/user/cainiao.svg',
      alt: 'cainiao',
      herf: 'https://global.cainiao.com/',
      name: 'Cai Niao',
    },
    {
      imgURL: 'img/user/china-unicom.svg',
      alt: 'china-unicom',
      herf: 'http://www.chinaunicom.com/',
      name: ' China Unicom',
    },
    {
      imgURL: 'img/user/cloudwise.jpg',
      alt: 'cloud wise',
      herf: 'https://www.cloudwise.cool/',
      name: ' Cloud Wise',
    },
    {
      imgURL: 'img/user/daocloud.png',
      alt: 'dao cloud',
      herf: 'https://www.daocloud.io/',
      name: 'Dao Cloud',
    },
    {
      imgURL: 'img/user/didi.png',
      alt: 'didi',
      herf: 'https://www.didiglobal.com/',
      name: ' DiDi',
    },
    {
      imgURL: 'img/user/douyin.png',
      alt: 'douyin',
      herf: 'https://www.douyin.com/',
      name: 'Douyin Group',
    },
    {
      imgURL: 'img/user/ele.png',
      alt: 'ele',
      herf: 'https://www.ele.me/',
      name: 'Eleme',
    },
    {
      imgURL: 'img/user/huawei.svg',
      alt: 'huawei',
      herf: 'https://www.huawei.com/cn/',
      name: 'Huawei',
    },
    {
      imgURL: 'img/user/huya.png',
      alt: 'huya',
      herf: 'https://www.huya.com/',
      name: ' Huya',
    },
    {
      imgURL: 'img/user/jd.png',
      alt: 'jd',
      herf: 'https://corporate.jd.com/',
      name: ' JD',
    },
    {
      imgURL: 'img/user/jfrog.svg',
      alt: 'jfrog',
      herf: 'https://jfrog.com/',
      name: ' JFrog',
    },
    {
      imgURL: 'img/user/kuaishou.svg',
      alt: 'kuaishou',
      herf: 'https://kuaishou.com/',
      name: ' Kuaishou',
    },
    {
      imgURL: 'img/user/lazada.svg',
      alt: 'lazada',
      herf: 'https://www.lazada.com/',
      name: ' Lazada',
    },
    {
      imgURL: 'img/user/meituan.svg',
      alt: 'mei tuan',
      herf: 'https://about.meituan.com/',
      name: ' Meituan',
    },
    {
      imgURL: 'img/user/neteasegames.jpeg',
      alt: 'netease games',
      herf: 'https://www.neteasegames.com/',
      name: ' Net Ease',
    },
    {
      imgURL: 'img/user/qunar.svg',
      alt: 'qunar',
      herf: 'https://www.qunar.com/',
      name: ' Qunar',
    },
    {
      imgURL: 'img/user/shopee.svg',
      alt: 'shopee',
      herf: 'https://shopee.com/',
      name: ' Shopee',
    },
    {
      imgURL: 'img/user/vivo.svg',
      alt: 'vivo',
      herf: 'https://www.vivo.com/',
      name: ' Vivo',
    },
    {
      imgURL: 'img/user/xiaomi.png',
      alt: 'xiaomi',
      herf: 'https://www.mi.com/global/',
      name: 'Xiaomi',
    },
    {
      imgURL: 'img/user/xperi.svg',
      alt: 'xperi',
      herf: 'https://xperi.com/',
      name: ' Xperi',
    },
    {
      imgURL: 'img/user/yahoo.svg',
      alt: 'yahoo',
      herf: 'https://www.yahoo.com/',
      name: ' Yahoo',
    },
  ];
  const PartnersList = [
    { imgURL: 'img/partners/ant-group.svg', alt: 'ant-group' },
    { imgURL: 'img/partners/alibaba-group.svg', alt: 'alibaba-group' },
    { imgURL: 'img/partners/douyin.png', alt: 'douyin' },
    { imgURL: 'img/partners/kuaishou.svg', alt: 'kuaishou' },
    { imgURL: 'img/partners/baidu.svg', alt: 'baidu' },
    { imgURL: 'img/partners/didi.svg', alt: 'didi' },
  ];
  const DevelopmentInfoList = [
    {
      cardTitle: <Translate> Dragonfly 1.x</Translate>,
      cardContent: (
        <Translate>
          In November 2017,the Dragonfly 1.x project was open sourced,and was selected and put into production use by
          many internet companies.
        </Translate>
      ),
    },
    {
      cardTitle: <Translate> CNCF SandBox</Translate>,
      cardContent: (
        <Translate>
          In October 2018,it entered the CNCF Sandbox, becoming the third project in China to enter the CNCF Sandbox.
        </Translate>
      ),
    },
    {
      cardTitle: <Translate> CNCF Incubating</Translate>,
      cardContent: (
        <Translate>
          In April 2020,the CNCF TOC voted to accept Dragonfly as an official entry into CNCF Incubating.
        </Translate>
      ),
    },
    {
      cardTitle: <Translate> Dragonfly 2</Translate>,
      cardContent: (
        <Translate>
          In April 2021, taking the advantages of Dragonfly 1 .x and making a lot of optimizations for known issues.
          Dragonfly 2 is open source.
        </Translate>
      ),
    },
  ];
  const FeaturesList = [
    {
      cardAnimationComp: <LottieDistribution />,
      cardTitle: <Translate>P2P File Distribution</Translate>,
      cardContent: (
        <Translate>
          Use P2P technology for file transfer, improve download efficiency, and save bandwidth across IDC.
        </Translate>
      ),
    },
    {
      cardAnimationComp: <LottieNoninvasive />,
      cardTitle: <Translate>Noninvasive</Translate>,
      cardContent: <Translate>Supports multiple containers for distributing images.</Translate>,
    },
    {
      cardAnimationComp: <LottieIsolate />,
      cardTitle: <Translate>Isolate Abnormal Peers</Translate>,
      cardContent: <Translate>Automatically isolate abnormal peers to improve download stability.</Translate>,
    },
  ];

  return (
    <Layout>
      <header className={clsx('hero', styles.heroHeader)}>
        <div className={styles.headerSkew}></div>
        <BackgroundAnimate />
        <div className={styles.headerWrapper}>
          <div className={styles.headerContainer}>
            <div className={styles.containerInfo}>
              <div className="hero_text">
                <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
                <div className={styles.tagline}>
                  <p className={clsx('hero__subtitle', styles.description)}>
                    <Translate>Provide</Translate>
                    <span className={styles.highlight}>
                      <Translate>efficient, stable, secure</Translate>
                    </span>
                    <Translate>
                      file distribution and image acceleration based on p2p technology to be the best practice and
                      standard solution in cloud native architectures. It is hosted by the Cloud Native Computing
                      Foundation
                    </Translate>
                    <span className={styles.highlight}>
                      <Translate>(CNCF)</Translate>
                    </span>
                    <Translate>as an Incubating Level Project.</Translate>
                  </p>
                </div>
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
            <div className={styles.heroLogowrapper}>
              <img className={styles.heroLogo} src={useBaseUrl('img/logo.png')} alt="Dragonfly Logo" />
            </div>
          </div>
          <div className={styles.partners}>
            <p className={styles.partnersTitle}>
              <Translate>Partners</Translate>
            </p>
            <div className={styles.partnersWrapper}>
              {PartnersList.map((img, index) => {
                return <img className={styles.companyLogo} key={index} src={useBaseUrl(img.imgURL)} alt={img.alt} />;
              })}
            </div>
          </div>
        </div>
      </header>
      <main className={clsx('row', styles.main)}>
        <div className={styles.mainSkew}></div>
        <div className={styles.mainWrapper}>
          <div className={styles.features}>
            <div className="row">
              <div className={styles.featuresTitleBox}>
                <h1 className={styles.mainModuleTitle}>
                  <span className={styles.titleLine}></span>
                  <Translate>Dragonfly</Translate>
                  <span className={styles.featuresTitleHighling}>
                    <Translate>Features</Translate>
                  </span>
                </h1>
              </div>
            </div>
            <div className={styles.buttonWrapper}>
              <Button href={useBaseUrl('docs/#features')}>
                <img
                  className={styles.viewFeaturesIcon}
                  src={useBaseUrl('img/icon/view-feature.svg')}
                  alt="button logo"
                />
                <Translate>View Features</Translate>
              </Button>
            </div>
            <div className={clsx('row')}>
              <p className={styles.mainModuleSubtitle}>
                <Translate>Dragonfly contains many features as a image and file distribution system.</Translate>
              </p>
            </div>
            <div className={clsx('row', styles.featuresCardWrapper)}>
              {FeaturesList.map((item, index) => {
                return (
                  <div className={styles.featuresCardInfo} key={index}>
                    {item.cardAnimationComp}
                    <p className={styles.featuresCardTitle}>{item.cardTitle}</p>
                    <p className={styles.featuresCardContent}>{item.cardContent}</p>
                  </div>
                );
              })}
            </div>
            <div className={clsx('row', styles.featuresCardWrapper)}>
              <div className={styles.featuresCardInfo}>
                <LottieConsistency />
                <p className={styles.featuresCardTitle}>
                  <Translate>Consistency</Translate>
                </p>
                <p className={styles.featuresCardContent}>
                  <Translate>
                    It can ensure that the same file is consistent in peer transmission, even if the user does not
                    perform final consistency check.
                  </Translate>
                </p>
              </div>

              <div className={styles.featuresCardInfo}>
                <LottieEcosystem />
                <p className={styles.featuresCardTitle}>
                  <Translate>Ecosystem</Translate>
                </p>
                <p className={styles.featuresCardContent}>
                  <a href="https://goharbor.io/" className={styles.textLink}>
                    Harbor
                  </a>
                  <Translate>
                    can distribute and preheat images based on the Dragonfly. if image acceleration based on
                  </Translate>
                  <a href="https://nydus.dev/" className={styles.textLink}>
                    Nydus
                  </a>
                  <Translate>or</Translate>
                  <a href=" https://github.com/containerd/stargz-snapshotter" className={styles.textLink}>
                    eStargz
                  </a>
                  <Translate>, Dragonfly can be used to distribute data.</Translate>
                </p>
              </div>
              <div className={styles.featuresCardInfo}>
                <LottieHostlevel />
                <p className={styles.featuresCardTitle}>
                  <Translate>Peer Level Control</Translate>
                </p>
                <p className={styles.featuresCardContent}>
                  <Translate>
                    In addition to the speed limit for the task like many other download tools, you can also limit the
                    speed and adjust the load limit for the peer level.
                  </Translate>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.development}>
            <div className="row">
              <h1 className={styles.mainModuleTitle}>
                <span className={styles.titleLine}></span>
                <span className={styles.featuresTitleHighling}>
                  {' '}
                  <Translate>Milestones</Translate>{' '}
                </span>
              </h1>
            </div>
            <div className={styles.buttonWrapper}>
              <Button href={useBaseUrl('docs/#evolution')}>
                🚀 <Translate> Learn More</Translate>
              </Button>
            </div>
            <div className={clsx('row')}>
              <p className={styles.mainModuleSubtitle}>
                <Translate>So far, dragonflies have experienced the following stages of development.</Translate>
              </p>
            </div>
            <div className={clsx('row', styles.developmentInfo)}>
              {DevelopmentInfoList.map((item, index) => {
                return (
                  <div className={styles.developmentCard} key={index}>
                    <LottieCardBackground />
                    <div className={styles.developmentBox}>
                      <div className={styles.developmentCardTitle}>{item.cardTitle}</div>
                      <div className={styles.developmentCardContent}>{item.cardContent}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <section className={styles.user}>
        <div className={styles.userWrapper}>
          <h1 className={styles.useTitle}>
            <Translate>Who Is</Translate>
            <div className={styles.userTitleHighling}>
              <Translate>Using</Translate>
            </div>
            <Translate>Dragonfly</Translate>
          </h1>
          <div className={clsx('row', styles.userImageBox)}>
            {UserList.map((item, index) => {
              return (
                <div className={styles.imageCard} key={index}>
                  <img className={styles.userImage} src={useBaseUrl(item.imgURL)} alt={item.alt} />
                  <div>
                    <a href={item.herf} target="_blank" className={styles.userLink}>
                      {item.name}
                    </a>
                  </div>
                </div>
              );
            })}
            <a href="mailto:dragonfly-discuss@googlegroups.com" className={styles.contactBox}>
              <LottieContact />
              <div className={styles.contact}>
                <Translate>CONTACT US</Translate>
              </div>
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const Button = ({ children, href }) => {
  return (
    <div>
      <Link className={styles.button} to={href}>
        {children}
      </Link>
    </div>
  );
};
