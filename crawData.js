import fetch from "node-fetch";
import * as cheerio from "cheerio";

const REQUEST_URL = "https://www.vscinemas.com.tw/vsweb/film/hot.aspx";

const getHotMovieInfo = async () => {
  try {
    const response = await fetch(REQUEST_URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const body = await response.text();
    const $ = cheerio.load(body);

    let hottestFilmTitle = $(".info > h1 > a").text();
    let hotList = $(".infoArea > h2 > a");

    const resultJson = hotList.map((i, elem) => elem.children[0].data).get();

    let top5FilmTitleList = [hottestFilmTitle, ...resultJson];

    top5FilmTitleList.forEach((title, index) =>
      console.log(`${index + 1}: ${title}`)
    );

    return top5FilmTitleList;
  } catch (error) {
    console.error("Fetch error", error);
  }
};

(async () => {
  try {
    const result = await getHotMovieInfo();
    console.log("result", result);
  } catch (error) {
    console.error("Error:", error);
  }
})();
