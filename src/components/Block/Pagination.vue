<template>
  <nav
    role="navigation"
    class="vid-pagination"
  >
    <div class="vid-pagination--desktop">
      <span
        v-if="onFirstPage"
        class="vid-pagination--desktop__prev-disabled"
      >
        <component
          :is="`${$formKitConfigs.componentPrefix}IconChevronLeft`"
          class="vid-pagination--desktop__icon"
        />
      </span>
      <a
        v-else
        class="vid-pagination--desktop__prev"
        @click.prevent="goTo(meta.prev_page_url, meta.current_page - 1)"
      >
        <component
          :is="`${$formKitConfigs.componentPrefix}IconChevronLeft`"
          class="vid-pagination--desktop__icon"
        />
      </a>

      <a
        v-if="hasMorePages"
        class="vid-pagination--desktop__next"
        @click.prevent="goTo(meta.next_page_url, meta.current_page + 1)"
      >
        <component
          :is="`${$formKitConfigs.componentPrefix}IconChevronRight`"
          class="vid-pagination--desktop__icon"
        />
      </a>
      <span
        v-else
        class="vid-pagination--desktop__next-disabled"
      >
        <component
          :is="`${$formKitConfigs.componentPrefix}IconChevronRight`"
          class="vid-pagination--desktop__icon"
        />
      </span>
    </div>

    <div class="vid-pagination--mobile">
      <div>
        <p class="vid-pagination--mobile__text">
          {{ t('Showing') }}
          <template v-if="meta.from">
            <span class="">{{ meta.from }}</span>
            {{ t('to') }}
            <span class="">{{ meta.to }}</span>
            {{ t('of') }}&nbsp;
          </template>
          <span class="">{{ meta.total }}</span>
          {{ t('results') }}
        </p>
      </div>

      <div>
        <span class="vid-pagination--mobile__actions">
          <!-- Previous Page Link -->
          <span
            v-if="onFirstPage"
            aria-disabled="true"
          >
            <span
              class="vid-pagination--mobile__prev-disabled"
              aria-hidden="true"
            >
              <component
                :is="`${$formKitConfigs.componentPrefix}IconChevronLeft`"
                class="vid-pagination--mobile__icon"
              />
            </span>
          </span>
          <a
            v-else
            rel="prev"
            class="vid-pagination--mobile__prev"
            @click.prevent="goTo(meta.prev_page_url, meta.current_page - 1)"
          >
            <component
              :is="`${$formKitConfigs.componentPrefix}IconChevronLeft`"
              class="vid-pagination--mobile__icon"
            />
          </a>
          <!-- Pagination Elements -->
          <template
            v-for="link in meta.links"
            :key="link.url"
          >
            <span
              v-if="link.url === null"
              aria-disabled="true"
            >
              <span
                class="vid-pagination--mobile__no-link"
                v-html="link.label"
              />
            </span>
            <template v-else>
              <span
                v-if="link.active"
                aria-current="page"
              >
                <span
                  class="vid-pagination--mobile__link-active"
                  v-html="link.label"
                />
              </span>
              <a
                v-else
                class="vid-pagination--mobile__link"
                @click.prevent="goTo(link.url, pageNumberFromLink(link))"
                v-html="link.label"
              />
            </template>
          </template>
          <!-- Next Page Link -->
          <a
            v-if="hasMorePages"
            rel="next"
            class="vid-pagination--mobile__next"
            @click.prevent="goTo(meta.next_page_url, meta.current_page + 1)"
          >
            <component
              :is="`${$formKitConfigs.componentPrefix}IconChevronRight`"
              class="vid-pagination--mobile__icon"
            />
          </a>
          <span
            v-else
            aria-disabled="true"
          >
            <span
              class="vid-pagination--mobile__next-disabled"
              aria-hidden="true"
            >
              <component
                :is="`${$formKitConfigs.componentPrefix}IconChevronRight`"
                class="vid-pagination--mobile__icon"
              />
            </span>
          </span>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import useLocale from '../../composables/useLocale';

export default {
  name: 'BlockPagination',
  props: {
    meta: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['to-page'],
  setup(props, { emit }) {
    const { t } = useLocale();
    return {
      t,
      onFirstPage: computed(() => props.meta.current_page <= 1),
      hasMorePages: computed(() => props.meta.current_page < props.meta.last_page),
      pageNumberFromLink: (link) => (new URL(link.url).searchParams.get('page') || 1),
      goTo: (link, pageNumber) => {
        emit('to-page', { link, pageNumber });
      },
    };
  },
};
</script>
