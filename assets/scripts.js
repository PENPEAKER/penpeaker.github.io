// Global Configurations
document.addEventListener("DOMContentLoaded", () => {
    initCursor();
    initNavbar();
    initTypewriter();
    initSkillAnimation();
    initCertificates();
    initProjectsDisplay();
    initScrollReveal();
    initCardTilt();
});

/* =========================================================================
   1. Custom Magnetic Mouse Cursor with Lerp
   ========================================================================= */
function initCursor() {
    const dot = document.getElementById("custom-cursor-dot");
    const outline = document.getElementById("custom-cursor-outline");
    
    if (!dot || !outline) return;

    let mouseX = 0, mouseY = 0; // Target coordinates
    let outlineX = 0, outlineY = 0; // Current trail coordinates
    let isHovering = false;
    
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant position for the dot
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
    });

    // Lerp calculation for smooth trail outline cursor
    function animateCursor() {
        const ease = 0.15; // Smooth interpolation factor
        outlineX += (mouseX - outlineX) * ease;
        outlineY += (mouseY - outlineY) * ease;
        
        outline.style.left = outlineX + "px";
        outline.style.top = outlineY + "px";
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover interactions for links, buttons, and card nodes
    const hoverElements = document.querySelectorAll("a, button, .cert-card, .project-card-cyber, .skill-node, .contact-item");
    hoverElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            outline.classList.add("cursor-hover");
            dot.classList.add("cursor-dot-hover");
            isHovering = true;
        });
        el.addEventListener("mouseleave", () => {
            outline.classList.remove("cursor-hover");
            dot.classList.remove("cursor-dot-hover");
            isHovering = false;
        });
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
        dot.style.opacity = 0;
        outline.style.opacity = 0;
    });
    document.addEventListener("mouseenter", () => {
        dot.style.opacity = 1;
        outline.style.opacity = 1;
    });
}

/* =========================================================================
   2. Sticky Header Navbar
   ========================================================================= */
function initNavbar() {
    const nav = document.getElementById("navbar");
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links-menu");
    
    if (!nav) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // Mobile Navigation Drawer Toggle
    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = menuBtn.querySelector("i");
            if (navLinks.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });

        // Close menu drawer when clicking a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuBtn.querySelector("i").className = "fa-solid fa-bars";
            });
        });
    }
}

/* =========================================================================
   3. Typewriter Animation (Hero section)
   ========================================================================= */
function initTypewriter() {
    const el = document.getElementById("typewriter-target");
    if (!el) return;

    const phrases = [
        "Certified Ethical Hacker",
        "Incident Responder",
        "DDoS Defense Engineer",
        "Python Automation Developer"
    ];

    let loopNum = 0;
    let period = 2000;
    let txt = '';
    let isDeleting = false;

    function tick() {
        let i = loopNum % phrases.length;
        let fullTxt = phrases[i];

        if (isDeleting) {
            txt = fullTxt.substring(0, txt.length - 1);
        } else {
            txt = fullTxt.substring(0, txt.length + 1);
        }

        el.innerHTML = `<span class="wrap">${txt}</span><span class="cursor" style="animation: cursorPulse 0.8s infinite; color: var(--primary);">|</span>`;

        let delta = 150 - Math.random() * 80;

        if (isDeleting) { delta /= 2.5; }

        if (!isDeleting && txt === fullTxt) {
            delta = period;
            isDeleting = true;
        } else if (isDeleting && txt === '') {
            isDeleting = false;
            loopNum++;
            delta = 600;
        }

        setTimeout(() => {
            tick();
        }, delta);
    }

    tick();
}

/* =========================================================================
   4. Skill Bar Load Trigger Animation
   ========================================================================= */
function initSkillAnimation() {
    const section = document.getElementById("CORE-COMPETENCIES");
    if (!section) return;

    const fills = document.querySelectorAll(".skill-bar-fill");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fills.forEach(fill => {
                    const val = fill.getAttribute("data-level");
                    fill.style.width = val + "%";
                });
            }
        });
    }, { threshold: 0.15 });

    observer.observe(section);
}

