<template>
  <form
    class="vid-search-form"
    @submit.prevent="submit"
  >
    <component
      :is="`${$formKitConfigs.componentPrefix}FormTextInput`"
      :id="id"
      v-model="searchText"
      type="text"
      class="vid-search-form__input-block"
      input-class="vid-search-form__input"
      input-wrap-class="vid-search-form__input-wrap"
      :placeholder="placeholder"
      :maxlength="maxlength"
    />
    <button
      type="submit"
      class="vid-search-form__btn"
    >
      <component
        :is="`${$formKitConfigs.componentPrefix}IconSearch`"
        class="vid-search-form__icon"
      />
    </button>
  </form>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'BlockSearchForm',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    maxlength: {
      type: String,
      default: null,
    },
    required: {
      type: [String, Boolean],
      default: false,
    },
  },
  emits: ['update:modelValue', 'submit'],
  setup(props, { emit }) {
    const searchText = ref(props.modelValue);
    const submit = () => {
      emit('submit', searchText.value);
    };

    watch(searchText, (newVal) => {
      emit('update:modelValue', newVal);
    });

    return {
      submit,
      searchText,
    };
  },
};
</script>
