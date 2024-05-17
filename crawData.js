const request = require("request");
const cheerio = require("cheerio");

const url = "https://www.vscinemas.com.tw/vsweb/film/hot.aspx";

const getHotMovieInfo = function () {
  request(
    {
      url,
      method: "GET",
    },
    function (error, response, body) {
      if (error || !body) {
        return;
      }
      const $ = cheerio.load(body);
      let hottest = $(".info > h1 > a").text();
      let hotList = $(".infoArea > h2 > a");
      console.log("1:", hottest);

      hotList.each((i, elem) => {
        console.log(i + 2 + ":", elem.children[0].data);
      });
    }
  );
};

getHotMovieInfo();
