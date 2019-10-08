// import { link } from "fs";

var everyDay = new Vue({
    el: '#every_day',
    data: {
        content: 'In one kiss, you will know all I have not said.'
    },
    computed: {
        getContent: function () {
            return this.content;
        }
    },
    created: function () {
        //请求数据给content赋值
        axios({
            method:'get',
            url:'/queryEveryDay'
        }).then(function(resp){
            everyDay.content = resp.data.data[0].content
            // console.log(resp.data.data[0].content)
        }).catch(function(resp){
            console.log('请求失败')
        })
    }
})


var articleList = new Vue({
    el: "#article_list",
    data: {
        page:1,
        pageSize:5,
        count:100,
        pageNumList:[],
        articleList: [
            {
                title: 'Docker搜索或拉取镜像时提示timeout',
                content: '【更新】推荐直接在物理主机的config.json文件进行配置，因为发现下面的方式修改/etc/resolv.conf后，重启docker时会失效。配置文件默认在C:\Users\你的用户名\.docker\machine\machines\default内。编辑其中的HostOptions>EngineOptions>Dns项，',
                date: '2019-8-15',
                views: '101',
                tags: 'test1 test2',
                id: '1',
                link: ''
            }

        ]
    },
    computed:{
        jumpTo:function(){
            return function(page){
                this.getPage(page,this.pageSize)
            }
        },
        getPage:function(){
            return function (page,pageSize){
                axios({
                    method:'get',
                    url:'/queryBlogByPage?page='+ (page-1) + '&pageSize=' + pageSize
                }).then(function(resp){
                    var result = resp.data.data
                    var list = [];
                    for(var i = 0;i < result.length;i ++){
                        var temp = {};
                        temp.title = result[i].title;
                        temp.content = result[i].content;
                        temp.date = result[i].ctime;
                        temp.views = result[i].views;
                        temp.id = result[i].id;
                        temp.tags = result[i].tags;
                        temp.link = "/blog_detail.html?bid=" + result[i].id
                        list.push(temp)
                    }
                    articleList.articleList = list
                    articleList.page = page;
                }).catch(function(resp){
                    console.log('请求错误')
                });
                axios({
                    method:'get',
                    url:"/queryBlogCount"
                }).then(function(resp){
                    articleList.count = resp.data.data[0].count
                    articleList.generatePageTool
                })
            }
        },
        generatePageTool:function(){
            var nowPage = this.page;
            var pageSize = this.pageSize;
            var totalCount = this.count;
            var result = [];
            result.push({text:'<<',page:1})
            if(nowPage > 2){
                result.push({text:nowPage - 2,page:nowPage - 2})
            }
            if(nowPage > 1){
                result.push({text:nowPage - 1,page:nowPage - 1})
            }
            result.push({text:nowPage,page:nowPage})
            if(nowPage + 1 <= (totalCount + pageSize -1) / pageSize){
                result.push({text:nowPage + 1,page:nowPage + 1})
            }
            if(nowPage + 2 <= (totalCount + pageSize -1) / pageSize){
                result.push({text:nowPage + 2,page:nowPage + 2})
            }
            result.push({text:">>",page:parseInt((totalCount + pageSize -1) / pageSize)})
            this.pageNumList = result;
            return result;
        }
    },
    created:function(){
        this.getPage(this.page,this.pageSize)
    }
})