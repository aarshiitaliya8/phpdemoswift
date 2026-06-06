<?php
$page_title = "Financial Dashboard";
include 'includes/header.php';
?>

<main class="container">
    <!-- Dashboard Header -->
    <section style="margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h1 style="font-size: 2.25rem; font-weight: 800; background: linear-gradient(135deg, var(--text-primary), var(--text-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.25rem;">
                Financial Dashboard
            </h1>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">
                Here's a premium overview of your dynamic income, expenses, and savings targets.
            </p>
        </div>
        <div>
            <a href="tracker.php" class="btn btn-primary" id="dashboardQuickAddBtn">
                <svg style="width: 20px; height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Manage Transactions
            </a>
        </div>
    </section>

    <!-- Metrics Summary Grid -->
    <section class="grid-cols-3" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));" aria-label="Financial Summary Metrics">
        <!-- Income Widget -->
        <div class="card" id="cardIncome">
            <div class="summary-widget">
                <div class="summary-icon income" aria-hidden="true">
                    💰
                </div>
                <div class="summary-data">
                    <span class="summary-label">Monthly Income</span>
                    <span class="summary-value" id="dashTotalIncome">$0.00</span>
                </div>
            </div>
        </div>

        <!-- Expense Widget -->
        <div class="card" id="cardExpense">
            <div class="summary-widget">
                <div class="summary-icon expense" aria-hidden="true">
                    💸
                </div>
                <div class="summary-data">
                    <span class="summary-label">Monthly Expenses</span>
                    <span class="summary-value" id="dashTotalExpense">$0.00</span>
                </div>
            </div>
        </div>

        <!-- Net Savings Widget -->
        <div class="card" id="cardSavings">
            <div class="summary-widget">
                <div class="summary-icon savings" aria-hidden="true">
                    🛡️
                </div>
                <div class="summary-data">
                    <span class="summary-label">Net Savings</span>
                    <span class="summary-value" id="dashNetSavings">$0.00</span>
                </div>
            </div>
        </div>

        <!-- Savings Rate Widget -->
        <div class="card" id="cardSavingsRate">
            <div class="summary-widget">
                <div class="summary-icon rate" aria-hidden="true">
                    📈
                </div>
                <div class="summary-data">
                    <span class="summary-label">Savings Rate</span>
                    <span class="summary-value" id="dashSavingsRate">0%</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Visual Charts Breakdown -->
    <section class="grid-cols-2" aria-label="Financial Visualizations">
        <!-- Expense Category Distribution -->
        <div class="card" id="cardExpenseChart">
            <h2 class="card-title">Expense Category Breakdown</h2>
            <div style="height: 280px; position: relative;">
                <canvas id="expenseBreakdownChart"></canvas>
            </div>
        </div>

        <!-- Comparison Bar Chart -->
        <div class="card" id="cardComparisonChart">
            <h2 class="card-title">Income vs Expenses</h2>
            <div style="height: 280px; position: relative;">
                <canvas id="incomeExpenseChart"></canvas>
            </div>
        </div>
    </section>

    <!-- Dynamic History & Tips -->
    <section class="grid-cols-2-1" aria-label="Recent Transactions and Insights">
        <!-- Recent List -->
        <div class="card" id="cardRecentTransactions">
            <h2 class="card-title">
                Recent Transactions
                <a href="tracker.php" style="font-size: 0.85rem; text-decoration: none; color: var(--color-primary); font-weight: 600;">View All</a>
            </h2>
            <ul id="dashRecentTransactions" class="transaction-list">
                <!-- Javascript will load this dynamically -->
            </ul>
        </div>

        <!-- System Tips and Advice -->
        <div class="card" id="cardFinancialInsights">
            <h2 class="card-title">Smart Recommendations</h2>
            <div id="dashTipsContent">
                <!-- Javascript will load feedback depending on savings rate -->
            </div>
            <div style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Quick Budgeting Rules:</h3>
                <p>The <strong>50/30/20 rule</strong> is a simple budgeting guideline: spend 50% on needs, 30% on wants, and save 20%. You can test how your income divides in our planner.</p>
                <a href="calculator.php" class="btn btn-secondary" style="margin-top: 1rem; width: auto; font-size: 0.85rem; padding: 0.5rem 1rem;">Go to 50/30/20 Planner</a>
            </div>
        </div>
    </section>
</main>

<?php include 'includes/footer.php'; ?>
