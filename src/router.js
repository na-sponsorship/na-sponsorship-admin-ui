import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "@views/Login.view.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "@views/layout/Dashboard.layout.vue"),
      children: [
        {
          path: "/",
          name: "child.list",
          meta: {
            title: "Children",
          },
          component: () =>
            import(/* webpackChunkName: "child.list" */ "@views/child/ChildList.view.vue"),
        },
        {
          path: "/dashboard/users",
          name: "user.list",
          meta: {
            title: "Users",
          },
          component: () =>
            import(/* webpackChunkName: "user.list" */ "@views/user/UserList.view.vue"),
        },
      ],
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
    },
  ],
});
