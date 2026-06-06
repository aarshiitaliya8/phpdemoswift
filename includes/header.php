<?php
$current_page = basename($_SERVER['SCRIPT_NAME']);
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- SEO Best Practices -->
    <title><?php echo isset($page_title) ? $page_title . ' - FinFlow Budget' : 'FinFlow - Personal Budget Calculator & Tracker'; ?></title>
    <meta name="description" content="Manage your personal finances, track monthly transactions, and simulate allocations with the 50/30/20 rule planner.">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
    <!-- Custom Style Sheet -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav class="nav-container" aria-label="Main Navigation">
            <a href="index.php" class="logo" id="logoLink">
                <div class="logo-icon">F</div>
                <span class="logo-text">FinFlow</span>
            </a>
            <ul class="nav-links">
                <li class="<?php echo ($current_page == 'index.php' || $current_page == '') ? 'active' : ''; ?>">
                    <a href="index.php" id="navDashboard">Dashboard</a>
                </li>
                <li class="<?php echo ($current_page == 'calculator.php') ? 'active' : ''; ?>">
                    <a href="calculator.php" id="navCalculator">50/30/20 Planner</a>
                </li>
                <li class="<?php echo ($current_page == 'tracker.php') ? 'active' : ''; ?>">
                    <a href="tracker.php" id="navTracker">Tracker</a>
                </li>
                <li>
                    <button id="themeToggleBtn" class="theme-toggle" aria-label="Toggle dark and light themes">☀️</button>
                </li>
            </ul>
        </nav>
    </header>
