import { itemRow } from "../../components/salesItemsRow.js";

export function renderSalesTable(data) {
  const tbody = document.getElementById("salesTableBody");
  tbody.innerHTML = "";

  for(const dataItem of data)
  {
    tbody.innerHTML +=  itemRow(dataItem);
  }
}
