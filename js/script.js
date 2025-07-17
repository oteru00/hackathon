// footerアニメーション
$(function () {
    $('.avatar-rotate').each(function (i, el) {
        const $imgs = $(el).find('img');
        let currentIndex = 0;

        $imgs.hide().eq(currentIndex).show();

        setInterval(function () {
            $imgs.eq(currentIndex).hide();
            currentIndex = (currentIndex + 1) % $imgs.length;
            $imgs.eq(currentIndex).show();
        }, 500);
    });
});