/* =========================================================================
   5. Certificates Gallery Modal System
   ========================================================================= */
const certsList = [
    "certificates/ceh.pdf",
    "certificates/flipper-workshop.pdf",
    "certificates/google-genai.pdf",
    "certificates/chatgpt-cyber.pdf",
    "certificates/healthcare-cyber.pdf"
];

const certNames = [
    "Certified Ethical Hacker (CEH) - Avodha",
    "Flipper Zero Workshop Certificate - RoomNumber404",
    "Introduction to Generative AI - Google Cloud / Simplilearn",
    "ChatGPT for Cyber Security - Simplilearn",
    "Cyber Security in Healthcare Systems - Simplilearn"
];

let currentCertIndex = 0;

function initCertificates() {
    const modal = document.getElementById("certModal");
    if (!modal) return;

    window.openCert = function(index) {
        currentCertIndex = index;
        updateModalFrame();
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Prevent background scroll
    };

    window.closeCert = function() {
        modal.style.display = "none";
        document.getElementById("certFrame").src = "";
        document.body.style.overflow = "auto";
    };

    window.nextCert = function() {
        currentCertIndex = (currentCertIndex + 1) % certsList.length;
        updateModalFrame();
    };

    window.prevCert = function() {
        currentCertIndex = (currentCertIndex - 1 + certsList.length) % certsList.length;
        updateModalFrame();
    };

    function updateModalFrame() {
        const frame = document.getElementById("certFrame");
        const title = document.getElementById("certModalTitle");
        frame.src = certsList[currentCertIndex];
        title.textContent = `CREDENTIAL DISPLAY: ${certNames[currentCertIndex].toUpperCase()}`;
    }

    // Close on click outside content window
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            window.closeCert();
        }
    });
}

/* =========================================================================
   6. Project Case Study Dynamic Drawer Manager
   ========================================================================= */
