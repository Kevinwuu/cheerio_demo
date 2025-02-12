import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

const REQUEST_URL = "https://www.vscinemas.com.tw/vsweb/film/hot.aspx";

const getHotMovieInfo = async () => {
  try {
    const response = await fetch(REQUEST_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        Referer: "https://www.google.com/", // 偽造來源，避免被認為是爬蟲程式而阻擋
      },
    });
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
