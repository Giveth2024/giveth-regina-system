export function viewStockRow(item) {
  return `
    <tr id="${item.id}">
      <td class="name">
        <strong>${item.item_name}</strong>
        <small>${item.barcode}</small>
      </td>

      <td>${item.category}</td>

      <td>${item.full_quantity}</td>

      <td>${item.empty_quantity ?? "—"}</td>

      <td>UGX ${item.cost_price.toLocaleString()}</td>

      <td>UGX ${item.selling_price.toLocaleString()}</td>

      <td>UGX ${item.expected_profit.toLocaleString()}</td>

      <td>${item.low_stock_alert_level}</td>

      <td>
        <span class="status ${item.statusClass}">
          ${item.status}
        </span>
      </td>
    </tr>
  `;
}