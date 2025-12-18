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
const pageId = "music8"; // 每頁改成 music1 ~ music12

// =======================
// DOM
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

        // 從 users collection 拿暱稱
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
            currentUser.username = userDoc.data().username;
        } else {
            currentUser.username = "匿名使用者";
        }

        console.log("登入 UID:", currentUser.uid, "暱稱:", currentUser.username);
    } else {
        window.location.href = "music8.html";
    }
});

// =======================
// 送出留言
// =======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const text = commentInput.value.trim();
    if (!text) return;

    sendBtn.classList.add("fly");
    setTimeout(() => sendBtn.classList.remove("fly"), 450);

    await addDoc(collection(db, "comments"), {
        pageId: pageId,
        message: text,
        timestamp: serverTimestamp(),
        uid: currentUser.uid,
        username: currentUser.username,  // 使用登入暱稱
        avatar: "musicimg/avatar.png"
    });

    commentInput.value = "";
});

// =======================
// 監聽留言
// =======================
const q = query(collection(db, "comments"), where("pageId", "==", pageId));

onSnapshot(q, (snapshot) => {
    commentList.innerHTML = "";

    snapshot.docs.forEach((doc) => {
        const data = doc.data();

        const item = document.createElement("div");
        item.className = "comment-item";

        item.innerHTML = `
            <div class="comment-avatar">
                <img src="${data.avatar}">
            </div>
            <div class="comment-body">
                <div class="comment-header">
                    <span class="comment-username">${data.username}</span>
                    <span class="comment-time">
                        ${data.timestamp ? data.timestamp.toDate().toLocaleString() : "剛剛"}
                    </span>
                </div>
                <div class="comment-text">${data.message}</div>
                <div class="comment-actions">
                    <img src="musicimg/like.png" class="like">
                    <img src="musicimg/dislike.png" class="dislike">
                </div>
            </div>
        `;

        // 點擊讚/倒讚效果
        item.querySelector(".like").addEventListener("click", e => {
            e.target.classList.toggle("active");
        });
        item.querySelector(".dislike").addEventListener("click", e => {
            e.target.classList.toggle("active");
        });

        commentList.appendChild(item);
    });
});




// =======================
// 自訂滑鼠游標
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cursorCanvas');
    const ctx = canvas.getContext('2d');

    let mouseX = 0, mouseY = 0, mouseDown = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    drawCursor();
});

// =======================
// 愛心動畫
// =======================
const heart = document.querySelector('.heart1');

if (heart) {
    heart.addEventListener('click', () => {
        const isLiked = heart.src.includes('heart3.png');

        heart.src = isLiked
            ? "musicimg/heart1.png"
            : "musicimg/heart3.png";

        heart.classList.remove('animate');
        void heart.offsetWidth; // 強制 reflow
        heart.classList.add('animate');
    });
}
