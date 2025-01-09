<!-- @format -->

# YouTube Video İndirici Chrome Eklentisi

<div align="center">
  <img src="logomuz.ico" alt="YouTube Video İndirici Logo" width="128"/>
  <br>
  <h3>Güvenli, Açık Kaynak ve Gizlilik Odaklı YouTube Video İndirici</h3>
</div>

## Genel Bakış

Bu Chrome eklentisi, YouTube videolarını MP4 formatında indirmenize ve M4A formatında ses dosyası olarak çıkarmanıza olanak tanır. Tamamen açık kaynaklıdır, üçüncü taraf API'ler kullanmaz ve gizlilik ile güvenlik ön planda tutularak tasarlanmıştır.

## Özellikler

- 🎥 MP4 formatında video indirme (1080p'ye kadar)
- 🎵 M4A formatında ses çıkarma (256kbps yüksek kalite)
- 🔒 Üçüncü taraf servis veya API yok
- 🚫 Veri toplama veya takip yok
- ⚡ Hızlı ve verimli indirme
- 💻 Tamamen yerel işleme
- 🔍 Açık kaynak ve şeffaf
- 🎨 Modern, piksel mükemmelliğinde arayüz tasarımı

## Güvenlik ve Gizlilik

- **%100 Açık Kaynak**: Tüm kod görünür ve denetlenebilir
- **Dış Bağımlılık Yok**: Sadece YouTube'un resmi akışlarını kullanır
- **Yerel İşleme**: Tüm indirmeler bilgisayarınızda işlenir
- **Veri Toplama Yok**: Kullanıcı verisi toplamaz veya saklamaz
- **Üçüncü Parti API Yok**: Sadece YouTube ile doğrudan iletişim
- **Güvenli ve Yasal**: Herkese açık video akışlarına izin verilen yöntemlerle erişir

## Nasıl Çalışır

### Teknik Mimari

1. **Video Algılama**:

   - İçerik betiği YouTube sayfa gezinmesini izler
   - DOM manipülasyonu ile video bilgilerini algılar
   - Video ID, başlık ve küçük resim URL'sini çıkarır

2. **İndirme Süreci**:

   - Stream çıkarma için yt-dlp kütüphanesi kullanır
   - YouTube'un herkese açık video akışlarına doğrudan erişim
   - Aracı sunucu veya üçüncü taraf servis yok

3. **Video İşleme**:

   - MP4 indirme: En iyi kalite video ve ses akışlarını birleştirir
   - M4A çıkarma: Ses akışını izole eder ve optimize eder
   - Tüm işlemler kullanıcının bilgisayarında gerçekleşir

4. **Dosya Yönetimi**:
   - Geçici dosyalar yerel indirme klasöründe saklanır
   - 1 dakika sonra otomatik temizleme
   - Güvenli dosya işleme ve uygun sanitizasyon

## Kurulum Kılavuzu

### Sistem Gereksinimleri

- İşletim Sistemi: Windows 10/11, macOS 10.15+ veya Linux
- Node.js: Sürüm 14.x veya üstü (Yerel sunucu için gerekli)
- Chrome/Firefox: En son sürüm
- Depolama: Minimum 100MB boş alan
- RAM: Minimum 4GB önerilen

### Adım Adım Kurulum

1. **Node.js Kurulumu**

   ```bash
   # Node.js'in kurulu olup olmadığını kontrol et
   node --version

   # Kurulu değilse, https://nodejs.org/ adresinden indir
   # LTS sürümünü seç
   ```

2. **yt-dlp Kurulumu**

   ```bash
   # macOS (Homebrew kullanarak)
   brew install yt-dlp

   # Windows (Yönetici olarak PowerShell'de)
   winget install yt-dlp

   # Linux (Ubuntu/Debian)
   sudo apt update
   sudo apt install yt-dlp
   ```

3. **Repository'yi Klonlama**

   ```bash
   # HTTPS kullanarak
   git clone https://github.com/ekincionthebeat/youtube-downloader.git

   # Proje dizinine git
   cd youtube-downloader
   ```

4. **Bağımlılıkların Kurulumu**

   ```bash
   # Gerekli Node.js paketlerini kur
   npm install
   ```

5. **Yerel Sunucuyu Başlatma**

   ```bash
   # Geliştirme modu
   npm run dev

   # Üretim modu
   npm start
   ```

6. **Eklentiyi Tarayıcıya Yükleme**

   - Chrome:

     1. `chrome://extensions/` adresini aç
     2. "Geliştirici modu"nu etkinleştir (sağ üst)
     3. "Paketlenmemiş öğe yükle"ye tıkla
     4. Eklenti dizinini seç

   - Firefox:
     1. `about:debugging` adresini aç
     2. "Bu Firefox"a tıkla
     3. "Geçici Eklenti Yükle"ye tıkla
     4. Eklenti dizininden manifest.json'ı seç

## Kullanım

1. Herhangi bir YouTube videosuna git
2. Eklenti simgesine tıkla
3. İndirme formatını seç:
   - MP4 (video - 1080p)
   - M4A (ses - 256kbps)
4. İşlenmeyi bekle
5. Dosyayı bilgisayarına kaydet

## Teknik Detaylar

### Bileşenler

- **Önyüz**: HTML, CSS, JavaScript
- **Arkayüz**: Node.js, Express
- **İndirme Motoru**: yt-dlp
- **Video İşleme**: FFmpeg (yt-dlp içinde yerleşik)

### Mimari

```
├── manifest.json        # Eklenti yapılandırması
├── popup.html          # Eklenti arayüzü
├── popup.js            # Arayüz mantığı
├── content.js          # YouTube sayfa entegrasyonu
├── background.js       # Arkaplan işlemleri
└── server.js          # Yerel işleme sunucusu
```

### Güvenlik Önlemleri

- Dosya adları için girdi temizleme
- Güvenli yerel dosya işleme
- Dış API çağrısı yok
- Geçici dosya temizleme
- Uygun hata yönetimi

## Lisans

MIT Lisansı - Özgürce kullanın, değiştirin ve dağıtın.

## İletişim

- GitHub: [ekincionthebeat](https://github.com/ekincionthebeat)
- Discord: ardabeat
