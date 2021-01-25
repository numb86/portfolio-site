import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {SWRConfig} from 'swr';
import {AppProps} from 'next/app';

import {GA_MEASUREMENT_ID} from '../shared/constants';

import '../styles/globals.css';

function MyApp({Component, pageProps}: AppProps) {
  const {events} = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      events.on('routeChangeComplete', (url: string) => {
        /* eslint-disable camelcase */
        const page_path = url;
        const page_title = window.document.title;
        /* eslint-enable camelcase */
        gtag('config', GA_MEASUREMENT_ID, {page_path, page_title});
      });
    }
  }, [events]);

  return (
    <SWRConfig
      value={{
        dedupingInterval: 180 * 1000,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
