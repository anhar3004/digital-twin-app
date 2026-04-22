<template>
  <footer class="custom-bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
    <div class="container px-4">
      <div class="row gy-4">

        <div class="col-lg-4 col-md-6">
          <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-cpu text-accent" viewBox="0 0 16 16">
              <path d="M5 0a.5.5 0 0 1 .5.5V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2h1V.5a.5.5 0 0 1 1 0V2A2.5 2.5 0 0 1 14 4.5h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14v1h1.5a.5.5 0 0 1 0 1H14a2.5 2.5 0 0 1-2.5 2.5v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14h-1v1.5a.5.5 0 0 1-1 0V14A2.5 2.5 0 0 1 2 11.5H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2v-1H.5a.5.5 0 0 1 0-1H2A2.5 2.5 0 0 1 4.5 2V.5A.5.5 0 0 1 5 0m-.5 3A1.5 1.5 0 0 0 3 4.5v7A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 11.5 3zM5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5zM6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
            </svg>
            Portal Digital Twin
          </h5>
          <p class="text-white-50 small mb-0">
            Solusi terpadu untuk pemantauan aset industri, manajemen garansi, dan integrasi Digital Twin secara real-time.
          </p>
        </div>

        <div class="col-lg-2 col-md-6">
          <h6 class="fw-bold mb-3 text-uppercase letter-spacing">Tautan</h6>
          <ul class="list-unstyled small">
            <li class="mb-2"><router-link to="/" class="footer-link">Dashboard</router-link></li>
            <li class="mb-2"><router-link to="/products" class="footer-link">Unit & Aset</router-link></li>
            <li class="mb-2"><a href="#" class="footer-link">Cek Garansi</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h6 class="fw-bold mb-3 text-uppercase letter-spacing">Dukungan</h6>
          <ul class="list-unstyled small">
            <li class="mb-2"><a href="#" class="footer-link">Pusat Bantuan</a></li>
            <li class="mb-2"><a href="#" class="footer-link">Ketentuan Garansi</a></li>
            <li class="mb-2"><a href="#" class="footer-link">Kebijakan Privasi</a></li>
          </ul>
        </div>

        <div class="col-lg-3 col-md-6">
          <h6 class="fw-bold mb-3 text-uppercase letter-spacing">Hubungi Kami</h6>
          <ul class="list-unstyled small text-white-50">
            <li class="mb-2 d-flex align-items-start gap-2">
              <i class="bi bi-geo-alt text-accent mt-1"></i>
              <span>Kawasan Industri Terpadu<br>Bandung, Jawa Barat, ID</span>
            </li>
            <li class="mb-2 d-flex align-items-center gap-2">
              <i class="bi bi-envelope text-accent"></i> support@digitaltwin.id
            </li>
            <li class="mb-2 d-flex align-items-center gap-2">
              <i class="bi bi-telephone text-accent"></i> (022) 1234-5678
            </li>
          </ul>
        </div>

      </div>

      <hr class="my-4 border-light opacity-10">

      <div class="row align-items-center">
        <div class="col-md-6 text-center text-md-start small text-white-50">
          &copy; {{ currentYear }} Portal Digital Twin. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Mengambil tahun saat ini secara otomatis
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.custom-bg-dark {
  background-color: #082f49; /* Sedikit lebih gelap dari warna Jumbotron agar ada kontras */
}

.text-accent {
  color: #deff9a;
}

.letter-spacing {
  letter-spacing: 1px;
}

/* Efek transisi halus saat tautan disorot */
.footer-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.2s ease-in-out, padding-left 0.2s ease-in-out;
}

.footer-link:hover {
  color: #deff9a;
  padding-left: 5px; /* Sedikit bergeser ke kanan saat di-hover */
}
</style>
