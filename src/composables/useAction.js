import {inject, reactive} from 'vue';
import { Inertia } from '@inertiajs/inertia';
import useLocale from './useLocale';

export default function useAction(action, entityType, selectedObjects, options = {}) {
  const { t } = useLocale();

  return reactive({
    processing: false,

    execute() {
      const portalApp = inject('PortalApp') || window.PortalApp;
      switch (action.type) {
        case 'custom':
          if (options.onSuccess) {
            options.onSuccess();
          } else {
            Inertia.reload();
          }
          break;
        case 'request':
        default:
          this.processing = true;
          portalApp.request()
            .post(
              (action.url || `/action/${action.name}`),
              Object.assign(
                (action.requestDefaults || {}),
                {
                  entity: entityType,
                  entities: Array.isArray(selectedObjects) ? selectedObjects : Object.keys(selectedObjects),
                },
              ),
            )
            .then((response) => {
              if (response.data && response.data.data && response.data.data.type) {
                const responseData = response.data.data;
                switch (responseData.type) {
                  case 'success':
                    portalApp.success(responseData.message || t('Action executed with status "success"'));
                    break;
                  case 'warning':
                    portalApp.warning(responseData.message || t('Action executed with status "warning"'));
                    break;
                  case 'error':
                    portalApp.error(responseData.message || t('Action executed with status "error"'));
                    break;
                  case 'info':
                    portalApp.info(responseData.message || t('Action executed with status "info"'));
                    break;
                  case 'download':
                    portalApp.info(t('Downloading'));
                    setTimeout(() => {
                      const link = document.createElement('a');
                      link.href = responseData.url;
                      link.download = responseData.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }, 0);
                    break;
                  default:
                    portalApp.warning(t('Action executed, without result status'));
                    break;
                }

                if (options.onSuccess) {
                  options.onSuccess();
                } else {
                  Inertia.reload();
                }
              }
            })
            .catch((e) => portalApp.onResponseError(e))
            .finally(() => {
              portalApp.progressDone();
              this.processing = false;
            });
          break;
      }
    },
  });
}
