var request=require("request");
var database=require("./database");

var getAccessToken=function(data,run,callback){
  database.Auth.find({username:data.username,platform:"reddit"},function(err,docs){
    if(err) throw err;
    if(docs.length>0){
      var url="https://www.reddit.com/api/v1/access_token"
              +"?refresh_token="+docs[0].refreshToken
              +"&grant_type=refresh_token";

      var auth="Basic "+new Buffer(process.env.redditClientId+":"+process.env.redditSecret).toString("base64");

      var headers={
        "User-Agent":"Entertainment-Hub by dedeco99",
        "Authorization":auth
      };

      request.post({url:url,headers:headers},function(error,response,html){
        if(error) console.log(error);
        var json=JSON.parse(html);
        run(data,json.access_token,callback);
      });
    }
  });
}

var getSubreddits=function(data,accessToken,callback){
  var url="https://oauth.reddit.com/subreddits/mine/subscriber?limit=1000";
  var headers={
    "User-Agent":"Entertainment-Hub by dedeco99",
    "Authorization":"bearer "+accessToken
  };

  request({url:url,headers:headers},function(error,response,html){
    if(error) console.log(error);
    var json=JSON.parse(html);

    var res=[];
    var all="";
    for(var i=0;i<json.data.children.length;i++){
      var displayName=json.data.children[i].data.display_name;
      all+=displayName+"+";
      displayName=displayName.charAt(0).toUpperCase()+displayName.slice(1);
      var subreddit={
        id:displayName,
        displayName:displayName
      };
      res.push(subreddit);
    }
    var subreddit={
      id:all,
      displayName:"All"
    };
    res.unshift(subreddit);
    callback(res,accessToken);
  });
}

function isFile(pathname){
  return pathname.split('/').pop().lastIndexOf(".")>-1;
}

function getImgurImages(url,callback){
  var content="";
  request(url,function(error,response,html){
    if(error) console.log(error);
    var $=cheerio.load(html);

    $(".post-image").find("img")
    .each(function(index,element){
      content+="<img src='https:"+$(element).attr("src")+"' width='250px'>";
    });
    callback(content);
  });
}

