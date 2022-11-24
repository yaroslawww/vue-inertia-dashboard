<template>
  <form
    v-if="options && options.length"
    class="vid-bulk-action"
    :class="{
      'vid-bulk-action--processing': processing,
      'vid-bulk-action--disabled ': Object.keys(selectedObjects).length <= 0
    }"
  >
    <component
      :is="`${$formKitConfigs.componentPrefix}SelectStandard`"
      v-model="selectedOption"
      :options="options"
      class="vid-bulk-action__select"
      deselectable
      :label="actionText?.bulkAction || t('Bulk Action')"
      :class="{
        'vid-bulk-action__select--disabled': Object.keys(selectedObjects).length <= 0
      }"
    />
    <component
      :is="`${$formKitConfigs.componentPrefix}FormButton`"
      as="button"
      btn-style="alt"
      class="vid-bulk-action__btn"
      :class="{
        'vid-bulk-action__btn--disabled': Object.keys(selectedObjects).length <= 0,
        'vid-bulk-action__btn--empty': !selectedOption,
      }"
      :title="actionText?.apply || t('Apply')"
      :text="actionText?.apply || t('Apply')"
      @click.prevent="actNow"
    />
  </form>
</template>

<script>
import { computed, ref } from 'vue';
import { usePage } from '@inertiajs/inertia-vue3';
import { forOwn } from 'lodash';
import useLocale from '../../composables/useLocale';
import useAction from '../../composables/useAction';

export default {
  name: 'BlockBulkAction',
  props: {
    selectedObjects: {
      type: Object,
      default: () => ({}),
    },
    entityType: {
      type: String,
      default: 'undefined',
    },
    bulkActions: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['executed'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const processing = ref(false);
    const selectedOption = ref(null);

    const options = computed(() => {
      const items = [];
      forOwn(props.bulkActions, (value, key) => {
        items.push({
          value: key,
          label: value.label,
        });
      });
      return items;
    });
    const actNow = () => {
      if (!selectedOption.value) {
        return;
      }

      const pendingAction = useAction(
        props.bulkActions[selectedOption.value],
        props.entityType,
        props.selectedObjects,
        {
          onSuccess: () => {
            emit('executed', props.bulkActions[selectedOption.value]);
            selectedOption.value = null;
          },
        },
      );

      pendingAction.execute();
    };

    return {
      t,
      processing,
      actionText: computed(() => usePage().props.value.page?.action),
      options,
      selectedOption,
      actNow,
    };
  },
};
</script>
