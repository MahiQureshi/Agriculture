/* =========================================================
   ORANGEPLANT AI
   MAIN JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GLOBAL ELEMENTS
    ====================================================== */

    const body = document.body;

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileOverlay = document.getElementById("mobileOverlay");

    const themeToggle = document.getElementById("themeToggle");

    const pageTitle = document.getElementById("pageTitle");

    const pages = document.querySelectorAll(".page");
    const navItems = document.querySelectorAll("[data-page]");

    const toast = document.getElementById("toast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");

    let toastTimer;


    /* =====================================================
       PAGE TITLES
    ====================================================== */

    const pageTitles = {

        dashboard:
            "Smart Planting Material Assessment",

        scanner:
            "AI Plant Scanner",

        batch:
            "Batch Assessment",

        analytics:
            "Analytics",

        history:
            "Assessment History",

        about:
            "About OrangePlant AI"

    };


    /* =====================================================
       NAVIGATION
    ====================================================== */

    function navigateTo(pageId) {

        pages.forEach(page => {

            page.classList.remove("active-page");

        });

        const target = document.getElementById(pageId);

        if (target) {

            target.classList.add("active-page");

            pageTitle.textContent =
                pageTitles[pageId] || "OrangePlant AI";

        }

        document.querySelectorAll(".nav-item").forEach(item => {

            item.classList.remove("active");

            if (item.dataset.page === pageId) {

                item.classList.add("active");

            }

        });

        sidebar.classList.remove("mobile-open");
        mobileOverlay.classList.remove("show");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const page = item.dataset.page;

            if (page) {

                navigateTo(page);

            }

        });

    });


    /* =====================================================
       MOBILE SIDEBAR
    ====================================================== */

    mobileMenu.addEventListener("click", () => {

        sidebar.classList.toggle("mobile-open");

        mobileOverlay.classList.toggle(
            "show",
            sidebar.classList.contains("mobile-open")
        );

    });


    mobileOverlay.addEventListener("click", () => {

        sidebar.classList.remove("mobile-open");

        mobileOverlay.classList.remove("show");

    });


    /* =====================================================
       DARK MODE
    ====================================================== */

    const savedTheme =
        localStorage.getItem("orangePlantTheme");

    if (savedTheme === "dark") {

        body.classList.add("dark-mode");

    }


    themeToggle.addEventListener("click", () => {

        body.classList.toggle("dark-mode");

        const isDark =
            body.classList.contains("dark-mode");

        localStorage.setItem(
            "orangePlantTheme",
            isDark ? "dark" : "light"
        );

        showToast(
            isDark
                ? "Dark Mode Enabled"
                : "Light Mode Enabled",
            isDark
                ? "Neon analytics theme activated."
                : "Clean orange glass theme activated."
        );

    });


    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(title, message) {

        clearTimeout(toastTimer);

        toastTitle.textContent = title;

        toastMessage.textContent = message;

        toast.classList.add("show");

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }


    /* =====================================================
       DEMO DATA
    ====================================================== */

    let assessments =
        JSON.parse(
            localStorage.getItem(
                "orangePlantAssessments"
            ) || "null"
        );

    if (!Array.isArray(assessments)) {

        assessments = [

            {
                id: "ORG-2026-001",
                batch: "NAG-OR-042",
                nursery: "Orange Nursery — Nagpur",
                score: 91,
                disease: "Low",
                decision: "Suitable",
                date: "05 Oct 2026"
            },

            {
                id: "ORG-2026-002",
                batch: "NAG-OR-042",
                nursery: "Orange Nursery — Nagpur",
                score: 86,
                disease: "Low",
                decision: "Suitable",
                date: "05 Oct 2026"
            },

            {
                id: "ORG-2026-003",
                batch: "NAG-OR-042",
                nursery: "Orange Nursery — Nagpur",
                score: 68,
                disease: "Medium",
                decision: "Review",
                date: "04 Oct 2026"
            },

            {
                id: "ORG-2026-004",
                batch: "NAG-OR-043",
                nursery: "Nursery A — Saoner",
                score: 39,
                disease: "High",
                decision: "Reject",
                date: "04 Oct 2026"
            },

            {
                id: "ORG-2026-005",
                batch: "NAG-OR-043",
                nursery: "Nursery A — Saoner",
                score: 94,
                disease: "Low",
                decision: "Suitable",
                date: "03 Oct 2026"
            }

        ];

        saveAssessments();

    }


    function saveAssessments() {

        localStorage.setItem(
            "orangePlantAssessments",
            JSON.stringify(assessments)
        );

    }


    /* =====================================================
       TABLE RENDERING
    ====================================================== */

    function getStatusClass(decision) {

        if (decision === "Suitable") {
            return "suitable";
        }

        if (decision === "Review") {
            return "review";
        }

        return "reject";

    }


    function renderRecentTable() {

        const tbody =
            document.getElementById(
                "recentTableBody"
            );

        if (!tbody) return;

        tbody.innerHTML = "";

        assessments
            .slice(0, 5)
            .forEach(item => {

                const tr =
                    document.createElement("tr");

                tr.innerHTML = `

                    <td>
                        <strong>${escapeHTML(item.id)}</strong>
                    </td>

                    <td>${escapeHTML(item.batch)}</td>

                    <td>
                        <strong>${item.score}/100</strong>
                    </td>

                    <td>${escapeHTML(item.disease)}</td>

                    <td>
                        <span class="status-pill ${getStatusClass(item.decision)}">
                            ${escapeHTML(item.decision)}
                        </span>
                    </td>

                    <td>${escapeHTML(item.date)}</td>

                `;

                tbody.appendChild(tr);

            });

    }


    function renderHistoryTable() {

        const tbody =
            document.getElementById(
                "historyTableBody"
            );

        const empty =
            document.getElementById(
                "emptyHistory"
            );

        if (!tbody) return;

        const search =
            (
                document.getElementById(
                    "historySearch"
                )?.value || ""
            ).toLowerCase();

        const filter =
            document.getElementById(
                "historyFilter"
            )?.value || "all";

        const filtered =
            assessments.filter(item => {

                const matchesSearch = [

                    item.id,
                    item.batch,
                    item.nursery,
                    item.decision

                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(search);

                const matchesFilter =
                    filter === "all" ||
                    item.decision === filter;

                return matchesSearch && matchesFilter;

            });

        tbody.innerHTML = "";

        filtered.forEach(item => {

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>
                    <strong>${escapeHTML(item.id)}</strong>
                </td>

                <td>${escapeHTML(item.batch)}</td>

                <td>${escapeHTML(item.nursery)}</td>

                <td>
                    <strong>${item.score}</strong>
                </td>

                <td>${escapeHTML(item.disease)}</td>

                <td>
                    <span class="status-pill ${getStatusClass(item.decision)}">
                        ${escapeHTML(item.decision)}
                    </span>
                </td>

                <td>${escapeHTML(item.date)}</td>

            `;

            tbody.appendChild(tr);

        });

        if (empty) {

            empty.classList.toggle(
                "hidden",
                filtered.length !== 0
            );

        }

    }


    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    renderRecentTable();
    renderHistoryTable();


    /* =====================================================
       HISTORY SEARCH
    ====================================================== */

    document
        .getElementById("historySearch")
        ?.addEventListener(
            "input",
            renderHistoryTable
        );


    document
        .getElementById("historyFilter")
        ?.addEventListener(
            "change",
            renderHistoryTable
        );


    /* =====================================================
       CLEAR DEMO HISTORY
    ====================================================== */

    document
        .getElementById("clearHistoryButton")
        ?.addEventListener(
            "click",
            () => {

                const confirmed =
                    confirm(
                        "Clear all saved prototype assessment records?"
                    );

                if (!confirmed) return;

                assessments = [];

                saveAssessments();

                renderRecentTable();
                renderHistoryTable();

                showToast(
                    "Records Cleared",
                    "Prototype assessment history has been cleared."
                );

            }
        );


    /* =====================================================
       IMAGE UPLOAD
    ====================================================== */

    const dropZone =
        document.getElementById(
            "dropZone"
        );

    const imageInput =
        document.getElementById(
            "plantImageInput"
        );

    const browseButton =
        document.getElementById(
            "browseButton"
        );

    const placeholder =
        document.getElementById(
            "uploadPlaceholder"
        );

    const previewContainer =
        document.getElementById(
            "imagePreviewContainer"
        );

    const preview =
        document.getElementById(
            "plantPreview"
        );

    const removeImage =
        document.getElementById(
            "removeImage"
        );

    const qualityBadge =
        document.getElementById(
            "imageQualityBadge"
        );


    browseButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            imageInput.click();

        }
    );


    dropZone.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "#browseButton"
                ) ||
                event.target.closest(
                    "#removeImage"
                )
            ) {
                return;
            }

            if (!previewContainer.classList.contains("show")) {

                imageInput.click();

            }

        }
    );


    imageInput.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];

            if (file) {

                loadPlantImage(file);

            }

        }
    );


    [
        "dragenter",
        "dragover"
    ].forEach(eventName => {

        dropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropZone.classList.add(
                    "drag-over"
                );

            }
        );

    });


    [
        "dragleave",
        "drop"
    ].forEach(eventName => {

        dropZone.addEventListener(
            eventName,
            event => {

                event.preventDefault();

                dropZone.classList.remove(
                    "drag-over"
                );

            }
        );

    });


    dropZone.addEventListener(
        "drop",
        event => {

            const file =
                event.dataTransfer.files?.[0];

            if (
                file &&
                file.type.startsWith("image/")
            ) {

                loadPlantImage(file);

            } else {

                showToast(
                    "Invalid Image",
                    "Please choose a JPG, PNG or WEBP image."
                );

            }

        }
    );


    function loadPlantImage(file) {

        if (!file.type.startsWith("image/")) {

            showToast(
                "Invalid File",
                "Please select an image file."
            );

            return;

        }

        const reader =
            new FileReader();

        reader.onload = event => {

            preview.src =
                event.target.result;

            placeholder.style.display =
                "none";

            previewContainer.classList.add(
                "show"
            );

            qualityBadge.textContent =
                "Image Ready";

            qualityBadge.style.color =
                "var(--green)";

            qualityBadge.style.borderColor =
                "rgba(32,173,112,.2)";

            showToast(
                "Image Uploaded",
                "Plant image is ready for AI assessment."
            );

        };

        reader.readAsDataURL(file);

    }


    removeImage.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            imageInput.value = "";

            preview.src = "";

            previewContainer.classList.remove(
                "show"
            );

            placeholder.style.display =
                "block";

            qualityBadge.textContent =
                "Waiting";

            qualityBadge.style.color =
                "";

            qualityBadge.style.borderColor =
                "";

            document
                .getElementById("aiOverlay")
                .classList.remove("active");

        }
    );


    /* =====================================================
       AI OVERLAY TOGGLE
    ====================================================== */

    const overlayToggle =
        document.getElementById(
            "overlayToggle"
        );

    const aiOverlay =
        document.getElementById(
            "aiOverlay"
        );

    overlayToggle.addEventListener(
        "click",
        () => {

            if (
                !previewContainer.classList.contains(
                    "show"
                )
            ) {

                showToast(
                    "Upload Required",
                    "Upload a plant image before enabling AI overlay."
                );

                return;

            }

            aiOverlay.classList.toggle(
                "active"
            );

            const active =
                aiOverlay.classList.contains(
                    "active"
                );

            overlayToggle.innerHTML =
                active
                    ? "<span>◈</span> Hide AI Overlay"
                    : "<span>◈</span> AI Overlay";

        }
    );


    /* =====================================================
       SCANNER MODE
    ====================================================== */

    document
        .querySelectorAll(".mode-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".mode-option"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    button.classList.add(
                        "active"
                    );

                    if (
                        button.dataset.mode ===
                        "batch"
                    ) {

                        showToast(
                            "Batch Mode",
                            "Batch workflow selected."
                        );

                    } else {

                        showToast(
                            "Single Plant Mode",
                            "Single plant screening selected."
                        );

                    }

                }
            );

        });


    /* =====================================================
       AI ASSESSMENT
    ====================================================== */

    const analyzeButton =
        document.getElementById(
            "analyzeButton"
        );

    const scanningPanel =
        document.getElementById(
            "scanningPanel"
        );

    const assessmentResult =
        document.getElementById(
            "assessmentResult"
        );

    const scanProgress =
        document.getElementById(
            "scanProgress"
        );

    const scanPercentage =
        document.getElementById(
            "scanPercentage"
        );

    const scanTitle =
        document.getElementById(
            "scanTitle"
        );

    const scanDescription =
        document.getElementById(
            "scanDescription"
        );

    const scanSteps =
        document.querySelectorAll(
            ".scan-step"
        );


    analyzeButton.addEventListener(
        "click",
        startAssessment
    );


    function startAssessment() {

        if (
            !previewContainer.classList.contains(
                "show"
            )
        ) {

            showToast(
                "Upload Required",
                "Please upload an orange plant image first."
            );

            return;

        }

        scanningPanel.classList.remove(
            "hidden"
        );

        assessmentResult.classList.add(
            "hidden"
        );

        scanningPanel.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        let progress = 0;

        const stages = [

            {
                at: 5,
                title: "Initializing computer vision...",
                description:
                    "Checking image quality and framing."
            },

            {
                at: 22,
                title: "Analyzing plant structure...",
                description:
                    "Assessing canopy, stem and overall plant structure."
            },

            {
                at: 45,
                title: "Analyzing leaf characteristics...",
                description:
                    "Examining colour, density and visible leaf patterns."
            },

            {
                at: 67,
                title: "Screening visible symptoms...",
                description:
                    "Checking for visible disease, stress and physical damage."
            },

            {
                at: 86,
                title: "Calculating quality score...",
                description:
                    "Combining visual indicators into an explainable score."
            },

            {
                at: 100,
                title: "Assessment complete",
                description:
                    "Generating planting-material recommendation."
            }

        ];

        const interval =
            setInterval(() => {

                progress += 2;

                if (progress > 100) {

                    progress = 100;

                }

                scanProgress.style.width =
                    progress + "%";

                scanPercentage.textContent =
                    progress + "%";


                const currentStage =
                    [...stages]
                        .reverse()
                        .find(
                            stage =>
                                progress >=
                                stage.at
                        );

                if (currentStage) {

                    scanTitle.textContent =
                        currentStage.title;

                    scanDescription.textContent =
                        currentStage.description;

                }


                scanSteps.forEach(
                    (step, index) => {

                        const threshold =
                            [10, 30, 50, 70, 90][
                                index
                            ];

                        step.classList.toggle(
                            "active",
                            progress >= threshold
                        );

                        if (
                            progress >=
                            threshold + 10
                        ) {

                            step
                                .querySelector("i")
                                .textContent =
                                "✓";

                        }

                    }
                );


                if (progress >= 100) {

                    clearInterval(interval);

                    setTimeout(
                        showAssessmentResult,
                        700
                    );

                }

            }, 70);

    }


    /* =====================================================
       ASSESSMENT RESULT
    ====================================================== */

    function showAssessmentResult() {

        scanningPanel.classList.add(
            "hidden"
        );

        assessmentResult.classList.remove(
            "hidden"
        );

        assessmentResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        const score = 91;

        const scoreProgress =
            document.getElementById(
                "scoreProgress"
            );

        const circumference =
            2 * Math.PI * 50;

        const offset =
            circumference -
            (score / 100) *
            circumference;

        scoreProgress.style.strokeDasharray =
            circumference;

        scoreProgress.style.strokeDashoffset =
            circumference;

        setTimeout(() => {

            scoreProgress.style.strokeDashoffset =
                offset;

        }, 100);

        document.getElementById(
            "overallScore"
        ).textContent = score;

        showToast(
            "AI Assessment Complete",
            "Plant quality score generated successfully."
        );

    }


    /* =====================================================
       NEW ASSESSMENT
    ====================================================== */

    document
        .getElementById(
            "newAssessmentButton"
        )
        .addEventListener(
            "click",
            () => {

                assessmentResult.classList.add(
                    "hidden"
                );

                scanningPanel.classList.add(
                    "hidden"
                );

                navigateTo("scanner");

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


    /* =====================================================
       HUMAN REVIEW
    ====================================================== */

    const reviewModal =
        document.getElementById(
            "reviewModal"
        );

    const modalClose =
        document.getElementById(
            "modalClose"
        );

    const modalDone =
        document.getElementById(
            "modalDone"
        );


    function submitHumanReview(decision) {

        const reviewer =
            document.getElementById(
                "reviewerName"
            ).value;

        if (
            reviewer ===
            "Select reviewer"
        ) {

            showToast(
                "Reviewer Required",
                "Please select a reviewer first."
            );

            return;

        }

        const plantId =
            document.getElementById(
                "plantId"
            ).value ||
            "ORG-2026-001";

        const batchId =
            document.getElementById(
                "batchId"
            ).value ||
            "NAG-OR-042";

        const nursery =
            document.getElementById(
                "nursery"
            ).value;

        const observation =
            document.getElementById(
                "reviewObservation"
            ).value;

        let finalDecision =
            "Suitable";

        if (decision === "reject") {

            finalDecision =
                "Reject";

        }

        if (decision === "review") {

            finalDecision =
                "Review";

        }

        const newRecord = {

            id: plantId,

            batch: batchId,

            nursery,

            score:
                finalDecision === "Reject"
                    ? 39
                    : finalDecision === "Review"
                        ? 68
                        : 91,

            disease:
                finalDecision === "Reject"
                    ? "High"
                    : finalDecision === "Review"
                        ? "Medium"
                        : "Low",

            decision:
                finalDecision,

            date:
                new Date()
                    .toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }
                    ),

            reviewer,

            observation

        };

        assessments.unshift(
            newRecord
        );

        saveAssessments();

        renderRecentTable();
        renderHistoryTable();

        reviewModal.classList.remove(
            "hidden"
        );

    }


    document
        .getElementById(
            "approveButton"
        )
        .addEventListener(
            "click",
            () =>
                submitHumanReview(
                    "approve"
                )
        );


    document
        .getElementById(
            "reviewButton"
        )
        .addEventListener(
            "click",
            () =>
                submitHumanReview(
                    "review"
                )
        );


    document
        .getElementById(
            "rejectButton"
        )
        .addEventListener(
            "click",
            () =>
                submitHumanReview(
                    "reject"
                )
        );


    modalClose.addEventListener(
        "click",
        () => {

            reviewModal.classList.add(
                "hidden"
            );

        }
    );


    modalDone.addEventListener(
        "click",
        () => {

            reviewModal.classList.add(
                "hidden"
            );

            navigateTo("history");

            showToast(
                "Record Saved",
                "The plant assessment is now in history."
            );

        }
    );


    reviewModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                reviewModal
            ) {

                reviewModal.classList.add(
                    "hidden"
                );

            }

        }
    );


    /* =====================================================
       BATCH GENERATOR
    ====================================================== */

    document
        .getElementById(
            "generateBatchButton"
        )
        .addEventListener(
            "click",
            () => {

                const total =
                    100;

                const suitable =
                    71;

                const review =
                    17;

                const reject =
                    12;

                document.getElementById(
                    "batchTotal"
                ).textContent =
                    total;

                document.getElementById(
                    "batchAnalyzed"
                ).textContent =
                    total;

                document.getElementById(
                    "batchAverage"
                ).textContent =
                    "84.7";

                showToast(
                    "Batch Generated",
                    `${total} plants analyzed: ${suitable} suitable, ${review} review, ${reject} reject.`
                );

            }
        );


    /* =====================================================
       EXPORT BATCH REPORT
    ====================================================== */

    document
        .getElementById(
            "exportBatchButton"
        )
        .addEventListener(
            "click",
            () => {

                const report = [

                    "ORANGEPLANT AI",
                    "Batch Assessment Report",
                    "-------------------------",
                    "Batch ID: NAG-OR-042",
                    "Nursery: Orange Nursery — Nagpur",
                    "Total Plants: 100",
                    "Suitable: 71",
                    "Review: 17",
                    "Reject: 12",
                    "Average Score: 84.7",
                    "",
                    "Prototype demonstration report."

                ].join("\n");

                downloadTextFile(
                    "orangeplant-batch-report.txt",
                    report
                );

                showToast(
                    "Report Exported",
                    "Batch report downloaded successfully."
                );

            }
        );


    function downloadTextFile(
        filename,
        content
    ) {

        const blob =
            new Blob(
                [content],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement(
                "a"
            );

        link.href = url;
        link.download = filename;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        URL.revokeObjectURL(
            url
        );

    }


    /* =====================================================
       CHART TOGGLE
    ====================================================== */

    document
        .querySelectorAll(
            ".chart-period"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".chart-period"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    button.classList.add(
                        "active"
                    );

                    const period =
                        button.dataset.period;

                    const tooltip =
                        document.getElementById(
                            "chartTooltip"
                        );

                    if (
                        period ===
                        "month"
                    ) {

                        tooltip.textContent =
                            "742 plants";

                        showToast(
                            "Monthly View",
                            "Monthly screening activity displayed."
                        );

                    } else {

                        tooltip.textContent =
                            "184 plants";

                        showToast(
                            "Weekly View",
                            "Weekly screening activity displayed."
                        );

                    }

                }
            );

        });


    /* =====================================================
       ANALYTICS TOGGLE
    ====================================================== */

    document
        .querySelectorAll(
            ".analytics-period"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".analytics-period"
                        )
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    button.classList.add(
                        "active"
                    );

                    showToast(
                        `${button.textContent.trim()} Analytics`,
                        "Analytics view updated."
                    );

                }
            );

        });


    /* =====================================================
       KEYBOARD SHORTCUT
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                reviewModal.classList.add(
                    "hidden"
                );

                sidebar.classList.remove(
                    "mobile-open"
                );

                mobileOverlay.classList.remove(
                    "show"
                );

            }

        }
    );


    /* =====================================================
       DASHBOARD COUNTER ANIMATION
    ====================================================== */

    animateCounter(
        document.getElementById(
            "totalPlants"
        ),
        1248
    );

    animateCounter(
        document.getElementById(
            "suitablePlants"
        ),
        846
    );

    animateCounter(
        document.getElementById(
            "reviewPlants"
        ),
        247
    );

    animateCounter(
        document.getElementById(
            "rejectedPlants"
        ),
        155
    );


    function animateCounter(
        element,
        target
    ) {

        if (!element) return;

        let current = 0;

        const duration = 900;

        const start =
            performance.now();

        function update(time) {

            const progress =
                Math.min(
                    (time - start) /
                    duration,
                    1
                );

            current =
                Math.floor(
                    progress *
                    target
                );

            element.textContent =
                current.toLocaleString();

            if (progress < 1) {

                requestAnimationFrame(
                    update
                );

            } else {

                element.textContent =
                    target.toLocaleString();

            }

        }

        requestAnimationFrame(
            update
        );

    }


    /* =====================================================
       INITIAL TOAST
    ====================================================== */

    setTimeout(() => {

        showToast(
            "Welcome to OrangePlant AI",
            "AI-assisted nursery screening prototype is ready."
        );

    }, 900);

});
