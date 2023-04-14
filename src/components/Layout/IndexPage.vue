<template>
  <div class="vid-layout-index">
    <slot
      name="header"
      :loading="loading"
      :selected-objects="selectedObjects"
      :update-selected-objects="updateSelectedObjects"
      :url-params="urlParams"
      :fetch-data="fetchData"
    />
    <div
      class="vid-layout-index__body"
    >
      <div class="vid-layout-index__bulk-action">
        <component
          :is="`${$vueInertiaDashboardConfigs.componentPrefix}BlockBulkAction`"
          index-key="indexList"
          :selected-objects="selectedObjects"
          class="w-64 px-2"
          :bulk-actions="bulkActions"
          :entity-type="entityType"
          @executed="bulkActionExecuted"
        />
      </div>
      <div class="vid-layout-index__search-form">
        <component
          :is="`${$vueInertiaDashboardConfigs.componentPrefix}BlockSearchForm`"
          v-model="searchText"
          class="vid-layout-index__search-form-input"
          @submit="searchSubmit"
        />
      </div>
      <div class="vid-layout-index__actions">
        <slot
          name="actions"
          :loading="loading"
          :selected-objects="selectedObjects"
          :update-selected-objects="updateSelectedObjects"
          :entities="entities"
          :url-params="urlParams"
          :fetch-data="fetchData"
        >
          <component
            :is="`${$formKitConfigs.componentPrefix}FormButton`"
            v-if="links?.create?.url"
            :href="links.create?.url"
            as="a"
            btn-style="default"
            :title="links.create?.text || t('Add')"
          >
            <component
              :is="`${$formKitConfigs.componentPrefix}IconCirclePlus`"
              class="vid-layout-index__actions-btn"
            />
            <span class="vid-layout-index__actions-icon">
              {{ links.create?.text || t('Add') }}
            </span>
          </component>
        </slot>
      </div>
    </div>
    <div>
      <slot
        :loading="loading"
        :selected-objects="selectedObjects"
        :update-selected-objects="updateSelectedObjects"
        :entities="entities"
        :columns="columns"
        :row-action-executed="rowActionExecuted"
        :url-params="urlParams"
        :fetch-data="fetchData"
      />
    </div>
    <div>
      <component
        :is="`${$formKitConfigs.componentPrefix}FormSeparator`"
        symmetric
      />
      <component
        :is="`${$vueInertiaDashboardConfigs.componentPrefix}BlockPagination`"
        :meta="entities.meta"
        @to-page="toPage"
      />
    </div>
    <slot
      name="footer"
      :loading="loading"
      :selected-objects="selectedObjects"
      :update-selected-objects="updateSelectedObjects"
      :url-params="urlParams"
      :fetch-data="fetchData"
    />
  </div>
</template>

<script>
import {
  computed, ref, onBeforeUnmount, onMounted, inject,
} from 'vue';
import { isObject } from 'lodash';
import { usePage } from '@inertiajs/inertia-vue3';
import { Inertia } from '@inertiajs/inertia';
import useLocale from '../../composables/useLocale';

export default {
  name: 'LayoutIndexPage',
  props: {
    name: {
      type: String,
      default: 'index',
    },
    indexKey: {
      type: String,
      default: 'indexData',
    },
    indexUrl: {
      type: String,
      default: null,
    },
    clearSelectedOnRequest: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, {emit}) {
    const { t } = useLocale();
    const portalApp = inject('PortalApp') || window.PortalApp;
    let entityType = ref('');
    let entities = ref({});
    let columns = ref([]);
    let links = ref({});
    let bulkActions = ref({});
    const urlParams = ref(new URLSearchParams(''));
    const loading = ref(false);

    const selectedObjects = ref({});
    const updateSelectedObjects = (id, isChecked) => {
      const obj = id;
      if (isObject(id)) {
        // eslint-disable-next-line no-param-reassign
        id = id.id;
      }
      if (isChecked) {
        selectedObjects.value[id] = obj;
      } else {
        delete selectedObjects.value[id];
      }
    };

    const ajaxRequest = () => {
      loading.value = true;
      portalApp.request()
        .get(props.indexUrl, {
          params: Object.fromEntries(urlParams.value),
        })
        .then((response) => {
          if (response.data?.data) {
            entityType.value = response.data.data.entityType;
            entities.value = response.data.data.entities;
            columns.value = response.data.data.columns;
            links.value = response.data.data.links;
            bulkActions.value = response.data.data.bulkActions;
            if (props.clearSelectedOnRequest) {
              selectedObjects.value = {};
            }
          }
        })
        .catch((e) => portalApp.onResponseError(e))
        .finally(() => {
          loading.value = false;
        });
    };

    const fetchData = (params = null) => {
      if (params && (params instanceof URLSearchParams)) {
        urlParams.value = params;
      }
      if (props.indexUrl) {
        ajaxRequest();
      } else {
        Inertia.get(window.location.href.split('?')[0], Object.fromEntries(urlParams.value));
      }
    };

    if (props.indexUrl) {
      fetchData();
    } else {
      entityType = computed(() => usePage().props.value[props.indexKey].entityType);
      entities = computed(() => usePage().props.value[props.indexKey].entities);
      columns = computed(() => usePage().props.value[props.indexKey].columns);
      links = computed(() => usePage().props.value[props.indexKey].links);
      bulkActions = computed(() => usePage().props.value[props.indexKey]?.bulkActions);
      urlParams.value = new URLSearchParams(usePage().props.value[props.indexKey]?.filtration);
    }

    const searchText = ref(urlParams.value.get('search'));
    const searchSubmit = () => {
      if (searchText.value) {
        urlParams.value.set('search', searchText.value);
        urlParams.value.set('page', 1);
      } else {
        urlParams.value.delete('search');
      }
      fetchData();
    };

    const refreshDashboardIndex = (name = 'index') => {
      if (name === props.name) {
        fetchData();
      }
    };


    onMounted(() => {
      portalApp.$on('refresh-dashboard-index', refreshDashboardIndex);
    });

    onBeforeUnmount(() => {
      portalApp.$off('refresh-dashboard-index', refreshDashboardIndex);
    });

    return {
      t,
      loading,
      selectedObjects,
      updateSelectedObjects,
      searchText,
      searchSubmit,
      urlParams,
      fetchData,
      entityType,
      entities,
      columns,
      links,
      bulkActions,
      toPage: (e) => {
        urlParams.value.set('page', e.pageNumber);
        fetchData();
      },
      rowActionExecuted: () => {
        fetchData();
      },
      bulkActionExecuted: (action) => {
        emit('bulk-action-executed', {action, entities: selectedObjects.value});
        if (action.onExecute) {
          // eslint-disable-next-line default-case
          switch (action.onExecute) {
            case 'reload':
              fetchData();
          }
        }
      },
    };
  },
};
</script>
