/**
 * 遊戲戰隊群組展示頁 - 主要腳本
 * 包含：分部切換、導航效果、回到頂部、漢堡選單等功能
 */

(function () {
    'use strict';

    // ==================== DOM 元素快取 ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const backToTopBtn = document.getElementById('backToTop');
    const divisionTabs = document.querySelectorAll('.division-tab');
    const divisionPanels = document.querySelectorAll('.division-panel');
    const footerYear = document.getElementById('currentYear');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    // ==================== 初始化：設定當前年份 ====================
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // ==================== 導航欄滾動效果 ====================
    function handleNavScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // 初始檢查
    handleNavScroll();

    // 監聽滾動 (使用 passive 提升效能)
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ==================== 漢堡選單 (行動版) ====================
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // 切換 aria-expanded 狀態 (無障礙)
        const isExpanded = navLinks.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', toggleMobileMenu);

    // 點擊導航連結後關閉選單
    allNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });

    // 點擊頁面其他區域關閉選單
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);

        if (
            navLinks.classList.contains('active') &&
            !isClickInsideNav &&
            !isClickOnToggle
        ) {
            closeMobileMenu();
        }
    });

    // ESC 鍵關閉選單
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
            navToggle.focus(); // 將焦點返回給漢堡按鈕
        }
    });

    // ==================== 分部切換功能 ====================
    function switchDivision(tabElement) {
        const targetPanelId = tabElement.getAttribute('data-tab');

        // 如果已經是目前啟用的標籤，不執行任何操作
        if (tabElement.classList.contains('active')) {
            return;
        }

        // 移除所有標籤的 active 狀態
        divisionTabs.forEach(function (tab) {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });

        // 移除所有面板的 active 狀態
        divisionPanels.forEach(function (panel) {
            panel.classList.remove('active');
        });

        // 啟用目標標籤
        tabElement.classList.add('active');
        tabElement.setAttribute('aria-selected', 'true');

        // 顯示目標面板
        const targetPanel = document.getElementById('panel-' + targetPanelId);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // 更新 URL hash (可選，方便分享連結)
        if (history.pushState) {
            const newHash = '#divisions-' + targetPanelId;
            if (window.location.hash !== newHash) {
                history.pushState(null, null, newHash);
            }
        }
    }

    // 為每個標籤綁定點擊事件
    divisionTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            switchDivision(tab);
        });

        // 鍵盤無障礙：Enter 和 Space 鍵觸發
        tab.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                switchDivision(tab);
            }
            // 左右箭頭鍵切換標籤
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                event.preventDefault();
                const tabsArray = Array.from(divisionTabs);
                const currentIndex = tabsArray.indexOf(tab);
                let nextIndex;
                if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabsArray.length;
                } else {
                    nextIndex =
                        (currentIndex - 1 + tabsArray.length) % tabsArray.length;
                }
                tabsArray[nextIndex].focus();
                switchDivision(tabsArray[nextIndex]);
            }
        });
    });

    // ==================== 根據 URL hash 初始化分部顯示 ====================
    function initDivisionFromHash() {
        const hash = window.location.hash;
        if (hash.startsWith('#divisions-')) {
            const targetDiv = hash.replace('#divisions-', '');
            const targetTab = document.querySelector(
                '.division-tab[data-tab="' + targetDiv + '"]'
            );
            if (targetTab) {
                switchDivision(targetTab);
            }
        }
    }

    initDivisionFromHash();

    // 監聽瀏覽器前進/後退
    window.addEventListener('hashchange', initDivisionFromHash);

    // ==================== 回到頂部按鈕 ====================
    function handleBackToTopVisibility() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    // 初始檢查
    handleBackToTopVisibility();

    // 監聽滾動
    window.addEventListener('scroll', handleBackToTopVisibility, {
        passive: true,
    });

    // 點擊事件
    backToTopBtn.addEventListener('click', scrollToTop);

    // ==================== 平滑滾動 (增強支援) ====================
    // 對於不支援 scroll-behavior: smooth 的瀏覽器提供 polyfill
    function smoothScrollTo(targetElement) {
        if (!targetElement) return;

        // 檢查瀏覽器是否原生支援 smooth scroll
        const supportsNativeSmoothScroll =
            'scrollBehavior' in document.documentElement.style;

        if (supportsNativeSmoothScroll) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // 手動平滑滾動 (fallback)
            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.pageYOffset -
                70;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 600;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // easeInOutCubic 緩動函數
                const ease =
                    progress < 0.5
                        ? 4 * progress * progress * progress
                        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

                window.scrollTo(0, startPosition + distance * ease);

                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        }
    }

    // 為所有內部錨點連結增強滾動體驗
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                event.preventDefault();
                smoothScrollTo(targetElement);
            }
        });
    });

    // ==================== 鍵盤無障礙增強 ====================
    // 確保所有互動元素可通過鍵盤訪問
    document.addEventListener('keydown', function (event) {
        // 按 Tab 鍵時確保回到頂部按鈕可見
        if (event.key === 'Tab' && window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        }
    });

    // ==================== 初始化完成日誌 ====================
    console.log('%c🎮 戰隊群組頁面已就緒 %c| %c請將所有 [資訊名稱] 替換為實際內容',
        'color: #a855f7; font-weight: bold;',
        'color: #b0b3bf;',
        'color: #f59e0b;');
    console.log('%c💡 提示：在 HTML 檔案中搜尋 "[" 即可快速找到所有需填寫的佔位符',
        'color: #6b6f7d; font-style: italic;');

})();