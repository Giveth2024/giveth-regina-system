import { navbar } from "../components/navbar.js";
import { footer } from "../components/footer.js";
import { renderStockTable } from "./OneTime/stockRender.js";
import { getStock } from "./OneTime/stockApi.js";

document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer();

// pagination
let currentPage = 1;
const nextPageButton = document.getElementById('nextPage');
const previousPageButton = document.getElementById('previousPage');

nextPageButton.addEventListener("click", () => {
    currentPage += 1;
    document.getElementById('currentPage').innerHTML = currentPage;
    getStockFilters();
});

previousPageButton.addEventListener("click", () => {
    currentPage -= 1;
    if(currentPage < 1) return alert("Page connot be negative");
    document.getElementById('currentPage').innerHTML = currentPage;
    getStockFilters();
});

document.getElementById("addItem").addEventListener("click", () => {
    window.location.href = "/frontend/stock/add"
});

const stock = await getStock();
renderStockTable(stock);

let timer; // create a timer (Debouncing)

async function getStockFilters()
{
    clearTimeout(timer);
    timer = setTimeout(async () => {    
        // All inputs    
        const search = document.getElementById('search').value.trim();
        const min_quantity = document.getElementById('min_quantity').value.trim();
        const max_quantity = document.getElementById('max_quantity').value.trim();
        const min_selling_price = document.getElementById("min_selling_price").value.trim();
        const max_selling_price = document.getElementById("max_selling_price").value.trim();

        // change filters
        const category = document.getElementById('category').value;
        const item_type = document.getElementById('item_type').value;
        const sort_by = document.getElementById('sort_by').value;
        
        // Check boxed
        const low_stock = document.getElementById('low_stock').checked;
        const out_of_stock = document.getElementById('out_of_stock').checked;
        const no_empty_bottles = document.getElementById("no_empty_bottles").checked;
        const has_empty_bottles = document.getElementById("has_empty_bottles").checked;

        const inputFilters = {
            search : search,
            category:category,
            item_type : item_type,
            low_stock : low_stock,
            out_of_stock : out_of_stock,
            no_empty_bottles : no_empty_bottles,
            has_empty_bottles : has_empty_bottles,
            min_quantity : min_quantity,
            max_quantity : max_quantity,
            min_selling_price : min_selling_price,
            max_selling_price : max_selling_price,
            sort_by: sort_by,
            page : currentPage
        }

        const stockFilters ={}

        for(const [key, value] of Object.entries(inputFilters))
        {
            if (value === "" || value === false || value < 1) continue;
            stockFilters[key] = value
        }

        const stock = await getStock(stockFilters);
        if (!stock.success) return alert(stock.message);
        renderStockTable(stock);
    }, 1000); // wait one second before fetching
}

const viewStockForm = document.getElementById("viewStockForm");
viewStockForm.addEventListener("input", getStockFilters);
viewStockForm.addEventListener("change", getStockFilters);
