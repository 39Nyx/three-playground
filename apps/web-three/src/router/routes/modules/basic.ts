import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('page.basic.title'),
    },
    name: 'Basic',
    path: '/basic',
    children: [
      {
        meta: {
          title: $t('page.basic.simple.title'),
          icon: 'carbon:workspace',
          codeUrl: 'basic/simple/simple.vue',
        },
        name: 'BasicSimple',
        path: 'simple',
        component: () => import('#/views/basic/simple/simple.vue'),
      },
    ],
  },
];

export default routes;
