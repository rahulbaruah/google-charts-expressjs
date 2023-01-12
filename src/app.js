const express = require("express");

const { renderHttp, render } = require("./index");

const app = express();
app.use(express.json());

app.get("/google-charts", renderHttp);
app.post("/google-charts", renderHttp);

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

async function getChartImage() {
  const image = await render(drawChartStr, {
    width: 400,
    height: 300,
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
    // executablePath: '/usr/bin/google-chrome-stable',
    // executablePath: "/usr/bin/chromium-browser",
  });
  //   var buffer64 = new Buffer.from(image, "base64").toString("base64");
  return new Buffer.from(image, "base64");
}

app.get("/image1", async (req, res, next) => {
  try {
    let img = await getChartImage();
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (err) {
    next(err);
  }
});

const port = process.env.PORT || 3500;
app.listen(port);
console.log(`Listening on port ${port}`);
