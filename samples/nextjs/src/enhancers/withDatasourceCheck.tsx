import React from 'react';
import { StyleguideComponentProps, StyleguideSitecoreContextValue } from 'lib/component-props';
import EditingError from './EditingError';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

const MISSING_DATASOURCE =
  'Datasource is required. Please choose a content item for this component.';

export const withDatasourceCheck = <P extends StyleguideComponentProps>(
  Component: React.ComponentType<P>
) => {
  return function WithDatasourceCheck(props: P): JSX.Element {
    const { sitecoreContext } = useSitecoreContext<StyleguideSitecoreContextValue>();

    return props.rendering?.fields ? (
      <Component {...props} />
    ) : sitecoreContext.pageEditing ? (
      <EditingError message={MISSING_DATASOURCE} />
    ) : (
      <></>
    );
  };
};