const projectsData = {
    ghostgate: {
        title: "🛡️ Windows GhostGate",
        desc: "A high-performance real-time DDoS detection and automated firewall mitigation system engineered for Windows servers and high-traffic infrastructures.",
        overview: "Windows GhostGate is an intelligent DDoS mitigation client. It uses a Scapy network hook to monitor incoming connection metrics, extracting parameters like traffic volume, packet sizes, and frequency. This telemetry is streamed to an unsupervised Machine Learning (IsolationForest) anomaly detector model which calculates real-time threat indexes. If an IP exceeds threat thresholds, GhostGate directly interfaces with the Windows Filtering Platform via PowerShell firewall hooks to automatically drop connections and block malicious activity. It also includes an administrative Flask web dashboard for real-time monitoring, manual overrides, stress simulations, and live log graphing.",
        capabilities: [
            "Real-time packet inspection & traffic frequency monitoring using custom Scapy sockets",
            "ML anomaly detection engine (Isolation Forest) profiling connections automatically",
            "Direct Windows Firewall / Netsh command automation integration",
            "Temporary & Permanent IP address ban lists with auto-release intervals",
            "Secure web-based administrative dashboard over HTTPS with token auth",
            "Interactive graphs detailing active connections, packet velocity, and drop rates",
            "Manual IP block/allow override commands and configuration options",
            "Traffic simulation scripts for conducting controlled server stress testing",
            "Engineered to withstand high-volume throughput on gaming infrastructure"
        ],
        architecture: [
            "1. Inspection Loop: Raw network packets are scanned, extracting packet headers and speed ratios.",
            "2. Feature Pipeline: Parameters are vectorized and pushed to an in-memory queue.",
            "3. Anomaly Scorer: Machine Learning model calculates contamination ratios (Isolation Forest).",
            "4. Firewall Driver: Block trigger fires Netsh filters directly for IPs with anomaly scores above 0.85.",
            "5. Telemetry Feed: Logs are cached in-memory and pushed to the Chart.js visual control dashboard."
        ],
        optimization: [
            "HTTPS-secured dashboard interface preventing unauthorized control overrides.",
            "Session validation token hashes securing the web controller backend.",
            "High-speed in-memory database lookup tables matching IPs instantly to prevent processing lags.",
            "Optimized command buffers grouping firewall insertion scripts, reducing Windows Filtering Platform overhead."
        ],
        impact: [
            "Mitigates DDoS traffic surges under 850 milliseconds automatically",
            "Eliminated manual firewall operations during high-velocity volumetric attacks",
            "Maintains web service uptime and latency limits during peak stress tests",
            "Delivers an easily deployable script-based defense package for Windows network architectures"
        ],
        tech: ["Python", "Flask", "Machine Learning", "IsolationForest", "Scapy", "Windows Firewall", "Chart.js", "HTML", "CSS", "JavaScript"],
        logLines: [
            "Booting Windows GhostGate Core Telemetry System...",
            "Loading Machine Learning classifier weights... SUCCESS",
            "Hyperparameters: (estimators=100, contamination=0.015, jobs=max)",
            "System socket bound to network interfaces. Listening for streams...",
            "Telemetry Dashboard active on https://127.0.0.1:443/admin (Port: 443)",
            "WARNING: Traffic surge detected from source node 192.168.1.187",
            "Anomaly Index: 0.962 [THRESHOLD EXCEEDED: 0.850]",
            "Firewall Hook Action Triggered: Adding auto-block policy...",
            "Executing shell command: netsh advfirewall firewall add rule name='GhostGate-Drop-192.168.1.187'...",
            "SUCCESS: Threat node 192.168.1.187 permanently banned. Connections dropped.",
            "Capturing packets... Connection logs healthy."
        ]
    },
    whatsapp: {
        title: "🤖 WhatsApp Business Automation Bot",
        desc: "A headless browser-based automation bot running customer catalog menus, pricing inquiries, and warranty dispatches for retail businesses.",
        overview: "The WhatsApp Business Automation Bot is an automated communications layer built in Python utilizing Playwright browser automation. The bot operates by loading the WhatsApp Web context, restoring authenticated sessions to skip repeat QR scans. Once loaded, it scans the DOM interface in a continuous loop to detect unread customer conversations. When an unread chat is opened, the bot extracts the client's queries, matches commands against a local JSON database containing retail listings, and dispatches item catalogs, spec sheets, images, and pricing/warranty details instantly. Built-in caching safeguards against duplicate replies, and local sqlite tables record message transaction schedules.",
        capabilities: [
            "Automated conversation handling on WhatsApp Web with zero manual intervention",
            "Real-time monitoring querying DOM nodes for unread chat badges",
            "Playwright browser automation managing background Chromium engines",
            "Interactive product catalogs featuring TV, refrigerator, and AC listings",
            "Catalog responses carrying matching product catalog photos and specs",
            "Price lookup, contact routing, and direct warranty detail transmission",
            "Safe session storage mapping cookies to bypass repetitive QR scanning prompts",
            "Duplicate response protection validating chat message IDs in local caching tables",
            "Resilience layer recovering execution states automatically on connection drops"
        ],
        architecture: [
            "1. Boot Initialization: Playwright initializes Chromium context and loads active credentials.",
            "2. UI Scanner: Main execution loop checks for active unread notification badges in the contact bar.",
            "3. Chat Inspector: Opens unread chat nodes, extracting the text payloads of the newest message strings.",
            "4. Command Matcher: Normalizes string queries and checks for catalog menu trigger keywords.",
            "5. Payload Dispatcher: Simulates message entries, copies assets (like catalog photos), and transmits response.",
            "6. Database Logger: Stores conversation timestamps and locks message keys to prevent repeated loops."
        ],
        optimization: [
            "Headless browser isolation reducing background processor usage on hosts.",
            "Custom debounce timers preventing account flags by mimicking human typing speed limits.",
            "Isolated Chromium user-data profiles preserving authenticated session statuses."
        ],
        impact: [
            "Reduced client customer support response times from hours to under 3 seconds",
            "Automated over 85% of standard product information and warranty inquiries",
            "Provided 24/7 client communication availability for retail customer networks"
        ],
        tech: ["Python", "Playwright", "Browser Automation", "Session Management", "SQLite", "DOM Parsing", "JSON File IO"],
        logLines: [
            "Starting WhatsApp Business Automation Module...",
            "Playwright Chromium browser thread initialized.",
            "Loading local user data session profile... SUCCESS",
            "Bypassed QR validation challenge. Restored authenticated cookies.",
            "Main background scanning thread running. Speed check: 500ms intervals.",
            "Unread chat detected from sender: 'Customer Node: +9180XXXXXX'",
            "Accessing conversation thread. Content: 'show refrigerator specs'...",
            "Command matched: REFRIGERATOR_CATALOG. Retrieving assets...",
            "Transmitting file: assets/fridge_spec.png (2.4 MB) with price lists...",
            "Message sent successfully. Locking transaction ID 'WA_MSG_90284'.",
            "Returning to background scan loop. Waiting for queries..."
        ]
    },
    vulnerability: {
        title: "🎯 Web Vulnerability Disclosure",
        desc: "Responsible identification and coordinated disclosure of server privilege escalations and database IDOR parameters.",
        overview: "Secured client accounts and database integrity by auditing corporate web applications, highlighting severe logical flaws, and compiling reports detailing mitigation steps for remediation engineers.",
        capabilities: [
            "API routing and URL query parameter tampering tests",
            "IDOR vulnerability inspection testing access control bounds",
            "Burp Suite Pro traffic interception and header manipulations",
            "Proof-of-concept exploit scripts verifying backend endpoint bugs",
            "Remediation guidance fixing server-side validation configurations"
        ],
        architecture: [
            "1. Reconnaissance: Audited application endpoints and mapped route variables.",
            "2. Traffic Proxying: Intercepted API calls mapping account structures.",
            "3. Privilege Testing: Modified object indicators without containing authorization headers.",
            "4. POC Validation: Extracted database records demonstrating logical flaws.",
            "5. Coordinated Disclosure: Prepared reports mapping risk metrics (CVSS) and developer code fixes."
        ],
        optimization: [
            "Advised on cryptographically secure token validation layers on REST controllers.",
            "Supported migration to UUIDs replacing sequential resource numbers."
        ],
        impact: [
            "Secured over 14,000 sensitive database records from unauthorized data access",
            "Eliminated route privilege exploits across critical payment systems",
            "Aligned corporate APIs with OWASP Top 10 access validation compliance standards"
        ],
        tech: ["OWASP Top 10", "Burp Suite Pro", "API Pen-Testing", "HTTP Headers", "Exploit Reporting"],
        logLines: [
            "Initializing security audit proxy logs...",
            "Intercepting query parameters: GET /user/profile/v1?account_id=2081...",
            "Testing account mutations: Modifying parameter payload to account_id=2082...",
            "ALERT: Direct Database Reference access authorized. Status: 200 OK.",
            "Vulnerability confirmed: IDOR (Missing Server-Side Auth Validation).",
            "Compiling vulnerability dossier. Evaluating impact vector: CVSS v3 8.3 (High)...",
            "Generating Python Proof-of-Concept query exploit...",
            "Securely transmitting report files to organization safety group.",
            "Coordinating fix validation: Verifying token authentication backend headers... APPROVED."
        ]
    }
};

