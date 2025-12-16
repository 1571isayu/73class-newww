
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
/**/// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firebase Auth
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Analytics（可選）
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // <-- 這行很重要

document.querySelector(".form").addEventListener("submit", async function(event) {
  event.preventDefault();

  try {
    // 匿名登入
    const userCredential = await signInAnonymously(auth);
    console.log("匿名登入成功：", userCredential.user.uid);

    // 顯示 popup
    const popup = document.getElementById("successPopup");
    popup.style.display = "block";
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
      popup.style.display = "none";
      window.location.href = "index.html";
    }, 2000);

  } catch (error) {
    console.error("匿名登入錯誤：", error);
    alert("匿名登入失敗，請查看 console");
  }
});
