const request=require("request");

const database=require("./database");

exports.getSeries=function(socket){
  socket.on("getImdbSeries",function(data){
    getSeries(data,function(res){
      socket.emit("getImdbSeries",res);
    });
  });
}

exports.getSeasons = (req, res) => {
  var data = {
    tvSeries: req.params.tvSeries,
    userId: req.query.userId
  };

  console.log(data);

  if(data.tvSeries == "all"){
    var dataf = {
      username:data.username,
      id:data.id,
      all:true
    };

    getAllSeries(dataf, (response) => {
      res.json(response.sort((a, b) => {
        return new Date(b.date) - new Date(a.date) || b.series - a.series || b.season - a.season || b.number - a.number;
      }));
    });
  }else{
    getSeasons(data, (response) => {
      res.json(response);
    });
  }
}

exports.getEpisodes=function(socket){
  socket.on("getImdbEpisodes",function(data){
    var dataf={
      all:false,
      id:data.id,
      series:data.series,
      season:data.season
    };
    getEpisodes(dataf,function(res){
      socket.emit("getImdbEpisodes",res);
    });
  });
}

exports.getSearch = (req, res) => {
  var data = {
    search: req.params.search,
    userId: req.query.userId
  };

  getSearch(data, (response) => {
    res.json(response);
  });
}

const getSeasons = (data, callback) => {
  var url = "https://api.themoviedb.org/3/tv/" + data.tvSeries + "?api_key=" + process.env.tmdbKey;

  request(url, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var res = [];
    for(var i = 0; i < json.seasons.length; i++){
      var season = {
        id: json.id,
        season: json.seasons[i].season_number
      };
      res.push(season);
    }
    callback(res);
  });
}

var getAllSeries=function(data,callback){
  database.UserImdbSeries.find({username:data.username}).sort("series").exec(function(err,docs){
    if(err) throw err;

    if(docs.length>0){
      var itemsProcessed=0;
      var episodes=[];

      docs.forEach(function(item,index){
        var dataSeasons={
          id:item.id
        };

        getSeasons(dataSeasons,function(res){
          var season=res[0].season;
          for(var i=0;i<res.length;i++){
            if(res[i].season>season) season=res[i].season;
          }

          var dataEpisodes={
            id:res[0].id,
            series:item.series,
            season:season,
            all:data.all
          };

          getAllEpisodes(dataEpisodes,function(res){
            itemsProcessed++;
            console.log(itemsProcessed+"/"+docs.length);
            episodes=episodes.concat(res);
            if(itemsProcessed===docs.length){
              callback(episodes);
            }
          });
        });
      });
    }
  });
}

var getAllEpisodes=function(data,callback){
  var items=0;
  var episodes=[];
  if(data.season==1){
    getEpisodes(data,function(res){
      items++;
      if(items==data.season){
        callback(res);
      }
    });
  }else{
    for(var i=data.season-1;i<=data.season;i++){
      var dataf={
        id:data.id,
        series:data.series,
        season:i,
        all:data.all
      }
      getEpisodes(dataf,function(res){
        items++;
        episodes=episodes.concat(res);
        if(items==2){
          callback(episodes);
        }
      });
    }
  }
}

var getEpisodes=function(data,callback){
  var url="https://api.themoviedb.org/3/tv/"+data.id+"/season/"+data.season+"?api_key="+process.env.tmdbKey;

  request(url,function(error,response,html){
    if(error) console.log(error);
    var json=JSON.parse(html);

    var res=[];
    for(var i=0;i<json.episodes.length;i++){
      var image="/assets/img/noimage.png";
      if(json.episodes[i].still_path){
        image="https://image.tmdb.org/t/p/w454_and_h254_bestv2"+json.episodes[i].still_path;
      }

      var episode={
        all:data.all,
        series:data.id,
        name:data.series,
        title:json.episodes[i].name,
        date:json.episodes[i].air_date,
        image:image,
        season:json.episodes[i].season_number,
        number:json.episodes[i].episode_number
      };
      res.push(episode);
    }
    callback(res);
  });
}

const getSearch = (data, callback) => {
  var url = "https://api.themoviedb.org/3/search/tv?query=" + data.search + "&api_key=" + process.env.tmdbKey;

  request(url, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var res = [];
    for(var i = 0; i < json.results.length; i++){
      var series = {
        id: json.results[i].id,
        displayName: json.results[i].name,
        image: "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + json.results[i].poster_path,
      };
      res.push(series);
    }
    callback(res);
  });
}
