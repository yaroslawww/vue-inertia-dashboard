<template>
  <div
    v-if="entities && entities.data.length"
    class="vid-list-tiles"
  >
    <template
      v-for="entity in entities.data"
      :key="entity.id"
    >
      <slot v-bind="entity" />
    </template>
  </div>
  <div
    v-else
    class="vid-list-tiles-empty"
  >
    <div class="vid-list-tiles-empty__text">
      {{ t('No items found') }}
    </div>
  </div>
</template>

<script>
import useLocale from '../../composables/useLocale';

export default {
  name: 'BlockListTiles',
  props: {
    entities: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { t } = useLocale();

    return {
      t,
    };
  },
};
</script>
