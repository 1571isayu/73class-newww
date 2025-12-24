/* =========================================
   1. 星星鼠標特效 (包含換圖功能)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const cursorStar = document.getElementById('cursor-star');
    
    // 防呆
    if (!cursorStar) {
        console.error("找不到 #cursor-star 元素");
        return;
    }

    let lastTime = 0;

    // --- A. 滑鼠移動跟隨 (基本功能) ---
    document.addEventListener('mousemove', function(e) {
        // 顯示並更新大星星位置
        cursorStar.style.display = 'block';
        cursorStar.style.left = e.clientX + 'px';
        cursorStar.style.top = e.clientY + 'px';

        // 產生尾巴小星星 (冷卻時間 100毫秒)
        const now = Date.now();
        if (now - lastTime > 100) { 
            createTrailStar(e.pageX, e.pageY);
            lastTime = now;
        }
    });

    // --- B. 連結換圖偵測 (新增功能) ---
    
    // 定義什麼是「可點擊」的元素
    function isClickable(target) {
        // 檢查目標本身，或是往上找它的祖先元素是否有這些特徵
        return target.closest('a') || // 連結
               target.closest('button') || // 按鈕
               target.closest('.nav-icon') || // 你 header 的 icon class
               // 或者檢查該元素的滑鼠樣式是否被設為 pointer (手型)
               window.getComputedStyle(target).cursor === 'pointer';
    }

    // 監聽滑鼠移入事件
    document.addEventListener('mouseover', function(e) {
        if (isClickable(e.target)) {
            // 如果碰到可點擊元素，加上 class 來換圖
            cursorStar.classList.add('is-hovering');
        }
    });

    // 監聽滑鼠移出事件
    document.addEventListener('mouseout', function(e) {
        // 這裡使用一個簡單的邏輯：滑鼠離開任何元素時，先移除 class。
        // 如果它立刻又進入另一個可點擊元素，mouseover 會馬上再把它加回去，視覺上是連續的。
        cursorStar.classList.remove('is-hovering');
    });


    // --- C. 產生尾巴函式 (維持原樣) ---
    function createTrailStar(x, y) {
        const star = document.createElement('div');
        star.classList.add('trail-star', 'star-image');
        
        // (選用) 如果你希望尾巴也跟著變色，可以把下面註解打開，
        // 但因為尾巴是隨機產生且很快消失，維持原樣通常視覺上比較不亂。
        /*
        if (cursorStar.classList.contains('is-hovering')) {
             star.style.backgroundImage = "url('../star-hover.png')";
        }
        */

        star.style.left = x + 'px';
        star.style.top = y + 'px';
        
        const size = Math.random() * 15 + 10; 
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        const tx = (Math.random() - 0.5) * 60; 
        star.style.setProperty('--tx', `${tx}px`);

        document.body.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
});

//fade up
document.addEventListener("DOMContentLoaded", () => {
    const fadeUpElements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // 只觸發一次
            }
        });
    }, { threshold: 0.5 }); // 元素 50% 進入視窗觸發

    fadeUpElements.forEach(el => observer.observe(el));
});

//Loading
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';//隱藏
    document.getElementById('main-content').style.display = 'block';
    initVolumeEffect();
  }, 2500);
});

