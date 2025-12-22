import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD8nOFhcqlDGPVtWyMdw_6le1uKgL8ETyI",
  authDomain: "class-ne.firebaseapp.com",
  projectId: "class-ne",
  storageBucket: "class-ne.firebasestorage.app",
  messagingSenderId: "420247277966",
  appId: "1:420247277966:web:9ef65a897e0fefc9be54df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//抓每頁的id
const pageId = document.body.dataset.pageId;

//把全部資訊放在一起
const SONG_MAP = {
  music1: { name: "夜に駆ける", image: "songimg/song1.png", pageLink: "music1.html" },
  music2: { name: "あの夢をなぞって", image: "songimg/song2.jpg", pageLink: "music2.html" },
  music3: { name: "ハルジオン", image: "songimg/song3.jpg", pageLink: "music3.html" },
  music4: { name: "たぶん", image: "songimg/song4.jpg", pageLink: "music4.html" },
  music5: { name: "群青", image: "songimg/song5.jpg", pageLink: "music5.html" },
  music6: { name: "ハルカ", image: "songimg/song6.jpg", pageLink: "music6.html" },
  music7: { name: "怪物", image: "songimg/song7.jpg", pageLink: "music7.html" },
  music8: { name: "優しい彗星", image: "songimg/song8.jpg", pageLink: "music8.html" },
  music9: { name: "もう少しだけ", image: "songimg/song9.jpg", pageLink: "music9.html" },
  music10:{ name: "三原色", image: "songimg/song10.jpg", pageLink: "music10.html" },
  music11:{ name: "ラブレター", image: "songimg/song11.jpg", pageLink: "music11.html" },
  music12:{ name: "大正浪漫", image: "songimg/song12.jpg", pageLink: "music12.html" }
};

const song = SONG_MAP[pageId];

//查看使用者(加入跳轉效果
let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "page5.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  currentUser = {
    uid: user.uid,
    username: userDoc.exists() ? userDoc.data().username : "匿名使用者"
  };
});

//留言輸入
const form = document.getElementById("commentform");
const commentInput = document.getElementById("commentinput");
const commentList = document.getElementById("commentList");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();//阻止刷新
    if (!commentInput.value.trim()) return;//不空才送

    //存到comments集合
    await addDoc(collection(db, "comments"), {
      pageId,
      message: commentInput.value,
      username: currentUser.username,
      uid: currentUser.uid,
      avatar: "musicimg/avatar.png",
      timestamp: serverTimestamp()
    });

    commentInput.value = "";//清空
  });

  const q = query(
    collection(db, "comments"),
    where("pageId", "==", pageId),
    orderBy("timestamp", "asc")
  );

  onSnapshot(q, (snapshot) => {
  commentList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const item = document.createElement("div");
    item.className = "comment-item";
    item.innerHTML = `
      <div class="comment-left">
        <div class="comment-avatar">
          <img src="${data.avatar}">
        </div>
        <div class="comment-body">
          <div class="comment-username">${data.username}</div>
          <div class="comment-text">${data.message}</div>
        </div>
      </div>
      <div class="comment-right">
        <div class="comment-actions">
          <img src="musicimg/like.png" class="like">
          <img src="musicimg/dislike.png" class="dislike">
        </div>
      </div>
    `;

    //讚+倒讚
    item.querySelector(".like").onclick =
      e => e.target.classList.toggle("active");

    item.querySelector(".dislike").onclick =
      e => e.target.classList.toggle("active");

    commentList.appendChild(item);
  });
});

}

//收藏列表
const heart = document.querySelector(".heart1");

if (heart && song) {
  const favRef = () =>
    doc(db, "users", currentUser.uid, "favorites", pageId);

  heart.addEventListener("click", async () => {
    const liked = heart.src.includes("heart3.png");
    heart.src = liked ? "musicimg/heart1.png" : "musicimg/heart3.png";

    if (liked) {
      await deleteDoc(favRef());
    } else {
      await setDoc(favRef(), {
        ...song,
        createdAt: serverTimestamp()
      });
    }
  });
}

// 滑鼠游標
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cursorCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let mouseX = 0, mouseY = 0, mouseDown = false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', e => {
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
    drawCursor();
});
// 取得按鈕與圖示元素
const hamburgerBtn = document.getElementById('hamburger-btn');
const hamburgerIcon = document.querySelector('.hamburger-icon');
const offcanvasElement = document.getElementById('offcanvasNavbar');

// 當選單「打開」時，變成叉叉
offcanvasElement.addEventListener('show.bs.offcanvas', function () {
    hamburgerIcon.classList.add('active');
});

// 當選單「關閉」時，變回三條線
offcanvasElement.addEventListener('hide.bs.offcanvas', function () {
    hamburgerIcon.classList.remove('active');
});