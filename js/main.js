// State & Storage Controller
const StorageKeys = {
    TRANSACTIONS: 'budget_tracker_transactions',
    INCOME_LIMIT: 'budget_planner_income',
    THEME: 'budget_tracker_theme'
};

// Initial mock data if empty (to give a wow factor right away)
const initialTransactions = [
    { id: '1', desc: 'Monthly Salary', amount: 5000, type: 'income', category: 'savings', date: '2026-06-01' },
    { id: '2', desc: 'Apartment Rent', amount: 1200, type: 'expense', category: 'housing', date: '2026-06-01' },
    { id: '3', desc: 'Grocery Shopping', amount: 350, type: 'expense', category: 'food', date: '2026-06-03' },
    { id: '4', desc: 'Gasoline refill', amount: 65, type: 'expense', category: 'transport', date: '2026-06-04' },
    { id: '5', desc: 'Electric Bill', amount: 120, type: 'expense', category: 'utilities', date: '2026-06-05' },
    { id: '6', desc: 'Movie night with friends', amount: 80, type: 'expense', category: 'entertainment', date: '2026-06-05' },
    { id: '7', desc: 'Freelance Design Gig', amount: 850, type: 'income', category: 'savings', date: '2026-06-06' }
];

// Helper Functions
function getTransactions() {
    const data = localStorage.getItem(StorageKeys.TRANSACTIONS);
    if (!data) {
        localStorage.setItem(StorageKeys.TRANSACTIONS, JSON.stringify(initialTransactions));
        return initialTransactions;
    }
    return JSON.parse(data);
}

function saveTransactions(transactions) {
    localStorage.setItem(StorageKeys.TRANSACTIONS, JSON.stringify(transactions));
}

function getBaseIncome() {
    const income = localStorage.getItem(StorageKeys.INCOME_LIMIT);
    return income ? parseFloat(income) : 5000;
}

function saveBaseIncome(income) {
    localStorage.setItem(StorageKeys.INCOME_LIMIT, income);
}

