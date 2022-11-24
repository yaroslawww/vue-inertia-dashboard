# Vue inertia dashboard kit

![NPM License](https://img.shields.io/npm/l/vue-inertia-dashboard)
![NPM Downloads](https://img.shields.io/npm/dt/vue-inertia-dashboard)
![NPM Version](https://img.shields.io/npm/v/vue-inertia-dashboard)

Simple dashboard kit of elements to quicker develop MVP.

```shell
yarn add vue-inertia-dashboard
```

Dashboard components works on top of `vue-form-kit` - so this package also should be installed and configured.

## Usage

### js

```js
import VueInertiaDashboard from 'vue-inertia-dashboard';
// ...
this.app.use(VueInertiaDashboard);
// or
this.app.use(VueInertiaDashboard, {
    componentPrefix: 'Tog',
});
```

### scss

```scss
@import "vue-inertia-dashboard/src/assets/scss/core";
// theme can be overridden
@import "vue-inertia-dashboard/src/assets/scss/core-theme";
```

## Credits

- [![Think Studio](https://yaroslawww.github.io/images/sponsors/packages/logo-think-studio.png)](https://think.studio/)

