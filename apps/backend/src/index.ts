import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";
import { staticPlugin } from '@elysiajs/static'

const connectionString = process.env.DATABASE_URL || "mysql://root:@localhost:3306/digital_twin_db";
const adapter = new PrismaMariaDb(connectionString);
const db = new PrismaClient({ adapter });
const port = process.env.PORT || 3000;

const app = new Elysia()
  .use(cors())
  .use(
    jwt({
      name: 'jwt',
      secret: 'RAHASIA_NEGARA_123' // Pastikan ini aman di production
    })
  ).use(staticPlugin({
    assets: "public", // Folder tempat menyimpan gambar
    prefix: "/public" // Prefix URL untuk mengaksesnya
  }))
  .post("/api/login", async ({ body, jwt, set }) => {
    const { userId, password } = body;

    // 1. Cari user di database
    const user = await db.user.findUnique({
      where: { userId }
    });

    if (!user) {
      set.status = 401;
      return { error: "User tidak ditemukan" };
    }

    // 2. Cek password (bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      set.status = 401;
      return { error: "Password salah" };
    }

    // 3. Buat Token
    const token = await jwt.sign({
      id: user.id,
      name: user.name
    });

    return {
      message: "Login Berhasil",
      token,
      user: { name: user.name, userId: user.userId }
    };
  }, {
    body: t.Object({
      userId: t.String(),
      password: t.String()
    })
  })
  .get("/api/products", async ({ headers, jwt, set }) => {
    // 1. Ambil token dari header Authorization (Format: "Bearer <token>")
    const authHeader = headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      set.status = 401;
      return { error: "Akses ditolak. Token tidak ditemukan." };
    }

    // 2. Verifikasi keaslian token
    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = 401;
      return { error: "Token tidak valid atau sudah kedaluwarsa." };
    }

    // 3. Ambil produk dari database (Hanya yang dimiliki oleh user ini)
    // Di dalam rute .get("/api/products", ...)
    try {
      // Ambil data dari tabel perantara (UserProduct)
      const userRelations = await db.userProduct.findMany({
        where: {
          userId: payload.id // ID user dari token JWT
        },
        include: {
          product: true // Ambil detail informasi produknya
        }
      });

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const formattedProducts = userRelations.map((rel) => {
        // 1. Konversi ke objek Date dan netralkan waktunya ke jam 00:00:00.000
        const expiryDate = new Date(rel.warrantyExpiry);
        expiryDate.setHours(0, 0, 0, 0);

        // 2. Bandingkan tanggal saja
        // Jika expiryDate lebih kecil dari hari ini, berarti sudah lewat hari
        const isExpired = expiryDate < now;

        // Jika sudah expired, paksa status jadi 'Expired'
        const finalStatus = isExpired ? 'Expired' : rel.status;

        return {
          id: rel.product.id,
          name: rel.product.name,
          serialNumber: rel.product.serialNumber,
          modelId: rel.product.modelId,
          image: rel.product.image,

          // Field Data Sensor
          temperature: rel.product.temperature,
          // Field Spesifikasi (Sesuai Seeder Mixer)
          tahunPembuatan: rel.product.tahunPembuatan,
          lokasi: rel.product.lokasi,
          kapasitas: rel.product.kapasitas,
          tipeKompresor: rel.product.tipeKompresor,
          spesifikasiKaca: rel.product.spesifikasiKaca,
          sistemPendingin: rel.product.sistemPendingin,
          materialBody: rel.product.materialBody,
          serviceStatus: rel.serviceStatus,

          // Status Garansi Dinamis
          warrantyStatus: finalStatus,
          warrantyExpiry: rel.warrantyExpiry
        };
      });
      return formattedProducts;
    } catch (error) {
      console.error("Database Error:", error);
      set.status = 500;
      return { error: "Gagal mengambil data dari database" };
    }
  })
  .get("/api/products/:serialNumber", async ({ params: { serialNumber }, headers, jwt, set }) => {
    const authHeader = headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      set.status = 401;
      return { error: "Unauthenticated" };
    }

    const payload = await jwt.verify(token);
    if (!payload) {
      set.status = 401;
      return { error: "Invalid token" };
    }

    try {
      // Cari relasi user-product untuk mendapatkan status & garansi spesifik
      const relation = await db.userProduct.findFirst({
        where: {
          userId: payload.id,
          product: {
            // Kita masuk ke relasi product untuk mencari serialNumber
            serialNumber: serialNumber
          }
        },
        include: {
          product: true
        }
      });

      if (!relation) {
        set.status = 404;
        return { error: "Produk tidak ditemukan" };
      }

      // Hitung status expired secara dinamis seperti di halaman list
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const expiryDate = new Date(relation.warrantyExpiry);
      expiryDate.setHours(0, 0, 0, 0);

      return {
        ...relation.product,
        status: expiryDate < now ? 'Expired' : relation.status,
        warrantyExpiry: relation.warrantyExpiry
      };
    } catch (e) {
      set.status = 500;
      return { error: "Server error" };
    }
  })
  .patch("/api/products/:id/service", async ({ params: { id }, headers, jwt, set }) => {
    const authHeader = headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    const payload = await jwt.verify(token || "");

    if (!payload) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    try {
      // 1. Cari data saat ini untuk tahu status terakhir
      const current = await db.userProduct.findUnique({
        where: { userId_productId: { userId: payload.id, productId: id } }
      });

      if (!current) {
        set.status = 404;
        return { error: "Product not found" };
      }

      // 2. Toggle status (jika true jadi false, jika false jadi true)
      const updated = await db.userProduct.update({
        where: { userId_productId: { userId: payload.id, productId: id } },
        data: { serviceStatus: !current.serviceStatus }
      });

      return { serviceStatus: updated.serviceStatus };
    } catch (e) {
      set.status = 500;
      return { error: "Internal Server Error" };
    }
  })
  .listen(port)

  console.log(`🦊 Elysia is running at port ${port}`)
