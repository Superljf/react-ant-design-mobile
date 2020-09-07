export default [
 // app插件
  {
    path: '/',
    component: '../layouts/MobileLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/classdynamics' },

      {
        path: '/classdynamics',
        component: './ClassDynamics',
      },
      {
        path: '/classdynamics/detail',
        component: './ClassNotice/Detail',
      },
    ],
  },

  // app
  // {
  //   path: '/',
  //   component: '../layouts/BasicLayout',
  //   Routes: ['src/pages/Authorized'],
  //   routes: [
  //     // dashboard
  //     // { path: '/', redirect: '/dashboard/analysis', authority: ['admin', 'user'] },
  //     { path: '/', redirect: '/dashboard/analysis'},
  //     {
  //       path: '/dashboard',
  //       name: 'dashboard',
  //       icon: 'dashboard',
  //       routes: [
  //         {
  //           path: '/dashboard/analysis',
  //           name: 'analysis',
  //           component: './Dashboard/Analysis',
  //         },
  //       ],
  //     },
  //     {
  //       name: 'exception',
  //       icon: 'warning',
  //       path: '/exception',
  //       hideInMenu: true,
  //       routes: [
  //         // exception
  //         {
  //           path: '/exception/403',
  //           name: 'not-permission',
  //           component: './Exception/403',
  //         },
  //         {
  //           path: '/exception/404',
  //           name: 'not-find',
  //           component: './Exception/404',
  //         },
  //         {
  //           path: '/exception/500',
  //           name: 'server-error',
  //           component: './Exception/500',
  //         },
  //         {
  //           path: '/exception/trigger',
  //           name: 'trigger',
  //           hideInMenu: true,
  //           component: './Exception/TriggerException',
  //         },
  //       ],
  //     },
  //     {
  //       component: '404',
  //     },
  //   ],
  // },
];
