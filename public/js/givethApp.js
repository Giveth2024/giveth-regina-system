import { renderStockTable } from "./OneTime/stockRender.js";
import { getStock } from "./OneTime/stockApi.js";

const stock = await getStock();
renderStockTable(stock);