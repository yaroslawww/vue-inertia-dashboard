<template>
  <div class="vid-order-arrows">
    <slot
      name="arrow-up"
      v-bind="{orderAction,orderKey}"
    >
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="vid-order-arrows__up"
        :class="{'vid-order-arrows__active': orderKey===modelValue.key && 'asc'===modelValue.direction}"
        @click="orderAction('asc')"
      >
        <path
          fill="currentColor"
          d="M6.101 359.293L25.9 379.092c4.686 4.686 12.284 4.686 16.971 0L224 198.393l181.13 180.698c4.686 4.686 12.284
          4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 132.908c-4.686-4.686-12.284-4.686-16.971
          0L6.101 342.322c-4.687 4.687-4.687 12.285 0 16.971z"
          class=""
        />
      </svg>
    </slot>
    <div class="vid-order-arrows__separator" />
    <slot
      name="arrow-down"
      v-bind="{orderAction,orderKey}"
    >
      <svg
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="vid-order-arrows__down"
        :class="{'vid-order-arrows__active': orderKey===modelValue.key && 'desc'===modelValue.direction}"
        @click="orderAction('desc')"
      >
        <path
          fill="currentColor"
          d="M6.101 359.293L25.9 379.092c4.686 4.686 12.284 4.686 16.971 0L224 198.393l181.13 180.698c4.686 4.686 12.284
          4.686 16.971 0l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L232.485 132.908c-4.686-4.686-12.284-4.686-16.971
          0L6.101 342.322c-4.687 4.687-4.687 12.285 0 16.971z"
          class=""
        />
      </svg>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BlockOrderArrows',
  props: {
    modelValue: {
      type: Object,
      default: () => {},
    },
    orderKey: {
      type: String,
      default: '-',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const orderAction = (direction = 'desc') => {
      if (direction !== 'desc') {
        // eslint-disable-next-line no-param-reassign
        direction = 'asc';
      }
      emit('update:modelValue', {
        key: props.orderKey,
        direction,
      });
    };

    return {
      orderAction,
    };
  },
};
</script>
