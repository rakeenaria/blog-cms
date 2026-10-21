<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('post_category')->truncate();
        DB::table('posts')->truncate();
        Schema::enableForeignKeyConstraints();

        $author1 = User::where('email', 'author1@blog.com')->first();
        $author2 = User::where('email', 'author2@blog.com')->first();

        $tech     = Category::where('name', 'Technology')->first();
        $travel   = Category::where('name', 'Travel')->first();
        $food     = Category::where('name', 'Food')->first();
        $health   = Category::where('name', 'Health')->first();
        $business = Category::where('name', 'Business')->first();

        $posts = [
            // --- Post Bahasa Indonesia (Topik Baru dengan Kategori yang Ada) ---
            [
                'user_id'      => $author1->id,
                'title'        => 'Menjelajahi Arsitektur AI Modern: Panduan Praktis bagi Pengembang Web',
                'body'         => '<p>Perkembangan teknologi kecerdasan buatan kini tidak hanya berkutat pada model matematika yang rumit, namun telah bertransformasi menjadi API dan layanan praktis yang dapat diintegrasikan langsung ke dalam aplikasi web modern.</p><p>Sebagai pengembang, memahami cara mengorkestrasi prompt, mengelola rate limit, serta mengamankan kunci API adalah kompetensi esensial. Di masa depan, integrasi AI akan menjadi fitur standar dalam setiap platform digital, dari personalisasi konten hingga asisten pintar.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subHours(5),
                'categories'   => [$tech->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Menemukan Ketenangan di Danau Toba: Catatan Perjalanan Menjelajahi Samosir',
                'body'         => '<p>Danau Toba menyuguhkan pemandangan bentang alam vulkanis yang begitu megah dan menyejukkan mata. Udara sejuk pegunungan serta keramahan masyarakat di Pulau Samosir menawarkan pelarian sempurna dari kebisingan kota metropolitan.</p><p>Menyewa sepeda motor untuk menyusuri jalanan pesisir danau di saat kabut pagi turun adalah pengalaman magis yang mengajarkan kita untuk kembali melambat dan menikmati indahnya momen saat ini.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subHours(18),
                'categories'   => [$travel->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Filosofi Rasa Rendang: Warisan Kuliner Minangkabau yang Menggugah Selera',
                'body'         => '<p>Rendang bukan sekadar olahan daging sapi berempah, melainkan manifestasi kesabaran, filosofi hidup, dan kekayaan budaya Minangkabau. Proses memasak yang memakan waktu berjam-jam untuk mengubah gulai menjadi kalio hingga akhirnya rendang kering menuntut ketelatenan tinggi.</p><p>Perpaduan serai, lengkuas, daun jeruk, serta rempah pilihan berpadu dengan santan kelapa menghasilkan cita rasa gurih autentik yang telah diakui kelezatannya di panggung kuliner dunia.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(1),
                'categories'   => [$food->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Seni Mengelola Screen Time: Menjaga Kesehatan Mata dan Kebugaran Mental',
                'body'         => '<p>Bekerja seharian di depan monitor sering kali memicu kelelahan visual (digital eye strain) dan gangguan pola tidur akibat paparan cahaya biru.</p><p>Menerapkan aturan 20-20-20 — mengalihkan pandangan sejauh 20 kaki selama 20 detik setiap 20 menit — serta membatasi penggunaan gawai satu jam sebelum tidur terbukti secara ilmiah membantu menjaga kejernihan pikiran dan memulihkan stamina harian.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(2),
                'categories'   => [$health->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Fondasi Kuat Membangun Bisnis Berkelanjutan bagi Pelaku UMKM',
                'body'         => '<p>Banyak usaha mikro dan kecil yang memiliki produk luar biasa namun terhambat dalam pertumbuhannya karena pencatatan keuangan yang belum tertib. Memisahkan rekening pribadi dengan rekening operasional usaha adalah langkah fundamental yang sering diabaikan.</p><p>Dengan laporan arus kas yang transparan dan strategi pemasaran digital yang tepat sasaran, UMKM lokal mampu bersaing dan bertahan menghadapi tantangan ekonomi yang dinamis.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(3),
                'categories'   => [$business->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Transformasi Digital dan Keamanan Data: Kunci Kepercayaan Konsumen Masa Depan',
                'body'         => '<p>Dalam lanskap bisnis modern, adopsi teknologi cloud dan otomasi proses kerja memberikan efisiensi yang luar biasa. Namun, kecepatan inovasi harus selalu diimbangi dengan standar perlindungan data yang ketat.</p><p>Perusahaan yang memprioritaskan privasi data pelanggannya akan memenangkan loyalitas jangka panjang di tengah era digital yang semakin kompetitif.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(3)->subHours(8),
                'categories'   => [$tech->id, $business->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Eksplorasi Kuliner Malam Legendaris di Sudut Kota Yogyakarta',
                'body'         => '<p>Yogyakarta selalu memikat hati siapa saja yang berkunjung. Menyusuri sudut-sudut jalanan saat malam tiba membawa kita pada aroma khas arang bakaran sate klathak hingga manis legitnya gudeg tradisional yang dimasak dengan kayu bakar.</p><p>Wisata kuliner di kota budaya ini bukan hanya memanjakan lidah, melainkan juga menghangatkan jiwa melalui percakapan hangat bersama para penjual yang bersahaja.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(4),
                'categories'   => [$food->id, $travel->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Draf: Membangun Kebiasaan Menulis Reflektif di Era Informasi Cepat',
                'body'         => '<p>Catatan draf awal mengenai pentingnya meluangkan waktu sejenak untuk menulis jurnal harian dan merangkum ide-ide kreatif sebelum terdistraksi arus linimasa media sosial.</p>',
                'status'       => 'draft',
                'published_at' => null,
                'categories'   => [$health->id],
            ],

            // --- Post Sampel Sebelumnya ---
            [
                'user_id'      => $author1->id,
                'title'        => 'Getting Started with Laravel 13 and PHP 8.5',
                'body'         => '<p>Laravel 13 paired with PHP 8.5 offers an incredibly refined developer experience. In this guide, we explore modern routing, type-safety improvements, and optimized session management.</p><p>Building REST APIs with Laravel has never been faster or cleaner!</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(10),
                'categories'   => [$tech->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Top 10 Must-Visit Travel Destinations for 2027',
                'body'         => '<p>Looking forward to your next adventure? From the pristine beaches of Southeast Asia to the historic mountains of Southern Europe, here are top 10 handpicked spots you should consider visiting.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(8),
                'categories'   => [$travel->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Healthy Meal Prepping on a College Student Budget',
                'body'         => '<p>Nutritious eating does not require gourmet spending. Learn how smart bulk purchasing, seasonal produce, and simple batch cooking recipes can save you time and money.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(6),
                'categories'   => [$food->id, $health->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Draft: Upcoming Trends in Artificial Intelligence',
                'body'         => '<p>This is a working draft summarizing cutting-edge advancements in neural architectures and agentic workflows. Not yet ready for public reading.</p>',
                'status'       => 'draft',
                'published_at' => null,
                'categories'   => [$tech->id],
            ],
            [
                'user_id'      => $author1->id,
                'title'        => 'Architecting Secure REST APIs with Sanctum SPA Cookies',
                'body'         => '<p>Modern single-page applications benefit greatly from HttpOnly cookie authentication. It shields credentials from client-side XSS vulnerabilities while maintaining seamless session state.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(4),
                'categories'   => [$tech->id, $business->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Starting Your First SaaS Business from Scratch',
                'body'         => '<p>Transitioning from developer to founder is an exciting journey. This post outlines key steps: validating market demand, building an MVP, and acquiring early adopters.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(9),
                'categories'   => [$business->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'A Street Food Tour Across Southeast Asia',
                'body'         => '<p>Join us on a culinary journey across night markets in Bangkok, Penang, and Ho Chi Minh City. We review famous noodles, desserts, and local beverages.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(7),
                'categories'   => [$food->id, $travel->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Ergonomics and Mental Wellness for Remote Developers',
                'body'         => '<p>Working from home demands conscious habits. Simple adjustments like proper monitor height, timed breaks, and daily walks drastically reduce fatigue and burnout.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(5),
                'categories'   => [$health->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'Draft: Investment Principles for Junior Engineers',
                'body'         => '<p>Preliminary notes discussing index funds, compounding interest, and emergency fund planning for early-career software developers.</p>',
                'status'       => 'draft',
                'published_at' => null,
                'categories'   => [$business->id],
            ],
            [
                'user_id'      => $author2->id,
                'title'        => 'How Tech Innovations Are Transforming Healthcare Diagnostics',
                'body'         => '<p>From high-resolution medical imaging to automated vitals monitoring, modern engineering is playing a vital role in clinical diagnosis and preventive care.</p>',
                'status'       => 'published',
                'published_at' => Carbon::now()->subDays(2),
                'categories'   => [$tech->id, $health->id],
            ],
        ];

        foreach ($posts as $postData) {
            $categoryIds = $postData['categories'];
            unset($postData['categories']);

            $post = Post::create($postData);
            $post->categories()->attach($categoryIds);
        }
    }
}
