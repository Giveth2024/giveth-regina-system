import { viewStockRow } from "../../components/viewStockRow.js";

export function renderStockTable(stockData) {

  // Set  Data for viewing in html
  // Set count for items
  document.getElementById("countItems").innerHTML = stockData.data.count

    const tbody = document.getElementById("tableBody");
    tbody.innerHTML = "";

  //   console.log(stockData);
  // get items in the array
  const stockItems = stockData.data.data;
  for (const stockItem of stockItems) {
    const rowItem = {
        id: stockItem.id,
        item_name : stockItem.item_name,
        barcode : stockItem.barcode,
        category : stockItem.category,
        full_quantity : parseFloat(stockItem.full_quantity),
        empty_quantity : parseFloat(stockItem.empty_quantity),
        cost_price : parseFloat(stockItem.cost_price),
        selling_price : parseFloat(stockItem.selling_price),
        expected_profit : parseFloat(stockItem.expected_profit),
        low_stock_alert_level : parseFloat(stockItem.low_stock_alert_level)
    }

    // console.log(parseFloat(stockItem.low_stock_alert_level));

    // in stock
    if (parseFloat(stockItem.full_quantity) > parseFloat(stockItem.low_stock_alert_level))
    {
        // console.log("In Stock");
        rowItem.status = "In Stock";
        rowItem.statusClass = "in";
    } else if(parseFloat(stockItem.full_quantity) < parseFloat(stockItem.low_stock_alert_level))
    {
        // console.log("Low Stock");
        rowItem.status = "Low Stock";
        rowItem.statusClass = "low";
    }else
    {
        console.log("Out of Stock");
        rowItem.status = "Out of Stock";
        rowItem.statusClass = "out";
    }

    // console.log(rowItem);
    tbody.innerHTML +=  viewStockRow(rowItem);
  }
}