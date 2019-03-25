const request = require("request");

const database = require("./database");

exports.getSeasons = (req, res) => {
  var data = {
    tvSeries: req.params.tvSeries,
    userId: req.query.userId
  };

  //getAllSeries(null, null);
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

exports.getEpisodes = (req, res) => {
  var data = {
    tvSeries:req.params.tvSeries,
    season:req.params.season
  };

  console.log(data);

  getEpisodes(data, (response) => {
    res.json(response);
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

var getAllSeries = (data, callback) => {
  database.firestore.collection("tvSeries")
  .get().then((snapshot) => {
    if(snapshot.size > 0) {
      var itemsProcessed = 0;
      var episodes = [];

      snapshot.docs.forEach((item,index) => {
        item = item.data();
        var dataSeasons = { tvSeries: item.seriesId };

        getSeasons(dataSeasons, (res) => {

          var season = res[0].season;
          for(var i = 0; i < res.length; i++) {
            if(res[i].season > season) season = res[i].season;
          }

          var dataEpisodes = {
            seriesName: item.displayName,
            tvSeries: item.seriesId,
            season: season,
          };

          getAllEpisodes(dataEpisodes, (res) => {
            itemsProcessed++;
            episodes = episodes.concat(res);
            if(itemsProcessed === snapshot.docs.length){
              console.log("Finish");
              //callback(episodes);
            }
          });
        });
      });
    }
  });
}

var getAllEpisodes = (data, callback) => {
  if(data.season > 1) {
    for(var i = data.season-1; i <= data.season; i++) {

      var items = 0;
      var episodes = [];

      var dataf = {
        seriesName: data.seriesName,
        tvSeries: data.tvSeries,
        season: i,
      }

      getEpisodes(dataf, (res) => {
        items++;
        episodes = episodes.concat(res);
        if(items == data.season || items == 2) {
          callback(episodes);
        }
      });
    }
  } else {
    getEpisodes(data, (res) => {
      callback(episodes);
    });
  }
}

var getEpisodes = (data, callback) => {
  var url = "https://api.themoviedb.org/3/tv/" + data.tvSeries + "/season/" + data.season + "?api_key=" + process.env.tmdbKey;

  request(url, (error, response, html) => {
    if(error) console.log(error);
    var json = JSON.parse(html);

    var res = [];
    for(var i = 0; i < json.episodes.length; i++){
      var image = "/assets/img/noimage.png";
      if(json.episodes[i].still_path){
        image = "https://image.tmdb.org/t/p/w454_and_h254_bestv2" + json.episodes[i].still_path;
      }

      var episode = {
        seriesId: data.tvSeries,
        seriesName: data.seriesName,
        title: json.episodes[i].name,
        date: json.episodes[i].air_date,
        image: image,
        season: json.episodes[i].season_number,
        number: json.episodes[i].episode_number
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
