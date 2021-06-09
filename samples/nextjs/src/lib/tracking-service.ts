import { LayoutServiceContext, RouteData } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  PageViewData,
  TrackingService as SitecoreTrackingService,
  TrackingServiceConfig,
} from '@sitecore-jss/sitecore-jss-tracking';
import config from 'temp/config';

export class TrackingService extends SitecoreTrackingService {
  constructor(private trackingEnabled: boolean, options: TrackingServiceConfig) {
    super(options);
  }

  public trackCurrentPage(
    context?: LayoutServiceContext | null,
    route?: RouteData | null
  ): Promise<void> {
    if (!this.trackingEnabled) {
      return Promise.resolve();
    }
    return super.trackCurrentPage(context, route);
  }

  public trackPage(
    pageView: PageViewData,
    querystringParams?: { [key: string]: unknown }
  ): Promise<void> {
    if (!this.trackingEnabled) {
      return Promise.resolve();
    }

    return super.trackPage(pageView, querystringParams);
  }
}

export const trackingService = new TrackingService(
  config.trackingEnabled.toLocaleLowerCase() === 'true',
  {
    endpoint: config.trackingEndpoint,
    apiKey: config.sitecoreServicesApiKey,
    siteName: config.jssAppName,
  }
);