let currentProjectId = "ghostgate";
let logsInterval = null;

function initProjectsDisplay() {
    const overlay = document.getElementById("case-study-overlay");
    if (!overlay) return;

    const closeBtn = document.getElementById("overlay-close-btn");
    
    // Global function to trigger project drawer
    window.viewProjectDetails = function(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        currentProjectId = projectId;
        
        // Populate static textual elements
        document.getElementById("overlay-project-title").textContent = data.title;
        document.getElementById("overlay-project-desc").textContent = data.desc;
        
        // Populate tech tags
        const techContainer = document.getElementById("overlay-project-tech");
        techContainer.innerHTML = "";
        data.tech.forEach(t => {
            const span = document.createElement("span");
            span.textContent = t;
            techContainer.appendChild(span);
        });

        // Set up dynamically populated tabs
        document.getElementById("overlay-overview-text").innerHTML = `<p>${data.overview}</p>`;
        
        // Build impact lists
        const impactList = document.getElementById("overlay-impact-list");
        impactList.innerHTML = "";
        data.impact.forEach(imp => {
            const li = document.createElement("li");
            li.textContent = imp;
            impactList.appendChild(li);
        });

        // Build capabilities list
        const capList = document.getElementById("overlay-capabilities-list");
        capList.innerHTML = "";
        data.capabilities.forEach(cap => {
            const li = document.createElement("li");
            li.textContent = cap;
            capList.appendChild(li);
        });

        // Build architecture list
        const archList = document.getElementById("overlay-architecture-list");
        archList.innerHTML = "";
        data.architecture.forEach((arch, idx) => {
            const li = document.createElement("li");
            li.setAttribute("data-step", idx + 1);
            li.textContent = arch;
            archList.appendChild(li);
        });

        // Build optimization list
        const optimList = document.getElementById("overlay-optimization-list");
        optimList.innerHTML = "";
        data.optimization.forEach(opt => {
            const li = document.createElement("li");
            li.textContent = opt;
            optimList.appendChild(li);
        });

        // Switch to the first tab (Overview) on open
        window.switchProjectTab("overview");

        // Display case study overlay
        overlay.style.display = "flex";
        document.body.style.overflow = "hidden"; // Disable background scrolling

        // Start simulated logs stream
        streamTerminalLogs(data.logLines);
    };

    // Close button click handler
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            overlay.style.display = "none";
            document.body.style.overflow = "auto";
            if (logsInterval) clearInterval(logsInterval);
        });
    }

    // Close on clicking overlay background
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.style.display = "none";
            document.body.style.overflow = "auto";
            if (logsInterval) clearInterval(logsInterval);
        }
    });

    // Tab switching script
    window.switchProjectTab = function(tabName) {
        // Toggle tab buttons
        const tabButtons = document.querySelectorAll(".tab-nav-link");
        tabButtons.forEach(btn => {
            if (btn.getAttribute("onclick").includes(tabName)) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        // Toggle panels
        const panels = document.querySelectorAll(".tab-panel");
        panels.forEach(panel => {
            if (panel.id === `tab-${tabName}`) {
                panel.classList.add("active");
            } else {
                panel.classList.remove("active");
            }
        });
    };

    // Close overlay and scroll directly to target section
    window.closeOverlayAndScroll = function(targetSectionId) {
        overlay.style.display = "none";
        document.body.style.overflow = "auto";
        if (logsInterval) clearInterval(logsInterval);
        
        const section = document.getElementById(targetSectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
}

// Simulated real-time logging feeds
function streamTerminalLogs(logsArray) {
    const output = document.getElementById("overlay-terminal-output");
    if (!output) return;

    if (logsInterval) clearInterval(logsInterval);
    output.innerHTML = "";
    
    let index = 0;
    
    function addLogLine() {
        if (index >= logsArray.length) {
            index = 0; // Loop logs
            output.innerHTML = "";
        }
        
        const line = document.createElement("div");
        line.className = "terminal-log-line";
        
        // Add timestamp and cyan marker prefix
        const time = new Date().toLocaleTimeString();
        line.innerHTML = `<span style="color: var(--primary)">[${time}] [SYS-LOG]</span> ${logsArray[index]}`;
        
        output.appendChild(line);
        output.scrollTop = output.scrollHeight; // Auto scroll down
        
        index++;
    }

    addLogLine(); // Run immediately
    logsInterval = setInterval(addLogLine, 1200 + Math.random() * 800);
}

/* =========================================================================
   7. Element Scroll Reveal
   ========================================================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach(r => observer.observe(r));
}

/* =========================================================================
   8. 3D Hover Card Tilt Effect (For Desktop)
   ========================================================================= */
function initCardTilt() {
    const cards = document.querySelectorAll(".tilt-target");
    
    // Disable tilt on mobile/tablets to optimize performance
    if (window.innerWidth < 1024) return;

    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            
            // Calculate cursor offset position relative to card dimensions
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate degrees of rotation (caps at 8 degrees)
            const rotateX = ((centerY - y) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}
