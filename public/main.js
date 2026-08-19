// ═══ HEADER SOLID ON SCROLL ═══
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 24);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ═══ MOBILE NAV ═══
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
burger.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
        header.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
    })
);

// ═══ ACTIVE NAV LINK ═══
const navLinks = [...document.querySelectorAll(".header__nav a")];
const navSpy = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            navLinks.forEach((link) =>
                link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
            );
        }
    },
    { rootMargin: "-40% 0px -55% 0px" }
);
navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) navSpy.observe(target);
});

// ═══ SCROLL REVEAL ═══
const revealer = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                revealer.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.18 }
);
document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

// ═══ ANIMATED COUNTERS ═══
const animateCount = (el) => {
    const target = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || "0", 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};
const counterObserver = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll(".count").forEach(animateCount);
                counterObserver.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.6 }
);
document.querySelectorAll(".stat").forEach((stat) => counterObserver.observe(stat));

// ═══ SKILL BARS ═══
const skillObserver = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width + "%";
                skillObserver.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.4 }
);
document.querySelectorAll(".skill__fill").forEach((bar) => skillObserver.observe(bar));

// ═══ PROJECTS RAIL DOTS ═══
const rail = document.getElementById("rail");
const dots = document.getElementById("dots");
if (rail && dots) {
    const cards = [...rail.querySelectorAll(".proj")];
    cards.forEach((card, index) => {
        const btn = document.createElement("button");
        btn.setAttribute("aria-label", `Project ${index + 1}`);
        if (index === 0) btn.classList.add("is-active");
        btn.addEventListener("click", () =>
            card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
        );
        dots.appendChild(btn);
    });
    const dotEls = [...dots.children];
    rail.addEventListener(
        "scroll",
        () => {
            const current = Math.round(rail.scrollLeft / (cards[0].offsetWidth + 32));
            dotEls.forEach((d, i) => d.classList.toggle("is-active", i === Math.min(current, cards.length - 1)));
        },
        { passive: true }
    );
}

