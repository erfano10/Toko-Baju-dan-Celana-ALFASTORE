# Setup: Pesanan Otomatis Masuk Spreadsheet

Lakukan sekali saja, sekitar 5–10 menit.

---

## Langkah 1 — Siapkan Sheet TRANSAKSI

Buka Google Spreadsheet kamu, klik sheet **TRANSAKSI**.
Isi baris pertama (baris 1) dengan header ini persis:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| nama_pembeli | nomor_wa | alamat | nama_produk | kategori | ukuran | merk | harga | jumlah | deskripsi | tanggal |

> Baris 2 ke bawah akan terisi otomatis dari website.

---

## Langkah 2 — Buka Apps Script

1. Di Google Spreadsheet, klik **Extensions → Apps Script**
2. Tab baru terbuka
3. Hapus semua kode yang ada

---

## Langkah 3 — Paste Kode Ini

```javascript
function doPost(e) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("TRANSAKSI");

    // Parse body — support application/json dan text/plain
    const raw  = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    // Nomor urut otomatis
    const lastRow = sheet.getLastRow();
    const no      = lastRow < 1 ? 1 : lastRow; // baris 1 = header, jadi no = lastRow

    sheet.appendRow([
      data.nama         || "",
      data.hp           || "",
      data.alamat       || "",
      data.nama_produk  || "",
      data.kategori     || "",
      data.ukuran       || "",
      data.merk         || "",
      data.harga        || "",
      data.jumlah       || 1,
      data.deskripsi    || "",
      data.tanggal      || new Date().toLocaleString("id-ID")
    ]);

    // Warnai baris baru agar mudah dilihat
    const newRow = sheet.getLastRow();
    sheet.getRange(newRow, 1, 1, 12)
         .setBackground("#1a1a2e")
         .setFontColor("#ffffff");

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", row: newRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi test — jalankan manual untuk cek koneksi
function testDoPost() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        tanggal:     "1/6/2025, 14.00",
        nama:        "Test User",
        hp:          "08123456789",
        alamat:      "Jl. Test No. 1, Jakarta",
        nama_produk: "Kemeja Test",
        kategori:    "baju",
        merk:        "TEST",
        ukuran:      "L",
        kondisi:     "Baru",
        harga:       "Rp 100.000",
        status:      "menunggu konfirmasi"
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
```

Klik **💾 Save** (Ctrl+S). Beri nama project bebas, misal `noir-store`.

---

## Langkah 4 — Test Dulu Sebelum Deploy

1. Di dropdown fungsi (atas tengah), pilih **testDoPost**
2. Klik **▶ Run**
3. Klik **Review permissions → Allow**
4. Cek sheet TRANSAKSI — harus muncul 1 baris data test
5. Kalau muncul = berhasil, lanjut ke langkah 5

---

## Langkah 5 — Deploy sebagai Web App

1. Klik **Deploy → New deployment**
2. Klik ikon ⚙ → pilih **Web app**
3. Isi:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**
5. Klik **Authorize access → Allow**
6. **Copy URL** yang muncul:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## Langkah 6 — Pasang URL ke app.js

Buka `app.js`, cari:

```js
scriptURL: "",
```

Ganti:

```js
scriptURL: "https://script.google.com/macros/s/AKfycb.../exec",
```

Simpan. Selesai.

---

## Langkah 7 — Test dari Website

1. Buka website
2. Klik "Ambil" pada produk mana saja
3. Isi form: nama, HP, alamat, ukuran
4. Klik "Pesan Sekarang"
5. Buka sheet TRANSAKSI — data harus muncul dalam 2–5 detik

---

## Kenapa Data Tidak Masuk? (Troubleshooting)

| Masalah | Solusi |
|---|---|
| scriptURL masih kosong | Isi URL di app.js |
| URL salah / typo | Copy ulang dari Apps Script |
| Belum authorize | Jalankan testDoPost lagi, klik Allow |
| Deploy lama tidak diupdate | Deploy ulang → **New deployment** (bukan edit existing) |
| Nama sheet salah | Pastikan nama sheet persis `TRANSAKSI` (huruf kapital semua) |

> **Penting:** Setiap kali kamu edit kode Apps Script, harus **deploy ulang** dengan **New deployment** — bukan edit existing deployment. URL bisa berubah, update lagi di app.js.

---

## Hasil di Spreadsheet

Setiap pesanan masuk akan terlihat seperti ini:

| nama_pembeli | nomor_wa | alamat | nama_produk | kategori | ukuran | merk | harga | jumlah | deskripsi | tanggal |
|---|---|---|---|---|---|---|---|---|---|---|
| Budi Santoso | 08123456789 | Jl. Merdeka No.5, Jakarta | Kemeja Oversize | baju | L | NOIR | Rp 185.000 | 1 | Kemeja premium... | 1/6/2025, 14.30 |

Admin bisa update kolom **Status** secara manual:
- `menunggu konfirmasi` → saat baru masuk
- `dikonfirmasi` → setelah deal
- `dikirim` → setelah barang dikirim
- `selesai` → transaksi selesai
- `dibatalkan` → jika batal
