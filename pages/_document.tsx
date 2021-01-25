import Document, {Html, Head, Main, NextScript} from 'next/document';

import {GA_MEASUREMENT_ID} from '../shared/constants';

const analyticsScript = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', {page_path: window.location.pathname, page_title: window.document.title})`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:image" content="/images/avatar.png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:image" content="/images/avatar.png" />
          <meta
            name="twitter:description"
            content="numb_86 のポートフォリオサイト。"
          />
        </Head>
        <body>
          {process.env.NODE_ENV === 'production' && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              />
              <script
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: analyticsScript,
                }}
              />
            </>
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
