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
        import(/* webpackChunkName: "login" */ "@views/Login.view.vue")
    },
    {
      path: "/dashboard",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "@views/layout/Dashboard.layout.vue"),
      children: [
        {
          path: "/",
          name: "child.list",
          meta: {
            title: "Children"
          },
          component: () =>
            import(/* webpackChunkName: "dashboard" */ "@views/child/ChildList.view.vue")
        }
      ]
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});
