document.addEventListener("DOMContentLoaded", () => {
  const balance = document.getElementById("balance");
  const moneyPlus = document.getElementById("money-plus");
  const moneyMinus = document.getElementById("money-minus");
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  function addTransaction(e) {
    e.preventDefault();
    const transactionText = text.value.trim();
    const transactionAmount = amount.value.trim();

    if (!transactionText || !transactionAmount) {
      alert("Please enter text and amount");
      return;
    }

    const transaction = {
      id: Date.now(),
      text: transactionText,
      amount: +transactionAmount,
    };

    transactions.push(transaction);
    updateUI();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
  }

  function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateUI();
    updateLocalStorage();
  }

  function updateUI() {
    list.innerHTML = "";
    const fragment = document.createDocumentFragment();
    
    transactions.forEach(({ id, text, amount }) => {
      const li = document.createElement("li");
      li.classList.add(amount < 0 ? "minus" : "plus");
      li.innerHTML = `${text} <span>&#8377;${Math.abs(amount)}</span>`;
      
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "x";
      deleteBtn.addEventListener("click", () => removeTransaction(id));
      
      li.appendChild(deleteBtn);
      fragment.appendChild(li);
    });
    
    list.appendChild(fragment);
    updateValues();
  }

  function updateValues() {
    const amounts = transactions.map(({ amount }) => amount);
    const total = amounts.reduce((acc, num) => acc + num, 0).toFixed(2);
    const income = amounts.filter(num => num > 0).reduce((acc, num) => acc + num, 0).toFixed(2);
    const expense = amounts.filter(num => num < 0).reduce((acc, num) => acc + num, 0).toFixed(2);
    
    balance.innerHTML = `&#8377;${total}`;
    moneyPlus.innerHTML = `+&#8377;${income}`;
    moneyMinus.innerHTML = `-&#8377;${Math.abs(expense)}`;
  }

  function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  form.addEventListener("submit", addTransaction);
  updateUI();
});
