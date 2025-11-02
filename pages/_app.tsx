import type { AppProps } from 'next/app';
import '../src/renderer/styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
