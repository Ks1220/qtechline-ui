import stockGroupMappings from "../utils/stockGroupMappings.json";

export function extractDocKey(stockNo: string): string {
  for (const { code } of stockGroupMappings) {
    const prefix = `${code}-`;

    if (stockNo.startsWith(prefix)) {
      return stockNo.slice(prefix.length);
    }
  }

  return stockNo;
}
