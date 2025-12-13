
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


/*--------------------------------------------------------------------------------------------------------------------------*/

     document.querySelector(".form").addEventListener("submit", function(event) {
        event.preventDefault(); // 防止頁面重新載入

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username && password) {
        const popup = document.getElementById("successPopup");
        popup.style.display = "block";
        popup.classList.add("show");

        // setInterval(函式, 間隔時間毫秒);
        setTimeout(() => {
            popup.classList.remove("show");
            popup.style.display = "none";
        }, 2000);
        } else {
        alert("⚠️ 請輸入帳號與密碼！");
        }
    }); 