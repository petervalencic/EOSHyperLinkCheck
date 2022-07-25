const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');

const extractLinks = $ => [
    ...new Set(
        $('.article a')
        .map((_, a) => $(a).attr('href'))
        .toArray()
    ),
];

const verifyLinks = $ => {
    $.forEach(page => {
        axios
        .get(page)
        .then(response => {
          if (response.status != 200) {
            console.log('Hyperlink: ' + chalk.red(page) +' was not found');
          } else {
            console.log('Hyperlink: ' + chalk.green(page) +' was found');
          }
        });

    });
}

//request the page
axios.get('https://help.eossupport.io/en/articles/5697538-why-eos').then(({
    data
}) => {
    const $ = cheerio.load(data);
    const links = extractLinks($);
    verifyLinks(links);
});
