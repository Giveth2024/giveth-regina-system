const addStockForm = document.getElementById("addStockForm");

// Function to make the request
async function sendStockData(url, stockData) {
    try {
        const response = await fetch(url, {
            method : "POST",
            body : JSON.stringify(stockData),
            headers : {
                'Content-Type' : 'application/json'
            }
        });

        const data = await response.json();

        if (!data.success) return alert(data.message)
        
        alert(data.message);
        
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error
    }
}

function clearData() {
    document.getElementById("item_name").value = "";
    document.getElementById("item_type").value = "Direct Sale";
    document.getElementById("category").value = "Soft Drinks";
    document.getElementById("barcode").value = "";
    document.getElementById("unit_type").value = "Plastic";
    document.getElementById("full_quantity").value = "";
    document.getElementById("empty_quantity").value = "";
    document.getElementById("low_stock_alert_level").value = "";
    document.getElementById("cost_price").value = "";
    document.getElementById("selling_price").value = "";
}

addStockForm.addEventListener("reset", (event) => {
    event.preventDefault(); // Prevent the page from refreshing
    clearData();
});

addStockForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the page from refreshing

    const item_name = document.getElementById("item_name").value.trim();
    const item_type = document.getElementById("item_type").value.trim();
    const category = document.getElementById("category").value.trim();
    const barcode = document.getElementById("barcode").value.trim();
    const unit_type = document.getElementById("unit_type").value.trim();
    const full_quantity = parseFloat(document.getElementById("full_quantity").value.trim());
    const empty_quantity = parseFloat(document.getElementById("empty_quantity").value.trim());
    const low_stock_alert_level = parseFloat(document.getElementById("low_stock_alert_level").value.trim());
    const cost_price = parseFloat(document.getElementById("cost_price").value.trim());
    const selling_price = parseFloat(document.getElementById("selling_price").value.trim());

    // Verify if the input is what it is to avoid mistakes
    if (item_name === "" || item_type === "" || category === "" || barcode === "" || unit_type === "") return alert("Empty Fields are not allowed!!!");
    if (isNaN(full_quantity) || isNaN(empty_quantity) || isNaN(low_stock_alert_level) || isNaN(cost_price) || isNaN(selling_price)) return alert("Fields must be a number!!");

    const payload = {
        item_name : item_name,
        item_type : item_type,
        category : category,
        barcode : barcode,
        unit_type : unit_type,
        full_quantity : full_quantity,
        empty_quantity : empty_quantity,
        low_stock_alert_level : low_stock_alert_level,
        cost_price : cost_price,
        selling_price : selling_price
    }

    const ok = confirm(`Preview Data
    item_type : ${item_name},
    item_type : ${item_type},
    category : ${category},
    barcode : ${barcode},
    unit_type : ${unit_type},
    full_type : ${full_quantity},
    empty_quantity : ${empty_quantity}
    low_stock_alert_level : ${low_stock_alert_level},
    cost_price : ${cost_price},
    selling_price : ${selling_price}
        `);

    if (!ok) return console.log("User cancelled before submitting data");

    await sendStockData("/api/giveth/stock/add", payload);
});