//ALBUM音符
document.addEventListener("DOMContentLoaded", () => {
  const blackredSection = document.querySelector('.album');
  const blackredText = document.querySelector('.blackred-text');
  const blackredImg = document.querySelector('.blackred-img');
  const blackredCanvas = document.getElementById('blackredCanvas');
  const brCtx = blackredCanvas.getContext('2d');

  function resizeBlackredCanvas() {
    const rect = blackredSection.getBoundingClientRect();
    blackredCanvas.width = rect.width;
    blackredCanvas.height = rect.height;
  }

  const checkVisible = setInterval(() => {
    if (getComputedStyle(document.getElementById('main-content')).display !== 'none') {
      resizeBlackredCanvas();
      clearInterval(checkVisible);
    }
  }, 100);

  window.addEventListener('resize', resizeBlackredCanvas);

  const notes = [];

  class Note {
    constructor(x, y, size, speed, dx, symbol) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
      this.dx = dx;
      this.alpha = 1;
      this.symbol = symbol;
    }

    //音符慢慢消失
    update() {
      this.y -= this.speed;
      this.x += this.dx;
      this.alpha -= 0.005;
    }

    draw() {
      brCtx.save();
      brCtx.globalAlpha = this.alpha;
      brCtx.fillStyle = "#fff";
      brCtx.font = `bold ${this.size}px Arial`;
      brCtx.fillText(this.symbol, this.x, this.y);
      brCtx.restore();
    }
  }

  const blackredObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        blackredText.classList.add("show");
        blackredObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  blackredObserver.observe(blackredText);

  //更新畫音符
  function animateNotes() {
    brCtx.clearRect(0, 0, blackredCanvas.width, blackredCanvas.height);
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

  blackredImg.addEventListener('mouseenter', () => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      const rect = blackredImg.getBoundingClientRect();
      const canvasRect = blackredCanvas.getBoundingClientRect();
      notes.push(new Note(
        rect.left - canvasRect.left + Math.random() * rect.width,
        rect.top - canvasRect.top + Math.random() * rect.height,
        20 + Math.random() * 40,
        0.5 + Math.random() * 2.5,
        (Math.random() - 0.5) * 2.5,
        symbols[Math.floor(Math.random() * symbols.length)]
      ));
    }, 200);
  });

  blackredImg.addEventListener('mouseleave', () => {
    clearInterval(intervalId);
    intervalId = null;
  });
});

//ALBUM音量波動
function initVolumeEffect() {
  const vCanvas = document.getElementById('volumeCanvas');
  const vCtx = vCanvas.getContext('2d');
  const blackredSection = document.querySelector('.album');

  let bars = [];
  const barWidth = 10;
  const barGap = 4;
  let mouseX = -1000;

  function resize() {
    vCanvas.width = blackredSection.clientWidth;
    vCanvas.height = 300;
    bars = Array.from({ length: Math.ceil(vCanvas.width / (barWidth + barGap)) }, (_, i) => ({
      x: i * (barWidth + barGap),
      base: 15 + Math.random() * 25,
      current: 0,
      target: 0
    }));
  }

  //追蹤滑鼠位置
  blackredSection.addEventListener('mousemove', e => {
    mouseX = e.clientX - blackredSection.getBoundingClientRect().left;
  });

  blackredSection.addEventListener('mouseleave', () => mouseX = -1000);

  function draw() {
    vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);

    bars.forEach(bar => {
      const dist = Math.abs(mouseX - bar.x);
      bar.target = dist < 100
        ? bar.base + (1 - dist / 100) * 60
        : bar.base + Math.sin(Date.now() * 0.005 + bar.x) * 10;

      bar.current += (bar.target - bar.current) * 0.15;

      vCtx.fillStyle = "rgba(255,255,255,0.6)";
      vCtx.fillRect(bar.x, vCanvas.height - bar.current, barWidth, bar.current);
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

//LIVE特效
document.addEventListener("DOMContentLoaded", () => {
  const redImg = document.querySelector(".live-img");
  const threeText = document.querySelector(".live-text");
  const smokeCanvas = document.getElementById("smokeCanvas");
  const ctx = smokeCanvas.getContext("2d");

  // 文字
  const textObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        threeText.classList.add("show");
        textObserver.unobserve(entry.target);//只觸發一次
      }
    });
  }, { threshold: 0.6 });

  textObserver.observe(redImg);

  //煙霧特效
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

    //往上飄 透明度++
    update() {
      this.x += this.vx;
      this.y -= this.vy;
      if (this.opacity < this.maxOpacity) this.opacity += 0.02;
      if (this.y < smokeCanvas.height * 0.78) this.opacity -= 0.03;
    }

    //光暈效果
    draw() {
      if (this.opacity <= 0) return;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, `rgba(255,255,255,${this.opacity})`);
      g.addColorStop(0.4, `rgba(255,255,255,${this.opacity * 0.4})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = g;
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

      if (smokes.length < 120 && Math.random() > 0.6) {
        smokes.push(new Smoke());
      }
      //刪除消失的煙霧
      for (let i = smokes.length - 1; i >= 0; i--) {
        smokes[i].update();
        smokes[i].draw();
        if (smokes[i].opacity <= 0) smokes.splice(i, 1);
      }

      requestAnimationFrame(frame);
    }
    frame();
  }

  animateSmoke();
});




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