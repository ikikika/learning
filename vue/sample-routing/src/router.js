import { createRouter, createWebHistory } from 'vue-router';
import TeamsList from './pages/TeamsList';
import UsersList from './pages/UsersList';
import TeamMembers from './components/teams/TeamMembers';
import TeamsFooter from './pages/TeamsFooter';
import UsersFooter from './pages/UsersFooter';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/teams',
    },
    {
      name: 'teams',
      path: '/teams',
      meta: { needsAuth: true },
      components: { default: TeamsList, footer: TeamsFooter },
      //   alias: '/',
      children: [
        {
          name: 'team-members',
          path: ':teamId',
          component: TeamMembers,
          props: true,
        },
      ],
    },
    {
      path: '/users',
      components: { default: UsersList, footer: UsersFooter },
      //   beforeEnter(_to, _from, next) {
      // guard can be defined here
      //   },
    },
    // {
    //   path: '/teams/:teamId',
    //   component: TeamMembers,
    //   props: true,
    // },
    {
      path: '/:notFound(.*)',
      redirect: '/',
    },
  ],
  linkActiveClass: 'active',
  scrollBehavior(_to, _from, savedPosition) {
    // to - going to
    // from - coming from
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach(function (to, from, next) {
  console.log(to, from);
  if (to.meta.needsAuth) {
    console.log('needs auth');
    next();
  } else {
    next();
  }
});

export default router;
