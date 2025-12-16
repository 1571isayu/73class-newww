// =======================
// Firebase 初始化
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, serverTimestamp, 
    query, orderBy, where, onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// 每頁專屬 pageId
// =======================
const pageId = "music12"; // <-- 每頁改成 music1 ~ music12

// =======================
// 抓 DOM
// =======================
const form = document.getElementById("commentform");
const commentInput = document.getElementById("commentinput");
const commentList = document.getElementById("commentList");
const sendBtn = document.getElementById("sendBtn");

// =======================
// Firestore: 送出留言
// =======================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = commentInput.value.trim();
    if (!text) return;

    sendBtn.classList.add("fly");
    setTimeout(() => sendBtn.classList.remove("fly"), 450);

    await addDoc(collection(db, "comments"), {
        message: text,
        timestamp: serverTimestamp(),
        pageId: pageId
    });

    commentInput.value = "";
});

// =======================
// Firestore: 監聽留言
// =======================
const q = query(
    collection(db, "comments"),
    where("pageId", "==", pageId),
    //orderBy("timestamp", "desc")
);
onSnapshot(q, (snapshot) => {
    commentList.innerHTML = "";

    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const text = data.message;

        const commentItem = document.createElement("div");
        commentItem.className = "comment-item";

        const avatar = document.createElement("div");
        avatar.className = "comment-avatar";
        avatar.innerHTML = `<img src="musicimg/avatar.png" />`;

        const commentText = document.createElement("div");
        commentText.className = "comment-text";
        commentText.innerText = text + "\n" +
          (data.timestamp ? data.timestamp.toDate().toLocaleString() : "剛剛");

        const actions = document.createElement("div");
        actions.className = "comment-actions";
        actions.innerHTML = `
            <img src="musicimg/like.png" class="like">
            <img src="musicimg/dislike.png" class="dislike">
        `;
        actions.querySelector(".like").addEventListener("click", e => e.target.classList.toggle("active"));
        actions.querySelector(".dislike").addEventListener("click", e => e.target.classList.toggle("active"));

        commentItem.appendChild(avatar);
        commentItem.appendChild(commentText);
        commentItem.appendChild(actions);

        commentList.appendChild(commentItem);
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
        heart.src = "musicimg/heart3.png";
        heart.classList.remove('animate'); 
        void heart.offsetWidth;
        heart.classList.add('animate');
    });
}
