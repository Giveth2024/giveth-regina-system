const loginForm = document.getElementById("loginForm");

async function sendData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const jsonData = await response.json();

    if (!jsonData.success) alert (jsonData.message);

    alert(`Welcome back ${jsonData.data.full_name}`);
    console.log(jsonData.message);


  } catch (error) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the page from refreshing

  const identifier = document.getElementById("identifier").value;
  const password = document.getElementById("password").value;

  const payload = {
    identifier: identifier,
    password: password,
  };

  await sendData("/api/giveth/auth/login", payload);
});
