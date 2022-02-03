import * as d3 from "d3";

export default (text, width) => {
  text.each(function (words) {
    if (typeof words !== "string") return;
    words = words.split(" ").reverse();
    var text = d3.select(this),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");

    //Words = words.map(w => w);
    //width = (typeof width === "function") ? width.call(this) : width;

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        if (line.length > 0) {
          tspan.text(line.join(" "));
          line = [word];
        }

        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
    /*
      var getBox = text.node().getBBox()
      width = getBox.width;
      height = getBox.height;
      */
  });
};
