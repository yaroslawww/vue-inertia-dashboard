import { usePage } from '@inertiajs/inertia-vue3';

const useLocale = () => {
  const t = (key, replaces = {}) => {
    const propsValue = usePage().props.value;
    // eslint-disable-next-line no-nested-ternary
    let translation = (propsValue && propsValue.translations && propsValue.translations[key])
      ? propsValue.translations[key]
      : (
        (propsValue && propsValue.translationsGlobal && propsValue.translationsGlobal[key])
          ? propsValue.translationsGlobal[key]
          : key
      );

    Object.keys(replaces).forEach((replace) => {
      translation = translation.replace(`:${replace}`, replaces[replace]);
    });

    return translation;
  };

  const tc = (key, count = 0, replaces = {}) => {
    const translations = t(key).split(' | ');
    let translation = '';

    if (count > 1) {
      translation = translations[translations.length - 1];
    } else if (count < 1) {
      if (translations.length === 2) {
        translation = translations[translations.length - 1];
      } else {
        // eslint-disable-next-line prefer-destructuring
        translation = translations[0];
      }
    } else {
      translation = (translations.length <= 2) ? translations[0] : translations[1];
    }

    if (!('count' in replaces)) {
      replaces.count = count;
    }

    Object.keys(replaces).forEach((replace) => {
      translation = translation.replace(`:${replace}`, replaces[replace]);
    });

    return translation;
  };

  return {
    t, tc,
  };
};

export default useLocale;
