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
