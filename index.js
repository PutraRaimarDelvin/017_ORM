// index.js
const express = require('express');
const app = express();
const PORT = 3001;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Start server setelah DB siap
db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
  });

/**
 * Helper: validasi field wajib sesuai DB
 */
function validateKomikPayload(body) {
  const required = ['judul', 'penulis', 'deskripsi', 'tahun_terbit'];
  const missing = required.filter((k) => body[k] === undefined || body[k] === null || body[k] === '');
  const errors = [];

  if (missing.length) {
    errors.push(`Field wajib kosong: ${missing.join(', ')}`);
  }
  if (body.tahun_terbit !== undefined && !Number.isInteger(Number(body.tahun_terbit))) {
    errors.push('tahun_terbit harus berupa integer');
  }
  return errors;
}

// === ROUTES ===

// CREATE
app.post('/Komik', async (req, res) => {
  try {
    const errors = validateKomikPayload(req.body);
    if (errors.length) return res.status(400).send({ message: errors.join('; ') });

    const payload = {
      judul: req.body.judul,
      penulis: req.body.penulis,
      deskripsi: req.body.deskripsi,
      tahun_terbit: Number(req.body.tahun_terbit),
      penerbit: req.body.penerbit ?? null
    };

    const komik = await db.Komik.create(payload);
    return res.status(201).send(komik);
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

// READ (all)
app.get('/Komik', async (_req, res) => {
  try {
    const data = await db.Komik.findAll({ order: [['id', 'ASC']] });
    return res.send(data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// READ (by id)
app.get('/Komik/:id', async (req, res) => {
  try {
    const komik = await db.Komik.findByPk(req.params.id);
    if (!komik) return res.status(404).send({ message: 'Komik tidak ditemukan' });
    return res.send(komik);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// UPDATE
app.put('/Komik/:id', async (req, res) => {
  try {
    const komik = await db.Komik.findByPk(req.params.id);
    if (!komik) return res.status(404).send({ message: 'Komik tidak ditemukan' });

    const update = {};
    if (req.body.judul !== undefined) update.judul = req.body.judul;
    if (req.body.penulis !== undefined) update.penulis = req.body.penulis;
    if (req.body.deskripsi !== undefined) update.deskripsi = req.body.deskripsi;
    if (req.body.tahun_terbit !== undefined) {
      if (!Number.isInteger(Number(req.body.tahun_terbit))) {
        return res.status(400).send({ message: 'tahun_terbit harus berupa integer' });
      }
      update.tahun_terbit = Number(req.body.tahun_terbit);
    }
    if (req.body.penerbit !== undefined) update.penerbit = req.body.penerbit;

    await komik.update(update);
    return res.send({ message: 'Komik berhasil diupdate', komik });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

// DELETE
app.delete('/Komik/:id', async (req, res) => {
  try {
    const komik = await db.Komik.findByPk(req.params.id);
    if (!komik) return res.status(404).send({ message: 'Komik tidak ditemukan' });

    await komik.destroy();
    return res.send({ message: 'Komik berhasil dihapus' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});
