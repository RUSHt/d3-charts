export default (d, r) => {
  var ao = -Math.PI / 2,
    aa = (d.startAngle + d.endAngle) / 2,
    tx = Math.cos(aa + ao),
    ty = Math.sin(aa + ao);
  return [(tx *= r), (ty *= r)];
};
