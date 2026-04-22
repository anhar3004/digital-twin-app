<template>
  <div class="jumbotron-wrapper d-flex align-items-center justify-content-center text-center">
    <div class="container px-4">

      <h1 class="display-4 fw-bold text-white mb-4">
        Portal Pusat <span class="text-accent">Produk Industri & Infrastruktur Pendingin Premium</span><br>PT. Holicindo Dasa Anugerah
      </h1>

      <p class="lead text-white-50 mx-auto mb-5" style="max-width: 800px;">
        Verifikasi keaslian, masa berlaku, dan status layanan unit Anda secara instan dalam satu platform terpadu. Akses eksklusif untuk klien terdaftar.
      </p>

      <button @click="goToLogin" class="btn btn-accent btn-lg px-5 py-3 fw-bold rounded-pill shadow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-lock-fill me-2 mb-1" viewBox="0 0 16 16">
          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2"/>
        </svg>
        SILAKAN LOGIN DAHULU
      </button>

      <div class="mt-4">
        <small class="text-white-50">Butuh bantuan akses? <a href="#" class="text-accent text-decoration-none">Hubungi Administrator</a></small>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// Impor useRouter jika Anda ingin tombolnya langsung pindah ke halaman login
import { useRouter } from 'vue-router';
import { useHead } from '@unhead/vue'

const router = useRouter();

useHead({
  // Judul utama yang memuat nama Brand + Kata Kunci Utama
  title: 'Holicindo | Showcase Industri & Infrastruktur Pendingin Premium',

  meta: [
    {
      name: 'description',
      content: 'Holicindo adalah produsen terkemuka showcase industri dan infrastruktur pendingin premium di Indonesia. Solusi terbaik untuk bisnis dan komersial.'
    },
    // Open Graph untuk Beranda
    { property: 'og:title', content: 'Holicindo | Showcase Industri & Infrastruktur Pendingin Premium' },
    { property: 'og:description', content: 'Solusi infrastruktur pendingin premium dan showcase industri terpercaya buatan Indonesia.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://domain.com/' },
    { property: 'og:image', content: 'https://domain.com/images/holicindo-banner.jpg' }
  ],

  // Schema Markup menggunakan @graph untuk menggabungkan Organization & WebSite
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            // 1. Schema Organisasi (Profil Perusahaan)
            "@type": "Organization",
            "@id": "https://domain.com/#organization",
            "name": "Holicindo",
            "url": "https://domain.com",
            "logo": "https://domain.com/images/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+62-800-123-4567", // Ganti dengan nomor asli jika ada
              "contactType": "customer service",
              "areaServed": "ID",
              "availableLanguage": "Indonesian"
            }
          },
          {
            // 2. Schema Website (Informasi Situs)
            "@type": "WebSite",
            "@id": "https://domain.com/#website",
            "url": "https://domain.com",
            "name": "Holicindo",
            "publisher": {
              "@id": "https://domain.com/#organization"
            },
            // Opsional: Jika Anda punya fitur Search (pencarian produk) di Home
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://domain.com/products?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        ]
      })
    }
  ]
})

const goToLogin = () => {
  // Ganti dengan router.push('/login') nantinya
  // alert('Mengarahkan klien ke halaman otentikasi aman...');
  router.push('/login') ;
};
</script>

<style scoped>
/* Latar Belakang Industrial Blue dengan sedikit gradasi halus di atasnya */
.jumbotron-wrapper {
  background-color: #0b1f38;
  /* Atur tinggi Jumbotron. 80vh = 80% tinggi layar. Ubah jika ingin lebih kecil */
  min-height: 85vh;
  background-image: radial-gradient(circle at 50% 0%, rgba(222, 255, 154, 0.05) 0%, transparent 60%);
}

/* Warna aksen hijau/kuning lemon */
.text-accent {
  color: #deff9a;
}

/* Custom styling untuk tombol agar sesuai tema */
.btn-accent {
  background-color: #deff9a;
  color: #0b1f38; /* Teks warna gelap */
  border: none;
  transition: all 0.3s ease-in-out;
}

/* Efek saat tombol disorot mouse */
.btn-accent:hover {
  background-color: #cceb87;
  color: #050a12;
  transform: translateY(-3px); /* Tombol sedikit terangkat */
}
</style>
