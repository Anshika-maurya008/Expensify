let balance = document.querySelectorAll(".balance-amt");
let balnDescription = document.querySelector(".description");

let spent = document.querySelectorAll(".spent");
let labelLeft = document.querySelector("#label-left");
let left = document.querySelector("#left");
let tranz = document.querySelector("#tranz");

let aDesc = document.querySelector("#desc");
let aAmt = document.querySelector("#amt");
let aCateg = document.querySelector("#type");
let aBtn = document.querySelector("#a-exp-btn");

let scaleBudget = document.querySelector("#scale-budget");
let bBudget = document.querySelector("#budget");
let sBud = document.querySelector("#set-btn");
let pSpent = document.querySelector("#p-spent");
let progressBar = document.querySelector("#progress-bar");
let bPercent = document.querySelector("#bud-percent");

let catBtns = document.querySelectorAll(".c-btns");
let clrAll = document.querySelector("#clr-all");

let cCards = document.querySelector(".c-cards");

//localStorage
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = parseFloat(localStorage.getItem("budget")) || 0;

let filter = "all";

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}
function saveBudget() {
    localStorage.setItem("budget", budget);
}
//updateStats
function updateStats() {
    let totalSpent = expenses.reduce((sum, exp) => sum + exp.amt, 0);
    let budgetLeft = budget - totalSpent;
    let countTranz = expenses.length;
    let spented = totalSpent.toLocaleString("en-IN");

    balance.forEach(b => b.textContent = spented);
    balnDescription.textContent = countTranz + " transactions recorded";
    spent.forEach(s => s.textContent = "₹" + spented);

    if (budgetLeft < 0) {
        labelLeft.textContent = "Budget Exceeded";
    } else {
        labelLeft.textContent = "Budget Left";
    }

    left.textContent = "₹" + Math.abs(budgetLeft).toLocaleString("en-IN");
    tranz.textContent = countTranz;
    pSpent.textContent = "₹" + spented + " spent";
    scaleBudget.textContent = "₹" + budget.toLocaleString("en-IN");

    updateProgressBar(totalSpent);
}
//progress bar
function updateProgressBar(totalSpent) {
    if (budget === 0) {
        progressBar.innerHTML = "";
        bPercent.textContent = "0%";
        return;
    }
    let percent = (totalSpent / budget) * 100;

    let color = "linear-gradient(to right, green 0%, yellow 90%)";
    if (percent > 100) {
        percent = 100;
        progressBar.innerHTML = `<div style="background:red; width:100%;"></div>`;
        bPercent.textContent = "100% +";
        color = "red";
        return;
    }
    else if (percent >= 90) {
        color = "linear-gradient(to right, green 0%, orange 75%, red 100%)";
    }
    else if (percent >= 75) {
        color = "linear-gradient(to right, green 0%, orange 75%)";
    }

    progressBar.innerHTML = `
        <div style="
            background:${color};
            width:${percent}%;
        "></div>
    `;

    bPercent.textContent = Math.round(percent) + "%";
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== Number(id));
    saveExpenses();
    renderCards();
    updateStats();
}

//cards
const categoryIcons = {
    food: "🍜",
    transport: "🚌",
    entertainment: "🎮",
    shopping: "🛍️",
    health: "💊",
    rent: "🏠",
    bills: "⚡",
    other: "📦"
};

function renderCards() {
    let filtered = expenses;
    if (filter !== "all") {
        filtered = expenses.filter(exp => exp.category === filter);
    }
    if (filtered.length === 0) {
        cCards.textContent = "No expenses yet. Add one above!";
        return;
    }
    let html = "";
    let filterExpenses = [...filtered].reverse();
    filterExpenses.forEach(exp => {
        html += `
            <div class="c-card" data-id="${exp.id}">
                <div class="c-icon">${categoryIcons[exp.category] || " 💸 "}</div>
                <div class="c-val">
                    <div class="c-desc">${exp.desc}</div>
                    <div class="c-category-date">${exp.category} | ${exp.date}</div>
                </div>
                <div class = "c-amt">
                    <div class="exp-amt">₹${exp.amt.toLocaleString("en-IN")}</div>
                    <div class="clr" data-id="${exp.id}">✕</div>
                </div>
            </div>
        `;
    });

    cCards.innerHTML = html;

    document.querySelectorAll(".clr").forEach(clrExp => {
        clrExp.addEventListener("click", function () {
            let del = parseInt(this.dataset.id);
            deleteExpense(del);
        });
    });
}
// add expenses
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
});
aBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (budget === 0 || budget === null || budget === undefined) {
        alert("Please set a budget first before adding expenses!");
        bBudget.focus();
        return;
    }

    let desc = aDesc.value.trim();
    let amt = parseFloat(aAmt.value);
    let category = aCateg.value;

    if (desc === "" || isNaN(amt) || amt <= 0) {
        alert("Please enter a valid Description & Amount !");
        return;
    }
    let newExpenses = {
        id: Date.now(),
        desc: desc,
        amt: amt,
        category: category,
        date: new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    };

    expenses.push(newExpenses);
    saveExpenses();

    aDesc.value = "";
    aAmt.value = "";

    renderCards();
    updateStats();
});

//set budget
sBud.addEventListener("click", function (e) {
    let val = parseFloat(bBudget.value);

    if (isNaN(val) || val <= 0) {
        alert("Please enter a valid Budget !");
        return;
    }
    budget = val;
    saveBudget();
    bBudget.value = "";
    updateStats();
});

// Map button text to category values
const filterMap = {
    "All": "all",
    "Food": "food",
    "Transport": "transport",
    "Entertainment": "entertainment",
    "Shopping": "shopping",
    "Health": "health",
    "Rent": "rent",
    "Bills": "bills",
    "Others": "other"
};

catBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        let clickedCategory = filterMap[this.textContent.trim()];

        if (filter === clickedCategory) {
            filter = "all";
            catBtns.forEach(b => b.classList.remove("active"));
            catBtns.forEach(b => {
                if (b.textContent.trim() === "All") b.classList.add("active");
            });
        } else {
            filter = clickedCategory;
            catBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
        }

        renderCards();
    });
});

// clear all expenses and reset budget

clrAll.addEventListener("click", function () {
    if (expenses.length === 0 && budget === 0) {
        alert("Nothing to clear!");
        return;
    }

    let confirmed = confirm("Are you sure you want to delete ALL expenses and reset budget?");
    if (!confirmed) return;

    expenses = [];
    budget = 0;
    saveExpenses();
    saveBudget();
    filter = "all";

    catBtns.forEach(b => b.classList.remove("active"));

    renderCards();
    updateStats();
});

renderCards();
updateStats();