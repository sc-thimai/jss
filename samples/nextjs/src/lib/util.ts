import { NextRouter } from 'next/router';

/**
 * Get the publicUrl.
 * This is used primarily to enable compatibility with the Sitecore Experience Editor.
 */
export const getPublicUrl = (): string => {
  return process.env.PUBLIC_URL || '';
};

/*
 * Pages that are statically optimized will be hydrated without their route parameters provided.
 * After hydration, Next.js will trigger an update to your application to provide the route parameters in the query object.
 * Details coudld be found on Caveats section for dynamic routes in Next.js doc
 *
 * The latest Next.js version has router.isReady property.
 * TODO: Remove it after switching to the latest Next.js version.
 */
export function areQueryParamsReady(router: NextRouter): boolean {
  const minQueryLength = router.query.path !== undefined ? 2 : 1;

  const index = router.asPath.indexOf('?');

  return (
    index < 0 ||
    router.asPath.length === index + 1 ||
    Object.keys(router.query).length >= minQueryLength
  );
}
