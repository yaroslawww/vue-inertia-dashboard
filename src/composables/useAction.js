import { reactive } from 'vue';
import { Inertia } from '@inertiajs/inertia';
import useLocale from './useLocale';

export default function useAction(action, entityType, selectedObjects, options = {}) {
  const { t } = useLocale();

  return reactive({
    processing: false,

    execute() {
      switch (action.type) {
        default:
          this.processing = true;
          window.PortalApp.request()
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
                    PortalApp.success(responseData.message || t('Action executed with status "success"'));
                    break;
                  case 'warning':
                    PortalApp.warning(responseData.message || t('Action executed with status "warning"'));
                    break;
                  case 'error':
                    PortalApp.error(responseData.message || t('Action executed with status "error"'));
                    break;
                  case 'info':
                    PortalApp.info(responseData.message || t('Action executed with status "info"'));
                    break;
                  case 'download':
                    PortalApp.info(t('Downloading'));
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
                    PortalApp.warning(t('Action executed, without result status'));
                    break;
                }

                if (options.onSuccess) {
                  options.onSuccess();
                } else {
                  Inertia.reload();
                }
              }
            })
            .catch((e) => PortalApp.onResponseError(e))
            .finally(() => {
              PortalApp.progressDone();
              this.processing = false;
            });
          break;
      }
    },
  });
}
