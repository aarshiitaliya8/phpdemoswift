<?php
$page_title = "50/30/20 Budget Planner";
include 'includes/header.php';
?>

<main class="container">
    <!-- Calculator Page Header -->
    <section style="margin-bottom: 2.5rem;">
        <h1 style="font-size: 2.25rem; font-weight: 800; background: linear-gradient(135deg, var(--text-primary), var(--text-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.25rem;">
            50/30/20 Rule Budget Planner
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
            A simple, scientifically-backed planning rule of thumb to divide your income into Needs, Wants, and Savings.
        </p>
    </section>

    <!-- Content Grid -->
    <section class="grid-cols-1-2" aria-label="Planner Interface">
        <!-- Sidebar Controls -->
        <div class="card" id="cardPlannerSettings">
            <h2 class="card-title">Income Settings</h2>
            
            <div class="form-group">
                <label for="calcIncomeInput" class="form-label">Monthly Post-Tax Income ($)</label>
                <input type="number" id="calcIncomeInput" class="form-control" placeholder="e.g. 5000" min="0" step="100">
                <small style="color: var(--text-muted); font-size: 0.75rem; display: block; margin-top: 0.5rem;">
                    Input your regular take-home pay to automatically generate target buckets.
                </small>
            </div>

            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">

            <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">The Allocation Rule:</h3>
                <ul style="padding-left: 1.2rem; margin-bottom: 1rem;">
                    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--color-primary);">50% Needs:</strong> Obligatory expenses including rent/mortgage, utilities, car payments, insurance, groceries.</li>
                    <li style="margin-bottom: 0.5rem;"><strong style="color: var(--color-warning);">30% Wants:</strong> Discretionary spending like hobbies, dinners, gym memberships, streaming services, travel.</li>
                    <li><strong style="color: var(--color-success);">20% Savings:</strong> Emergency fund additions, investment accounts, retirement planning, credit card debt payments.</li>
                </ul>
            </div>
        </div>

        <!-- Main Display & Graph -->
        <div class="card" id="cardPlannerCharts">
            <h2 class="card-title">Target Allocations</h2>
            
            <!-- Cards of allocations -->
            <div class="budget-rule-grid" aria-label="Allocation Targets">
                <!-- Needs Card -->
                <div class="budget-rule-card needs">
                    <div class="rule-pct">50%</div>
                    <div class="rule-title">Needs</div>
                    <div class="rule-value" id="ruleValueNeeds">$0.00</div>
                    <div class="rule-desc">Essentials</div>
                </div>

                <!-- Wants Card -->
                <div class="budget-rule-card wants">
                    <div class="rule-pct">30%</div>
                    <div class="rule-title">Wants</div>
                    <div class="rule-value" id="ruleValueWants">$0.00</div>
                    <div class="rule-desc">Lifestyle Choices</div>
                </div>

                <!-- Savings Card -->
                <div class="budget-rule-card savings">
                    <div class="rule-pct">20%</div>
                    <div class="rule-title">Savings & Debt</div>
                    <div class="rule-value" id="ruleValueSavings">$0.00</div>
                    <div class="rule-desc">Financial Goals</div>
                </div>
            </div>

            <!-- Graph Canvas -->
            <div style="height: 280px; position: relative; margin-top: 2rem;">
                <canvas id="plannerChart"></canvas>
            </div>

            <!-- Tips output -->
            <div id="calcRuleTips">
                <!-- Javascript will load messages here -->
            </div>
        </div>
    </section>
</main>

<?php include 'includes/footer.php'; ?>
