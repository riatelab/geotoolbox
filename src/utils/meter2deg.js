export function meter2deg(distance) {
  const earthRadius = 6371008.8;
  const radians = distance / earthRadius;
  const degrees = radians % (2 * Math.PI);
  return (degrees * 180) / Math.PI;
}
