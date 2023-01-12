'use strict';

const express = require('express');
const app = express();
const GoogleChartsNode = require('./index');
const puppeteer = require('puppeteer');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//process.argv is an array containing the command line arguments. The first element will be 'node', the second element will be the name of the JavaScript file. The next elements will be any additional command line arguments.
// var args = process.argv.slice(2);

// Define your chart drawing function
/* function drawChart() {
    const data = google.visualization.arrayToDataTable([
        ['City', '2010 Population'],
        ['New York City, NY', 8175000],
        ['Los Angeles, CA', 3792000],
        ['Chicago, IL', 2695000],
        ['Houston, TX', 2099000],
        ['Philadelphia, PA', 1526000],
    ]);

    const options = {
        title: 'Population of Largest U.S. Cities',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Total Population',
            minValue: 0,
        },
        vAxis: {
            title: 'City',
        },
    };

    const chart = new google.visualization.BarChart(container);
    chart.draw(data, options);
} */

const myArg = 12345;
const myOtherArg = [5, 10, 15, 20];
const drawChartStr = `
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', ${myArg}],
    ['Onions', ${myOtherArg[0]}],
    ['Olives', ${myOtherArg[1]}],
    ['Zucchini', ${myOtherArg[2]}],
    ['Pepperoni', ${myOtherArg[3]}],
  ]);
  // Set chart options
  var options = { title: 'How Much Pizza I Ate Last Night' };
  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
`;

// Render the chart to image
/* (async () => {
  const image = await GoogleChartsNode.render(drawChart, {
    width: 400,
    height: 300,
  });
  var buffer64 = new Buffer.from(image, "base64").toString("base64");
  console.log(buffer64);
  //   return image;
})(); */

async function getChartImage() {
    const image = await GoogleChartsNode.render(drawChartStr, {
        width: 400,
        height: 300,
        // headless: true,
        args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
        executablePath: '/usr/bin/google-chrome-stable',
    });
    //   var buffer64 = new Buffer.from(image, "base64").toString("base64");
    return new Buffer.from(image, 'base64');
}

app.get('/', (req, res) => {
    res.send('Hello World from Docker');
});

app.get('/image1', async (req, res, next) => {
    try {
        let img = await getChartImage();
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length,
        });
        res.end(img);
    } catch (err) {
        next(err);
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});

const screenshot = async (url) => {
    console.log('Opening the browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox'],
        executablePath: '/usr/bin/google-chrome-stable',
    });
    const page = await browser.newPage();

    console.log(`Go to ${url}`);
    await page.goto(url);

    console.log('Taking a screenshot...');
    await page.screenshot({
        path: './screenshot.png',
        fullPage: true,
    });

    console.log('Closing the browser...');
    await page.close();
    await browser.close();
    console.log('Job done!');
    return 'Screenshot Successful';
};

app.get('/screenshot', async (req, res) => {
    const URL = 'https://www.google.com';
    const msg = await screenshot(URL);
    return res.send(msg);
});
