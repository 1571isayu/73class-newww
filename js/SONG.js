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
  music10: { name: "三原色", image: "songimg/song10.jpg", pageLink: "music10.html" },
  music11: { name: "ラブレター", image: "songimg/song11.jpg", pageLink: "music11.html" },
  music12: { name: "大正浪漫", image: "songimg/song12.jpg", pageLink: "music12.html" }
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

    // 觸發愛心動畫
    heart.classList.remove("animate"); // 重置動畫
    void heart.offsetWidth; // 強制重排，保證動畫可重新觸發
    heart.classList.add("animate");

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