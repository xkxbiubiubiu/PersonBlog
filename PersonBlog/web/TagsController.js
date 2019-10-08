var blogDao = require("../dao/BlogDao")
var tagsDao = require("../dao/TagsDao")
var tagBlogMappingDao = require("../dao/TagBlogMappingDao")
var timeUtil = require('../util/TimeUtil')
var respUtil = require("../util/RespUtil")
var url = require('url')


var path = new Map()

function queryRandomTags(request,response){
    tagsDao.queryAllTag(function(result){
        result.sort(function(){
            return Math.random() > 0.5 ?true : false
        })
        response.writeHead(200);
        response.write(respUtil.writeResult("success",'查询成功',result))
        response.end();
    })
}
path.set("/queryRandomTags",queryRandomTags)

module.exports.path = path;
