$(function () {

  //スクロールアニメーション
  const numLoops = 2;

  $(window).on('scroll', function () {
    const windowHeight = $(window).height();
    const scrollTop = $(window).scrollTop();

    $('.avatar').each(function () {
      const $avatar = $(this);
      const offsetTop = $avatar.offset().top;
      const avatarHeight = $avatar.outerHeight();

      // ビューポート内での表示進捗（0〜1）
      const progress = (scrollTop + windowHeight - offsetTop) / (windowHeight + avatarHeight);

      // 範囲外ならスキップ
      if (progress < 0 || progress > 1) return;

      const $imgs = $avatar.find('img');
      const numImages = $imgs.length;
      const totalSteps = numImages * numLoops;
      const currentStep = Math.floor(progress * totalSteps) % numImages;

      $imgs.removeClass('active');
      $imgs.eq(currentStep).addClass('active');
    });
  });

  // 初期表示
  $(window).trigger('scroll');

  // --- footerアニメーション ---
  $('footer .avatar-rotate').each(function (i, el) {
    const $imgs = $(el).find('img');
    let currentIndex = 0;

    $imgs.hide().eq(currentIndex).show();

    setInterval(function () {
      $imgs.eq(currentIndex).hide();
      currentIndex = (currentIndex + 1) % $imgs.length;
      $imgs.eq(currentIndex).show();
    }, 500);
  });

  // --- voice-slider（音声カードスライダー）処理 ---
  const $slider = $('.voice-slider');          // スライダー全体のコンテナ
  const $cards = $slider.find('.voice-card');  // スライダー内のカード要素一覧
  const $nextBtn = $('#next');                  // 「次へ」ボタン
  const $prevBtn = $('#prev');                  // 「前へ」ボタン

  let currentIndex = 2; // 初期表示は3枚目のカード（中央）

  // mod関数：負の数にも対応した剰余計算をする関数
  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  // スライダーをフェードインで表示する処理
  function showSliderWithFadeIn() {
    $slider.css({
      visibility: 'visible',  // 表示設定
      opacity: '1',           // 透明度100%（完全に見える）
    });
  }

  // カードの位置・傾き・大きさ・重なり順などを計算して反映する関数
  // centerIndex：中央に置くカードのインデックス
  // immediate：trueならアニメーションなしで即座に適用
  function updateArchEffect(centerIndex, immediate = false) {
    const total = $cards.length; // カードの総数

    $cards.each(function (i, el) {
      // 現在のカードの中央からの距離（オフセット）を計算
      let offset = i - centerIndex;

      // 右端と左端でループさせるため、offsetを調整
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      // 中央のカードだけ「is-center」クラスを付ける
      if (offset === 0) {
        $(el).addClass('is-center');
      } else {
        $(el).removeClass('is-center');
      }

      // オフセットに応じて位置や回転、拡大率を設定
      const x = offset * 280;              // 横方向の移動(px)
      const y = Math.abs(offset) * -30;   // 縦方向の移動(px)
      const rotateY = offset * 15;         // Y軸回転(deg)
      const scale = offset === 0 ? 1.1 : 0.9; // 中央だけ大きく、それ以外は少し小さく
      const zIndex = 100 - Math.abs(offset); // 重なり順。中央が一番上に

      // gsapに渡すプロパティをまとめる
      const props = {
        x,
        y,
        rotateY,
        scale,
        zIndex,
        ease: 'power2.out', // アニメーションのイージング（滑らかさ）
      };

      // immediateがtrueなら即座にセット（アニメなし）、falseならアニメーションで移動
      if (immediate) {
        gsap.set(el, props);
      } else {
        gsap.to(el, { duration: 0.5, ...props });
      }
    });
  }

  // スライダーを指定のインデックスに移動させる関数
  function slideTo(index, immediate = false) {
    currentIndex = mod(index, $cards.length);  // インデックスを範囲内に収める
    updateArchEffect(currentIndex, immediate); // カードの見た目を更新
    if (immediate) showSliderWithFadeIn();    // 即時の場合はフェードイン表示も行う
  }

  // 「次へ」ボタンクリック時にスライドを進める
  $nextBtn.on('click', () => {
    slideTo(currentIndex + 1);
  });

  // 「前へ」ボタンクリック時にスライドを戻す
  $prevBtn.on('click', () => {
    slideTo(currentIndex - 1);
  });

  // 初期表示を設定（アニメなしで即座に配置）
  slideTo(currentIndex, true);

  // 画面サイズが変わったらスライダーの位置を再計算
  $(window).on('resize', () => {
    slideTo(currentIndex, true);
  });
});

// ページ内のすべてのボタンにイベントを設定
document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    card.classList.toggle('expand');
  });
});
