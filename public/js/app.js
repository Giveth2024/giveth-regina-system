import { navbar } from "../components/navbar.js";
import { footer } from "../components/footer.js";


document.getElementById("navbar").innerHTML = navbar();
document.getElementById("footer").innerHTML = footer();

document.getElementById("addItem").addEventListener("click", () => {
    window.location.href = "/frontend/stock/add"
});