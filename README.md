# Game Matematika Yura

Game matematika online untuk anak TK dengan soal pertambahan dan pengurangan.

## Menjalankan dengan Docker

### Prerequisites
- Docker
- Docker Compose

### Cara Menjalankan

1. Clone atau download project ini
2. Buka terminal di folder project
3. Jalankan perintah berikut:

```bash
# Build dan jalankan container
docker-compose up --build

# Atau jalankan di background
docker-compose up -d --build
```

4. Buka browser dan akses: `http://localhost:3000`

### Perintah Docker Compose

```bash
# Menjalankan aplikasi
docker-compose up

# Menjalankan di background
docker-compose up -d

# Melihat logs
docker-compose logs

# Menghentikan aplikasi
docker-compose down

# Rebuild dan restart
docker-compose up --build
```

## Fitur Game
- 1000 soal matematika (pertambahan & pengurangan)
- Desain ramah anak dengan warna-warna cerah
- Pilihan ganda dengan 4 opsi
- Sistem scoring
- Penyimpanan soal dalam format JSON
