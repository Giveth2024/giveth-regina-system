// Apis will appear here 

export async function getStock(filters = {}) {
  try {
    const response = await fetch("/api/giveth/stock");
    const data = await response.json();
    if (!data.success) return alert(data.message);
    console.log(data.message);
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
