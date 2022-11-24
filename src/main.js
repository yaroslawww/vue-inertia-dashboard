import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { defineAsyncComponent } from 'vue';
import DirectiveClickOutside from './directives/click-outside';

const VueInertiaDashboard = {
  install(app, options = {}) {
    const configs = { componentPrefix: '', ...options };

    const folders = {
      Layout: import.meta.glob('./components/Layout/*.vue'),
      Block: import.meta.glob('./components/Block/*.vue'),
    };
    Object.entries(folders).forEach(([folder, modules]) => {
      Object.entries(modules).forEach(([path, m]) => {
        const componentName = upperFirst(
          camelCase(path.split('/').pop().replace(/\.\w+$/, '')),
        );
        app.component(`${configs.componentPrefix}${folder}${componentName}`, defineAsyncComponent(m));
      });
    });

    app.config.globalProperties.$vueInertiaDashboardConfigs = configs;
    app.provide('vueInertiaDashboardConfigs', configs);

    app.directive('click-outside', DirectiveClickOutside);
  },
};

export default VueInertiaDashboard;