// Category Configuration
const CategoryConfig = {
    housing: { label: 'Housing', color: '#f97316', emoji: '🏠' },
    food: { label: 'Food', color: '#14b8a6', emoji: '🍔' },
    transport: { label: 'Transportation', color: '#3b82f6', emoji: '🚗' },
    entertainment: { label: 'Entertainment', color: '#d946ef', emoji: '🎬' },
    utilities: { label: 'Utilities', color: '#eab308', emoji: '⚡' },
    savings: { label: 'Savings & Debt', color: '#10b981', emoji: '📈' },
    other: { label: 'Other', color: '#64748b', emoji: '📦' }
};

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem(StorageKeys.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleButton(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(StorageKeys.THEME, newTheme);
    updateThemeToggleButton(newTheme);
    
    // Dispatch custom event so active charts can re-render/adjust text colors if necessary
    window.dispatchEvent(new Event('themeChanged'));
}

function updateThemeToggleButton(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    btn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    btn.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
}

// Currency Formatter
function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

// Global Chart References
let dashboardExpenseChart = null;
let dashboardComparisonChart = null;
let plannerChart = null;

// Dashboard Controller
function initDashboard() {
    const transactions = getTransactions();
    
    // Calcs
    let totalIncome = 0;
    let totalExpense = 0;
    const catSums = { housing: 0, food: 0, transport: 0, entertainment: 0, utilities: 0, savings: 0, other: 0 };
    
    transactions.forEach(t => {
        const amt = parseFloat(t.amount);
        if (t.type === 'income') {
            totalIncome += amt;
        } else {
            totalExpense += amt;
            const cat = t.category in catSums ? t.category : 'other';
            catSums[cat] += amt;
        }
    });
    
    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    
    // Update summary values in UI
    const incVal = document.getElementById('dashTotalIncome');
    const expVal = document.getElementById('dashTotalExpense');
    const savVal = document.getElementById('dashNetSavings');
    const rateVal = document.getElementById('dashSavingsRate');
    
    if (incVal) incVal.innerText = formatCurrency(totalIncome);
    if (expVal) expVal.innerText = formatCurrency(totalExpense);
    if (savVal) {
        savVal.innerText = formatCurrency(netSavings);
        if (netSavings < 0) {
            savVal.style.color = 'var(--color-danger)';
        } else {
            savVal.style.color = 'var(--text-primary)';
        }
    }
    if (rateVal) rateVal.innerText = savingsRate.toFixed(1) + '%';
    
    // Recommendation text logic
    const tipContainer = document.getElementById('dashTipsContent');
    if (tipContainer) {
        let tipHtml = '';
        if (totalIncome === 0) {
            tipHtml = `<div class="feedback-box info">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <div><strong>Welcome!</strong> Add some income and expense transactions in the <em>Tracker</em> page to visualize your financial dashboard.</div>
            </div>`;
        } else if (savingsRate < 0) {
            tipHtml = `<div class="feedback-box warning">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                <div><strong>Warning: Deficit Budgeting.</strong> You are spending more than you earn (Net: ${formatCurrency(netSavings)}). Look at cutting entertainment and other discretionary costs.</div>
            </div>`;
        } else if (savingsRate < 20) {
            tipHtml = `<div class="feedback-box warning">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                <div><strong>Room to Improve:</strong> Your savings rate is ${savingsRate.toFixed(1)}%. Financial experts recommend a target rate of at least <strong>20%</strong> for long-term health. Try using our 50/30/20 Planner page to reallocate.</div>
            </div>`;
        } else {
            tipHtml = `<div class="feedback-box success">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <div><strong>Excellent Job!</strong> Your savings rate of ${savingsRate.toFixed(1)}% is healthy! Keep investing the surplus in compound interest accounts.</div>
            </div>`;
        }
        tipContainer.innerHTML = tipHtml;
    }
    
    // Render Recent Transactions Table (max 5)
    renderDashboardTransactions(transactions);

    // Initialize Charts
    renderDashboardCharts(totalIncome, totalExpense, catSums);
}

function renderDashboardTransactions(transactions) {
    const listElement = document.getElementById('dashRecentTransactions');
    if (!listElement) return;

    // Sort transactions by date descending
    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    if (sorted.length === 0) {
        listElement.innerHTML = `
            <div class="empty-state">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3>No transactions found</h3>
                <p>Add your first transaction in the Tracker tab to see it here.</p>
            </div>
        `;
        return;
    }

    let html = '';
    sorted.forEach(t => {
        const amt = parseFloat(t.amount);
        const config = CategoryConfig[t.category] || CategoryConfig.other;
        const sign = t.type === 'income' ? '+' : '-';
        const typeClass = t.type === 'income' ? 'income' : 'expense';
        
        html += `
        <li class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-category-icon bg-cat-${t.category}">
                    ${config.emoji}
                </div>
                <div class="transaction-details">
                    <span class="transaction-desc">${escapeHtml(t.desc)}</span>
                    <span class="transaction-date">${t.date}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center;">
                <span class="transaction-amount ${typeClass}">${sign}${formatCurrency(amt)}</span>
            </div>
        </li>`;
    });
    listElement.innerHTML = html;
}

function getThemeFontColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? '#0f172a' : '#f8fafc';
}

function getThemeGridColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';
}

