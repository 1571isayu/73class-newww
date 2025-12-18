
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

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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
  event.preventDefault();

  const usernameInput = document.getElementById("username").value.trim();
  if (!usernameInput) {
    alert("請輸入暱稱");
    return;
  }
try {
    // 匿名登入
    const userCredential = await signInAnonymously(auth);
    const uid = userCredential.user.uid;

    // 將 username 存到 users collection
    await setDoc(doc(db, "users", uid), {
      username: usernameInput
    });

    console.log("匿名登入成功，暱稱已存:", usernameInput);

    // 用 alert 提示登入成功
    alert(`登入成功！歡迎 ${usernameInput}`);

    // 之後跳轉頁面
    window.location.href = "page2.html"; // 登入後頁面

} catch (error) {
    console.error("匿名登入錯誤：", error);
    alert("登入失敗，請查看 console");
}

});