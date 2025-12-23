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