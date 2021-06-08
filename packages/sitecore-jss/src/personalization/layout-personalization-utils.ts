import {
  PersonalizedComponentRendering,
  isComponentRendering,
  isPersonalizedComponentRendering,
  ComponentRendering,
  PlaceholdersData,
} from '../layout/models';

export class LayoutPersonalizationUtils {
  buildPersonalizedFragment(
    uid: string,
    personalizedFragments: { [key: string]: ComponentRendering | null | undefined },
    defaultComponent: ComponentRendering | null
  ): ComponentRendering | null {
    const personalizedFragment = personalizedFragments[uid];

    if (personalizedFragment === null) {
      return null;
    }

    if (personalizedFragment === undefined) {
      return defaultComponent;
    }

    try {
      this.replaceNestedPersonalizedRenderings(personalizedFragment, personalizedFragments);
      return personalizedFragment;
    } catch (error) {
      console.error(error);
      return defaultComponent;
    }
  }

  getPersonalizedComponents(placeholders: PlaceholdersData): PersonalizedComponentRendering[] {
    const result: PersonalizedComponentRendering[] = [];

    for (const placeholder of Object.values(placeholders)) {
      for (const component of placeholder) {
        if (isPersonalizedComponentRendering(component)) {
          result.push(component);
        } else if (isComponentRendering(component) && component.placeholders) {
          const components = this.getPersonalizedComponents(component.placeholders);
          result.push(...components);
        }
      }
    }

    return result;
  }

  replacePersonalizedComponentsWithLoaderComponents(
    placeholders: PlaceholdersData,
    loaderComponentName: string
  ) {
    if (!placeholders) {
      return;
    }

    for (const placeholder of Object.values(placeholders)) {
      placeholder.forEach((component) => {
        if (isPersonalizedComponentRendering(component)) {
          component.personalization.defaultComponent = component.personalization.hiddenByDefault
            ? null
            : { ...component };
          component.componentName = loaderComponentName;
        } else if (isComponentRendering(component) && component.placeholders) {
          this.replacePersonalizedComponentsWithLoaderComponents(
            component.placeholders,
            loaderComponentName
          );
        }
      });
    }
  }

  /**
   * @param {ComponentRendering} context
   * @param {object} personalizedFragments
   */
  private replaceNestedPersonalizedRenderings(
    context: ComponentRendering,
    personalizedFragments: { [key: string]: ComponentRendering | null | undefined }
  ) {
    if (!context.placeholders) {
      return;
    }

    for (const [key, placeholder] of Object.entries(context.placeholders)) {
      const hiddenComponents: string[] = [];

      for (let i = 0; i < placeholder.length; i++) {
        const component = placeholder[i];

        // component has only uid therefore it need to be replaced with the corresponding fragment
        if ('uid' in component && component.uid && Object.keys(component).length === 1) {
          const personalizedFragment = personalizedFragments[component.uid];

          if (personalizedFragment === null) {
            hiddenComponents.push(component.uid);
          } else if (personalizedFragment) {
            this.replaceNestedPersonalizedRenderings(personalizedFragment, personalizedFragments);

            placeholder[i] = personalizedFragment;
          } else {
            throw new Error('Fragment is missing');
          }
        } else if (isComponentRendering(component)) {
          this.replaceNestedPersonalizedRenderings(component, personalizedFragments);
        }
      }

      if (hiddenComponents.length) {
        context.placeholders[key] = placeholder.filter(
          (component) =>
            'uid' in component && component.uid && hiddenComponents.indexOf(component.uid) === -1
        );
      }
    }
  }
}
