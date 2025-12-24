/*星星鼠標特效*/
document.addEventListener('DOMContentLoaded', () => {
  const cursorStar = document.getElementById('cursor-star');

  if (!cursorStar) {
    console.error("找不到 #cursor-star 元素");
    return;
  }

  let lastTime = 0;

  document.addEventListener('mousemove', function (e) {
    cursorStar.style.display = 'block';
    cursorStar.style.left = e.clientX + 'px';
    cursorStar.style.top = e.clientY + 'px';
    const now = Date.now();
    if (now - lastTime > 100) {
      createTrailStar(e.pageX, e.pageY);
      lastTime = now;
    }
  });

  function isClickable(target) {
    return target.closest('a') ||
      target.closest('button') ||
      target.closest('.nav-icon') ||
      window.getComputedStyle(target).cursor === 'pointer';
  }

  document.addEventListener('mouseover', function (e) {
    if (isClickable(e.target)) {
      cursorStar.classList.add('is-hovering');
    }
  });

  document.addEventListener('mouseout', function (e) {
    cursorStar.classList.remove('is-hovering');
  });
  //小星星拖尾特效
  function createTrailStar(x, y) {
    const star = document.createElement('div');
    star.classList.add('trail-star', 'star-image');
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
    var offcanvasElement = document.getElementById('offcanvasNavbar');
    var hamburgerIcon = document.querySelector('.hamburger-icon');
    if (!offcanvasElement || !hamburgerIcon) return;
    offcanvasElement.addEventListener('show.bs.offcanvas', function () {
        hamburgerIcon.classList.add('active');
    });
    offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
        hamburgerIcon.classList.remove('active');
    });
});