function renderDashboardCharts(income, expense, categoryData) {
    const expCtx = document.getElementById('expenseBreakdownChart');
    const compCtx = document.getElementById('incomeExpenseChart');

    if (!expCtx || !compCtx) return;

    // Colors & Labels
    const labels = Object.keys(categoryData).map(k => CategoryConfig[k].label);
    const dataVals = Object.keys(categoryData).map(k => categoryData[k]);
    const backgroundColors = Object.keys(categoryData).map(k => CategoryConfig[k].color);

    // Destroy existing charts to avoid overlay bugs
    if (dashboardExpenseChart) dashboardExpenseChart.destroy();
    if (dashboardComparisonChart) dashboardComparisonChart.destroy();

    const textPrimary = getThemeFontColor();
    const gridColor = getThemeGridColor();

    // Chart 1: Expense breakdown by category
    const hasExpense = dataVals.some(v => v > 0);
    
    if (hasExpense) {
        dashboardExpenseChart = new Chart(expCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataVals,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textPrimary,
                            font: { family: 'Inter', size: 11 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    } else {
        // Draw empty indicator placeholder
        const ctx = expCtx.getContext('2d');
        ctx.clearRect(0, 0, expCtx.width, expCtx.height);
        ctx.fillStyle = textPrimary;
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No expense data available', expCtx.width / 2, expCtx.height / 2);
    }

    // Chart 2: Income vs Expense vs Net Savings
    dashboardComparisonChart = new Chart(compCtx, {
        type: 'bar',
        data: {
            labels: ['Total Income', 'Total Expenses', 'Net Savings'],
            datasets: [{
                data: [income, expense, income - expense],
                backgroundColor: [
                    '#10b981', // green
                    '#ef4444', // red
                    income - expense >= 0 ? '#6366f1' : '#f59e0b' // primary or yellow warning
                ],
                borderRadius: 8,
                maxBarThickness: 45
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return ` ${context.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textPrimary, font: { family: 'Inter' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { 
                        color: textPrimary, 
                        font: { family: 'Inter' },
                        callback: function(val) { return formatCurrency(val); }
                    }
                }
            }
        }
    });
}

// 50/30/20 Calculator Controller
function initCalculator() {
    const incomeInput = document.getElementById('calcIncomeInput');
    if (!incomeInput) return;

    // Load initial budget income
    const savedIncome = getBaseIncome();
    incomeInput.value = savedIncome;

    // Setup input listener
    incomeInput.addEventListener('input', () => {
        calculateAndRenderRule();
    });

    calculateAndRenderRule();
}

function calculateAndRenderRule() {
    const incomeInput = document.getElementById('calcIncomeInput');
    const income = parseFloat(incomeInput.value) || 0;
    saveBaseIncome(income);

    const needsTarget = income * 0.50;
    const wantsTarget = income * 0.30;
    const savingsTarget = income * 0.20;

    // Update rule card amounts
    const valNeeds = document.getElementById('ruleValueNeeds');
    const valWants = document.getElementById('ruleValueWants');
    const valSavings = document.getElementById('ruleValueSavings');

    if (valNeeds) valNeeds.innerText = formatCurrency(needsTarget);
    if (valWants) valWants.innerText = formatCurrency(wantsTarget);
    if (valSavings) valSavings.innerText = formatCurrency(savingsTarget);

    // Dynamic advice/tips based on amounts
    const adviceContainer = document.getElementById('calcRuleTips');
    if (adviceContainer) {
        let text = '';
        if (income <= 0) {
            text = `<div class="feedback-box info">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                <div>Enter your monthly post-tax income above to generate your target allocations.</div>
            </div>`;
        } else {
            text = `<div class="feedback-box success">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <div>
                    <strong>Suggested Breakdown Strategy:</strong><br>
                    - Allocate <strong>${formatCurrency(needsTarget)}</strong> towards necessities like housing, healthcare, grocery shopping, and bills.<br>
                    - Allocate <strong>${formatCurrency(wantsTarget)}</strong> for dining out, movies, hobbies, and luxury purchases.<br>
                    - Direct <strong>${formatCurrency(savingsTarget)}</strong> to savings, investments, or paying down high-interest loans.
                </div>
            </div>`;
        }
        adviceContainer.innerHTML = text;
    }

    // Chart rendering
    const chartCtx = document.getElementById('plannerChart');
    if (chartCtx) {
        if (plannerChart) plannerChart.destroy();

        if (income > 0) {
            const textPrimary = getThemeFontColor();
            plannerChart = new Chart(chartCtx, {
                type: 'pie',
                data: {
                    labels: ['Needs (50%)', 'Wants (30%)', 'Savings & Debt (20%)'],
                    datasets: [{
                        data: [needsTarget, wantsTarget, savingsTarget],
                        backgroundColor: ['#6366f1', '#f59e0b', '#10b981'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: textPrimary,
                                font: { family: 'Inter' }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return ` ${context.label}: ${formatCurrency(context.raw)}`;
                                }
                            }
                        }
                    }
                }
            });
        } else {
            const ctx = chartCtx.getContext('2d');
            ctx.clearRect(0, 0, chartCtx.width, chartCtx.height);
        }
    }
}

// Transaction Tracker Controller
function initTracker() {
    const addForm = document.getElementById('addTransactionForm');
    if (!addForm) return;

    // Bind form submit
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const descInput = document.getElementById('txDescription');
        const amtInput = document.getElementById('txAmount');
        const typeSelect = document.getElementById('txType');
        const catSelect = document.getElementById('txCategory');
        const dateInput = document.getElementById('txDate');

        const desc = descInput.value.trim();
        const amt = parseFloat(amtInput.value);
        const type = typeSelect.value;
        const category = catSelect.value;
        const date = dateInput.value || new Date().toISOString().split('T')[0];

        if (!desc || isNaN(amt) || amt <= 0) {
            alert('Please provide a valid description and a positive transaction amount.');
            return;
        }

        // Add transaction
        const transactions = getTransactions();
        const newTx = {
            id: Date.now().toString(),
            desc,
            amount: amt,
            type,
            category: type === 'income' ? 'savings' : category, // Income defaulted to savings category
            date
        };

        transactions.push(newTx);
        saveTransactions(transactions);

        // Reset fields
        descInput.value = '';
        amtInput.value = '';
        
        // Refresh Table
        renderTrackerTable();
    });

    // Handle type select changes (only show categories for expense type)
    const typeSelect = document.getElementById('txType');
    const catGroup = document.getElementById('categoryFormGroup');
    if (typeSelect && catGroup) {
        typeSelect.addEventListener('change', () => {
            if (typeSelect.value === 'income') {
                catGroup.style.display = 'none';
            } else {
                catGroup.style.display = 'block';
            }
        });
    }

    // Load initial table list
    renderTrackerTable();
}

function renderTrackerTable() {
    const tbody = document.getElementById('trackerTableBody');
    if (!tbody) return;

    const transactions = getTransactions();
    
    // Sort transactions by date descending, then by id descending
    const sorted = [...transactions].sort((a, b) => {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;
        return parseInt(b.id) - parseInt(a.id);
    });

    if (sorted.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3>No transactions recorded</h3>
                    <p>Use the form on the left to add items.</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    sorted.forEach(t => {
        const amt = parseFloat(t.amount);
        const config = CategoryConfig[t.category] || CategoryConfig.other;
        const sign = t.type === 'income' ? '+' : '-';
        const typeClass = t.type === 'income' ? 'income' : 'expense';
        
        // Formulate transaction badge
        const badgeColorClass = t.type === 'income' ? 'bg-cat-savings' : `bg-cat-${t.category}`;
        const badgeLabel = t.type === 'income' ? 'Income' : config.label;

        html += `
        <tr>
            <td style="font-weight: 600;">${escapeHtml(t.desc)}</td>
            <td>${t.date}</td>
            <td>
                <span class="badge ${badgeColorClass}">
                    ${t.type === 'income' ? '💰' : config.emoji} ${badgeLabel}
                </span>
            </td>
            <td class="transaction-amount ${typeClass}" style="font-weight: 700;">
                ${sign}${formatCurrency(amt)}
            </td>
            <td>
                <button class="delete-btn" onclick="deleteTransactionItem('${t.id}')" title="Delete Transaction">
                    <svg style="width: 18px; height: 18px;" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// Global scope exposed function for deleting transactions
window.deleteTransactionItem = function(id) {
    let transactions = getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions(transactions);
    renderTrackerTable();
};

// HTML Escaper for Safety
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Global theme change event listener for active charts
window.addEventListener('themeChanged', () => {
    // Redraw whatever is active on the current page
    if (document.getElementById('expenseBreakdownChart')) {
        initDashboard();
    }
    if (document.getElementById('calcIncomeInput')) {
        calculateAndRenderRule();
    }
});

// App Router / Loader
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Theme
    initTheme();

    // 2. Bind global theme toggler
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // 3. Page router checks
    if (document.getElementById('dashRecentTransactions')) {
        initDashboard();
    }
    if (document.getElementById('calcIncomeInput')) {
        initCalculator();
    }
    if (document.getElementById('addTransactionForm')) {
        initTracker();
    }
});
