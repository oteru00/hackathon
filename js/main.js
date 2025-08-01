// ======================
// ローディング関連の設定
// ======================

const loading = document.getElementById('loading');
const vw = window.innerWidth;
const vh = window.innerHeight;
const centerX = vw / 2;
const centerY = vh / 2;

const images = [
  { src: 'img/metalife-avatar (12).png', count: 1 },
  { src: 'img/metalife-avatar (4).png', count: 1 },
  { src: 'img/metalife-avatar (8).png', count: 1 },
  { src: 'img/metalife-avatar.png', count: 1 },
  { src: 'img/meta2.png', count: 10 }
];

function animateToCenter({ classNames, content, large }) {
  const el = document.createElement('div');
  el.className = classNames;
  if (large) el.classList.add('loading__item--large');

  const startX = Math.random() * vw;
  const startY = Math.random() * vh;

  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;

  if (content) el.innerHTML = content;
  loading.appendChild(el);

  const tl = gsap.timeline({ onComplete: () => el.remove() });

  tl.to(el, {
    scale: 1.2,
    rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
    duration: 2,
    ease: "power1.inOut"
  });

  tl.to(el, {
    x: centerX - startX,
    y: centerY - startY,
    scale: 0,
    opacity: 0,
    rotation: 720 * (Math.random() > 0.5 ? 1 : -1),
    duration: 3 + Math.random(),
    ease: "power3.in"
  });
}

images.forEach(({ src, count }) => {
  for (let i = 0; i < count; i++) {
    animateToCenter({
      classNames: 'loading__item',
      content: `<img src="${src}" alt="">`,
      large: count === 1
    });
  }
});

// ======================
// 初期ロード処理
// ======================

window.addEventListener('load', () => {
  $('body').addClass('no-scroll');

  setTimeout(() => {
    gsap.to('#loading', {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        $('#loading').css('display', 'none');
        $('#loading-item').fadeIn(300);
        window.addEventListener('wheel', handleWheel);
      }
    });
  }, 4500);
});

// ======================
// ハンバーガーメニュー
// ======================

$('.hamburger').on('click', () => {
  $('nav').slideToggle(300);
});

// ページ内リンク スムーススクロール
$('a[href^="#"]').on('click', function(event){
  event.preventDefault();
  const target = $(this).attr('href');
  const $target = $(target);
  if ($target.length) {
    $('html, body').animate({
      scrollTop: $target.offset().top
    }, 600);
  }
});


// ======================
// メインビジュアル：スクロールでclip-path変化
// ======================

let fakeScroll = 0;
const maxScroll = 300;

function handleWheel(e) {
  if ($('body').hasClass('no-scroll')) {
    fakeScroll += e.deltaY * 0.3;
    fakeScroll = Math.max(0, Math.min(fakeScroll, maxScroll));

    const progress = fakeScroll / maxScroll;

    // メインビジュアルの切り抜き
    $('.main-visual-video').css('clip-path', `inset(${progress * 100}% round 30px)`);
  }
}

$(function () {
  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    const $section = $('.main-visual');
    const sectionTop = $section.offset().top;
    const sectionHeight = $section.outerHeight();

    const progress = (scrollTop - sectionTop) / (sectionHeight - windowHeight);
    const clamped = Math.max(0, Math.min(progress, 1));

    $('.main-visual-video').css('clip-path', `inset(${clamped * 100}% round 30px)`);

    // ロゴ表示トリガー（ほぼ100%に達したら表示）
    if (clamped >= 0.99) {
      $('#centerLogo').addClass('visible');
    } else {
      $('#centerLogo').removeClass('visible');
    }
  });

  $(window).trigger('scroll'); // 初期化
});

$(function () {
  const $centerLogo = $('#centerLogo');
  const $trigger = $('.avatar-scroll-rotate');
  const windowHeight = $(window).height();

  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    const triggerTop = $trigger.offset().top;

    // 画面の80%地点で発動
    if (scrollTop + windowHeight * 0.8 > triggerTop) {
      // 後ろに引く（z-indexを下げる）
      $centerLogo.css({
        'z-index': -10,
        'transition': 'z-index 0.5s ease',
        'opacity': 0.5,
      });
    } else {
      // 元に戻す
      $centerLogo.css({

      });
    }
  });
});

$(function () {
  const $centerLogo = $('#centerLogo');
  const $secTit = $('h2.logo-style');

  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    const windowHeight = $(this).height();
    const windowWidth = $(this).width();

    const screenCenterY = scrollTop + windowHeight / 2;
    const screenCenterX = windowWidth / 2;

    const rect = $secTit[0].getBoundingClientRect();
    const h2Top = rect.top + scrollTop;
    const h2Left = rect.left;
    const h2CenterY = h2Top + rect.height / 2;

    const h2Width = rect.width;
    const h2Height = rect.height;
    const h2FontSize = $secTit.css('font-size');
    const h2LineHeight = $secTit.css('line-height');
    const h2FontWeight = $secTit.css('font-weight');

    if (h2CenterY <= screenCenterY) {
      $secTit.css('opacity', 1);

      $centerLogo.css({
        position: 'absolute',
        top: (h2Top) + 'px',
        left: (h2Left) + 'px',
        width: h2Width + 'px',
        height: h2Height + 'px',
        fontSize: h2FontSize,
        lineHeight: h2LineHeight,
        fontWeight: h2FontWeight,
        transform: 'none',
        transition: 'all 0.4s ease',
        zIndex: 1
      });
    } else {
      $secTit.css('opacity', 0);

      $centerLogo.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '',
        height: '',
        fontSize: '15rem',
        lineHeight: '',
        fontWeight: '',
        transition: 'all 0.4s ease',
        zIndex: -10
      });
    }
  });

  $(window).trigger('scroll');
});

$(function () {
  $('.accordion').click(function () {
    $(this).children('.accordion-inner').slideToggle();
    $(this).toggleClass("open");
    $('.accordion').not($(this)).children('.accordion-inner').slideUp();
    $('.accordion').not($(this)).removeClass("open");
  });
});

// フロアセクション
$(function() {
  $('.expand-btn').click(function() {
    // すべて閉じる
    $('.card').removeClass('expand');
    $('.card-list').removeClass('has-expand');

    // クリックしたカードが展開されていない場合のみ展開
    if (!$(this).closest('.card').hasClass('expand')) {
      $(this).closest('.card').addClass('expand');
      $(this).closest('.card-list').addClass('has-expand');
    }
  });
});

$(function() {
  $('.close-btn').click(function() {
    // すべて閉じる
    $('.card').removeClass('expand');
    $('.card-list').removeClass('has-expand');
  });
});





