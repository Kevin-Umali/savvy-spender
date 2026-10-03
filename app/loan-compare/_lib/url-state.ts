import { createParser } from "nuqs/server";
import { scenarioSchema } from "./schema";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export const scenarioParser = createParser({
  parse: (raw) => {
    if (raw.length > 100000) return null;
    try {
      // Versioned compression keeps itemized multi-option quotes practical to share.
      if (raw.startsWith("v1:") && raw.length > 12000) return null;
      const json = raw.startsWith("v1:")
        ? decompressFromEncodedURIComponent(raw.slice(3))
        : raw;
      if (!json || json.length > 100000) return null;
      const result = scenarioSchema.safeParse(JSON.parse(json));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },
  serialize: (value) =>
    "v1:" + compressToEncodedURIComponent(JSON.stringify(value)),
  eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});
