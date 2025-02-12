import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

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

const convertToCSV = (data) => {
  return data.map((row) => row.map((item) => `"${item}"`).join(",")).join("\n");
};

const saveToCSV = (filename, data) => {
  const csvData = convertToCSV(data);
  fs.writeFileSync(filename, csvData, "utf-8");
  console.log("CSV file saved!");
};

(async () => {
  try {
    const result = await getHotMovieInfo();

    const csvData = [["index", "title"]]; // 2 columns
    result.forEach((value, index) => csvData.push([index, value]));

    saveToCSV("top5_film_title.csv", csvData);
  } catch (error) {
    console.error("Error:", error);
  }
})();
