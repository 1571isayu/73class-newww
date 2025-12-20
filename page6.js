import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

const favoritesList = document.getElementById("favoritesList");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "page5.html"; // 如果沒登入跳回登入頁
        return;
    }
    currentUser = user;

    // 抓使用者收藏清單
    const favCollection = collection(db, "users", user.uid, "favorites");
    const favSnapshot = await getDocs(favCollection);

    favSnapshot.forEach(docSnap => {
        const data = docSnap.data();
        renderFavorite(data);
    });
});

// 渲染單筆收藏
function renderFavorite(item) {
    const div = document.createElement("div");
    div.classList.add("favorite-item");

    div.innerHTML = `
        <a href="${item.pageLink}">
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name}</span>
        </a>
    `;
    favoritesList.appendChild(div);
}

const heart = document.querySelector('.heart1');
if (heart) {
    heart.addEventListener('click', async () => {
        if (!currentUser) return alert("請先登入");

        const musicId = "music1";  // 唯一識別ID
        const favoriteData = {
            name: "夜に駆ける",
            image: "songimg/song1.png",
            pageLink: "music1.html"
        };

        const docRef = doc(db, "users", currentUser.uid, "favorites", musicId);

        try {
            if (heart.classList.contains("active")) {
                await deleteDoc(docRef);
                heart.classList.remove("active");
                heart.src = "musicimg/heart1.png";
                console.log("已取消收藏");
            } else {
                await setDoc(docRef, favoriteData);
                heart.classList.add("active");
                heart.src = "musicimg/heart3.png";
                console.log("已加入收藏");
                renderFavorite(favoriteData); // 新增到頁面
            }
        } catch (err) {
            console.error("收藏操作失敗:", err);
        }
    });
}
