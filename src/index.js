import "./styles.css";
import data from "./chartData.js";
import barVertical from "./charts/barVertical.js";
import barHorizontal from "./charts/barHorizontal.js";
import pie from "./charts/pie.js";
import spider from "./charts/spider.js";

let type = "spider";

document.querySelector("#chart-types").addEventListener("click", (e) => {
  type = e.target.id;
  drawChart();
});

const setResponseFilter = ({ page, field }) => {
  field.filter = !field.filter;
  chart.update({ filter: field.filter, field });
};

const chart = document.querySelector(".d3-chart");

const drawChart = () => {
  switch (type) {
    case "bar-horizontal":
      return barHorizontal(chart, data, setResponseFilter);
    case "bar-vertical":
      return barVertical(chart, data, setResponseFilter);
    case "pie":
      return pie(chart, data, setResponseFilter);
    case "spider":
      return spider(chart, data, setResponseFilter);
    default:
      alert("No Chart Type " + type);
  }
};

drawChart();

window.addEventListener("resize", drawChart);
