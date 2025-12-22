// 滑鼠
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
    ctx.rotate(-Math.PI / 4);
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
