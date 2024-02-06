import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import BackgroundAnimate from './components/BackgroundAnimate';
import LottieContact from './components/Contact';

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
      imgURL: 'img/user/cloudwise.svg',
      alt: 'cloud wise',
      herf: 'https://www.cloudwise.cool/',
      name: ' Cloud Wise',
    },
    {
      imgURL: 'img/user/daocloud.svg',
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
      imgURL: 'img/user/neteasegames.png',
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

  const FeaturesList = [
    {
      cardTitle: <Translate>P2P technology</Translate>,
      cardContent: (
        <>
          <Translate>Based on P2P technology, use the idle bandwidth of Peer to</Translate>
          <span className={styles.featuresHighlight}>
            <Translate>improve download speed.</Translate>
          </span>
        </>
      ),
    },
    {
      cardTitle: <Translate>Non-invasive</Translate>,
      cardContent: (
        <>
          <Translate>Non-intrusive support for</Translate>
          <span className={styles.featuresHighlight}>
            <Translate>multiple container runtimes, download tools, AI infrastructure,</Translate>
          </span>
          <Translate>etc.</Translate>
        </>
      ),
    },
    {
      cardTitle: <Translate>Peer configuration</Translate>,
      cardContent: (
        <>
          <span className={styles.featuresInitialHighlight}>
            <Translate>Load limit, concurrent limit, traffic limit,</Translate>
          </span>
          <Translate>etc. can be configured.</Translate>
        </>
      ),
    },
    {
      cardTitle: <Translate>Consistency</Translate>,
      cardContent: (
        <>
          <Translate>Ensures downloaded files are</Translate>
          <span className={styles.featuresHighlight}>
            <Translate>consistent</Translate>
          </span>
          <Translate>even if the user does not check for consistency.</Translate>
        </>
      ),
    },
    {
      cardTitle: <Translate>Exception isolation</Translate>,
      cardContent: (
        <>
          <span className={styles.featuresInitialHighlight}>
            <Translate>Isolate exceptions</Translate>
          </span>
          <Translate>based on Service level, Peer level and Task level to improve download stability.</Translate>
        </>
      ),
    },
    {
      cardTitle: <Translate>Ecosystem</Translate>,
      cardContent: (
        <>
          <Translate>Provides simple integration with</Translate>
          <span className={styles.featuresHighlight}>
            <Translate>AI infrastructure, container runtimes, container registry, download tools,</Translate>
          </span>
          <Translate> etc.</Translate>
        </>
      ),
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
              <div className={styles.heroContiner}>
                <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
                <div className={styles.tagline}>
                  <p className={clsx('hero__subtitle', styles.description)}>
                    <Translate>Provide</Translate>
                    <span className={styles.highlight}>
                      <Translate>efficient, stable, secure</Translate>
                    </span>
                    <Translate>
                      file distribution and image acceleration based on p2p technology to be the best practice and
                      standard solution in cloud native architectures. It is hosted by the
                    </Translate>
                    <span className={styles.highlight}>
                      <Translate>Cloud Native Computing Foundation(CNCF)</Translate>
                    </span>
                    <Translate>as an</Translate>
                    <span className={styles.highlight}>
                      <Translate>Incubating Level Project.</Translate>
                    </span>
                  </p>
                </div>
                <div className={styles.headerButton}>
                  <Link className={styles.getStartedButton} to="docs/next/">
                    GET STARTED
                  </Link>
                  <Link className={styles.githubButton} to="https://github.com/dragonflyoss/Dragonfly2">
                    <img className={styles.githubIcon} src={useBaseUrl('img/icon/github.svg')} alt="button logo" />
                    <span>GITHUB</span>
                  </Link>
                </div>
              </div>
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
      <div className={styles.waveSkew}></div>
      <main className={clsx('row', styles.main)}>
        <div className={styles.mainSkew}></div>
        <div className={styles.mainWrapper}>
          <img className={styles.featuresImageBackground} src={useBaseUrl('img/icon/features-background.svg')} />
          <div className="row">
            <div className={styles.featuresTitleBox}>
              <h1 className={styles.mainModuleTitle}>
                <span className={styles.featuresTitleHighling}>
                  <Translate>Features</Translate>
                </span>
              </h1>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            <Button href={useBaseUrl('docs/next/#features')}>
              <img
                className={styles.viewFeaturesIcon}
                src={useBaseUrl('img/icon/view-feature.svg')}
                alt="button logo"
              />
              <Translate>View Features</Translate>
            </Button>
          </div>
          <div className={clsx('row')}>
            <p className={styles.communitySubtitle}>
              <Translate>Dragonfly contains many features as a image and file distribution system.</Translate>
            </p>
          </div>
          <div className={clsx('row', styles.featuresCardWrapper)}>
            {FeaturesList.map((item, index) => {
              return (
                <div className={clsx('col col--3', styles.featuresInfoWrapper)} key={index}>
                  <div className={styles.featuresCardTitle}>{item.cardTitle}</div>
                  <span className={styles.featuresCardContent}>{item.cardContent}</span>
                </div>
              );
            })}
            <img className={styles.featuresBackground} src={useBaseUrl('img/features.svg')}></img>
          </div>
        </div>
      </main>
      <section className={clsx('row', styles.development)}>
        <div className={styles.developmentSkew}></div>
        <div className={styles.developmentContainer}>
          <div className="row">
            <h1 className={styles.mainModuleTitle}>
              <span className={styles.userTitleHighling}>
                <Translate>Milestones</Translate>
              </span>
            </h1>
          </div>
          <div className={styles.buttonWrapper}>
            <Button href={useBaseUrl('docs/next/#milestones')}>
              <img
                className={styles.viewFeaturesIcon}
                src={useBaseUrl('img/icon/development-learn-more.svg')}
                alt="button logo"
              />
              <Translate>Learn More</Translate>
            </Button>
          </div>
          <div className={clsx('row')}>
            <p className={styles.communitySubtitle}>
              <Translate>So far, dragonflies have experienced the following stages of development.</Translate>
            </p>
          </div>
          <div className={clsx('row', styles.developmentInfo)}>
            <img className={styles.developmentInfoImage} src={useBaseUrl('img/icon/development-milestone.svg')} />
            <div className={styles.developmentCardWrapper}>
              <div className={styles.developmentCard}>
                <div className={styles.developmentBox}>
                  <div className={styles.developmentTitleWrapper}>
                    <img
                      className={styles.developmentCardImage}
                      src={useBaseUrl('img/icon/development-dragonfly1.svg')}
                    />
                    <div className={styles.developmentCardTitle}>Dragonfly 1.x</div>
                  </div>
                  <div className={styles.developmentCardContent}>
                    <Translate>v1.x was open source and used in production environments by many companies.</Translate>
                  </div>
                </div>
                <div className={styles.developmentCardYear}>
                  <span className={styles.developmentCardMoon}>
                    <Translate>November</Translate>
                  </span>
                  <h2>2017</h2>
                </div>
              </div>
              <div className={styles.developmentLineWarapper}>
                <div className={styles.developmentLine}></div>
                <div className={styles.developmentCircle}>1</div>
                <div className={styles.developmentLine}></div>
              </div>
            </div>
            <div className={styles.developmentCardWrapper}>
              <div className={styles.developmentCards}>
                <div className={styles.developmentBox}>
                  <div className={styles.developmentTitleWrapper}>
                    <img className={styles.developmentCardImage} src={useBaseUrl('img/icon/development-san-box.svg')} />
                    <div className={styles.developmentCardTitle}>
                      <Translate> CNCF Sandbox</Translate>
                    </div>
                  </div>
                  <div className={styles.developmentCardContent}>
                    <Translate>Dragonfly joined the CNCF as a sandbox project.</Translate>
                  </div>
                </div>
                <div className={styles.developmentCardYear}>
                  <span className={styles.developmentCardMoon}>
                    <Translate>October</Translate>
                  </span>
                  <h2>2018</h2>
                </div>
              </div>
              <div className={styles.developmentLineWarapper}>
                <div className={styles.developmentLine}></div>
                <div className={styles.developmentCircle}>2</div>
                <div className={styles.developmentLine}></div>
              </div>
            </div>
            <div className={styles.developmentCardWrapper}>
              <div className={styles.developmentCard}>
                <div className={styles.developmentBox}>
                  <div className={styles.developmentTitleWrapper}>
                    <img
                      className={styles.developmentCardImage}
                      src={useBaseUrl('img/icon/development-incubating.svg')}
                    />
                    <div className={styles.developmentCardTitle}>
                      <Translate>CNCF Incubating</Translate>
                    </div>
                  </div>
                  <div className={styles.developmentCardContent}>
                    <Translate>
                      The CNCF Technical Oversight Committee (TOC) voted to accept Dragonfly as an Incubating Project.
                    </Translate>
                  </div>
                </div>
                <div className={styles.developmentCardYear}>
                  <span className={styles.developmentCardMoon}>
                    <Translate>April</Translate>
                  </span>
                  <h2>2020</h2>
                </div>
              </div>
              <div className={styles.developmentLineWarapper}>
                <div className={styles.developmentLine}></div>
                <div className={styles.developmentCircle}>3</div>
                <div className={styles.developmentLine}></div>
              </div>
            </div>
            <div className={styles.developmentCardWrapper}>
              <div className={styles.developmentCards}>
                <div className={styles.developmentBox}>
                  <div className={styles.developmentTitleWrapper}>
                    <img
                      className={styles.developmentCardImage}
                      src={useBaseUrl('img/icon/development-dragonfly2.svg')}
                    />
                    <div className={styles.developmentCardTitle}>
                      <Translate> Dragonfly 2</Translate>
                    </div>
                  </div>
                  <div className={styles.developmentCardContent}>
                    <Translate>v2.0 was released after architectural optimization and code refactoring.</Translate>
                  </div>
                </div>
                <div className={styles.developmentCardYear}>
                  <span className={styles.developmentCardMoon}>
                    <Translate>April</Translate>
                  </span>
                  <h2>2021</h2>
                </div>
              </div>
              <div className={styles.developmentLineWarapper}>
                <div className={styles.developmentLine}></div>
                <div className={styles.developmentCircle}>4</div>
                <div className={styles.developmentLine}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <div className={styles.userSkew}></div>
        <div className={styles.communitySkew}></div>
        <section className={clsx('row', styles.user)}>
          <div className={styles.userWrapper}>
            <h1 className={styles.useTitle}>
              <Translate>Who is</Translate>
              <div className={styles.userTitleHighling}>
                <Translate>Using</Translate>
              </div>
              <Translate>Dragonfly</Translate>
            </h1>
            <div className={styles.userCase}>
              <dl className={styles.userShowCase}>
                <div className={styles.showCaseWrapper}>
                  <h1 className={styles.showCaseContent}>
                    <Translate>Efficiency</Translate>
                  </h1>
                </div>
                <div className={styles.showCaseWrapper}>
                  <h1 className={styles.showCaseContent}>
                    <Translate>Stability</Translate>
                  </h1>
                </div>
                <div className={styles.showCaseWrapper}>
                  <h1 className={styles.showCaseContent}>
                    <Translate>Safety</Translate>
                  </h1>
                </div>
              </dl>
            </div>
            <div className={clsx('row', styles.userImageBox)}>
              {UserList.map((item, index) => {
                return (
                  <div className={styles.imageCard} key={index}>
                    <a href={item.herf} target="_blank" className={styles.userLink}>
                      <img className={styles.userImage} src={useBaseUrl(item.imgURL)} alt={item.alt} />
                      <div className={styles.userName}>{item.name}</div>
                    </a>
                  </div>
                );
              })}
              <a href="mailto:dragonfly-discuss@googlegroups.com" className={styles.contactBox}>
                <LottieContact />
                <div className={styles.contact}>
                  <div>CONTACT US</div>
                </div>
              </a>
            </div>
          </div>
        </section>
        <section className={clsx('row', styles.community)}>
          <div className={styles.communityWrapper}>
            <h1 className={styles.communityTitle}>
              <Translate>Join the</Translate>
              <div className={styles.userTitleHighling}>
                <Translate>Community</Translate>
              </div>
            </h1>
            <p className={styles.communitySubtitle}>
              <Translate>
                Engage with our ever-growing community to get the latest updates, product support, and more.
              </Translate>
            </p>
            <div className={clsx('row', styles.communityCardInfo)}>
              <div className={clsx('col col--4', styles.communityCardWrapper)}>
                <div className={styles.communityCard}>
                  <div className={styles.communityContent}>
                    <img className={styles.communityIcon} src={useBaseUrl('img/icon/community-slack.svg')} />
                    <h3>Join Slack</h3>
                    <p className={styles.communityText}>
                      <Translate>Join our developer security community on Slack Channel.</Translate>
                    </p>
                  </div>
                  <Link className={styles.communityButton} to="https://cloud-native.slack.com/messages/dragonfly/">
                    <img
                      className={styles.communityButtonIcon}
                      src={useBaseUrl('img/icon/community-slack-button.svg')}
                      alt="button logo"
                    />
                    Slack Channel
                  </Link>
                </div>
              </div>
              <div className={clsx('col col--4', styles.communityCardWrapper)}>
                <div className={styles.communityCard}>
                  <div className={styles.communityContent}>
                    <img
                      className={styles.communityIcon}
                      src={useBaseUrl('img/icon/community-github.svg')}
                      alt="button logo"
                    />
                    <h3>GitHub</h3>
                    <p className={styles.communityText}>
                      <Translate>Join our contributors in building the future of Dragonfly.</Translate>
                    </p>
                  </div>
                  <Link className={styles.communityButton} to="https://github.com/dragonflyoss/Dragonfly2">
                    <img
                      className={styles.communityButtonIcon}
                      src={useBaseUrl('img/icon/community-github-button.svg')}
                      alt="button logo"
                    />
                    Star →
                  </Link>
                </div>
              </div>
              <div className={clsx('col col--4', styles.communityCardWrapper)}>
                <div className={styles.communityCard}>
                  <div className={styles.communityContent}>
                    <img className={styles.communityIcon} src={useBaseUrl('img/icon/community-problem.svg')} />
                    <h3>Dragonfly Improvement Proposals</h3>
                    <p className={styles.communityText}>
                      <Translate>Propose, discuss and debate ideas.</Translate>
                    </p>
                  </div>
                  <div className={clsx('row', styles.communityButtonContain)}>
                    <Link className={styles.communityButton} to="https://github.com/dragonflyoss/Dragonfly2/issues">
                      <img
                        className={styles.communityButtonIcon}
                        src={useBaseUrl('img/icon/community-issues-button.svg')}
                      />
                      Issues
                    </Link>
                    <Link
                      className={styles.communityButton}
                      to="https://github.com/dragonflyoss/Dragonfly2/discussions"
                    >
                      <img
                        className={styles.communityButtonIcon}
                        src={useBaseUrl('img/icon/community-discussions-button.svg')}
                      />
                      Discussions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
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
