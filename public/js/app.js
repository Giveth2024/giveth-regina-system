import { navbar } from "../components/navbar.js";
import { footer } from "../components/footer.js";
import { glassSales } from "../components/glassSales.js";
import { renderSalesTable } from "./OneTime/renderSalesTable.js";
import { renderStockTable } from "./OneTime/stockRender.js";
import { getStock } from "./OneTime/stockApi.js";

document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer();

// pagination
let currentPage = 1;
const nextPageButton = document.getElementById("nextPage");
const previousPageButton = document.getElementById("previousPage");

if (nextPageButton) {
  nextPageButton.addEventListener("click", () => {
    currentPage += 1;
    document.getElementById("currentPage").innerHTML = currentPage;
    getStockFilters();
  });
}

if (previousPageButton) {
  previousPageButton.addEventListener("click", () => {
    currentPage -= 1;
    if (currentPage < 1) return alert("Page connot be negative");
    document.getElementById("currentPage").innerHTML = currentPage;
    getStockFilters();
  });
}

if (document.getElementById("addItem")) {
  document.getElementById("addItem").addEventListener("click", () => {
    window.location.href = "/frontend/stock/add";
  });
}

const stock = await getStock();
renderStockTable(stock);

let timer; // create a timer (Debouncing)
async function getStockFilters() {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    // All inputs
    const search = document.getElementById("search").value.trim();
    const min_quantity = document.getElementById("min_quantity").value.trim();
    const max_quantity = document.getElementById("max_quantity").value.trim();
    const min_selling_price = document
      .getElementById("min_selling_price")
      .value.trim();
    const max_selling_price = document
      .getElementById("max_selling_price")
      .value.trim();

    // change filters
    const category = document.getElementById("category").value;
    const item_type = document.getElementById("item_type").value;
    const sort_by = document.getElementById("sort_by").value;

    // Check boxed
    const low_stock = document.getElementById("low_stock").checked;
    const out_of_stock = document.getElementById("out_of_stock").checked;
    const no_empty_bottles =
      document.getElementById("no_empty_bottles").checked;
    const has_empty_bottles =
      document.getElementById("has_empty_bottles").checked;

    const inputFilters = {
      search: search,
      category: category,
      item_type: item_type,
      low_stock: low_stock,
      out_of_stock: out_of_stock,
      no_empty_bottles: no_empty_bottles,
      has_empty_bottles: has_empty_bottles,
      min_quantity: min_quantity,
      max_quantity: max_quantity,
      min_selling_price: min_selling_price,
      max_selling_price: max_selling_price,
      sort_by: sort_by,
      page: currentPage,
    };

    const stockFilters = {};

    for (const [key, value] of Object.entries(inputFilters)) {
      if (value === "" || value === false || value < 1) continue;
      stockFilters[key] = value;
    }

    const stock = await getStock(stockFilters);
    if (!stock.success) return alert(stock.message);
    renderStockTable(stock);
  }, 1000); // wait one second before fetching
}

const viewStockForm = document.getElementById("viewStockForm");
if (viewStockForm) {
  viewStockForm.addEventListener("input", getStockFilters);
  viewStockForm.addEventListener("change", getStockFilters);
}

function clearElementValues() {
  // clear all
  document.getElementById("item_id").innerHTML = "";
  document.getElementById("item_name").value = "";
  document.getElementById("barcode").value = "";
  document.getElementById("category").value = "";
  document.getElementById("unit_type").value = "";
  document.getElementById("full_quantity").value = "";
  document.getElementById("selling_price").value = "";
  console.log("Elements were cleared!!");
}

clearElementValues();

async function getSalesStock() {
  const searchValue = document.getElementById("search");

  console.log(searchValue.value);
  const stock = await getStock({ search: searchValue.value });

  if (!stock.success) {
    return alert(stock.message);
  }
  const stockItem = stock.data.data[0];

  // set value as is in the entry part
  document.getElementById("item_id").innerHTML = stockItem.id;
  document.getElementById("item_name").value = stockItem.item_name;
  document.getElementById("barcode").value = stockItem.barcode;
  document.getElementById("category").value = stockItem.category;
  document.getElementById("unit_type").value = stockItem.unit_type;
  document.getElementById("full_quantity").value = 0;
  document.getElementById("selling_price").value = stockItem.selling_price;

  if (stockItem.unit_type === "Glass") {
    console.log(stockItem.unit_type);
    document.getElementById("glassOptions").innerHTML = glassSales();
    return;
  }
  document.getElementById("glassOptions").innerHTML = "";
}

if (document.getElementById("salesSearchButton")) {
  document
    .getElementById("salesSearchButton")
    .addEventListener("click", getSalesStock);
}

if (document.getElementById("search")) {
  document.getElementById("search").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      getSalesStock();
    }
  });
}

