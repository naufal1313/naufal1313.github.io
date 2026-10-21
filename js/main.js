/**
 * MAIN.JS - Lightweight Interactive Logic & Scroll Animations
 * Portfolio: Rizky Noufal Hidayat
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const toggleBtn = document.getElementById('nav-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. PROJECT CATEGORY FILTERING (on projects.html)
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');

        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (category === 'All' || cardCategory === category) {
            card.style.display = 'flex';
            card.classList.add('visible');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. COPY TO CLIPBOARD BUTTONS (Email & Phone)
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-btn, .copy-email-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || btn.getAttribute('data-email') || 'rizkynaupal87@gmail.com';
      try {
        await navigator.clipboard.writeText(textToCopy);
        const textSpan = btn.querySelector('.copy-text') || btn;
        const originalText = textSpan.textContent;

        textSpan.textContent = 'Copied!';
        btn.style.color = '#0e7490';
        btn.style.borderColor = '#0e7490';

        setTimeout(() => {
          textSpan.textContent = originalText;
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. TOP SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  let progressBar = document.getElementById('scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);
  }

  // --------------------------------------------------------------------------
  // 5. FLOATING BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  let backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Scroll back to top');
    backToTopBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Update scroll bar and back to top button visibility
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollHeight > 0 && progressBar) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --------------------------------------------------------------------------
  // 6. HERO TYPEWRITER ANIMATION
  // --------------------------------------------------------------------------
  const typewriterTarget = document.getElementById('typewriter-role');
  if (typewriterTarget) {
    const phrases = [
      'Junior Backend Developer | Golang, REST APIs & PostgreSQL',
      'Junior Software Engineer | Clean Architecture & Concurrency',
      'Junior Backend Developer | High-Throughput Microservices',
      'Junior Software Engineer | Performance, Security & Speed',
      'AI & Data Engineer | Deep Learning & NLP Pipelines'
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;
    let typingSpeed = 40;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typewriterTarget.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 38;
      } else {
        typewriterTarget.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 75;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at the end of typing so the user can read the role
        typingSpeed = 2400;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 450;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    // Initial pause before first deletion so the user reads the starting phrase
    setTimeout(typeLoop, 2200);
  }

  // --------------------------------------------------------------------------
  // 7. INTERSECTION OBSERVER SCROLL REVEAL ANIMATIONS (ENHANCED)
  // --------------------------------------------------------------------------
  const revealSelectors = [
    '.section-header',
    '.project-card',
    '.project-item',
    '.metric-card',
    '.skill-card',
    '.skill-card-featured',
    '.skill-card-regular',
    '.timeline-item',
    '.flow-step-box',
    '.code-card',
    '.case-section',
    '.contrib-card',
    '.arch-node',
    '.confidentiality-notice'
  ];

  const elementsToAnimate = document.querySelectorAll(revealSelectors.join(', '));

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elementsToAnimate.forEach((el) => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
        
        // Add subtle staggered delays for items inside grids or flex containers
        const parent = el.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(c => elementsToAnimate.includes ? elementsToAnimate.contains?.(c) || c.matches?.(revealSelectors.join(',')) : true);
          const childIndex = siblings.indexOf(el);
          if (childIndex >= 0) {
            const delayMod = (childIndex % 5) + 1;
            el.classList.add(`delay-${delayMod}`);
          }
        }
      }
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers without IntersectionObserver
    elementsToAnimate.forEach((el) => {
      el.classList.add('visible');
    });
  }

  // --------------------------------------------------------------------------
  // 8. LIVE-TYPING CODE RUNNER FOR developer.go (Realistic Character Cadence)
  // --------------------------------------------------------------------------
  const codeTableBody = document.getElementById('code-table-body');
  if (codeTableBody) {
    const codeData = [
      {
        plain: 'package main',
        highlighted: '<span class="token-kw">package</span> main'
      },
      {
        plain: 'type Developer struct {',
        highlighted: '<span class="token-kw">type</span> <span class="token-var">Developer</span> <span class="token-kw">struct</span> {'
      },
      {
        plain: '  Name   string',
        highlighted: '  <span class="token-key">Name</span>   <span class="token-kw">string</span>'
      },
      {
        plain: '  Role   string',
        highlighted: '  <span class="token-key">Role</span>   <span class="token-kw">string</span>'
      },
      {
        plain: '  Skills []string',
        highlighted: '  <span class="token-key">Skills</span> []<span class="token-kw">string</span>'
      },
      {
        plain: '  Focus  string',
        highlighted: '  <span class="token-key">Focus</span>  <span class="token-kw">string</span>'
      },
      {
        plain: '}',
        highlighted: '}'
      },
      {
        plain: 'dev := Developer{',
        highlighted: '<span class="token-var">dev</span> := <span class="token-var">Developer</span>{'
      },
      {
        plain: "  Name:   'Rizky Noufal Hidayat',",
        highlighted: '  <span class="token-key">Name</span>:   <span class="token-str">\'Rizky Noufal Hidayat\'</span>,'
      },
      {
        plain: "  Role:   'Junior Backend Developer',",
        highlighted: '  <span class="token-key">Role</span>:   <span class="token-str">\'Junior Backend Developer\'</span>,'
      },
      {
        plain: "  Skills: []string{'Golang', 'PostgreSQL', 'APIs'},",
        highlighted: '  <span class="token-key">Skills</span>: []<span class="token-kw">string</span>{<span class="token-str">\'Golang\'</span>, <span class="token-str">\'PostgreSQL\'</span>, <span class="token-str">\'APIs\'</span>},'
      },
      {
        plain: "  Focus:  'Maintainability, Security & Speed',",
        highlighted: '  <span class="token-key">Focus</span>:  <span class="token-str">\'Maintainability, Security &amp; Speed\'</span>,'
      },
      {
        plain: '}',
        highlighted: '}'
      },
      {
        plain: 'dev.BuildResilientBackends()',
        highlighted: '<span class="token-var">dev</span>.<span class="token-fn">BuildResilientBackends</span>()'
      }
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let currentTr = null;
    let currentCodeTd = null;

    const escapeCodeHtml = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };

    const startTyping = () => {
      codeTableBody.innerHTML = '';
      lineIndex = 0;
      charIndex = 0;
      prepareNextLine();
    };

    const prepareNextLine = () => {
      if (lineIndex >= codeData.length) {
        // Typing complete! Keep blinking cursor visible for 7 seconds, then restart cycle
        setTimeout(startTyping, 7000);
        return;
      }

      // Remove blinking cursor from previous line
      const oldCursor = codeTableBody.querySelector('.code-cursor');
      if (oldCursor) oldCursor.remove();

      currentTr = document.createElement('tr');
      const lineNumTd = document.createElement('td');
      lineNumTd.className = 'line-num';
      lineNumTd.textContent = lineIndex + 1;

      currentCodeTd = document.createElement('td');
      currentCodeTd.className = 'line-code';
      currentCodeTd.innerHTML = '<span class="code-cursor"></span>';

      currentTr.appendChild(lineNumTd);
      currentTr.appendChild(currentCodeTd);
      codeTableBody.appendChild(currentTr);

      charIndex = 0;
      typeNextChar();
    };

    const typeNextChar = () => {
      const lineObj = codeData[lineIndex];
      if (charIndex < lineObj.plain.length) {
        const typedText = lineObj.plain.substring(0, charIndex + 1);
        currentCodeTd.innerHTML = escapeCodeHtml(typedText) + '<span class="code-cursor"></span>';
        charIndex++;

        // Natural typing delay: ~35-50ms with subtle human variation
        const char = lineObj.plain.charAt(charIndex - 1);
        let delay = 35 + Math.floor(Math.random() * 20);
        if (char === ',' || char === ';' || char === '{' || char === '}') {
          delay = 140;
        } else if (char === ' ') {
          delay = 20;
        }

        setTimeout(typeNextChar, delay);
      } else {
        // Finished typing this line: replace with full syntax-highlighted HTML
        currentCodeTd.innerHTML = lineObj.highlighted + '<span class="code-cursor"></span>';
        lineIndex++;
        // Natural line-break pause
        setTimeout(prepareNextLine, 180);
      }
    };

    // Start typing after initial intro
    setTimeout(startTyping, 900);
  }

  // --------------------------------------------------------------------------
  // 9. SIDE PROJECTS COLLAPSIBLE TOGGLE
  // --------------------------------------------------------------------------
  const toggleSideBtn = document.getElementById('toggle-side-projects-btn');
  const sidePanel = document.getElementById('side-projects-panel');
  if (toggleSideBtn && sidePanel) {
    toggleSideBtn.addEventListener('click', () => {
      const isOpen = sidePanel.classList.toggle('open');
      const textSpan = toggleSideBtn.querySelector('span');
      if (textSpan) {
        textSpan.textContent = isOpen ? 'Hide Side Projects' : 'View More Projects (2 Side Projects)';
      }
      const chevron = toggleSideBtn.querySelector('.toggle-chevron');
      if (chevron) {
        chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      }
      toggleSideBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // --------------------------------------------------------------------------
  // 10. IN-PAGE SMOOTH SCROLLING (HOME LINKS)
  // --------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || targetId === '#hero') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetId && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const navOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
          }
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. BILINGUAL LANGUAGE SWITCHER (ID / EN) - COMPREHENSIVE & CONSISTENT
  // --------------------------------------------------------------------------
  const langBtnId = document.getElementById('lang-btn-id');
  const langBtnEn = document.getElementById('lang-btn-en');
  const langBtnIdMobile = document.getElementById('lang-btn-id-mobile');
  const langBtnEnMobile = document.getElementById('lang-btn-en-mobile');

  const translations = {
    id: {
      // Navbar & Drawer
      navHome: 'Home',
      navAbout: 'About',
      navExperience: 'Experience',
      navProjects: 'Projects',
      navSkills: 'Skills',
      navEducation: 'Education',
      navContact: 'Contact',
      downloadCvBtn: 'Unduh CV',
      downloadCvPdfBtn: 'Unduh CV (PDF)',

      // Hero
      heroGreeting: 'Halo, saya',
      heroDesc: 'Berbekal pemahaman Ilmu Komputer yang mendalam, saya berdedikasi merekayasa sistem backend terukur, mengintegrasikan solusi AI, dan merancang RESTful API berkinerja tinggi.',
      viewProjectsBtn: 'Lihat Proyek',
      contactBtn: 'Hubungi Saya',
      connectLabel: 'HUBUNGI:',
      heroLocation: 'Bogor / Jakarta, ID',

      // About
      aboutEyebrow: 'PROFIL & LATAR BELAKANG',
      aboutTitle: 'About Me',
      aboutP1: 'Saya mahasiswa tingkat akhir program studi Ilmu Komputer di Universitas Pakuan dengan IPK 3.65, berdedikasi pada rekayasa backend, microservices berthroughput tinggi, dan integrasi AI.',
      aboutP2: 'Bagi saya, rekayasa perangkat lunak bukan sekadar menulis kode yang berfungsi di permukaan. Kualitas rekayasa sejati berpusat pada kemudahan pemeliharaan (maintainability), keamanan, dan kecepatan eksekusi: memastikan perangkat lunak mudah dikembangkan dan di-debug oleh tim, tangguh terhadap celah kerentanan, serta teroptimasi untuk latensi rendah di bawah beban trafik operasional yang tinggi.',
      aboutP3: 'Berpengalaman merekayasa layanan backend produksi untuk korporasi di Bank Rakyat Indonesia (BRI) dan Indocement, saya membangun perangkat lunak menggunakan Clean Architecture, validasi defensif, pengindeksan kueri relasional, dan penanganan error eksplisit agar tim rekayasa dapat mengembangkan sistem secara andal.',
      mindsetEyebrow: 'POLA PIKIR REKAYASA',
      mindsetTitle: 'Pemeliharaan, Keamanan & Kecepatan',
      mindsetDesc: 'Menulis kode backend yang defensif, mudah dipelihara, dan berkinerja tinggi. Memprioritaskan pemisahan modular, validasi input yang ketat, optimasi kueri basis data, dan pola konkurensi yang menjamin ketahanan operasional jangka panjang.',
      coreCompetenciesLabel: 'Kompetensi Inti:',
      stat1Label: 'Magang Industri',
      stat2Label: 'IPK Akademik',
      stat3Label: 'Layanan REST Dibangun',
      stat4Label: 'Disiplin Pengujian',

      // Work Experience
      experienceEyebrow: 'JEJAK KARIER',
      experienceTitle: 'Work Experience',
      experienceDesc: 'Rekam jejak praktis dalam membangun perangkat lunak produksi di industri perbankan teregulasi dan rantai pasok industri.',
      expBriSector: 'PERBANKAN • HUMAN CAPITAL',
      expBriRole: 'Backend Developer',
      expBriPeriod: 'Agu 2024 - Des 2024',
      expBriLoc: 'Jakarta, Indonesia • Hybrid',
      expBriB1: 'Mengembangkan endpoint RESTful berkinerja tinggi menggunakan Golang dan Chi Router untuk microservices human capital internal yang melayani ribuan karyawan korporasi.',
      expBriB2: 'Mengoptimalkan kueri basis data relasional pada tabel PostgreSQL, menurunkan rata-rata waktu eksekusi kueri hingga ~35%.',
      expBriB3: 'Mengintegrasikan pengujian unit API otomatis dengan cakupan kode 85%+ pada modul otentikasi kritis dan log audit.',
      expIndoSector: 'MANUFAKTUR • DIVISI PENJUALAN',
      expIndoRole: 'Software Engineer',
      expIndoPeriod: 'Jan 2024 - Mei 2024',
      expIndoLoc: 'Bogor, Indonesia • Di Lokasi',
      expIndoB1: 'Membangun API manajemen backend untuk platform distribusi POSM yang mengoordinasikan pelacakan barang di berbagai depo pasokan regional.',
      expIndoB2: 'Mengimplementasikan otentikasi aman berbasis JWT dan izin peran bertingkat (RBAC) untuk pengawas gudang depo dan tim audit.',
      expIndoB3: 'Berkolaborasi dengan insinyur frontend untuk standardisasi format respons error JSON API dan memelihara dokumentasi Swagger/OpenAPI.',
      expKmsSector: 'MANUFAKTUR • PRODUKSI',
      expKmsRole: 'Pembantu Produksi',
      expKmsPeriod: 'Feb 2021 - Apr 2021',
      expKmsLoc: 'Bogor, Indonesia • Di Lokasi',
      expKmsB1: 'Bertanggung jawab atas pengemasan komponen rail grab dan cover CVT sesuai standar mutu perusahaan.',
      expKmsB2: 'Memastikan keakuratan jumlah unit produk dan keamanan pengemasan sebelum proses distribusi.',
      expKmsB3: 'Menjaga fokus tinggi dan ketelitian kerja untuk mencapai target harian departemen produksi.',
      expKmsTag1: 'Standar Mutu',
      expKmsTag2: 'Pengemasan Komponen',
      expKmsTag3: 'Target Produksi',

      // Selected Projects
      selectedProjectsEyebrow: 'PORTOFOLIO REKAYASA',
      selectedProjectsTitle: 'Selected Projects',
      selectedProjectsDesc: 'Tiga sistem utama berskala produksi dan riset deep learning yang direkayasa untuk skalabilitas, integritas transaksi, dan kemudahan pemeliharaan.',
      projBriBadge1: '★ Proyek Unggulan Utama',
      projBriBadge2: 'Pengalaman Profesional',
      projBriDesc: 'Layanan backend manajemen human capital internal yang menangani alur kerja siklus kerja karyawan, pencatatan kepatuhan otomatis, dan pelaporan korporasi.',
      projContribLabel: 'Kontribusi Saya:',
      projBriContrib: 'Merancang endpoint REST modular di Go dengan Chi Router, mengoptimalkan kueri relasional yang memangkas latensi hingga ~35%, dan menulis unit test untuk logika autentikasi.',
      viewCaseStudy: 'Lihat Detail Studi Kasus',
      projIndoBadge1: '★ Proyek Unggulan Utama',
      projIndoBadge2: 'Pengalaman Profesional',
      projIndoDesc: 'Sistem pelacakan operasional berbasis web untuk mengelola material promosi penjualan (POSM) di seluruh toko mitra ritel.',
      projIndoContrib: 'Merekayasa alur kerja batch multi-peran, unggah foto 3 tahap asinkron via AJAX, dan notifikasi otomatis jatuh tempo pajak reklame.',
      projJudolBadge1: '★ Proyek Unggulan Utama',
      projJudolBadge2: 'Proyek Akademik',
      projJudolDesc: 'Sistem moderasi cerdas pendeteksi komentar spam promosi judi online di YouTube menggunakan Hybrid AI (Bi-LSTM & Aturan Heuristik).',
      projJudolContrib: 'Membangun API inferensi Python Flask, merekayasa penarikan data YouTube API v3, dan mengintegrasikan interpretabilitas LIME XAI.',
      viewMoreSideProjects: 'Lihat Proyek Tambahan (2 Side Projects)',
      sideProjectBadge: 'Side Project',
      sideBangunDesc: 'Aplikasi mobile pencatatan arus kas dan manajemen inventaris bahan bangunan untuk kontraktor konstruksi dan toko bangunan UMKM.',
      sideRentalDesc: 'Platform pemesanan dan manajemen armada rental mobil dengan kalkulasi durasi otomatis, validasi ketersediaan kendaraan, dan pencetakan faktur PDF.',

      // Engineering Skill Matrix
      skillsEyebrow: 'KAPABILITAS TEKNIS',
      skillsTitle: 'Engineering Skill Matrix',
      skillsDesc: 'Struktur keahlian teknis terstandar yang digunakan dalam perancangan microservices, basis data, pipeline CI/CD, dan model AI.',
      skill1Title: 'Rekayasa Backend & API',
      skill1Badge: 'Spesialisasi Utama • Standar Produksi',
      skill1Desc: 'Layanan backend berkinerja tinggi dan arsitektur modular di Go dengan clean onion architecture, konkurensi goroutine, worker pool, dan penanganan error sentinel yang terprediksi.',
      skill2Title: 'Basis Data & Rekayasa Data',
      skill2Desc: 'Pemodelan relasional, strategi pengindeksan, manajemen transaksi ACID, dan analisis rencana kueri.',
      skill3Title: 'Otentikasi & Keamanan Sistem',
      skill3Desc: 'Manajemen identitas korporasi, izin berbasis peran granular (RBAC), pertahanan berlapis, dan audit keamanan kode.',
      skill4Title: 'Pengujian & Kualitas Kode',
      skill4Desc: 'Pencegahan regresi otomatis melalui mock terisolasi, asersi pengujian, dan gerbang analisis kualitas kode statis.',
      skill5Title: 'DevOps & Observabilitas',
      skill5Desc: 'Kontainerisasi aplikasi, pipeline CI/CD, telemetri pelacakan terdistribusi, dan uji beban performa.',
      skill6Title: 'AI, ML & Integrasi Data',
      skill6Desc: 'Pipeline machine learning, klasifikasi teks sekuensial, dan interpretabilitas AI transparan (diimplementasikan pada JudolScan).',
      skill7Title: 'Frontend & Kakas Pengembang',
      skill7Badge: 'Fondasi Pendukung • Lintas Fungsi',
      skill7Desc: 'Antarmuka frontend modern, kakas pengujian API, dan lingkungan pengembangan terstruktur untuk integrasi menyeluruh.',

      // Education & Certification
      educationEyebrow: 'PENDIDIKAN & SERTIFIKASI',
      educationTitle: 'Education & Certification',
      educationDesc: 'Landasan akademik formal ilmu komputer, perkuliahan teknis spesialisasi, dan sertifikasi kompetensi terverifikasi.',
      degreeBadge: 'GELAR PENDIDIKAN TINGGI',
      degreeTitle: 'Sarjana Ilmu Komputer (S-1 Ilmu Komputer)',
      degreePeriod: 'Jun 2022 - Sekarang',
      degreeLoc: 'Bogor, Jawa Barat',
      degreeDesc: 'Berfokus pada rekayasa sistem backend, manajemen basis data, dan pipeline machine learning. Mempertahankan rekam jejak akademik konsisten dengan IPK 3.65 sembari aktif menyelesaikan magang rekayasa perangkat lunak di sektor perbankan dan manufaktur.',
      courseworkLabel: 'Mata Kuliah Spesialisasi & Riset:',
      certEyebrow: 'SERTIFIKASI PROFESIONAL',
      certSectionTitle: 'Kredensial Terverifikasi & Kompetensi Spesialis',
      certSectionDesc: 'Kredensial yang diakui industri dalam keamanan ofensif AI, arsitektur sistem agentic, fondasi cloud AWS, dan rekayasa berbasis spesifikasi. Klik sertifikat untuk melihat verifikasi resolusi tinggi.',
      certPreviewHint: 'Pratinjau Sertifikat',
      cert1Title: 'Introduction to Offensive Security with Artificial Intelligence',
      cert1Desc: 'Sertifikat penyelesaian yang memvalidasi pengetahuan fundamental pada irisan keamanan siber dan kecerdasan buatan. Materi mencakup prinsip dan aplikasi praktis pemanfaatan teknologi AI dalam operasi keamanan ofensif dan red teaming.',
      cert2Title: 'Intelligent by Design: Build an AI Agent',
      cert2Desc: 'Sertifikat penyelesaian dari IBM SkillsBuild yang berfokus pada desain praktis dan rekayasa AI Agent. Memvalidasi kompetensi dalam prinsip inti AI, alur kerja agentic, dan fondasi arsitektur untuk membangun sistem cerdas berbasis tugas.',
      cert3Title: 'Micro-Certification - Agentic AI Executive',
      cert3Desc: 'Sertifikasi dari ServiceNow yang memvalidasi pemahaman strategis implementasi Agentic AI, berfokus pada pemanfaatan AI untuk mentransformasi dan mengotomatisasi alur kerja korporasi dan proses operasional bisnis.',
      cert4Title: 'Belajar Dasar Cloud dan Gen AI di AWS',
      cert4Desc: 'Sertifikat kompetensi dari Dicoding Academy yang memvalidasi pengetahuan dasar arsitektur AWS Cloud, paradigma komputasi awan, dan implementasi praktis layanan Generative AI di Amazon Web Services.',
      cert5Title: 'Spec-Driven Development dengan Kiro',
      cert5Desc: 'Sertifikasi rekayasa perangkat lunak dari Dicoding Academy yang memvalidasi kemampuan Spec-Driven Development (SDD), penyusunan spesifikasi teknis, dan pemanfaatan alur kerja pengembangan berbasis AI dengan Kiro untuk mempercepat rilis perangkat lunak produksi.',

      // Contact & Footer
      contactEyebrow: 'HUBUNGI SAYA',
      contactTitle: 'Mari Membangun Solusi Berkualitas Bersama',
      contactDesc: 'Apakah Anda sedang mencari Backend Engineer untuk microservices Golang berkinerja tinggi, pengembangan software, atau integrasi pipeline AI/NLP, pintu komunikasi saya selalu terbuka.',
      sendEmailBtn: 'Kirim Email (rizkynaupal87@gmail.com)',
      whatsappBtn: 'WhatsApp Saya',
      linkedinBtn: 'Terhubung di LinkedIn',
      footerCopyright: '© 2026 Rizky Noufal Hidayat. Dibangun dengan Semantic HTML, Vanilla CSS & JS.',
      footerStatus: 'Terbuka untuk Peluang Kerja'
    },
    en: {
      // Navbar & Drawer
      navHome: 'Home',
      navAbout: 'About',
      navExperience: 'Experience',
      navProjects: 'Projects',
      navSkills: 'Skills',
      navEducation: 'Education',
      navContact: 'Contact',
      downloadCvBtn: 'Download CV',
      downloadCvPdfBtn: 'Download CV (PDF)',

      // Hero
      heroGreeting: 'Hi, I am',
      heroDesc: 'With a strong foundation in Computer Science, I am passionate about building scalable backend systems, integrating AI solutions, and designing high-performance RESTful APIs.',
      viewProjectsBtn: 'View Projects',
      contactBtn: 'Contact Me',
      connectLabel: 'CONNECT:',
      heroLocation: 'Bogor / Jakarta, ID',

      // About
      aboutEyebrow: 'PROFILE & BACKGROUND',
      aboutTitle: 'About Me',
      aboutP1: 'I am a final-year Computer Science student at Universitas Pakuan with an academic GPA of 3.65, dedicated to backend engineering, high-throughput microservices, and AI integrations.',
      aboutP2: 'For me, software engineering is never just about writing code that works on the surface. True engineering quality centers on maintainability, security, and execution speed: ensuring that software remains effortless for teams to extend and debug, resilient against vulnerabilities, and optimized for low latency under high operational traffic.',
      aboutP3: 'Having engineered production backend services for enterprise environments at Bank Rakyat Indonesia (BRI) and Indocement, I build software using Clean Architecture, defensive validation, relational query indexing, and explicit error handling so engineering teams can scale systems reliably.',
      mindsetEyebrow: 'ENGINEERING MINDSET',
      mindsetTitle: 'Maintainability, Security & Speed',
      mindsetDesc: 'Writing defensible, easily maintainable, and high-performance backend code. Prioritizing modular separation of concerns, strict input validation, database query tuning, and concurrency patterns that guarantee long-term operational resilience.',
      coreCompetenciesLabel: 'Core Competencies:',
      stat1Label: 'Production Internships',
      stat2Label: 'Academic GPA',
      stat3Label: 'REST Services Built',
      stat4Label: 'Test Discipline',

      // Work Experience
      experienceEyebrow: 'CAREER MILESTONES',
      experienceTitle: 'Work Experience',
      experienceDesc: 'Practical track record of writing production software in regulated enterprise industries and supply chain operations.',
      expBriSector: 'BANKING • ENTERPRISE HC',
      expBriRole: 'Backend Developer',
      expBriPeriod: 'Aug 2024 - Dec 2024',
      expBriLoc: 'Jakarta, Indonesia • Hybrid',
      expBriB1: 'Developed high-throughput RESTful endpoints using Golang and Chi Router for internal human capital microservices serving enterprise employees.',
      expBriB2: 'Streamlined relational database queries across PostgreSQL tables, reducing average query execution times by ~35%.',
      expBriB3: 'Integrated automated API unit tests achieving 85%+ code coverage across critical authentication and audit log modules.',
      expIndoSector: 'MANUFACTURING • SALES DIVISION',
      expIndoRole: 'Software Engineer',
      expIndoPeriod: 'Jan 2024 - May 2024',
      expIndoLoc: 'Bogor, Indonesia • On-site',
      expIndoB1: 'Built backend management APIs for the POSM distribution platform coordinating item tracking across multiple regional supply depots.',
      expIndoB2: 'Implemented secure JWT-based authentication and granular role-based permissions (RBAC) for depot warehouse supervisors and audit teams.',
      expIndoB3: 'Collaborated with frontend engineers to standardize JSON API error response formats and maintained live Swagger/OpenAPI documentation.',
      expKmsSector: 'MANUFACTURING • PRODUCTION',
      expKmsRole: 'Production Helper',
      expKmsPeriod: 'Feb 2021 - Apr 2021',
      expKmsLoc: 'Bogor, Indonesia • On-site',
      expKmsB1: 'Responsible for packaging rail grab components and CVT covers in accordance with company quality standards.',
      expKmsB2: 'Ensured accurate product quantities and secure packaging before distribution.',
      expKmsB3: 'Maintained a high level of focus and attention to detail to achieve daily production department targets.',
      expKmsTag1: 'Quality Standards',
      expKmsTag2: 'Component Packaging',
      expKmsTag3: 'Production Target',

      // Selected Projects
      selectedProjectsEyebrow: 'ENGINEERING PORTFOLIO',
      selectedProjectsTitle: 'Selected Projects',
      selectedProjectsDesc: 'Three flagship production and deep learning systems engineered for scalability, transactional integrity, and maintainability.',
      projBriBadge1: '★ Star Featured Project',
      projBriBadge2: 'Professional Experience',
      projBriDesc: 'Internal human capital management backend service handling employee lifecycle workflows, automated compliance logging, and enterprise reporting.',
      projContribLabel: 'My Contribution:',
      projBriContrib: 'Designed modular REST endpoints in Go with Chi Router, optimized relational queries reducing latency by ~35%, and wrote unit tests covering critical auth logic.',
      viewCaseStudy: 'View Case Study Details',
      projIndoBadge1: '★ Star Featured Project',
      projIndoBadge2: 'Professional Experience',
      projIndoDesc: 'Web-based operational tracking system managing Point of Sales Materials (POSM) across retail partner stores.',
      projIndoContrib: 'Engineered multi-role batch workflows, asynchronous 3-stage photo uploads via AJAX, and automated tax expiry alerts.',
      projJudolBadge1: '★ Star Featured Project',
      projJudolBadge2: 'Academic Project',
      projJudolDesc: 'AI-powered moderation system detecting online gambling spam comments on YouTube using Hybrid AI (Bi-LSTM & Rules).',
      projJudolContrib: 'Built Python Flask inference API, engineered YouTube Data API v3 ingestion, and integrated LIME XAI for transparent spam scoring.',
      viewMoreSideProjects: 'View More Projects (2 Side Projects)',
      sideProjectBadge: 'Side Project',
      sideBangunDesc: 'Mobile cashflow ledger and material inventory management application built for construction contractors and building supply small businesses.',
      sideRentalDesc: 'Car rental fleet management and booking platform featuring automated duration calculations, vehicle availability checks, and PDF invoice generation.',

      // Engineering Skill Matrix
      skillsEyebrow: 'TECHNICAL CAPABILITIES',
      skillsTitle: 'Engineering Skill Matrix',
      skillsDesc: 'Structured toolsets and frameworks used across production microservices, data architecture, and continuous deployment workflows.',
      skill1Title: 'Backend & API Engineering',
      skill1Badge: 'Core Specialization • Production Grade',
      skill1Desc: 'High-throughput backend services and modular monoliths in Go with clean onion architecture, goroutine concurrency, worker pools, and predictable sentinel error handling.',
      skill2Title: 'Database & Data Engineering',
      skill2Desc: 'Relational modeling, indexing strategies, ACID transaction management, and query plan profiling.',
      skill3Title: 'Authentication & Security',
      skill3Desc: 'Enterprise identity, granular role-based permissions, defense-in-depth, and security audits.',
      skill4Title: 'Testing & Code Quality',
      skill4Desc: 'Automated regression prevention through isolated mocks, test assertions, and static code quality gates.',
      skill5Title: 'DevOps & Observability',
      skill5Desc: 'Containerization, CI/CD runners, distributed tracing telemetry, and stress benchmarking.',
      skill6Title: 'AI, ML & Data Integration',
      skill6Desc: 'Machine learning pipelines, text classification, and explainable AI interpretability (applied in JudolScan).',
      skill7Title: 'Frontend & Developer Tools',
      skill7Badge: 'Supporting Stack • Cross-Functional',
      skill7Desc: 'Modern frontend interfaces, API testing utilities, and structured development environments for end-to-end integration.',

      // Education & Certification
      educationEyebrow: 'ACADEMIC & CREDENTIALS',
      educationTitle: 'Education & Certification',
      educationDesc: 'Formal academic foundation in computer science, specialized technical coursework, and quality certification standards.',
      degreeBadge: 'HIGHER EDUCATION DEGREE',
      degreeTitle: 'Bachelor of Computer Science (S-1 Ilmu Komputer)',
      degreePeriod: 'Jun 2022 - Present',
      degreeLoc: 'Bogor, West Java',
      degreeDesc: 'Specializing in backend system engineering, database management, and machine learning pipelines. Maintained a consistent academic record with a cumulative GPA of 3.65 while actively completing software engineering internships in the banking and manufacturing sectors.',
      courseworkLabel: 'Specialized Coursework & Research:',
      certEyebrow: 'PROFESSIONAL CERTIFICATIONS',
      certSectionTitle: 'Verified Credentials & Specialized Competencies',
      certSectionDesc: 'Industry-recognized credentials in offensive AI security, agentic system architecture, AWS cloud foundation, and spec-driven engineering. Click on any certificate to view high-resolution verification.',
      certPreviewHint: 'Preview Certificate',
      cert1Title: 'Introduction to Offensive Security with Artificial Intelligence',
      cert1Desc: 'A completion certificate validating foundational knowledge at the intersection of cybersecurity and artificial intelligence. This course covers the principles and practical applications of leveraging AI technologies within offensive security and red teaming operations.',
      cert2Title: 'Intelligent by Design: Build an AI Agent',
      cert2Desc: 'A completion certificate from IBM SkillsBuild focusing on the practical design and engineering of AI Agents. Validates competencies in core AI principles, agentic workflows, and the architectural foundations required to build intelligent, task-oriented systems.',
      cert3Title: 'Micro-Certification - Agentic AI Executive',
      cert3Desc: 'A certification from ServiceNow validating strategic understanding of Agentic AI implementation, focusing on leveraging AI to transform and automate enterprise workflows and business operational processes.',
      cert4Title: 'Belajar Dasar Cloud dan Gen AI di AWS',
      cert4Desc: 'A competency certificate from Dicoding Academy verifying foundational knowledge in AWS Cloud architecture, cloud computing paradigms, and practical implementation of Generative AI services on Amazon Web Services.',
      cert5Title: 'Spec-Driven Development dengan Kiro',
      cert5Desc: 'A software engineering certification from Dicoding Academy validating skills in Spec-Driven Development (SDD), structuring technical specifications, and leveraging AI-powered development workflows with Kiro to accelerate production software delivery.',

      // Contact & Footer
      contactEyebrow: 'GET IN TOUCH',
      contactTitle: "Let's Build Something Exceptional Together",
      contactDesc: 'Whether you are looking for a dedicated Backend Engineer for high-throughput Golang microservices, full-stack software development, or integrating AI/NLP pipelines, my inbox is always open.',
      sendEmailBtn: 'Send Email (rizkynaupal87@gmail.com)',
      whatsappBtn: 'WhatsApp Me',
      linkedinBtn: 'Connect on LinkedIn',
      footerCopyright: '© 2026 Rizky Noufal Hidayat. Built with Semantic HTML, Vanilla CSS & JS.',
      footerStatus: 'Available for Opportunities'
    }
  };

  const applyLanguage = (lang) => {
    const t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    if (lang === 'id') {
      langBtnId?.classList.add('active');
      langBtnIdMobile?.classList.add('active');
      langBtnEn?.classList.remove('active');
      langBtnEnMobile?.classList.remove('active');
      document.documentElement.setAttribute('lang', 'id');
    } else {
      langBtnEn?.classList.add('active');
      langBtnEnMobile?.classList.add('active');
      langBtnId?.classList.remove('active');
      langBtnIdMobile?.classList.remove('active');
      document.documentElement.setAttribute('lang', 'en');
    }
    localStorage.setItem('portfolio_lang', lang);
  };

  langBtnId?.addEventListener('click', () => applyLanguage('id'));
  langBtnEn?.addEventListener('click', () => applyLanguage('en'));
  langBtnIdMobile?.addEventListener('click', () => applyLanguage('id'));
  langBtnEnMobile?.addEventListener('click', () => applyLanguage('en'));

  // Init language from storage (default to 'en' for global consistency)
  const savedLang = localStorage.getItem('portfolio_lang') || 'en';
  applyLanguage(savedLang);

  // --------------------------------------------------------------------------
  // 12. INTERACTIVE IMAGE LIGHTBOX / MODAL PREVIEW
  // --------------------------------------------------------------------------
  const initImageLightbox = () => {
    let lightbox = document.getElementById('image-preview-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'image-preview-modal';
      lightbox.className = 'image-lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image Preview');
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <button type="button" class="lightbox-close-btn" aria-label="Close preview">&times;</button>
          <img src="" alt="Preview Image" class="lightbox-img" id="lightbox-target-img">
          <div class="lightbox-caption" id="lightbox-caption-text"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('#lightbox-target-img');
    const lightboxCaption = lightbox.querySelector('#lightbox-caption-text');
    const closeBtn = lightbox.querySelector('.lightbox-close-btn');

    const openLightbox = (src, caption) => {
      lightboxImg.src = src;
      lightboxImg.alt = caption || 'Preview Image';
      if (caption) {
        lightboxCaption.textContent = caption;
        lightboxCaption.style.display = 'block';
      } else {
        lightboxCaption.style.display = 'none';
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        lightboxImg.src = '';
      }, 250);
    };

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    // Delegate click for any previewable image or avatar
    document.addEventListener('click', (e) => {
      const previewTrigger = e.target.closest('[data-preview-img], .previewable-img');
      if (previewTrigger) {
        const src = previewTrigger.getAttribute('data-preview-img') || 
                    (previewTrigger.tagName === 'IMG' ? (previewTrigger.currentSrc || previewTrigger.src) : null);
        const caption = previewTrigger.getAttribute('data-caption') || 
                        previewTrigger.getAttribute('alt') || 
                        previewTrigger.getAttribute('title') || 
                        '';
        if (src) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(src, caption);
        }
      }
    });
  };

  initImageLightbox();
});


