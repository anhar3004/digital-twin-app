import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProductView from '../views/ProductView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // Tandai bahwa halaman ini HANYA untuk "Tamu" (belum login)
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView // Tambahkan route login
    },
    {
      path: '/products',
      name: 'products',
      component: ProductView, // Tambahkan route login
      // Tandai bahwa halaman ini WAJIB login
      meta: { requiresAuth: true }
    },
    {
      // 1. URL Bersih: Menggunakan serialNumber sebagai identifier unik di URL
      path: '/products/:serialNumber',
      name: 'product-detail',

      // 2. Lazy Loading (Sangat disarankan untuk performa SEO/Core Web Vitals)
      component: () => import('@/views/ProductDetailView.vue'),

      // 3. Meta Data untuk Auth Guard
      meta: {
        requiresAuth: true,
        // Tambahkan title statis jika ingin digunakan sebagai fallback sebelum useHead dimuat
        title: 'Detail Unit | Holicindo'
      }
    }
  ],
})

// === SATPAM ROUTER (Navigation Guard) ===
router.beforeEach((to, from, next) => {
  // Cek apakah ada token di localStorage (artinya user sudah login)
  const isAuthenticated = !!localStorage.getItem('auth_token');

  // 1. Jika rute mewajibkan belum login (seperti form Login), TAPI user sudah login
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/products'); // Usir kembali ke halaman product
  }
  // 2. Jika rute mewajibkan auth (seperti Product), TAPI user belum login
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/'); // Lempar ke halaman login
  }
  // 3. Jika aman, persilakan lewat
  else {
    next();
  }
});

export default router
