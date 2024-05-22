// pages/_app.js
import 'globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'fontawesome'; // This imports the configuration we made earlier

config.autoAddCss = false; // Tell FontAwesome to not add its own CSS since we did it above

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;