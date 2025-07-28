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
        $('#loading').hide();
        $('#loading-item').fadeIn(300);
        window.addEventListener('wheel', handleWheel); // ← スクロール演出を復元
      }
    });
  }, 4500);
});

// ======================
// ハンバーガーメニュー
// ======================

$(document).ready(function () {
  $('.hamburger').on('click', function () {
    $('nav').slideToggle(300);
  });
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
        'opacity': 0.5
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
  const $h2Logo = $('h2.sec-tit.logo-style');

  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();
    const windowHeight = $(this).height();

    const h2Top = $h2Logo.offset().top;
    const h2Left = $h2Logo.offset().left;
    const h2CenterY = h2Top + $h2Logo.outerHeight() / 2;
    const screenCenterY = scrollTop + windowHeight / 2;

    const h2Width = $h2Logo.outerWidth();
    const h2Height = $h2Logo.outerHeight();
    const h2FontSize = $h2Logo.css('font-size');
    const h2LineHeight = $h2Logo.css('line-height');
    const h2FontWeight = $h2Logo.css('font-weight');

    // .sec-tit が画面中央より上に行ったら追従（吸着モード）
    if (h2CenterY < screenCenterY) {
      $centerLogo.css({
        position: 'absolute',
        top: h2Top + 'px',
        left: h2Left + 'px',
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
      // 画面中央より下 → 中央で大きく表示
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
});
