const axios = require("axios");
const cheerio = require("cheerio");
const chalk = require("chalk");
const readXlsxFile = require("read-excel-file/node");

//.flex-auto .article
const extractLinks = ($) => [
  ...new Set(
    $(".flex-auto a")
      .map((_, a) => $(a).attr("href"))
      .toArray()
  ),
];

const verifyLinks = async (links, pageName) => {
  console.log("--------------------------------------------------");
  console.log(chalk.blueBright(pageName) + " will be checked");
  for (const link of links) {
    let response = await axios.get(link);
    if (response.status != 200) {
      console.log(
        "Hyperlink: " + chalk.red(link) + ", the remote web page was not found"
      );
    } else {
      console.log(
        "Hyperlink: " + chalk.green(link) + " the remote web page was found"
      );
    }
  }
};

const getData = async (URL) => {
  const res = await axios(URL);
  return await res.data;
};

const readInputData = async (fileName) => {
  const data = await readXlsxFile(fileName);
  return await data;
};

const verifyData = async (data) => {
  if (!data) {
    throw new Error("Empty array");
  }

  for (const row in data) {
    const pageName = data[row][0];
    const url = data[row][1];
    const document = await getData(url);
    const $ = await cheerio.load(document);
    const links = extractLinks($);
    await verifyLinks(links, pageName);
  }
};

//main
(async () => {
  console.log(chalk.yellow(`Start `));

  //read excel sheet
  const excelData = await readInputData(
    "C:/NodeProjects/peter/EOSHyperLinkCheck/data/test.xlsx"
  );
  //verify hyperlinks
  await verifyData(excelData);

  console.log(chalk.yellow(`End`));
})().catch((error) => {
  console.error(error);
});
