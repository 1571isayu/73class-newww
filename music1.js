import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, collection, addDoc, query, where, onSnapshot, serverTimestamp, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// =======================
// Firebase config
// =======================
const firebaseConfig = {
    apiKey: "AIzaSyD8nOFhcqlDGPVtWyMdw_6le1uKgL8ETyI",
    authDomain: "class-ne.firebaseapp.com",
    projectId: "class-ne",
    storageBucket: "class-ne.firebasestorage.app",
    messagingSenderId: "420247277966",
    appId: "1:420247277966:web:9ef65a897e0fefc9be54df",
    measurementId: "G-JYK74LDJEY"
};

// =======================
// 初始化 Firebase
// =======================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// =======================
// 每頁專屬 pageId
// =======================
const pageId = "music1";

// =======================
// DOM（先抓，不急著用）
// =======================
const form = document.getElementById("commentform");
const commentInput = document.getElementById("commentinput");
const commentList = document.getElementById("commentList");
const sendBtn = document.getElementById("sendBtn");

// =======================
// 目前登入使用者
// =======================
let currentUser = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        currentUser.username = userDoc.exists()
            ? userDoc.data().username
            : "匿名使用者";

        console.log("登入成功:", currentUser.username);
    } else {
        // ❗ 不要跳回自己
        window.location.href = "page5.html"; // login 頁
    }
});

// =======================
// 送出留言（安全）
// =======================
if (form && commentInput && commentList) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const text = commentInput.value.trim();
        if (!text) return;

        sendBtn?.classList.add("fly");
        setTimeout(() => sendBtn?.classList.remove("fly"), 450);

        await addDoc(collection(db, "comments"), {
            pageId,
            message: text,
            timestamp: serverTimestamp(),
            uid: currentUser.uid,
            username: currentUser.username,
            avatar: "musicimg/avatar.png"
        });

        commentInput.value = "";
    });

    // =======================
    // 監聽留言（安全）
    // =======================
    const q = query(collection(db, "comments"), where("pageId", "==", pageId));
    onSnapshot(q, (snapshot) => {
        commentList.innerHTML = "";
        snapshot.forEach((doc) => {
            const data = doc.data();

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

            item.querySelector(".like").onclick = e => e.target.classList.toggle("active");
            item.querySelector(".dislike").onclick = e => e.target.classList.toggle("active");

            commentList.appendChild(item);
        });
    });
}

// =======================
// 自訂滑鼠游標（安全）
// =======================
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

// =======================
// 愛心動畫（安全）
// =======================
const heart = document.querySelector('.heart1');
if (heart) {
    heart.addEventListener('click', () => {
        const liked = heart.src.includes('heart3.png');
        heart.src = liked ? "musicimg/heart1.png" : "musicimg/heart3.png";
        heart.classList.remove('animate');
        void heart.offsetWidth;
        heart.classList.add('animate');
    });
}
