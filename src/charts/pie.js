import * as d3 from "d3";
import colors from "./colors.js";
import placeLabel from "./placeLabel.js";
import getAlign from "./getAlign.js";

const Pie = (chart, config, setResponseFilter) => {
  config.width = parseInt(getComputedStyle(chart).width);
  chart.innerHTML = "";

  chart.update = (update) => {
    if (!update) return Pie(chart, config, setResponseFilter);
    // apply update;
    console.log("apply update", update);
  };

  var margin = config.margin,
    width = config.width - margin.left - margin.right,
    height = config.height - margin.bottom * 2,
    radius = Math.min(width, height) / 2 - 50;

  var total = config.fields.reduce((p, d) => (p += d.qty), 0);

  total > 0 &&
    config.fields.forEach(
      (field) => (field.percent = parseInt((field.qty / total) * 100))
    );

  var pieGenerator = d3
    .pie()
    .value((d) => d.percent)
    .sort(null);
  var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
  var outArc = d3
    .arc()
    .innerRadius(radius * 1.1)
    .outerRadius(radius * 1.1);
  var arcData = pieGenerator(
    config.fields.filter((score) => score.percent > 0)
  );

  chart.innerHTML = "";

  var svg = d3
    .select(chart)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", `border:2px solid white;margin:10px`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height + 20) / 2 + ")")
    .selectAll("path")
    .data(arcData)
    .enter()
    .append("path")
    .attr("class", "bar")
    .attr("fill", (d, i) => d.data.barColor || colors[i]) // barColor
    .attr("d", arcGenerator)
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .on("click", function (e, d) {
      setResponseFilter({ e, field: d.data, page: config });
    })
    .on("mouseover", function (e, d) {
      this.classList.add("over");
    })
    .on("mouseout", function (e, d) {
      this.classList.remove("over");
    });

  svg
    .select("g")
    .selectAll("text")
    .data(arcData)
    .enter()
    .append("text")
    .each(function (d) {
      var centroid = arcGenerator.centroid(d);
      d3.select(this)
        .attr("x", centroid[0] * 1.4)
        .attr("y", centroid[1] * 1.4)
        .attr("dy", "0.33em")
        .text(d.data.percent + "%")
        .attr("font-family", "sans-serif");
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .on("click", function (e, d) {
      setResponseFilter({ e, field: d.data, page: config });
    })
    .on("mouseover", function (e, d) {
      this.classList.add("over");
    })
    .on("mouseout", function (e, d) {
      this.classList.remove("over");
    });

  svg
    .select("g")
    .append("g")
    .selectAll("text")
    .data(arcData)
    .enter()
    .append("text")
    .each(function (d) {
      var centroid = arcGenerator.centroid(d);
      d3.select(this)
        .attr("x", centroid[0] * 1.8)
        .attr("y", centroid[1] * 1.8)
        .attr("dy", "0.33em")
        .attr("style", "font-size:12px")
        .text(d.data.qty);
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .on("click", function (e, d) {
      setResponseFilter({ e, field: d.data, page: config });
    })
    .on("mouseover", function (e, d) {
      this.classList.add("over");
    })
    .on("mouseout", function (e, d) {
      this.classList.remove("over");
    });

  svg
    .select("g")
    .append("g")
    .selectAll("text")
    .data(arcData)
    .enter()
    .append("text")
    .each(function (d) {
      d3.select(this).attr("text-anchor", getAlign(d, radius + 30));
    })
    .attr("class", "o-label")
    .each(function (d) {
      d3.select(this)
        .text((d.data.value + "").replace("<br>", "").replace(/&nbsp;/g, ""))
        .attr("transform", `translate(${placeLabel(d, radius + 30)})`)
        .attr("font-family", "sans-serif");
    })
    .attr("fill", "black");
};

export default Pie;
