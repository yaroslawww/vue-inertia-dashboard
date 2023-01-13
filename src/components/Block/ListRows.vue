<template>
  <div
    v-if="entities && entities.data?.length"
    class="vid-list-rows entries-index-table"
  >
    <div class="vid-list-rows__table-wrap-l1">
      <div class="vid-list-rows__table-wrap-l2">
        <div class="vid-list-rows__table-wrap-l3">
          <table class="vid-list-rows__table">
            <thead class="vid-list-rows__table-head">
              <tr>
                <th
                  v-if="selectable"
                  scope="col"
                  class="vid-list-rows__table-head-th-all"
                >
                  <label class="control control-checkbox relative">
                    <input
                      v-model="selectAll"
                      type="checkbox"
                    >
                    <div class="control_indicator" />
                    <span class="">&nbsp;</span>
                  </label>
                </th>
                <th
                  scope="col"
                >
                  <!-- Actions column -->
                </th>
                <th
                  v-for="(column, columnKey) in columns"
                  :key="columnKey"
                  scope="col"
                  class="vid-list-rows__table-head-th"
                >
                  <div class="vid-list-rows__table-head-th__wrap">
                    <component
                      :is="`${$vueInertiaDashboardConfigs.componentPrefix}BlockOrderArrows`"
                      v-if="column.sortable"
                      v-model="order"
                      :order-key="column.field"
                    />
                    {{ column.title || '' }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="vid-list-rows__table-body">
              <tr
                v-for="entity in entities.data"
                :key="entity.id"
              >
                <td
                  v-if="selectable"
                  class="vid-list-rows__table-body-td-all"
                >
                  <label class="control control-checkbox relative">
                    <input
                      :checked="Object.keys(selectedObjects).map(Number).includes(entity.id)"
                      type="checkbox"
                      :value="entity.id"
                      @change="(event) => $emit('select-entity', {id:entity, checked: event.target.checked})"
                    >
                    <div class="control_indicator" />
                    <span class="">&nbsp;</span>
                  </label>
                </td>
                <template v-if="actionsAsList">
                  <td
                    class="vid-list-rows__table-body-td-actions"
                  >
                    <component
                      :is="`${$formKitConfigs.componentPrefix}FormButton`"
                      v-if="entity._actions?.length"
                      id="menu-button"
                      as="button"
                      btn-style="alt"
                      type="button"
                      aria-expanded="true"
                      aria-haspopup="true"
                      class="vid-list-rows__table-body-td-actions-btn"
                      @click.prevent="toggleContextMenu($event, entity)"
                    >
                      <span class="sr-only">{{ t('Open options') }}</span>
                      <component
                        :is="`${$formKitConfigs.componentPrefix}IconEllipsisVertical`"
                        class="vid-list-rows__table-body-td-actions-icon"
                      />
                    </component>
                  </td>
                </template>
                <template v-else>
                  <td
                    class="vid-list-rows__table-body-td-action"
                  >
                    <div class="vid-list-rows__table-body-td-action-btn">
                      <component
                        :is="action.component.index"
                        v-for="(action, actionKey) in entity?._actions"
                        :key="actionKey"
                        :entity="entity"
                        :action="action"
                        format="icon"
                        @executed="onActionExecuted(entity, $event)"
                      />
                    </div>
                  </td>
                </template>
                <td
                  v-for="(column, columnKey) in columns"
                  :key="columnKey"
                  class="vid-list-rows__table-body-td"
                >
                  <component
                    :is="column.component"
                    :entity="entity"
                    :column="column"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <template v-if="actionsAsList">
      <transition
        enter-active-class="vid-list-rows__menu-enter-active-class"
        enter-from-class="vid-list-rows__menu-enter-from-class"
        enter-to-class="vid-list-rows__menu-enter-to-class"
        leave-active-class="vid-list-rows__menu-leave-active-class"
        leave-from-class="vid-list-rows__menu-leave-from-class"
        leave-to-class="vid-list-rows__menu-leave-to-class"
      >
        <div
          v-if="contextMenu.entity?._actions?.length"
          v-click-outside="closeContextMenu"
          class="vid-list-rows__menu"
          :style="{top: `${contextMenu.positionTop}px`}"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div
            class="py-1"
            role="none"
          >
            <component
              :is="action.component.index"
              v-for="(action, actionKey) in contextMenu.entity?._actions"
              :key="actionKey"
              :entity="contextMenu.entity"
              :action="action"
              @executed="onActionExecuted(contextMenu.entity, $event)"
            />
          </div>
        </div>
      </transition>
    </template>
  </div>
  <div
    v-else
    class="vid-list-rows-empty"
  >
    <div class="vid-list-rows-empty__text">
      <template v-if="loading">
        {{ t('Loading...') }}
      </template>
      <template v-else>
        {{ t('No items found') }}
      </template>
    </div>
  </div>
</template>

<script>
import { map, difference } from 'lodash';
import { computed, ref, watch } from 'vue';
import useLocale from '../../composables/useLocale';

export default {
  name: 'BlockListRows',
  props: {
    actionsAsList: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    selectable: {
      type: Boolean,
      default: true,
    },
    entities: {
      type: Object,
      default: () => ({}),
    },
    selectedObjects: {
      type: Object,
      default: () => ({}),
    },
    columns: {
      type: Object,
      default: () => ({}),
    },
    urlParams: {
      type: URLSearchParams,
      default: null,
    },
  },
  emits: ['select-entity', 'row-action-executed', 'order-changed'],
  setup(props, { emit }) {
    const { t } = useLocale();
    const contextMenu = ref({});
    const order = ref({
      key: '',
      direction: 'asc',
    });
    if (props.urlParams?.has('order')
      && ['asc', 'desc'].includes(props.urlParams.get('order-direction'))) {
      order.value = {
        key: props.urlParams.get('order'),
        direction: props.urlParams.get('order-direction'),
      };
    }

    let preventCloseMenu = false;
    const closeContextMenu = () => {
      if (preventCloseMenu) {
        preventCloseMenu = false;
        return;
      }
      contextMenu.value = {};
    };

    const toggleContextMenu = (event, entity) => {
      if (contextMenu.value.id === entity.id) {
        preventCloseMenu = false;
        closeContextMenu();
      } else {
        preventCloseMenu = true;
        const positionTop = event.currentTarget.getBoundingClientRect().top + document.documentElement.scrollTop;
        const tablePositionTop = event.currentTarget.closest('.entries-index-table').getBoundingClientRect().top + document.documentElement.scrollTop;
        contextMenu.value = {
          id: entity.id,
          positionTop: positionTop - tablePositionTop,
          entity,
        };
      }
    };

    watch(order, (newOrder) => {
      if (newOrder.key && newOrder.direction) {
        props.urlParams.set('order', newOrder.key);
        props.urlParams.set('order-direction', newOrder.direction);
        props.urlParams.set('page', 1);
      } else {
        props.urlParams.delete('order');
        props.urlParams.delete('order-direction');
        props.urlParams.set('page', 1);
      }
      emit('order-changed', props.urlParams);
    });

    const selectAll = computed({
      get() {
        if (!props.entities.data) {
          return [];
        }
        return difference(map(props.entities.data, 'id'), Object.keys(props.selectedObjects).map(Number)).length === 0;
      },
      set(newValue) {
        props.entities.data.forEach((entity) => {
          emit('select-entity', { id: entity, checked: newValue });
        });
      },
    });

    return {
      t,
      closeContextMenu,
      toggleContextMenu,
      onActionExecuted: (entity, action) => {
        closeContextMenu();
        emit('row-action-executed', { entity, action });
      },
      contextMenu,
      order,
      selectAll,
    };
  },
};
</script>
