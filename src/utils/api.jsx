const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzxcQ3x6REyLMeids_Lh7t0shVUdbSHRizgdzW4rC_C-xM7j7FGy_t0VDEjSex9YdfJwg/exec";

// 1. GET: Fetch all historical transactions from Google Sheets
export async function fetchHistoricalOrders() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch historical orders:", error);
    return [];
  }
}

// 2. POST: Submit a live order from the PWA to Google Sheets
export async function submitLiveOrder(orderPayload) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // Avoids CORS browser pre-flight blocks
      body: JSON.stringify(orderPayload),
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to submit order:", error);
  }
}