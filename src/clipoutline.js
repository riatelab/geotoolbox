import { clipbyrect } from "./clipbyrect.js";
import { togeojson } from "./togeojson.js";
export async function clipoutline(data, { delta = 0.00001 }) {
  let geojson = togeojson(data);
  const features = await Promise.all(
    geojson.features.map((d) =>
      clipbyrect(d, {
        bbox: [90 - delta, 180 - delta, -90 + delta, -180 + delta],
      })
    )
  );
  return togeojson(features);
}
