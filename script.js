let expenses = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentMonth, currentYear);

    document.getElementById('prev-month').addEventListener('click', () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else {
            currentMonth -= 1;
        }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('next-month').addEventListener('click', () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear += 1;
        } else {
            currentMonth += 1;
        }
        renderCalendar(currentMonth, currentYear);
    });
});

function addExpense() {
    const date = document.getElementById('expense-date').value;
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (date && name && amount) {
        const expense = { date, name, amount };
        expenses.push(expense);
        displayExpenses();
        calculateExpenditures();
        updateCalendar(date, amount);
    }
}

function displayExpenses() {
    const expenseItems = document.getElementById('expense-items');
    expenseItems.innerHTML = '';

    expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `${expense.date} - ${expense.name}: ₹${expense.amount.toFixed(2)}`;
        expenseItems.appendChild(li);
    });
}

function calculateExpenditures() {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let weeklyExpenditure = 0;
    let monthlyExpenditure = 0;

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);

        if (expenseDate >= startOfWeek) {
            weeklyExpenditure += expense.amount;
        }

        if (expenseDate >= startOfMonth) {
            monthlyExpenditure += expense.amount;
        }
    });

    document.getElementById('weekly-expenditure').textContent = weeklyExpenditure.toFixed(2);
    document.getElementById('monthly-expenditure').textContent = monthlyExpenditure.toFixed(2);
}

function renderCalendar(month, year) {
    const calendarTitle = document.getElementById('calendar-title');
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];

    calendarTitle.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day');
        calendar.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerHTML = `<span>${day}</span>`;
        
        expenses.forEach(expense => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getDate() === day && expenseDate.getMonth() === month && expenseDate.getFullYear() === year) {
                const amountP = document.createElement('p');
                amountP.textContent = `$${expense.amount.toFixed(2)}`;
                dayDiv.appendChild(amountP);
            }
        });

        calendar.appendChild(dayDiv);
    }
}

function updateCalendar(date, amount) {
    const [year, month, day] = date.split('-').map(Number);
    renderCalendar(month - 1, year);
}

function filterExpenses() {
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;
    const name = document.getElementById('filter-name').value.toLowerCase();

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const withinDateRange = (!startDate || expenseDate >= new Date(startDate)) &&
                                (!endDate || expenseDate <= new Date(endDate));
        const nameMatch = !name || expense.name.toLowerCase().includes(name);
        return withinDateRange && nameMatch;
    });

    displayFilteredExpenses(filteredExpenses);
}

function displayFilteredExpenses(filteredExpenses) {
    const expenseItems = document.getElementById('expense-items');
    expenseItems.innerHTML = '';

    filteredExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.date} - ${expense.name}: $${expense.amount.toFixed(2)}`;
        expenseItems.appendChild(li);
    });
}
