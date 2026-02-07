import type { StockLevel } from "./types";
import { extractDocKey } from "./utils";

const API_BASE = "https://api.qtechline.com";

const CF_ACCESS_CLIENT_ID = "b8e89d689814104c39a8f922e15b8dd1.access";
const CF_ACCESS_CLIENT_SECRET =
  "98bf0de4e78a0a08394ac1083197f2354f70c3f8a65df4f0d31759e4d2cbb580";

export async function fetchStockLevels(): Promise<StockLevel[]> {
  const res = await fetch(`${API_BASE}/assetStock`, {
    headers: {
      "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch stock levels: ${text}`);
  }

  return res.json();
}

// 1st Attempt to update: only update the sql side of things
// export async function updateStockItem(stockNo: string, payload: any) {
//   const res = await fetch(`https://api.sql.my/stockitem/${stockNo}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to update stock item");
//   }

//   return res.json();
// }

export async function saveStockItem(stockNo: string, payload: any) {
  const res = await fetch(`${API_BASE}/stockLevels/${stockNo}/adjust`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
    },

    body: JSON.stringify({ ...payload, stockNo }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function fetchSqlStockItem(stockNo: string) {
  const docKey = extractDocKey(stockNo);

  const res = await fetch(`${API_BASE}/stockitem/${docKey}`, {
    headers: {
      "CF-Access-Client-Id": CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": CF_ACCESS_CLIENT_SECRET,
    },
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
  return (await res.json()).balsqty;
}
