import {
  ComponentRendering,
  LayoutServiceContext,
  PersonalizedComponentRendering,
  RouteData,
} from '../layout/models';
import {
  PersonalizationDecisionData,
  PersonalizationDecisionsService,
} from './personalization-decisions-service';
import { LayoutFragmentService } from './layout-fragment-service';
import { LayoutPersonalizationUtils } from './layout-personalization-utils';

export interface PersonalizationResult {
  route?: RouteData;
  isRoutePersonalized: boolean;
}

export interface PersonalizationLoadResult {
  hasPersonalizationComponents: boolean;
  personalizedFragments?: { [key: string]: ComponentRendering | null };
}

export class LayoutPersonalizationService {
  private personalizationResult: {
    personalizationOperation?: Promise<{
      [key: string]: ComponentRendering | null;
    }>;
    components?: { [key: string]: ComponentRendering | null };
  } = {};
  private layoutPersonalizationUtils = new LayoutPersonalizationUtils();

  constructor(
    private personalizationDecisionsService: PersonalizationDecisionsService,
    private layoutFragmentService: LayoutFragmentService
  ) {}

  async loadPersonalization(
    context: LayoutServiceContext,
    route: RouteData
  ): Promise<PersonalizationLoadResult> {
    // clear personalization before getting new one
    this.personalizationResult = {};

    const personalizedRenderings = this.layoutPersonalizationUtils.getPersonalizedComponents(
      route.placeholders
    );

    if (!personalizedRenderings.length) {
      return Promise.resolve({ hasPersonalizationComponents: false });
    }

    const currentResult = this.personalizationResult;
    currentResult.personalizationOperation = this.personalize(context, personalizedRenderings);

    try {
      const components = await currentResult.personalizationOperation;
      currentResult.components = components;
      return { personalizedFragments: components, hasPersonalizationComponents: true };
    } catch (error) {
      currentResult.personalizationOperation = undefined;
      throw error;
    }
  }

  getPersonalizedComponent(componentUid: string): ComponentRendering | null {
    if (!this.personalizationResult.components) {
      return null;
    }

    return this.personalizationResult.components[componentUid] ?? null;
  }

  isLoading(): boolean {
    return (
      !!this.personalizationResult.personalizationOperation &&
      !this.personalizationResult.components
    );
  }

  async loadPersonalizedComponent(componentUid: string): Promise<ComponentRendering | null> {
    if (!this.personalizationResult.personalizationOperation) {
      throw new Error('loadPersonalization should be called before getting personalized component');
    }

    const personalizedComponents = await this.personalizationResult.personalizationOperation;
    if (!personalizedComponents) {
      return null;
    }

    return personalizedComponents[componentUid] ?? null;
  }

  async personalize(
    context: LayoutServiceContext,
    personalizedRenderings: PersonalizedComponentRendering[]
  ): Promise<{ [key: string]: ComponentRendering | null }> {
    if (personalizedRenderings.length === 0) {
      return {};
    }

    const personalizedRenderingIds = personalizedRenderings.map((r) => r.uid);
    let personalizedFragments: { [key: string]: ComponentRendering | null | undefined } = {};

    try {
      const personalizationDecisionsResult = await this.personalizationDecisionsService.getPersonalizationDecisions(
        {
          routePath: context.itemPath as string,
          language: context.language as string,
          renderingIds: personalizedRenderingIds,
        }
      );
      personalizedFragments = await this.resolveFragments(personalizationDecisionsResult, context);
    } catch (error) {
      // catch all errors on getting a personalization decision
      console.error(error);
      // default will be used for unresolved fragments
      personalizedRenderingIds.forEach((id) => (personalizedFragments[id] = undefined));
    }

    const result: { [key: string]: ComponentRendering | null } = {};
    personalizedRenderings.forEach((pr) => {
      result[pr.uid] = this.layoutPersonalizationUtils.buildPersonalizedFragment(
        pr.uid,
        personalizedFragments,
        pr.personalization.defaultComponent
      );
    });

    return result;
  }

  private async resolveFragments(
    personalizationDecisionsResult: PersonalizationDecisionData,
    context: LayoutServiceContext
  ) {
    const personalizedFragments: { [key: string]: ComponentRendering | null | undefined } = {};
    const renderingsDecisions = personalizationDecisionsResult.renderings;
    const personalizedFragmentsRequests: Promise<void>[] = [];

    for (const [renderingId, decision] of Object.entries(renderingsDecisions)) {
      const variantKey = decision?.variantKey;
      if (variantKey) {
        // load fragments in parallel
        personalizedFragmentsRequests.push(
          this.layoutFragmentService
            .fetchLayoutFragmentData(
              context.itemPath as string,
              context.language as string,
              renderingId,
              variantKey
            )
            .then((fr) => {
              personalizedFragments[renderingId] = fr.fragment;
            })
            .catch((error) => {
              console.error(error);

              // default will be used in case failed to resolve the fragment
              personalizedFragments[renderingId] = undefined;
            })
        );
      } else if (variantKey === null) {
        // hidden by personalization
        personalizedFragments[renderingId] = null;
      } else {
        // was not able to resolve decision for the rendering, default will be used
        personalizedFragments[renderingId] = undefined;
      }
    }

    await Promise.all(personalizedFragmentsRequests);

    return personalizedFragments;
  }
}
