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

onSnapshot(q, (snapshot) => 
{
    favoritesList.innerHTML = "";

    if (snapshot.empty) {
        favoritesList.innerHTML = `<p style="color:#F3E9EB; text-align:center;">尚未收藏任何歌曲</p>`;
        return;
    }

    let counter = 1; 

    snapshot.forEach((docSnap) => {
        const data = docSnap.data(); 
        const itemId = docSnap.id;
        const songImage = data.image || 'icon/default.png';

        const pageLink = `MUSIC${counter}.html`;
        counter++;
        if(counter > 12) counter = 1; 

        const item = document.createElement("div");
        item.className = "favorite-item";

        item.innerHTML = `
            <a href="${pageLink}" class="record-link">
                <div class="record-wrapper">
                    <img src="${songImage}" alt="${data.name}" class="album-cover">
                    <div class="record-disk">
                        <div class="record-center">
                            <img src="${songImage}" alt="label">
                        </div>
                    </div>
                </div>
            </a>
            <div class="favorite-name">${data.name || '未知'}</div>
            <div class="favorite-heart" data-id="${itemId}">
                <img src="musicimg/heart3.png" alt="愛心" class="heart-icon">
            </div>
        `;
        favoritesList.appendChild(item);

        // 愛心刪除
        const heartDiv = item.querySelector(".favorite-heart");
        heartDiv.addEventListener("click", async (e) => {
            e.stopPropagation(); 
            try {
                await deleteDoc(doc(db, "users", uid, "favorites", itemId));
                item.style.opacity = "0";
                setTimeout(() => item.remove(), 300);
            } catch (err) {
                console.error("刪除失敗:", err);
            }
        });
    });
}, (err) => {
    console.error("抓取收藏清單失敗:", err);
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