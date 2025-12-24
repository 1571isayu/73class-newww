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
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    collection,
    doc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const favoritesList = document.getElementById("favoritesList");

onAuthStateChanged(auth, (user) => {
    if (!user) {
        console.log("使用者未登入");
        return;
    }
    const uid = user.uid;

    const favRef = collection(db, "users", uid, "favorites");
    const q = query(favRef, orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    favoritesList.innerHTML = "";

    if (snapshot.empty) {
      favoritesList.innerHTML =
        `<p style="color:#F3E9EB;text-align:center;">尚未收藏任何歌曲</p>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const itemId = docSnap.id;

      const pageLink = data.pageLink || "#";
      const songImage = data.image || "icon/default.png";

      const item = document.createElement("div");
      item.className = "favorite-item";

      item.innerHTML = `
        <a href="${pageLink}" class="record-link">
          <div class="record-wrapper">
            <img src="${songImage}" class="album-cover" alt="${data.name}">
            <div class="record-disk">
              <div class="record-center">
                <img src="${songImage}" alt="label">
              </div>
            </div>
          </div>
        </a>

        <div class="favorite-name">${data.name}</div>

        <div class="favorite-heart">
          <img src="musicimg/heart3.png" class="heart-icon">
        </div>
      `;

      favoritesList.appendChild(item);

      item.querySelector(".favorite-heart").addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
          await deleteDoc(doc(db, "users", uid, "favorites", itemId));
          item.style.opacity = "0";
          setTimeout(() => item.remove(), 300);
        } catch (err) {
          console.error("刪除失敗", err);
        }
      });
    });
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