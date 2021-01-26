import {SWRConfig} from 'swr';
import {AppProps} from 'next/app';

import '../styles/globals.css';

function MyApp({Component, pageProps}: AppProps) {
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
