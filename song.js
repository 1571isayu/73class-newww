
//Firebase 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, serverTimestamp,
    query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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

// 抓 DOM elements
const form = document.getElementById("commentform");
const commentInput = document.getElementById("commentinput");
const commentList = document.getElementById("commentList");
const sendBtn = document.getElementById("sendBtn");

// Firestore：送出留言
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = commentInput.value.trim();
    if (!text) return;

    sendBtn.classList.add("fly");
    setTimeout(() => sendBtn.classList.remove("fly"), 450);

    // 存到 Firestore
    await addDoc(collection(db, "comments"), {
        message: text,
        timestamp: serverTimestamp()
    });
    // 清空輸入框
    commentInput.value = "";
});

// Firestore

const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    commentList.innerHTML = ""; // 清空

    snapshot.forEach((doc) => {
        const data = doc.data();
        const text = data.message;

        // 留言 css
        const commentItem = document.createElement("div");
        commentItem.className = "comment-item";

        // 左-頭像
        const avatar = document.createElement("div");
        avatar.className = "comment-avatar";
        const avatarImg = document.createElement("img");
        avatarImg.src = "musicimg/avatar.png"; // 你的頭像
        avatar.appendChild(avatarImg);

        // 留言文字
        const commentText = document.createElement("div");
        commentText.className = "comment-text";
        commentText.innerText = text;

        // 右-讚 倒讚
        const actions = document.createElement("div");
        actions.className = "comment-actions";

        const like = document.createElement("img");
        like.src = "musicimg/like.png";
        like.addEventListener("click", () => like.classList.toggle("active"));

        const dislike = document.createElement("img");
        dislike.src = "musicimg/dislike.png";
        dislike.addEventListener("click", () => dislike.classList.toggle("active"));

        actions.appendChild(like);
        actions.appendChild(dislike);

        commentItem.appendChild(avatar);
        commentItem.appendChild(commentText);
        commentItem.appendChild(actions);

        commentList.appendChild(commentItem);
    });
});  
/*滑鼠*/
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

/*愛心*/
const heart = document.querySelector('.heart1');

heart.addEventListener('click', () => {
    // 換成紅色愛心圖
    heart.src = "musicimg/heart3.png"

    // 觸發跳動動畫
    heart.classList.remove('animate'); 
    void heart.offsetWidth; // 重置動畫
    heart.classList.add('animate');
});