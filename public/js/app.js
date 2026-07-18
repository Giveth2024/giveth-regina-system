import { navbar } from "../components/navbar.js";
import { footer } from "../components/footer.js";
import { renderStockTable } from "./OneTime/stockRender.js";
import { getStock } from "./OneTime/stockApi.js";

document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer();

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
        const search = document.getElementById('search').value;
        const min_quantity = document.getElementById('min_quantity').value;
        const max_quantity = document.getElementById('max_quantity').value;
        const min_selling_price = document.getElementById("min_selling_price").value;
        const max_selling_price = document.getElementById("max_selling_price").value;

        const inputFilters = {
            search : search,
            min_quantity : min_quantity,
            max_quantity : max_quantity,
            min_selling_price : min_selling_price,
            max_selling_price : max_selling_price
        }

        console.log(inputFilters);
        const stock = await getStock(inputFilters);
        if (!stock.success) return alert(stock.message);
        renderStockTable(stock);
    }, 1000); // wait one second before fetching

    // const category = document.getElementById('category').value;
    // console.log(category);
    // console.log(stock);
    // renderStockTable(stock);
}

const viewStockForm = document.getElementById("viewStockForm");
viewStockForm.addEventListener("input", getStockFilters);
// viewStockForm.addEventListener("change", getStockFilters);
