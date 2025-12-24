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
const sendBtn = document.getElementById("sendBtn");

let isSubmitting = false;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  if (!commentInput.value.trim()) return;
  if (!currentUser) return;

  isSubmitting = true;
  sendBtn.disabled = true;

  // 飛機動畫
  sendBtn.classList.remove("fly");
  void sendBtn.offsetWidth;
  sendBtn.classList.add("fly");

  try {
    await addDoc(collection(db, "comments"), {
      pageId,
      message: commentInput.value,
      username: currentUser.username,
      uid: currentUser.uid,
      avatar: "musicimg/avatar.png",
      timestamp: serverTimestamp()
    });

    commentInput.value = "";
  } finally {
    setTimeout(() => {
      sendBtn.classList.remove("fly");
      sendBtn.disabled = false;
      isSubmitting = false;
    }, 500);
  }
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



const heart = document.querySelector(".heart1");

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

  if (!heart || !song) return;

  const favRef = doc(db, "users", currentUser.uid, "favorites", pageId);

  const snap = await getDoc(favRef);
  heart.src = snap.exists()
    ? "musicimg/heart3.png"
    : "musicimg/heart1.png";

  heart.addEventListener("click", async () => {
    const liked = heart.src.includes("heart3.png");

    heart.src = liked
      ? "musicimg/heart1.png"
      : "musicimg/heart3.png";

    heart.classList.remove("animate");
    void heart.offsetWidth;
    heart.classList.add("animate");

    if (liked) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        ...song,
        createdAt: serverTimestamp()
      });
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