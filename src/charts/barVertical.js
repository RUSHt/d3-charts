import wrap from "./wrapText.js";
import * as d3 from "d3";
import colors from "./colors.js";

const barVertical = (chart, config, setResponseFilter) => {
  config.width = parseInt(getComputedStyle(chart).width);
  chart.innerHTML = "";

  chart.update = (update) => {
    if (!update) return barVertical(chart, config, setResponseFilter);
    // apply update;
    console.log("apply update", update);
  };

  var margin = config.margin,
    angle = config.angle,
    width = config.width - margin.left - margin.right - 5,
    height = config.height - margin.top - margin.bottom - 25;

  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  var svg = d3
    .select(chart)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  x.domain(
    config.fields.map((d) =>
      (d.value + "").replace("<br>", "").replace(/\&nbsp;/g, "")
    )
  );

  var yMax = parseInt(d3.max(config.fields, (d) => d.qty) * 1.05) || 100;

  y.domain([0, yMax]);

  svg
    .append("g")
    .attr("class", "x-line")
    .call(d3.axisLeft(y).ticks().tickSize(-width).tickFormat(""));

  var domainPath = chart.querySelector("path.domain");
  domainPath && domainPath.parentElement.removeChild(domainPath);

  svg
    .selectAll(".bar")
    .data(config.fields)
    .enter()

    .append("g")
    .attr("class", "g-bar")
    .append("rect")
    .attr("class", "bar")
    .attr("fill", (d, i) => config.barColor || d.barColor || colors[i]) //  //config.barColor
    .attr("x", (d) =>
      x((d.value + "").replace("<br>", "").replace(/\&nbsp;/g, ""))
    )
    .attr("id", (d) => "code-" + d.code)
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.qty))
    .attr("height", (d) => height - y(d.qty))
    .on("click", function (e, d) {
      setResponseFilter({ e, page: config, field: d });
    })
    .on("mouseover", function (e, d) {
      this.classList.add("over");
    })
    .on("mouseout", function (e, d) {
      this.classList.remove("over");
    });

  var total = config.fields.reduce((p, d) => (p += d.qty), 0);

  total > 0 &&
    svg
      .selectAll(".g-bar")
      .append("text")
      .attr("font-family", "sans-serif")
      .text((d) => ((d.qty / total) * 100).toFixed() + "%")
      .attr("y", (d) => y(d.qty) + 15)
      .attr(
        "x",
        (d) =>
          x((d.value + "").replace("<br>", "").replace(/&nbsp;/g, "")) +
          x.bandwidth() / 2
      )
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", 14)
      .on("click", function (e, d) {
        setResponseFilter({ e, page: config, field: d });
      });

  var cWidth = x.bandwidth();

  var textAnchor = angle === 0 ? "middle" : "middle";

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("class", "x-label")
    .attr("fill", "black")
    .attr("font-size", 14)
    .attr("text-anchor", textAnchor)
    .attr("transform-origin", "0% 0%")
    .attr(
      "transform",
      `translate(${config.xOffset},${config.yOffset}) rotate(${angle})`
    );

  config.wrapXlabels && svg.selectAll(".x-label").call(wrap, x.bandwidth());

  svg.append("g").call(d3.axisLeft(y));

  svg
    .selectAll(".g-bar")
    .append("text")
    .attr("font-family", "sans-serif")
    .text((d) => (d.qty > 0 ? d.qty : ""))
    .attr("y", (d) => y(d.qty) - 5)
    .attr(
      "x",
      (d) =>
        x((d.value + "").replace("<br>", "").replace(/&nbsp;/g, "")) +
        x.bandwidth() / 2
    )
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", 14);
};

export default barVertical;
