import 'jsdom-global/register';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { SitecorePageProps } from 'lib/page-props';
import SitecorePage from './[[...path]]';

describe('SitecorePage', () => {
  describe('useMemo', () => {
    it('should return rendered component if it is not null', () => {
      const SitecorePageComponent = () => {
        SitecorePage({ ...getSitecorePageProps() });

        return <div>Loading</div>;
      };

      const wrapper = shallow(<SitecorePageComponent />);
      expect(wrapper).is.not.null;
      expect(wrapper.html()).contains('Loading');
    });
  });
});

function getSitecorePageProps(): SitecorePageProps {
  return {
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
}
