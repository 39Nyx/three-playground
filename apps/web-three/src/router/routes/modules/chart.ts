import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Charts',
    path: '/charts',
    component: () => import('#/views/charts/charts.vue'),
    meta: {
      icon: 'carbon:workspace',
      title: $t('page.charts.title'),
    },
  },
  {
    name: 'ChartsPreview',
    path: '/charts/preview',
    component: () => import('#/views/charts/preview/preview.vue'),
    meta: {
      icon: 'carbon:workspace',
      title: $t('page.charts.title'),
      keepAlive: true,
      hideInMenu: true,
    },
    props: (route) => {
      return {
        cid: route.query.cid,
      };
    },
  },
];

export default routes;
