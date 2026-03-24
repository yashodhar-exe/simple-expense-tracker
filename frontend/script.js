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

  fetch("http://localhost:5000/add-expense", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      amount,
      type
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
  fetch("http://localhost:5000/expenses")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";

      let income = 0;
      let expense = 0;

      data.forEach(item => {
        const li = document.createElement("li");
        li.className = "flex justify-between bg-slate-700 p-3 rounded";

        li.innerHTML = `
          <span>${item.title}</span>
          <span class="${item.category === "income" ? "text-green-400" : "text-red-400"}">
            ${item.category === "income" ? "+" : "-"}₹${item.amount}
          </span>
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
}

loadExpenses();