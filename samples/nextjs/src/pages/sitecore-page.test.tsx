import 'jsdom-global/register';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { SitecorePageProps } from 'lib/page-props';
import SitecorePage from './[[...path]]';
import { layoutPersonalizationService } from 'lib/layout-personalization-service';

use(sinonChai);

describe('SitecorePage', () => {
  describe('useMemo', () => {
    beforeEach(function () {
      sinon.spy(layoutPersonalizationService, 'loadPersonalization');
    });

    afterEach(function () {
      sinon.restore();
    });

    it('should call loadPersonalization once with passed props', () => {
      shallow(<SitecorePage {...sitecorePageProps} />);
      expect(layoutPersonalizationService.loadPersonalization).to.have.been.callCount(1);
    });

    it('should return empty component rendering if application is running in disconnected mode', () => {
      const props: SitecorePageProps = {
        ...sitecorePageProps,
        layoutData: {
          sitecore: {
            context: {},
            route: {
              name: 'name',
              layoutId: 'available-in-connected-mode',
              placeholders: { 'jss-main': [] },
            },
          },
        },
      };
      shallow(<SitecorePage {...props} />);
      expect(layoutPersonalizationService.loadPersonalization).to.have.been.callCount(0);
    });

    it('should return empty component rendering if application is running on server', () => {
      global.window = undefined;
      shallow(<SitecorePage {...sitecorePageProps} />);
      expect(layoutPersonalizationService.loadPersonalization).to.have.been.callCount(0);
    });

    it('should return empty component rendering if application is running in preview mode', () => {
      const props: SitecorePageProps = {
        ...sitecorePageProps,
        isPreview: true,
      };
      shallow(<SitecorePage {...props} />);
      expect(layoutPersonalizationService.loadPersonalization).to.have.been.callCount(0);
    });
  });
});

const sitecorePageProps: SitecorePageProps = {
  locale: '',
  layoutData: {
    sitecore: {
      context: {},
      route: {
        name: 'name',
        placeholders: { 'jss-main': [] },
      },
    },
  },
  dictionary: {},
  componentProps: {},
  notFound: false,
  tracked: false,
  isPreview: false,
};

interface CustomWindow {
  [key: string]: unknown;
  document: unknown;
}

interface Global {
  window: CustomWindow | undefined;
}

declare const global: Global;
