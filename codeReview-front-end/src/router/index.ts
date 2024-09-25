import { createWebHashHistory } from "vue-router";
import { createRouter } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import("../components/index.vue")
        }
    ]
})

export default router;