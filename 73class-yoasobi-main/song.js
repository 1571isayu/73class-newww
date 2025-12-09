$(document).ready(function () {

    $("#submitbtn").on("click", function () {
        const name = $("#name").val().trim();
        const message = $("#message").val().trim();
        //val 是取得輸入框的值 trim是去掉前後空白

        if (!name || !message) {
            alert("名字和留言都要填喔!");
            return;
        }

        // 建立新的留言元素
        const newComment = `
            <div class="comment-item">
                <div class="name">${name}</div>
                <div class="text">${message}</div>
            </div>
        `;

        $("#commentlist").append(newComment);  
        
        $("#name").val("");
        $("#message").val("");
    });

});

/**/ 
document.addEventListener('DOMContentLoaded', () => {
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

    window.addEventListener('mousedown', () => mouseDown = true);
    window.addEventListener('mouseup', () => mouseDown = false);

    function drawCursor() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(-Math.PI / 4); // 箭頭旋轉

        ctx.fillStyle = mouseDown ? '#F3E9EB' : '#F2285A';

        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(10, 10);
        ctx.lineTo(0, 5);
        ctx.lineTo(-10, 10);
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
});
