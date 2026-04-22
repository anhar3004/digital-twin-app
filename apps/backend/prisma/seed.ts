import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL || "mysql://root:@localhost:3306/my_file_explorer_db";

// Adapter untuk MySQL
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
    const passwordAdmin = await bcrypt.hash("admin", 10);

    console.log("Sedang membuat data admin...");

    const admin1 = await prisma.user.upsert({
        where: { userId: 'manager_coffee' },
        update: {},
        create: {
            userId: 'manager_coffee',
            password: passwordAdmin,
            name: 'Manager Coffee',
        },
    });

    const admin2 = await prisma.user.upsert({
        where: { userId: 'manager_chocolate' },
        update: {},
        create: {
            userId: 'manager_chocolate',
            password: passwordAdmin,
            name: 'Manager Chocolate',
        },
    });

    // --- 2. SIAPKAN DATA PRODUCT & HUBUNGKAN KE USER ---

    // --- DAFTAR 10 PRODUK ---
    const productList = [
        {
            name: 'Spiral Mixer 6 kg',
            serialNumber: 'SC-2024-UX-99',
            modelId: 'SP-MIX-6',
            image: 'Spiral-Mixer-6-kg.webp',
            temperature: 10,
            tahunPembuatan: 2024,
            lokasi: 'Bandung, ID',
            kapasitas: '6 kg Dough',
            tipeKompresor: 'Heavy Duty Chain Drive', // Penggerak rantai
            spesifikasiKaca: 'Safety Guard Grid with Auto-stop', // Pelindung kisi-kisi
            sistemPendingin: 'Natural Air Ventilation',
            materialBody: 'Painted Steel & SS 304 Bowl',
            owners: [admin1.id, admin2.id]
        },
        {
            name: 'Twin Mixer 50 L',
            serialNumber: 'ULF-2024-ZK-01',
            modelId: 'TWIN-50L',
            image: 'Twin-Mixer-50-L.webp',
            temperature: 20,
            tahunPembuatan: 2023,
            lokasi: 'Bandung, ID',
            kapasitas: '50 Liter',
            tipeKompresor: 'Dual Motor Synchronous', // Dua motor sinkron
            spesifikasiKaca: 'Acrylic Splash Guard',
            sistemPendingin: 'Fan Cooled Motor',
            materialBody: 'Die-cast Aluminum',
            owners: [admin1.id]
        },
        {
            name: 'Planetary Mixer 10 L',
            serialNumber: 'SCS-2024-MM-05',
            modelId: 'PLAN-10L',
            temperature: 30,
            image: 'Planetary-Mixer-10-L.webp',
            tahunPembuatan: 2024,
            lokasi: 'Surabaya, ID',
            kapasitas: '10 Liter',
            tipeKompresor: '3-Speed Gear Transmission', // Transmisi gigi 3 kecepatan
            spesifikasiKaca: 'None (Open Top)',
            sistemPendingin: 'Internal Venting',
            materialBody: 'Stainless Steel 304',
            owners: [admin2.id]
        },
        {
            name: 'Spiral Mixer 25 kg',
            serialNumber: 'BBR-2024-LT-12',
            modelId: 'SP-MIX-25',
            image: 'Spiral-Mixer-25-kg.webp',
            temperature: 40,
            tahunPembuatan: 2024,
            lokasi: 'Semarang, ID',
            kapasitas: '25 kg Dough',
            tipeKompresor: 'Industrial Belt & Gear System',
            spesifikasiKaca: 'Stainless Steel Safety Cover',
            sistemPendingin: 'Overload Protection Fan',
            materialBody: 'Full Stainless Steel Grade 304',
            owners: [admin1.id, admin2.id]
        },
        {
            name: 'Planetary Mixer 90 L',
            serialNumber: 'LIF-2024-QR-88',
            modelId: 'PLAN-90L',
            image: 'Planetary-Mixer-90-L.webp',
            temperature: 50,
            tahunPembuatan: 2023,
            lokasi: 'Medan, ID',
            kapasitas: '90 Liter',
            tipeKompresor: 'Oil-bathed Gearbox Inverter', // Gearbox terendam oli
            spesifikasiKaca: 'Polycarbonate Shield',
            sistemPendingin: 'External Cooling Fins',
            materialBody: 'Heavy Duty Cast Iron Body',
            owners: [admin1.id]
        }
    ];

    // --- PROSES LOOPING ---

    for (const [index, productData] of productList.entries()) {
        // 1. BUAT ATAU UPDATE PRODUKNYA TERLEBIH DAHULU
        // Kita tidak melakukan 'connect' user di sini!
        const createdProduct = await prisma.product.upsert({
            where: { serialNumber: productData.serialNumber },
            update: {
                name: productData.name,
                modelId: productData.modelId,
                image: productData.image,
                temperature: productData.temperature,
                tahunPembuatan: productData.tahunPembuatan,
                lokasi: productData.lokasi,
                kapasitas: productData.kapasitas,
                tipeKompresor: productData.tipeKompresor,
                spesifikasiKaca: productData.spesifikasiKaca,
                sistemPendingin: productData.sistemPendingin,
                materialBody: productData.materialBody,
            },
            create: {
                name: productData.name,
                serialNumber: productData.serialNumber,
                modelId: productData.modelId,
                image: productData.image,
                temperature: productData.temperature,
                tahunPembuatan: productData.tahunPembuatan,
                lokasi: productData.lokasi,
                kapasitas: productData.kapasitas,
                tipeKompresor: productData.tipeKompresor,
                spesifikasiKaca: productData.spesifikasiKaca,
                sistemPendingin: productData.sistemPendingin,
                materialBody: productData.materialBody,
            },
        });

        // 2. HUBUNGKAN KE USER MELALUI TABEL PERANTARA (UserProduct)
        for (const userId of productData.owners) {
            // Set garansi 12 bulan dari sekarang
            const expiryDate = new Date();
            // Tambahkan bulan berdasarkan urutan (index) produk
            // Produk ke-0 = +1 bulan, Produk ke-1 = +2 bulan, dst.
            expiryDate.setMonth(expiryDate.getMonth() + (index + 1));
            await prisma.userProduct.upsert({
                where: {
                    // Menggunakan unique compound index yang kita buat di schema
                    userId_productId: {
                        userId: userId,
                        productId: createdProduct.id
                    }
                },
                update: {
                    status: "Aktif",
                    warrantyExpiry: expiryDate
                },
                create: {
                    userId: userId,
                    productId: createdProduct.id,
                    status: "Aktif",
                    warrantyExpiry: expiryDate
                }
            });
        }
    }
    console.log("✅ Data User dan Product berhasil dibuat dan dihubungkan!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });