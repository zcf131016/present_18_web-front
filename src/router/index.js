import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import TeacherManage from "@/components/page/TeacherManage";
import StudentManage from "@/components/page/StudentManage";
import ManageBoard from "@/components/page/ManageBoard";
import RoleManage from "@/components/page/RoleManage";
import DataDictionary from "@/components/page/DataDictionary";
import LessonManage from "@/components/page/LessonManage";
import UserManage from "@/components/page/UserManage";
import HelloWorld from "@/components/HelloWorld";
import BaseTable from "@/components/base/BaseTable";
import Others from "@/components/Others";
import BaseForm from "@/components/base/BaseForm";
import ErrorPage from "@/views/ErrorPage";
import MenuManage from "@/components/page/MenuManage";
import SysParaManage from "@/components/page/SysParaManage";
import signManage from "@/components/page/signManage";
import UsersManage from "@/components/page/UsersManage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Home,
    name: '首页',
    meta: {
      keepAlive: true,
      requireAuth: true,
      title: '首页'
    },
    redirect: '/manageBoard',
    children: [
      {
        path: '/manageBoard',
        name: '数据面板',
        component: ManageBoard,
        hidden: true,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '管理面板'
        }
      },
      {
        path: '/roleManage',
        name: '角色管理',
        component: RoleManage,
        hidden: true,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '角色管理'
        }
      },
      {
        path: '/signManage',
        name: '签到管理',
        component: signManage,
        hidden: true,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '签到管理'
        }
      },
      {
        path: '/sysParaManage',
        name: '参数管理',
        component: SysParaManage,
        hidden: true,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '参数管理'
        }
      },
      {
        path: '/menuManage',
        name: '菜单管理',
        component: MenuManage,
        hidden: true,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '菜单管理'
        }
      },
      {
        path: '/user',
        name: '用户管理',
        component: UserManage,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '用户管理'
        },
        children: [
          {
            path: '/usersManage',
            name: '用户管理',
            component: UsersManage,
            meta: {
              keepAlive: true,
              requireAuth: true,
              title: '用户管理'
            }
          },
          {
            path: '/studentManage',
            name: '学生管理',
            component: StudentManage,
            meta: {
              keepAlive: true,
              requireAuth: true,
              title: '学生管理'
            }
          },
          {
            path: '/teacherManage',
            name: '教师管理',
            component: TeacherManage,
            meta: {
              keepAlive: true,
              requireAuth: true,
              title: '教师管理'
            }
          },
        ]
      },
      {
        path: '/lessonManage',
        name: '课程管理',
        component: LessonManage,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '课程管理'
        }
      },
      {
        path: '/dataDictionary',
        name: '数据字典',
        component: DataDictionary,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '数据字典'
        }
      },
      {
        path: '/test',
        name: '测试页面',
        component: HelloWorld,
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '测试页面'
        }
      },
      {
        path: '/others',
        name: '表单相关',
        component: Others,
        meta: {
          keepAlive: true,
          requireAuth: true
        },
        children: [
          {
            path: '/baseTable',
            name: '基础列表',
            component: BaseTable,
            meta: {
              keepAlive: true,
              requireAuth: true,
              title: '基础列表'
            }
          },
          {
            path: '/baseForm',
            name: '基础表单',
            component: BaseForm,
            meta: {
              keepAlive: true,
              requireAuth: true,
              title: '基础表单'
            }
          },
          {
            path: '/errorPage',
            name:'自定义异常页面',
            component: ErrorPage,
            meta: {
              keepAlive: true,
              requireAuth: true,
              title: '自定义异常页面'
            }
          },
          {
            path: '/404',
            name: '404页面',
            component: () => import('../views/404'),
            meta: {
              title: '404异常页面'
            }
          }
        ]
      },
      {
        path: '/about',
        name: '关于',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
        meta: {
          keepAlive: true,
          requireAuth: true,
          title: '关于我们'
        }
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import('../views/404'),
    meta: {
      title: '404页面'
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
