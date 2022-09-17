import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Pie from '../views/Pie.vue'
import table from '../views/goodsViews/table.vue'
import Edit from '../views/goodsViews/Edit.vue'
import shopTable from '../views/shopCartViews/shopTable.vue'
import usersTable from '../views/usersViews/usersTable.vue'
import login from "../views/login.vue"
import goodsType from "../views/goodsType/goodsTypeTale.vue"
import order from "../views/order/orderTable.vue"
import error from "../views/Error.vue"

Vue.use(VueRouter)

/*这个错误是vue-router内部错误,导致导航跳转问题,
往同一地址跳转时会报错的情况push和replace 都会导致这个情况的发生*/
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {

    return originalPush.call(this, location).catch(err => err)

}
const routes = [
    //登录界面
    {
        path: '/',
        name: 'login',
        component: login,
        meta: {
            showMenu: true
        }
    },
    //主界面
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    // 错误
    {
        path: "/error",
        component: error
    },
    {
        path: '/bar',
        name: 'bar',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/bar.vue')
    },
    //Echarts饼状图
    {
        path: '/pie',
        component: Pie,
    },
    //Element 商品数据表
    {
        path: '/table',
        component: table,
    },
    //编辑修改数据表
    {
        path: '/edit',
        component: Edit
    },
    //购物车的表单
    {
        path: '/shop',
        component: shopTable
    },
    //用户表单
    {
        path: '/user',
        component: usersTable
    },
    //订单界面
    {
        path: '/order',
        component: order,
        meta: {
            requireAuth: true
        }
    },
    //商品类型界面
    {
        path: '/goodsType',
        component: goodsType
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/')) {
        next()
    }
    let admin = JSON.parse(window.localStorage.getItem('accese-usename'))
    if (admin != null) {
        axios({
            url: "http://localhost:8080/verifyToke",
            method: "get",
            headers: {
                token: admin.token
            }
        }).then((response) => {
            if (!response.data) {
                console.log("账户失效,验证失败")
                next({path: 'error'})
            }
        })
        next()
    } else {
        next('/')
    }
})

export default router
