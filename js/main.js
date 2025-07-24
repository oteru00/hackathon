// ======================
// ローディング関連の設定
// ======================

// 読み込み時に表示するローディングエリアを取得
const loading = document.getElementById('loading');

// 画面サイズ（vw:横幅, vh:縦幅）を取得
const vw = window.innerWidth;
const vh = window.innerHeight;

// 画面中央の座標を計算（中心へ画像を移動するために使用）
const centerX = vw / 2;
const centerY = vh / 2;

// ローディング中に表示する画像データ（src:画像パス, count:表示個数）
const images = [
  { src: 'img/metalife-avatar (12).png', count: 1 },
  { src: 'img/metalife-avatar (4).png', count: 1 },
  { src: 'img/metalife-avatar (8).png', count: 1 },
  { src: 'img/metalife-avatar.png', count: 1 },
  { src: 'img/meta2.png', count: 10 }
];

// ローディング中に画像をランダムな位置から中央にアニメーションで移動させる関数
function animateToCenter({ classNames, content, large }) {
  const el = document.createElement('div'); // div要素を作成
  el.className = classNames;
  if (large) el.classList.add('loading__item--large');

  const startX = Math.random() * vw; // 開始位置X
  const startY = Math.random() * vh; // 開始位置Y

  el.style.left = `${startX}px`;
  el.style.top = `${startY}px`;

  if (content) el.innerHTML = content; // 画像を中に挿入

  loading.appendChild(el); // loadingエリアに追加

  const tl = gsap.timeline({ onComplete: () => el.remove() });

  // 最初に少し拡大＋回転
  tl.to(el, {
    scale: 1.2,
    rotation: 360 * (Math.random() > 0.5 ? 1 : -1),
    duration: 2,
    ease: "power1.inOut"
  });

  // 中央へ移動＆消える
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

// images配列をもとに画像をアニメーション表示
images.forEach(({ src, count }) => {
  for (let i = 0; i < count; i++) {
    animateToCenter({
      classNames: 'loading__item',
      content: `<img src="${src}" alt="">`,
      large: count === 1 // 大きい画像は1個のときだけ
    });
  }
});

// ======================
// アバターアニメーション関連
// ======================

const avatars = document.querySelectorAll('.avatar');
const maxScroll = 300; // スクロールの最大値（基準）

// アバターのフレーム画像（それぞれ4枚ずつ）
const avatarFrames = {
  avatar1: [
    "img/metalife-avatar (12).png",
    "img/metalife-avatar (13).png",
    "img/metalife-avatar (14).png",
    "img/metalife-avatar (15).png"
  ],
  avatar2: [
    "img/metalife-avatar (4).png",
    "img/metalife-avatar (5).png",
    "img/metalife-avatar (6).png",
    "img/metalife-avatar (7).png"
  ],
  avatar3: [
    "img/metalife-avatar (8).png",
    "img/metalife-avatar (9).png",
    "img/metalife-avatar (10).png",
    "img/metalife-avatar (11).png"
  ],
  avatar4: [
    "img/metalife-avatar.png",
    "img/metalife-avatar (1).png",
    "img/metalife-avatar (2).png",
    "img/metalife-avatar (3).png"
  ]
};

// 回転の開始位置（フレームをずらすためのオフセット）
const avatarOffsets = {
  avatar1: 0,
  avatar2: 1,
  avatar3: 2,
  avatar4: 3
};

let fakeScroll = 0;                 // 擬似スクロール量（自前で管理）
let animationPlayed = false;       // meta-logo アニメーション再生済みか
let metaLogoFinished = false;      // meta-logo 完了フラグ
let headerLogoState = 'initial';   // ヘッダーロゴの状態
let lastScrollY = 0;               // 前回スクロール位置
let avatarScrollStart = false;     // アバター表示開始済みか

// アバターのフレーム更新（回転方向切替可能）
function updateAvatarRotationFrames(scrollValue, reverse = false) {
  Object.entries(avatarFrames).forEach(([id, frames]) => {
    const img = document.getElementById(id);
    if (!img) return;

    const frameCount = frames.length;
    const baseFrame = Math.floor(scrollValue / 10);
    const offset = avatarOffsets[id] || 0;
    let frameIndex = (baseFrame + offset) % frameCount;

    if (reverse) {
      frameIndex = (frameCount - (frameIndex % frameCount)) % frameCount;
    }

    img.src = frames[frameIndex];
  });
}

// ======================
// スクロールイベント処理
// ======================

function handleWheel(e) {
  if ($('body').hasClass('no-scroll')) {
    fakeScroll += e.deltaY * 0.3; // スクロール量を擬似的に加算
    fakeScroll = Math.max(0, Math.min(fakeScroll, maxScroll + 800)); // 最大値制限

    const progress = fakeScroll / maxScroll; // 進行率（0〜1）

    // メインビジュアルの切り抜き（上から）
    $('.main-visual-video').css('clip-path', `inset(${progress * 100}% round 30px)`);

    const currentScrollY = fakeScroll;
    const scrollingDown = currentScrollY > lastScrollY;
    const scrollingUp = currentScrollY < lastScrollY;
    lastScrollY = currentScrollY;

    // ロゴを縮小・非表示（初回スクロール時）
    if (progress > 0 && headerLogoState !== 'hidden' && headerLogoState !== 'shown') {
      gsap.to('.logo img', {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: 'back.in(2)'
      });
      headerLogoState = 'hidden';
    }

    // 上に戻ったらロゴ再表示
    if (progress === 0 && headerLogoState !== 'initial') {
      gsap.to('.logo img', {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      });
      headerLogoState = 'initial';
    }

    // meta-logo アニメーション再生（1回のみ）
    if (progress >= 0.6 && !animationPlayed && !metaLogoFinished) {
      animationPlayed = true;

      gsap.fromTo('.meta-logo', {
        opacity: 0,
        scale: 0.5
      }, {
        opacity: 1,
        scale: 1.2,
        duration: 0.6,
        ease: 'back.out(1.7)',
        onComplete: () => {
          gsap.to('.meta-logo', {
            opacity: 0,
            scale: 1,
            duration: 0.5,
            delay: 0.5,
            ease: 'power1.out',
            onComplete: () => {
              metaLogoFinished = true;
              $('.meta-logo').removeClass('visible');
            }
          });
        }
      });

      $('.meta-logo').addClass('visible');
    }

    // アバター表示エリアがスクロール対象に入ったときの処理
    if (progress > 0.6) {
      avatarScrollStart = true;
      const moveUp = fakeScroll - maxScroll;

      avatars.forEach((avatar, i) => {
        const baseY = 300 + i * 50;
        if (moveUp >= i * 50) {
          const yPos = Math.max(baseY - moveUp, 0);
          gsap.to(avatar, {
            opacity: 1,
            duration: 0.3,
            y: yPos,
            overwrite: 'auto',
            ease: 'power1.out'
          });
        } else {
          gsap.to(avatar, {
            opacity: 0,
            duration: 0.3,
            y: baseY,
            overwrite: 'auto',
            ease: 'power1.out'
          });
        }
      });
    } else {
      // アバター非表示
      avatarScrollStart = false;
      gsap.set('.avatar-container', { y: 0 });
      avatars.forEach(avatar => {
        gsap.set(avatar, { opacity: 0, y: 100 });
      });
    }

    // 上に戻ったとき状態リセット
    if (progress < 0.6 && animationPlayed) {
      animationPlayed = false;
      metaLogoFinished = false;

      $('.meta-logo').removeClass('visible');
      $('.next-section').removeClass('visible');

      gsap.set('.avatar-container', { y: 0 });
      avatars.forEach(avatar => {
        gsap.set(avatar, { opacity: 0, y: 100 });
      });

      gsap.set('.meta-logo', { opacity: 0, scale: 1 });
      gsap.set('.next-section', { opacity: 0, y: 100 });
    }

    // ロゴを再非表示（下から上に戻ったとき）
    if (headerLogoState === 'shown' && scrollingUp && progress < 1) {
      gsap.to('.logo img', {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(2)'
      });
      headerLogoState = 'hidden';
    }

    // ロゴを再表示（最初まで戻ったとき）
    if (headerLogoState === 'hidden' && progress === 0) {
      gsap.to('.logo img', {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      });
      headerLogoState = 'initial';
    }

    // アバター回転：スクロール方向で逆再生
    if (scrollingDown) updateAvatarRotationFrames(fakeScroll, false);
    if (scrollingUp) updateAvatarRotationFrames(fakeScroll, true);
  }
}

// ======================
// 初期ロード処理
// ======================

window.addEventListener('load', () => {
  $('body').addClass('no-scroll'); // 最初はスクロール禁止
  gsap.set(avatars, { opacity: 0, y: 300 }); // アバター初期位置設定

  // ローディング終了後にスクロール開始許可
  setTimeout(() => {
    gsap.to('#loading', {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        $('#loading').hide();
        $('#loading-item').fadeIn(300);
        window.addEventListener('wheel', handleWheel); // スクロール開始
      }
    });
  }, 4500); // 4.5秒後に実行
});

// ======================
// ハンバーガーメニュー
// ======================
$(document).ready(function () {
  $('.hamburger').on('click', function () {
    $('nav').slideToggle(300); // メニュー表示切替
  });
});
