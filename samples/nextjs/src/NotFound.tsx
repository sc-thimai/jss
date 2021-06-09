import Head from 'next/head';
import { useRouter } from 'next/router';
import { isServer } from '@sitecore-jss/sitecore-jss-nextjs';
import { trackingService } from 'lib/tracking-service';
import { areQueryParamsReady } from 'lib/util';

/**
 * Rendered in case if we have 404 error
 */
const NotFound = (): JSX.Element => {
  if (!isServer() && areQueryParamsReady(useRouter())) {
    trackingService
      .trackPage(
        {
          url: location.pathname + location.search,
          referrer: document.referrer,
        },
        { sc_trk: 'Page not found' }
      )
      .catch((error: unknown) => console.error('Tracking failed: ' + error));
  }

  return (
    <>
      <Head>
        <title>404: NotFound</title>
      </Head>
      <div style={{ padding: 10 }}>
        <h1>Page not found</h1>
        <p>This page does not exist.</p>
        <a href="/">Go to the Home page</a>
      </div>
    </>
  );
};

export default NotFound;
