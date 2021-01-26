import Document, {Html, Head, Main, NextScript} from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            property="og:image"
            content={`${process.env.NEXT_PUBLIC_SITE_FQDN}/images/og.png`}
          />
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:image"
            content={`${process.env.NEXT_PUBLIC_SITE_FQDN}/images/og.png`}
          />
          <meta
            name="twitter:description"
            content="numb_86 のポートフォリオサイト。"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
