<?php
$page_title = "Transaction Tracker";
include 'includes/header.php';
?>

<main class="container">
    <!-- Tracker Header -->
    <section style="margin-bottom: 2.5rem;">
        <h1 style="font-size: 2.25rem; font-weight: 800; background: linear-gradient(135deg, var(--text-primary), var(--text-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.25rem;">
            Transaction Ledger
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Record your daily incomes and expenses below. Your data is stored locally in your browser cache.
        </p>
    </section>

    <!-- Content Split Layout -->
    <section class="grid-cols-1-2" aria-label="Transaction Operations">
        <!-- Add Transaction Form Card -->
        <div class="card" id="cardAddTransaction">
            <h2 class="card-title">Add Transaction</h2>
            
            <form id="addTransactionForm">
                <!-- Description -->
                <div class="form-group">
                    <label for="txDescription" class="form-label">Description</label>
                    <input type="text" id="txDescription" class="form-control" placeholder="e.g. Weekly Groceries" required maxlength="50">
                </div>

                <!-- Row 1: Amount & Type -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="txAmount" class="form-label">Amount ($)</label>
                        <input type="number" id="txAmount" class="form-control" placeholder="0.00" min="0.01" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="txType" class="form-label">Type</label>
                        <select id="txType" class="form-control">
                            <option value="expense" selected>Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>
                </div>

                <!-- Category Group (Dynamically toggled for income vs expense) -->
                <div class="form-group" id="categoryFormGroup">
                    <label for="txCategory" class="form-label">Category</label>
                    <select id="txCategory" class="form-control">
                        <option value="food" selected>🍔 Food & Groceries</option>
                        <option value="housing">🏠 Rent & Housing</option>
                        <option value="transport">🚗 Transportation</option>
                        <option value="utilities">⚡ Utilities & Bills</option>
                        <option value="entertainment">🎬 Entertainment & Leisure</option>
                        <option value="savings">📈 Savings & Investments</option>
                        <option value="other">📦 Other / Miscellaneous</option>
                    </select>
                </div>

                <!-- Date -->
                <div class="form-group">
                    <label for="txDate" class="form-label">Date</label>
                    <input type="date" id="txDate" class="form-control">
                </div>

                <!-- Action Button -->
                <button type="submit" class="btn btn-primary" style="margin-top: 1rem;" id="addTransactionSubmitBtn">
                    <svg style="width: 18px; height: 18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Save Transaction
                </button>
            </form>
        </div>

        <!-- Transactions Ledger Table Card -->
        <div class="card" id="cardTransactionLedger">
            <h2 class="card-title">Record History</h2>
            
            <div class="table-container">
                <table class="transaction-table" id="transactionLedgerTable">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th style="width: 50px;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="trackerTableBody">
                        <!-- Javascript will render transactions dynamically -->
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</main>

<?php include 'includes/footer.php'; ?>
