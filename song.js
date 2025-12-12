$(document).ready(function () {

    $("#submitbtn").on("click", function () {
        const name = $("#name").val().trim();
        const message = $("#message").val().trim();
        //val 是取得輸入框的值 trim是去掉前後空白

        if (!name || !message) {
            alert("名字和留言都要填喔!");
            return;
        }

        // 建立新的留言元素
        const newComment = `
            <div class="comment-item">
                <div class="name">${name}</div>
                <div class="text">${message}</div>
            </div>
        `;

        $("#commentlist").append(newComment);  
        
        $("#name").val("");
        $("#message").val("");
    });

});

/*滑鼠*/ 
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cursorCanvas');
    const ctx = canvas.getContext('2d');

    let mouseX = 0;
    let mouseY = 0;
    let mouseDown = false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 監聽滑鼠位置
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener('mousedown', () => mouseDown = true);
    window.addEventListener('mouseup', () => mouseDown = false);

    function drawCursor() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(mouseX, mouseY);
        ctx.rotate(-Math.PI / 4); // 箭頭旋轉

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

    // 調整畫布大小
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    drawCursor();
});


// -------------------------
// 1. Firebase 初始化
// -------------------------
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

// -------------------------
// 2. DOM elements
// -------------------------
const form = document.getElementById("commentform");
const commentInput = document.getElementById("commentinput");
const commentList = document.getElementById("commentList");
const sendBtn = document.getElementById("sendBtn");

// -------------------------
// 3. Firestore：送出留言
// -------------------------
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = commentInput.value.trim();
    if (!text) return;

    // 飛機動畫
    sendBtn.classList.add("fly");
    setTimeout(() => sendBtn.classList.remove("fly"), 450);

    // 存到 Firestore
    await addDoc(collection(db, "comments"), {
        message: text,
        timestamp: serverTimestamp()
    });

    commentInput.value = "";
});

// -------------------------
// 4. Firestore：即時抓留言、顯示 UI
// -------------------------
const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    commentList.innerHTML = ""; // 清空

    snapshot.forEach((doc) => {
        const data = doc.data();
        const text = data.message;

        // ------------------
        // 建立你的留言 UI
        // ------------------
        const commentItem = document.createElement("div");
        commentItem.className = "comment-item";

        // 左側頭像
        const avatar = document.createElement("div");
        avatar.className = "comment-avatar";
        const avatarImg = document.createElement("img");
        avatarImg.src = "musicimg/avatar.jpg"; // 你的頭像
        avatar.appendChild(avatarImg);

        // 留言文字
        const commentText = document.createElement("div");
        commentText.className = "comment-text";
        commentText.innerText = text;

        // 讚 & 倒讚
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

        // 組合
        commentItem.appendChild(avatar);
        commentItem.appendChild(commentText);
        commentItem.appendChild(actions);

        commentList.appendChild(commentItem);
    });
});
