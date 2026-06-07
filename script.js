/* =========================================================================
   script.js - KOD FUNGSI JAVASCRIPT UNTUK ZAKAT SABAH (S.O.H)
   ========================================================================= */

// --- FUNGSI MODAL ---
function bukaModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.add('show');
}

function tutupModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.remove('show');
}

// Tutup modal jika klik di luar kawasan putih
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});


document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENU MUDAH ALIH (BURGER MENU FIX) ---
    const navLinks = document.getElementById('nav-links');
    let mobileMenu = document.getElementById('mobile-menu');
    
    // Bina butang burger dinamik
    if (!mobileMenu && navLinks) {
        mobileMenu = document.createElement('div');
        mobileMenu.id = 'mobile-menu';
        mobileMenu.innerHTML = '☰';
        mobileMenu.style.fontSize = '2rem';
        mobileMenu.style.cursor = 'pointer';
        mobileMenu.style.color = 'var(--primary-teal)';
        mobileMenu.style.display = 'none';
        
        const styleMobile = document.createElement('style');
        styleMobile.innerHTML = `@media (max-width: 768px) { #mobile-menu { display: block !important; } }`;
        document.head.appendChild(styleMobile);
        
        const nav = document.querySelector('nav');
        if (nav) nav.insertBefore(mobileMenu, navLinks);
    }

    if (mobileMenu && navLinks) {
        // Buka/Tutup apabila ikon ditekan
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Halang event dari bubble up
            navLinks.classList.toggle('nav-active');
            mobileMenu.innerHTML = navLinks.classList.contains('nav-active') ? '✖' : '☰';
        });

        // Tutup jika link menu ditekan
        const menuItems = navLinks.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                mobileMenu.innerHTML = '☰';
            });
        });

        // PENAMBAHBAIKAN 4: Tutup menu jika pengguna klik tempat lain (luar menu)
        document.addEventListener('click', (e) => {
            // Semak adakah menu sedang aktif, dan klik berlaku BUKAN di dalam navLinks
            if (navLinks.classList.contains('nav-active') && !navLinks.contains(e.target)) {
                navLinks.classList.remove('nav-active');
                mobileMenu.innerHTML = '☰';
            }
        });
    }


    // --- 2. ANIMASI SCROLL ---
    const elementsToAnimate = document.querySelectorAll('.card, .issue-item, .verdict-card, .formula-box, #kalkulator-form');
    elementsToAnimate.forEach(el => el.classList.add('scroll-animate'));

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('terlihat');
            }
        });
    }, { threshold: 0.15 });

    elementsToAnimate.forEach(el => scrollObserver.observe(el));


    // --- 3. SMOOTH SCROLLING NAVIGASI ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const yPos = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top: yPos, behavior: 'smooth' });
            }
        });
    });


    // --- 4. LOGIK KALKULATOR ZAKAT ---
    const formKalkulator = document.getElementById('kalkulator-form');
    
    if (formKalkulator) {
        formKalkulator.addEventListener('submit', function(e) {
            e.preventDefault();

            // Total Pendapatan Tahunan (Input telah diubah ke format tahunan)
            const pendapatanTahunan = parseFloat(document.getElementById('pendapatan-bulanan')?.value || 0);
            const gajiSampingan = parseFloat(document.getElementById('pendapatan-sampingan')?.value || 0);
            const totalPendapatan = pendapatanTahunan + gajiSampingan;
            
            // Total Tolakan
            const tolakanDiri = parseFloat(document.getElementById('diri-sendiri')?.value || 0);
            const tolakanIsteri = parseFloat(document.getElementById('isteri')?.value || 0);
            const tolakanAnak = parseFloat(document.getElementById('anak')?.value || 0);
            const tolakanKWSP = parseFloat(document.getElementById('kwsp')?.value || 0);
            const totalTolakan = tolakanDiri + tolakanIsteri + tolakanAnak + tolakanKWSP;
            
            const nisabSemasa = parseFloat(document.getElementById('nisab')?.value || 24000);
            const baki = totalPendapatan - totalTolakan;
            let mesejAlert = '';

            if (baki >= nisabSemasa) {
                const jumlahZakat = baki * 0.025;
                mesejAlert = `✓ WAJIB BERZAKAT ✓\n\n` +
                             `📊 RINGKASAN PENGIRAAN:\n` +
                             `• Total Pendapatan Tahunan: RM ${totalPendapatan.toFixed(2)}\n` +
                             `• Total Tolakan (Had Kifayah): RM ${totalTolakan.toFixed(2)}\n` +
                             `• Baki Harta: RM ${baki.toFixed(2)}\n\n` +
                             `✅ STATUS: Melepasi Nisab (RM ${nisabSemasa.toFixed(2)})\n\n` +
                             `💰 JUMLAH ZAKAT DIKENAKAN (2.5%): RM ${jumlahZakat.toFixed(2)}`;
            } else if (baki > 0 && baki < nisabSemasa) {
                mesejAlert = `⚠️ BELUM WAJIB BERZAKAT ⚠️\n\n` +
                             `📊 RINGKASAN:\n` +
                             `Baki harta (RM ${baki.toFixed(2)}) tidak mencapai paras Nisab semasa (RM ${nisabSemasa.toFixed(2)}).`;
            } else {
                mesejAlert = `✓ TIDAK WAJIB BERZAKAT ✓\n\n` +
                             `📊 RINGKASAN:\n` +
                             `Pendapatan bersih anda berada di bawah Had Kifayah (keperluan asas) MUIS.`;
            }
            alert(mesejAlert);
        });
    }
});
