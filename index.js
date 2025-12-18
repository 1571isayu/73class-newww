
const faders = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

faders.forEach(fader => observer.observe(fader));
/**/
const canvas = document.getElementById('cursorCanvas');
const ctx = canvas.getContext('2d');

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 監聽滑鼠位置
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// 監聽滑鼠按下/放開
window.addEventListener('mousedown', () => mouseDown = true);
window.addEventListener('mouseup', () => mouseDown = false);

function drawCursor() {
    // 清空畫布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(mouseX, mouseY);

    // 旋轉箭頭方向 (-45度 = 左上)
    ctx.rotate(-Math.PI / 4);

    // 顏色設定
    ctx.fillStyle = mouseDown ? '#F3E9EB' : '#F2285A';

    // 箭頭形狀
    ctx.beginPath();
    ctx.moveTo(0, -15);    // 上尖
    ctx.lineTo(10, 10);    // 右下
    ctx.lineTo(0, 5);      // 中下
    ctx.lineTo(-10, 10);   // 左下
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    requestAnimationFrame(drawCursor);
}

// 調整畫布大小
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

drawCursor();

//漢堡選單動畫
document.addEventListener('DOMContentLoaded', function () {
    // 1. 抓取元素
    var offcanvasElement = document.getElementById('offcanvasNavbar');
    var hamburgerIcon = document.querySelector('.hamburger-icon');

    // 如果找不到元素就不要執行，避免報錯
    if (!offcanvasElement || !hamburgerIcon) return;

    // 2. 當選單「開始顯示」時 -> 變成 X
    offcanvasElement.addEventListener('show.bs.offcanvas', function () {
        hamburgerIcon.classList.add('active');
    });

    // 3. 當選單「開始隱藏」時 -> 變回三條線
    offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
        hamburgerIcon.classList.remove('active');
    });
});