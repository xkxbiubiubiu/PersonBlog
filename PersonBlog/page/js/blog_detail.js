var bolgDetail = new Vue({
    el: '#blog_detail',
    data: {
        title: '',
        content: '',
        ctime: '',
        tags: '',
        views: ''
    },
    computed: {

    },
    created: function () {
        var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        if (searchUrlParams == "") {
            return;
        }
        var bid = -10;
        for (var i = 0; i < searchUrlParams.length; i++) {
            if (searchUrlParams[i].split("=")[0] == "bid") {
                try {
                    bid = parseInt(searchUrlParams[i].split("=")[1])
                } catch (e) {
                    console.log(e)
                }
            }
        }
        axios({
            method: "get",
            url: '/queryBlogById?bid=' + bid
        }).then(function (resp) {
            
            var result = resp.data.data[0]
            bolgDetail.title = result.title;
            bolgDetail.content = result.content;
            bolgDetail.ctime = result.ctime;
            bolgDetail.tags = result.tags;
            bolgDetail.views = result.views;
        }).catch(function (resp) {
            console.log("请求失败")
        })
    }
})


var sendComment = new Vue({
    el: '#send_comments',
    data: {
        vcode: '',
        rightCode:''
    },
    computed: {
        changeCode: function () {
            return function () {
                axios({
                    method: 'get',
                    url: '/queryRandomCode',
                }).then(function (resp) {
                    console.log(resp.data.data.text)
                    sendComment.vcode = resp.data.data.data;
                    sendComment.rightCode = resp.data.data.text
                })
            }
        },
        sendComment: function () {
            return function () {
                var code = document.getElementById('comment_code').value;
                if(code != sendComment.rightCode){
                    console.log(sendComment.rightCode)
                    console.log(code)
                    alert("验证码有误")
                }
                var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var bid = -10;
                for (var i = 0; i < searchUrlParams.length; i++) {
                    if (searchUrlParams[i].split("=")[0] == "bid") {
                        try {
                            bid = parseInt(searchUrlParams[i].split("=")[1])
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
                var replyName = document.getElementById('comment_reply_name').value;                
                var reply = document.getElementById('comment_reply').value;
                var name = document.getElementById('comment_name').value;
                var email = document.getElementById('comment_email').value;
                var content = document.getElementById('commnet_content').value;
                axios({
                    method: "get",
                    url: "/addComment?bid=" + bid + '&parent=' + reply + "&userName=" + name + "&email=" + email + "&content=" + content + '&parentName=' + replyName
                }).then(function (resp) {
                    
                })
            }
        }
    },
    created: function () {
        this.changeCode()
    }

})

var blogComments = new Vue({
    el:'#blog_comments',
    data:{
        total:0,
        commentList:[

        ]
    },
    computed:{
        reply:function(){
            return function(commentId,userName){
                document.getElementById("comment_reply").value = commentId
                document.getElementById('comment_reply_name').value = userName
                location.href = "#send_comments"
            }
        }
    },
    created:function(){
        var searchUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var bid = -10;
                for (var i = 0; i < searchUrlParams.length; i++) {
                    if (searchUrlParams[i].split("=")[0] == "bid") {
                        try {
                            bid = parseInt(searchUrlParams[i].split("=")[1])
                        } catch (e) {
                            console.log(e)
                        }
                    }
                }
        axios({
            method:'get',
            url:'/queryCommentsByBlogId?bid=' + bid
        }).then(function(resp){
           console.log(resp.data.data)
            blogComments.commentList = resp.data.data
            for(var i = 0;i < blogComments.commentList.length;i ++){
                 if(blogComments.commentList[i].parent > -1){
                    blogComments.commentList[i].options = "回复@" + blogComments.commentList[i].parent_name
                 }
            }
        })
        axios({
            method:'get',
            url:'/queryCommentsCountByBlogId?bid=' + bid
        }).then(function(resp){
            blogComments.total = resp.data.data[0].count
        })
    }
})