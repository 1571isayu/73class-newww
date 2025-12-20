/* ===============================
   Intersection fade-up (文字滑入)
================================ */
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

/* ===============================
   自訂滑鼠游標
================================ */
const cursorCanvas = document.getElementById('cursorCanvas');
const cursorCtx = cursorCanvas.getContext('2d');
let mouseX = 0, mouseY = 0, mouseDown = false;

cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;

window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
window.addEventListener('mousedown', () => mouseDown = true);
window.addEventListener('mouseup', () => mouseDown = false);

function drawCursor() {
  cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  cursorCtx.save();
  cursorCtx.translate(mouseX, mouseY);
  cursorCtx.rotate(-Math.PI / 4);
  cursorCtx.fillStyle = mouseDown ? '#F3E9EB' : '#F2285A';
  cursorCtx.beginPath();
  cursorCtx.moveTo(0, -15);
  cursorCtx.lineTo(10, 10);
  cursorCtx.lineTo(0, 5);
  cursorCtx.lineTo(-10, 10);
  cursorCtx.closePath();
  cursorCtx.fill();
  cursorCtx.restore();
  requestAnimationFrame(drawCursor);
}
drawCursor();

window.addEventListener('resize', () => {
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
});

/* ===============================
   Loading
================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  }, 2500);
});

/* ===============================
   聚光燈 + 煙霧 (最終整合版)
================================ *//* ===============================
   霓虹燈與煙霧 (修正版)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const redImg = document.querySelector(".red-img");
  const redText = document.querySelector(".red-text");
  const smokeCanvas = document.getElementById("smokeCanvas");
  const ctx = smokeCanvas.getContext("2d");

  // 文字滑入監測
  const redObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        redText.classList.add("show");
        redObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  redObserver.observe(redImg);

  // 煙霧粒子邏輯 (維持你喜歡的小顆粒 + 糊感)
  let smokes = [];
  let smokeAnimating = false;

  class Smoke {
    constructor(isPreload = false) {
      this.init(isPreload);
    }
    init(isPreload = false) {
      this.x = Math.random() * smokeCanvas.width;
      this.y = smokeCanvas.height - (Math.random() * (isPreload ? 40 : 20));
      this.radius = Math.random() * 12 + 8;
      this.vx = Math.random() * 1.2 - 0.6;
      this.vy = Math.random() * 0.2 + 0.1;
      this.maxOpacity = Math.random() * 0.2 + 0.15;
      this.opacity = isPreload ? Math.random() * this.maxOpacity : 0;
    }
    update() {
      this.x += this.vx;
      this.y -= this.vy;
      if (this.opacity < this.maxOpacity) this.opacity += 0.02;
      if (this.y < smokeCanvas.height * 0.78) this.opacity -= 0.03;
    }
    draw() {
      if (this.opacity <= 0) return;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${this.opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animateSmoke() {
    if (smokeAnimating) return;
    smokeAnimating = true;
    for (let i = 0; i < 60; i++) smokes.push(new Smoke(true));
    function frame() {
      ctx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
      if (smokes.length < 120 && Math.random() > 0.6) smokes.push(new Smoke());
      for (let i = smokes.length - 1; i >= 0; i--) {
        smokes[i].update();
        smokes[i].draw();
        if (smokes[i].opacity <= 0) smokes.splice(i, 1);
      }
      requestAnimationFrame(frame);
    }
    frame();
  }

  // 啟動煙霧
  animateSmoke();
});

/* ===============================
   第三張圖動畫 (音符特效)
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const blackSection = document.querySelector('.black');
  const blackText = document.querySelector('.black-text');
  const blackImg = document.querySelector('.black-img');
  const blackCanvas = document.getElementById('blackCanvas');
  const bCtx = blackCanvas.getContext('2d');

  function resizeBlackCanvas() {
    blackCanvas.width = blackSection.clientWidth;
    blackCanvas.height = blackSection.clientHeight;
  }

  const checkVisible = setInterval(() => {
    if (getComputedStyle(document.getElementById('main-content')).display !== 'none') {
      resizeBlackCanvas();
      clearInterval(checkVisible);
    }
  }, 100);

  window.addEventListener('resize', resizeBlackCanvas);

  const notes = [];

  class Note {
    constructor(x, y, size, speed, dx, symbol = '♪') {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
      this.dx = dx;
      this.alpha = 1.0;
      this.symbol = symbol;
    }
    draw() {
      bCtx.save();
      bCtx.globalAlpha = this.alpha;
      bCtx.fillStyle = "#FFFFFF";
      bCtx.font = `bold ${this.size}px Arial`;
      bCtx.fillText(this.symbol, this.x, this.y);
      bCtx.restore();
    }
    update() {
      this.y -= this.speed;
      this.x += this.dx;
      this.alpha -= 0.005;
    }
  }

  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        blackText.classList.add('show');
        textObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  textObserver.observe(blackText);

  function animateNotes() {
    bCtx.clearRect(0, 0, blackCanvas.width, blackCanvas.height);
    for (let i = notes.length - 1; i >= 0; i--) {
      notes[i].update();
      notes[i].draw();
      if (notes[i].alpha <= 0) notes.splice(i, 1);
    }
    requestAnimationFrame(animateNotes);
  }
  animateNotes();

  let intervalId = null;
  const symbols = ['♪', '♫', '♬', '♩'];

  blackImg.addEventListener('mouseenter', () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      const rect = blackImg.getBoundingClientRect();
      const canvasRect = blackCanvas.getBoundingClientRect();
      const offsetX = rect.left - canvasRect.left + Math.random() * rect.width;
      const offsetY = rect.top - canvasRect.top + Math.random() * rect.height;
      const size = 20 + Math.random() * 30;
      const speed = 0.5 + Math.random() * 1.5;
      const dx = (Math.random() - 0.5) * 2;
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      notes.push(new Note(offsetX, offsetY, size, speed, dx, symbol));
    }, 400);
  });

  blackImg.addEventListener('mouseleave', () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  });
});

/* ===============================
   全背景音量波動圖 (穩定版)
================================ */
function initVolumeEffect() {
    const vCanvas = document.getElementById('volumeCanvas');
    if (!vCanvas) return; // 防止抓不到元素報錯
    
    const vCtx = vCanvas.getContext('2d');
    const blackSection = document.querySelector('.black');

    let bars = [];
    let barWidth = 10;
    let barGap = 4;
    let barCount = 0;
    let mouseX = -1000;

    function resizeBars() {
        // 確保抓到的是正確的容器寬度
        const containerWidth = blackSection.clientWidth || window.innerWidth;
        vCanvas.width = containerWidth;
        vCanvas.height = 300; 
        
        barCount = Math.ceil(vCanvas.width / (barWidth + barGap));
        bars = [];
        for (let i = 0; i < barCount; i++) {
            bars.push({
                x: i * (barWidth + barGap),
                baseHeight: 15 + Math.random() * 25,
                currentHeight: 0,
                targetHeight: 0
            });
        }
    }

    // 滑鼠監聽
    blackSection.addEventListener('mousemove', (e) => {
        const rect = blackSection.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
    });

    blackSection.addEventListener('mouseleave', () => {
        mouseX = -1000;
    });

    function drawVolume() {
        vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
        
        bars.forEach((bar) => {
            const dist = Math.abs(mouseX - bar.x);
            const influence = 100; // 影響範圍稍微加大
            
            if (dist < influence) {
                const boost = (1 - dist / influence) * 60;
                bar.targetHeight = bar.baseHeight + boost;
            } else {
                // 基礎跳動感
                bar.targetHeight = bar.baseHeight + Math.sin(Date.now() * 0.005 + bar.x) * 10;
            }

            bar.currentHeight += (bar.targetHeight - bar.currentHeight) * 0.15;

            // 顏色：白色半透明
            vCtx.fillStyle = "rgba(255, 255, 255, 0.6)";
            
            vCtx.beginPath();
            // 使用矩形繪製，如果瀏覽器不支援 roundRect 則改用 fillRect
            if (vCtx.roundRect) {
                vCtx.roundRect(bar.x, vCanvas.height - bar.currentHeight, barWidth, bar.currentHeight, [5, 5, 0, 0]);
            } else {
                vCtx.fillRect(bar.x, vCanvas.height - bar.currentHeight, barWidth, bar.currentHeight);
            }
            vCtx.fill();
        });

        requestAnimationFrame(drawVolume);
    }

    // 初始化
    resizeBars();
    window.addEventListener('resize', resizeBars);
    drawVolume();
}

// ★ 修正重點：確保在 Loading 結束後才啟動
// 找到你原本的 Loading 監聽器，在那裡加入啟動指令
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    // 當 main-content 顯示後，啟動波動圖
    initVolumeEffect(); 
  }, 2500);
});