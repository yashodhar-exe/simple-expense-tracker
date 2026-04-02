let deviceId = localStorage.getItem("deviceId");
if (!deviceId) {
  deviceId = "dev_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  localStorage.setItem("deviceId", deviceId);
}

document
  .getElementById("transactionForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); 
    addExpense();
  });

function addExpense() {
  const text = document.getElementById("text").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;

  if (!text || !amount) {
    alert("Please fill all fields");
    return;
  }

  fetch("/add-expense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      amount,
      type,
      deviceId
    })
  })
    .then(res => res.json())
    .then(() => {
      clearFields();
      loadExpenses();
    })
    .catch(err => console.error("ADD ERROR:", err));
}

function loadExpenses() {
  fetch(`/expenses?deviceId=${deviceId}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      let income = 0;
      let expense = 0;

      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "flex justify-between border-b border-gray-200 py-4 items-center group cursor-pointer transition duration-300 hover:border-black";

        li.innerHTML = `
          <div class="flex-1">
            <span class="text-xl font-light text-gray-800 group-hover:text-black transition">${item.title}</span>
          </div>
          <div class="flex items-center space-x-6">
            <span class="text-xl font-medium ${item.category === "income" ? "text-black" : "text-red-600"}">
              ${item.category === "income" ? "+" : "-"}₹${item.amount}
            </span>
            <button onclick="deleteExpense('${item.id}')" class="text-gray-300 hover:text-red-600 transition duration-300 focus:outline-none opacity-0 group-hover:opacity-100">
              <svg class="w-5 h-5 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        `;

        list.appendChild(li);

        if (item.category === "income") {
          income += Number(item.amount);
        } else {
          expense += Number(item.amount);
        }
      });

      document.getElementById("income").innerText = `₹${income}`;
      document.getElementById("expense").innerText = `₹${expense}`;
      document.getElementById("balance").innerText = `₹${income - expense}`;
    })
    .catch(err => console.error("LOAD ERROR:", err));
}

function clearFields() {
  document.getElementById("text").value = "";
  document.getElementById("amount").value = "";
  // Reset our custom dropdown text as well if needed, but not strictly required
}

function deleteExpense(id) {
  fetch(`/expenses/${id}?deviceId=${deviceId}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(() => {
      loadExpenses();
    })
    .catch(err => console.error("DELETE ERROR:", err));
}

loadExpenses();