<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-biru-tua shadow-sm">
    <div class="container-fluid px-4">

      <router-link to="/" class="navbar-brand fw-bold d-flex align-items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-cpu" viewBox="0 0 16 16">
          <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0m-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
        </svg>
        Digital Twin Portal
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse"
        :class="{ 'show': isMenuOpen }"
        id="navbarContent"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 mt-3 mt-lg-0">
          <!-- <li v-if="!isLoggedIn" class="nav-item">
            <router-link to="/" class="nav-link" active-class="active" @click="closeMenu">Home</router-link>
          </li> -->
          <li v-if="isLoggedIn" class="nav-item">
            <router-link to="/products" class="nav-link" active-class="active" @click="closeMenu">All Product</router-link>
          </li>
        </ul>

        <div v-if="isLoggedIn" class="d-flex align-items-center mt-3 mt-lg-0 pb-3 pb-lg-0">
          <button class="btn btn-outline-light w-100 text-start text-lg-center" @click="handleLogout">
            Logout, {{ userName }}
          </button>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref , onMounted} from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// State reaktif untuk mendeteksi apakah menu mobile sedang terbuka atau tertutup
const isMenuOpen = ref(false);

// Fungsi untuk membuka/menutup menu saat tombol ditekan
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Fungsi untuk menutup menu otomatis saat link diklik (opsional tapi bagus untuk UX)
const closeMenu = () => {
  isMenuOpen.value = false;
};

const userName = ref('');
const isLoggedIn = ref(false);

// Ambil nama user saat komponen dimuat
onMounted(() => {
  const token = localStorage.getItem('auth_token');
  const userInfoStr = localStorage.getItem('user_info');

  // Jika ada token dan data user, berarti dia sudah login
  if (token && userInfoStr) {
    isLoggedIn.value = true; // Munculkan tombol
    const user = JSON.parse(userInfoStr);
    userName.value = user.name;
  } else {
    isLoggedIn.value = false; // Sembunyikan tombol
  }
});

const handleLogout = () => {
  // 1. Konfirmasi (Opsional, agar user tidak tidak sengaja kepencet)
  const isConfirm = confirm('Apakah Anda yakin ingin keluar?');
  if (!isConfirm) return;

  // 2. Hapus token dan data user dari brankas browser
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');

  console.log('User berhasil logout');

  // 3. Tendang kembali ke halaman login
  router.push('/');
};
</script>

<style scoped>
.bg-biru-tua {
  background-color: #082f49 !important;
}

.nav-link {
  transition: color 0.2s ease-in-out;
}

.nav-link:hover {
  color: #bae6fd !important;
}

/* Memastikan transisi buka tutup menu terlihat halus */
.collapse {
  transition: height 0.3s ease;
}
</style>
