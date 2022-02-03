export default (d, r) => {
  var ao = -Math.PI / 2,
    aa = (d.startAngle + d.endAngle) / 2,
    tx = Math.cos(aa + ao),
    ty = Math.sin(aa + ao),
    x = tx * r,
    y = ty * r;
  if (x > r * 0.7) return "start";
  if (x < -r * 0.7) return "end";
  return "middle";
};
