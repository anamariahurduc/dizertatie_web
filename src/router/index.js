import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/auth/LoginPage.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/auth/RegisterPage.vue')
        },
        {
            path: '/reset-password',
            name: 'reset-password',
            component: () => import('@/views/auth/ResetPasswordPage.vue')
        },
        {
            path: '/',
            component: () => import('@/layout/HomeNavbar.vue'), // doar navbarul
            children: [
                {
                    path: '',
                    redirect: '/home'
                },
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/user/HomePage.vue')
                }
            ]
        },
        {
            path:'/',
            component: AppLayout,
            meta: {
                requiresAuth: true,
                role: 'user'
            },
            children:
            [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/complaints/DashboardPage.vue')
                },
                {
                    path: '/chatbot',
                    name: 'chatbot',
                    component: () => import('@/views/complaints/ChatbotPage.vue')
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/user/ProfilePage.vue')
                },
                {
                    path: '/new-claim',
                    name: 'new_claim',
                    component: () => import('@/views/user/NewClaimPage.vue')
                },
                {
                    path: '/complaint/:id',
                    name: 'complaint',
                    component: () => import('@/views/complaints/ComplaintPage.vue')
                },
                {
                    path: '/complaints',
                    name: 'complaints',
                    component: () => import('@/views/complaints/AllComplaints.vue')
                },
                {
                    path: '/statistics',
                    name: 'statistics',
                    component: () => import('@/views/user/StatisticsPage.vue')
                },

            ]
        },
        {
            path: '/admin',
            component: AppLayout,
            meta: {
                requiresAuth: true,
                role: 'admin'
            },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: () => import('@/views/admin/DashboardPage.vue'),
                },
                {
                    path: 'users',
                    name: 'admin-users',
                    component: () => import('@/views/admin/UsersPage.vue'),
                }
            ],
        },
        {
            path: '/auth/access',
            name: 'access-denied',
            component: () => import('@/views/auth/AccessPage.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/views/auth/NotFoundPage.vue'),
        },

        {
            path: '/old',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboardold',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/auth/login',
            name: 'auth-login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (to.meta.requiresAuth && !user) {
        router.push({ name: 'login' });
    }

    if (to.meta.role && user?.role !== to.meta.role) {
        router.push({ name: 'access-denied' });
    }

    next();
});

export default router;