var getPosts=function(data,accessToken,callback){
  var url="https://oauth.reddit.com/r/"+data.subreddit+"/"+data.category;
  if(data.after) url+="?after="+data.after;
  var headers={
    "User-Agent":"Entertainment-Hub by dedeco99",
    "Authorization":"bearer "+accessToken
  };

  request({url:url,headers:headers},function(error,response,html){
    if(error) console.log(error);
    var json = JSON.parse(html);

    //console.log(json.data.children[0].data);

    var res = [];
    for(var i = 0; i < json.data.children.length; i++){
      var data = json.data.children[i].data;

      if(data.thumbnail=="self" || data.thumbnail=="default"){
        isText = true;
      }

      var redditVideo = null;
      if(data.media && data.media.reddit_video){
        redditVideo = data.media.reddit_video.fallback_url;
      }

      var videoHeight = null, videoPreview = null;
      if(data.media && data.media.oembed){
        videoHeight = data.media.oembed.height;
      }else if(data.preview && data.preview.images && data.preview.images[0].resolutions){
        var resolutions=data.preview.images[0].resolutions;
        videoPreview = resolutions[resolutions.length-1].url;
      }

      /*var content = null;
      var imgTypes=["jpg","jpeg","png","gif"];

      if(url.indexOf("reddit.com")!==-1){
        content=data.selftext;
      }else if(url.indexOf(".gifv")!==-1){
        var id='<video src="'+url.slice(0,-4)+'mp4" autoplay controls width="90%" height="90%"></video>';

        var resolutions=data.preview.images[0].resolutions;
        content="<div class='centercontainer'>"
          +"<img class='redditvideo' id='"+id+"' src='/assets/img/playButton.png' width='75px'>"
          +"<img src='"+resolutions[resolutions.length-1].url+"' width='90%'>";
      }else if(imgTypes.indexOf(url.substr(url.lastIndexOf(".")+1))!=-1){
        content="<img src='"+url+"' width='90%'>";
      }else if(url.indexOf("imgur.com")!==-1){
        if(isFile(url)){
          content="<img src='"+url+"' width='90%'>";
        }else{
          content="<img src='"+url+".png' width='90%'>";
        }
      }else if(url.indexOf("v.redd.it")!==-1 && data.media!=null){
        var id='<video src="'+data.media.reddit_video.fallback_url+'"  autoplay controls width="90%" height="90%"></video>';

        var resolutions=data.preview.images[0].resolutions;
        content="<div class='centercontainer'>"
          +"<img class='redditvideo' id='"+id+"' src='/assets/img/playButton.png' width='75px'>"
          +"<img src='"+resolutions[resolutions.length-1].url+"' width='90%'>";
      }else if(url.indexOf("gfycat.com")!==-1){
        var id='<video src="https://giant.gfycat.com/'+url.substr(url.lastIndexOf("/")+1)+'.mp4" autoplay controls width="90%" height="90%"></video>';

        var resolutions=data.preview.images[0].resolutions;
        content="<div class='centercontainer'>"
          +"<img class='redditvideo' id='"+id+"' src='/assets/img/playButton.png' width='75px'>"
          +"<img src='"+resolutions[resolutions.length-1].url+"' width='90%'>";
      }else if(url.indexOf("youtube.com")!==-1){
        content="<div class='centercontainer'>"
          +"<img class='youtubevideo' id='"+url.substr(url.lastIndexOf("v=")+2,11)+"' src='/assets/img/playButton.png' width='75px'>"
          +"<img src='https://i.ytimg.com/vi/"+url.substr(url.lastIndexOf("v=")+2,11)+"/hqdefault.jpg' width='90%'>";
        +"</div>";
      }else if(url.indexOf("youtu.be")!==-1){
        content="<div class='centercontainer'>"
          +"<img class='youtubevideo' id='"+url.substr(url.lastIndexOf("/")+1,11)+"' src='/assets/img/playButton.png' width='75px'>"
          +"<img src='https://i.ytimg.com/vi/"+url.substr(url.lastIndexOf("/")+1,11)+"/hqdefault.jpg' width='90%'>"
        +"</div>";
      }else if(url.indexOf("clips.twitch.tv")!==-1){
        url=url.replace("?","&");
        content="<iframe src='https://clips.twitch.tv/embed?clip="+url.substr(url.lastIndexOf("/")+1)+"&tt_content=embed&autoplay=false' frameborder='0' allowfullscreen='true' width='90%' height='90%'></iframe>";
      }*/
      res.push({
        title:data.title,
        permalink:"https://reddit.com/"+data.permalink,
        thumbnail:data.thumbnail,
        upvotes:data.ups,
        downvotes:data.downs,
        comments:data.num_comments,
        crossposts:data.num_crossposts,
        author:data.author,
        domain:data.domain,
        url:data.url,
        text:data.selftext_html,
        redditVideo:redditVideo,
        videoHeight:videoHeight,
        videoPreview:videoPreview,
        created:data.created,
        after:json.data.after
      });
    }
    callback(res);
  });
}

exports.getSubreddits=function(req, res){
  var data={username:req.cookies.username};
  getAccessToken(data,getSubreddits,function(response){
    res.json(response.sort(
      function(a,b){
        if(a.displayName!="All" && b.displayName!="All"){
          if(a.displayName<b.displayName) return -1;
          if(a.displayName>b.displayName) return 1;
          return 0;
        }
      }
    ));
  });
}

exports.getPosts=function(req, res){
  var data=req.params;
  req.params.username=req.cookies.username;

  getAccessToken(data,getPosts,function(response){
    res.json(response);
  });
}