function getSalesValues() {
  const item_id = document.getElementById("item_id").textContent;
  const item_name = document.getElementById("item_name").value;
  const barcode = document.getElementById("barcode").value;
  const category = document.getElementById("category").value;
  const unit_type = document.getElementById("unit_type").value;
  const full_quantity = parseFloat(
    document.getElementById("full_quantity").value,
  );
  const selling_price = parseFloat(
    document.getElementById("selling_price").value,
  );

  // Validate data
  if (item_name === "" || item_name === null || item_name === undefined)
    return alert(`Item name is Invalid`);
  if (item_id === "" || item_id === null || item_id === undefined)
    return alert(`Item id is Invalid`);
  if (barcode === "" || barcode === null || barcode === undefined)
    return alert(`Barcode is Invalid`);
  if (category === "" || category === null || category === undefined)
    return alert(`Category is Invalid`);
  if (unit_type === "" || unit_type === null || unit_type === undefined)
    return alert(`Unit Type is Invalid`);
  if (
    full_quantity === "" ||
    full_quantity === null ||
    full_quantity === undefined ||
    parseFloat(full_quantity) === 0
  )
    return alert(`Quantity is Invalid`);
  if (
    selling_price === "" ||
    selling_price === null ||
    selling_price === undefined
  )
    return alert(`Selling Price is Invalid`);

  if (unit_type === "Glass") {
    const glass_status = document.querySelector(
      'input[name="glass_status"]:checked',
    ).value;
    const glass_fine_per_unit = parseFloat(
      document.getElementById("glass_fine_per_unit").value,
    );

    if (glass_status === "Take Away") {
      alert("Charge a fine");
      return {
        id: item_id,
        item_name: item_name,
        barcode: barcode,
        category: category,
        glass_status: glass_status,
        glass_fine_per_unit: glass_fine_per_unit,
        unit_type: unit_type,
        full_quantity: full_quantity,
        selling_price: selling_price,
        subtotal: full_quantity * selling_price
      };
    }

    return {
      id: item_id,
      item_name: item_name,
      barcode: barcode,
      category: category,
      glass_status: glass_status,
      unit_type: unit_type,
      full_quantity: full_quantity,
      selling_price: selling_price,
      subtotal: full_quantity * selling_price
    };
  }

  return {
    id: item_id,
    item_name: item_name,
    barcode: barcode,
    category: category,
    unit_type: unit_type,
    full_quantity: full_quantity,
    selling_price: selling_price,
    subtotal: full_quantity * selling_price
  };
}

// Array to hold sales items
const sale_items = [];

// Get all the subtotals
function getTotalAmount(items)
{
  let total = 0;
  let units = 0

  for (const item of items)
    {
    console.log(items);
    total += item.subtotal;
    units += item.full_quantity;
    if (item.unit_type === "Glass" && item.glass_status === "Take Away")
    {
      total += item.glass_fine_per_unit;
    }

  }
  return {
    totalAmount: total,
    totalUnits : units
  };
}

document.getElementById("addSalesItem").addEventListener("click", () => {
  if (!getSalesValues()) return; 
  sale_items.push(getSalesValues());
  document.getElementById("items_count").innerHTML = `${sale_items.length} Items`;

  // Render it into the sales item table
  document.getElementById("totalSalesAmount").innerHTML = getTotalAmount(sale_items).totalAmount;
  document.getElementById("cartTotal").innerHTML = `Cart Total (${getTotalAmount(sale_items).totalUnits} units across ${sale_items.length} items)`
  renderSalesTable(sale_items);
});

const tbody = document.getElementById("salesTableBody");

tbody.addEventListener("click", (event) => {

    const button = event.target.closest(".deleteRowButton");

    if (!button) return;

    const index = sale_items.findIndex(
        item => item.id === button.id
    );

    if (index === -1) return;

    sale_items.splice(index, 1);

    // update the item count and other stuff here
    document.getElementById("items_count").innerHTML = `${sale_items.length} Items`;
    document.getElementById("totalSalesAmount").innerHTML = getTotalAmount(sale_items).totalAmount;
    document.getElementById("cartTotal").innerHTML = `Cart Total (${getTotalAmount(sale_items).totalUnits} units across ${sale_items.length} items)`;
    renderSalesTable(sale_items);    

});

document.getElementById("clearAllSales").addEventListener("click", () => {
  sale_items.splice(0, sale_items.length);
      document.getElementById("items_count").innerHTML = `${sale_items.length} Items`;
    document.getElementById("totalSalesAmount").innerHTML = getTotalAmount(sale_items).totalAmount;
    document.getElementById("cartTotal").innerHTML = `Cart Total (${getTotalAmount(sale_items).totalUnits} units across ${sale_items.length} items)`;
    renderSalesTable(sale_items);   
});
