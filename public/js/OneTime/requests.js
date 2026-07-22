export async function completeSaleRequest(url, payload) {
    try{
        console.log(payload);
        const response = await fetch(url, {
            method : "POST",
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify(payload)
        });
    
        const data = await response.json();
    
        return data;
    } catch (error)
    {
        console.error("Fetch Error:", error);
        return null;
    }
}