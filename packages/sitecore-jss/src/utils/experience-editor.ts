import isServer from './is-server';

export const isExperienceEditorActive = (): boolean => {
  if (isServer()) {
    return false;
  }
  return isExperienceEditing() || isHorizonEditing();
};

export const resetExperienceEditorChromes = (): void => {
  if (isServer()) {
    return;
  }
  if (isExperienceEditing()) {
    // eslint-disable-next-line
    (window as any).Sitecore.PageModes.ChromeManager.resetChromes();
  } else if (isHorizonEditing()) {
    // No way to "reset chromes" in Horizon, simply reload the canvas (iframe) instead
    window.location.reload();
  }
};

const isExperienceEditing = (): boolean => {
  // eslint-disable-next-line
  const sc = (window as any).Sitecore;
  return Boolean(sc && sc.PageModes && sc.PageModes.ChromeManager);
};

const isHorizonEditing = (): boolean => {
  // Horizon canvas state is injected. Example:
  // <script id="hrz-canvas-state" type="application/json">
  // {
  //   "type": "State",
  //   "data": {
  //     "itemId": "45be1451-fa83-5f80-9f0d-d7457b480b58",
  //     "siteName": "JssNextWeb",
  //     "language": "en",
  //     "deviceId": "fe5d7fdf-89c0-4d99-9aa3-b5fbd009c9f3",
  //     "pageMode": "EDIT"
  //   }
  // }
  // </script>
  const stateEl = window.document.querySelector('#hrz-canvas-state');
  if (!stateEl || stateEl.innerHTML === '') {
    return false;
  }
  const state = JSON.parse(stateEl.innerHTML);
  return state.data?.pageMode === 'EDIT';
};
