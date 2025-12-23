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
// 調整畫布大小
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged    } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD8nOFhcqlDGPVtWyMdw_6le1uKgL8ETyI",
  authDomain: "class-ne.firebaseapp.com",
  projectId: "class-ne",
  storageBucket: "class-ne.firebasestorage.app",
  messagingSenderId: "420247277966",
  appId: "1:420247277966:web:9ef65a897e0fefc9be54df",
  measurementId: "G-JYK74LDJEY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.querySelector(".form").addEventListener("submit", async (event) => {
  event.preventDefault();// 防止表單自動提交

  const usernameInput = document.getElementById("username").value.trim();
  if (!usernameInput) {
    alert("請輸入暱稱");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    try {
      let currentUser = user;

      if (!currentUser) {
        const userCredential = await signInAnonymously(auth);
        currentUser = userCredential.user;
      }
      const uid = currentUser.uid;

      // 存 username
      await setDoc(doc(db, "users", uid), {
        username: usernameInput
      }, { merge: true });

      console.log("登入成功，uid:", uid);

      alert(`登入成功！歡迎 ${usernameInput}`);
      window.location.href = "page2.html";

    } catch (error) {
      console.error("匿名登入錯誤：", error);
      alert("登入失敗，請查看 console");
    }
  });
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