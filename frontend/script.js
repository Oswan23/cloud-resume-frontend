// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle")
const themeIcon = document.querySelector(".theme-icon")
const html = document.documentElement
const API_BASE = "https://fjwy1ub4ge.execute-api.us-east-1.amazonaws.com";

// Only update the icon (theme is set in index.html head to prevent flash)
const savedTheme = localStorage.getItem("theme") || "light"
updateThemeIcon(savedTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme")
  const newTheme = currentTheme === "light" ? "dark" : "light"

  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
})

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === "light" ? "🌙" : "☀️"
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const navHeight = document.getElementById("navbar").offsetHeight
      const targetPosition = target.offsetTop - navHeight
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })

  // Mobile hamburger menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  //const navLinksContainer = document.querySelector(".nav-links");

  // menuToggle.addEventListener("click", () => {
  //     navLinksContainer.classList.toggle("active");
  // });

  if (menuToggle && navLinks) {
    // make the button accessible by toggling aria-expanded on click
    menuToggle.setAttribute('aria-expanded', 'false')
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active')
      menuToggle.setAttribute('aria-expanded', isOpen.toString())
    })

    // close the menu after clicking a link (mobile UX)
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active')
        }
      })
    })
  }
})

// Timeline Animation on Scroll
const timelineItems = document.querySelectorAll(".timeline-item")

const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in")
    }
  })
}, observerOptions)

timelineItems.forEach((item) => {
  observer.observe(item)
})

// Counters Configuration
const viewCountDisplay = document.getElementById("view-count");
const clickButton = document.getElementById("click-button");
const clickCountDisplay = document.getElementById("click-count");
const clickLockBtn = document.getElementById("click-lock");

// Initialize both counters on page load
async function initializeCounters() {
  // 1. View Counter Optimistic Load
  const cachedViews = localStorage.getItem("viewCount");
  if (cachedViews) viewCountDisplay.textContent = cachedViews;
  else viewCountDisplay.innerHTML = '<span class="loading-dots" style="opacity: 0.5;">...</span>';

  // 2. Click Counter Local Session Logic
  const isClicksLocked = localStorage.getItem("clicksLocked") === "true";

  if (clickLockBtn) {
    clickLockBtn.innerHTML = isClicksLocked ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>';
    clickLockBtn.title = isClicksLocked ? "Unlock local click count" : "Lock local click count across reloads";
  }

  // Local clicks default to 0 on refresh unless locked
  let initialClicks = 0;
  if (isClicksLocked && localStorage.getItem("localSessionClicks")) {
    initialClicks = parseInt(localStorage.getItem("localSessionClicks")) || 0;
  } else {
    localStorage.removeItem("localSessionClicks"); // Ensure it's clear
  }
  clickCountDisplay.textContent = initialClicks;

  // Fetch true View Count from DB
  try {
    const response = await fetch(`${API_BASE}/views`, { method: "POST" });
    if (response.ok) {
      const data = await response.json();
      viewCountDisplay.textContent = data.count;
      localStorage.setItem("viewCount", data.count);
    }
  } catch (error) {
    console.error("Error loading view count:", error);
  }
}

// Click Lock Toggle
if (clickLockBtn) {
  clickLockBtn.addEventListener("click", () => {
    const currentState = localStorage.getItem("clicksLocked") === "true";
    const newState = !currentState;
    localStorage.setItem("clicksLocked", newState);

    clickLockBtn.innerHTML = newState ? '<i class="fa-solid fa-lock"></i>' : '<i class="fa-solid fa-lock-open"></i>';
    clickLockBtn.title = newState ? "Unlock local click count" : "Lock local click count across reloads";

    // Manage session state persistence on toggle
    if (!newState) {
      localStorage.removeItem("localSessionClicks");
    } else {
      localStorage.setItem("localSessionClicks", clickCountDisplay.textContent);
    }

    // Animation for lock
    clickLockBtn.style.transform = "scale(0.8)";
    setTimeout(() => clickLockBtn.style.transform = "scale(1)", 150);
  });
}

// Click Counter Interaction + Frontend Debounce
let clickCooldown = false;

clickButton.addEventListener("click", async () => {
  // Basic Anti-Abuse: Prevent rapid spamming (cooldown of 1 second)
  if (clickCooldown) return;

  clickCooldown = true;
  clickButton.style.opacity = "0.7";
  clickButton.style.cursor = "not-allowed";

  setTimeout(() => {
    clickCooldown = false;
    clickButton.style.opacity = "1";
    clickButton.style.cursor = "pointer";
  }, 300); // 300ms cooldown

  // Animation
  clickButton.style.transform = "scale(0.95)";
  setTimeout(() => {
    clickButton.style.transform = "scale(1)";
  }, 100);

  // Optimistic UI Update (local session tracking)
  let currentCount = parseInt(clickCountDisplay.textContent) || 0;
  let newCount = currentCount + 1;
  clickCountDisplay.textContent = newCount;

  // Update persistence if locked
  if (localStorage.getItem("clicksLocked") === "true") {
    localStorage.setItem("localSessionClicks", newCount);
  }

  // Implicitly update backend (Global counter) without tying UI to it
  try {
    await fetch(`${API_BASE}/clicks`, {
      method: "POST"
    });
    // We intentionally ignore the returned global count response here 
    // to maintain the requested frontend local session behavior
  } catch (error) {
    console.error("Error pushing click to DB:", error);
  }
});



// Active Navigation Link Highlighting
const sections = document.querySelectorAll(".section")
const navLinks = document.querySelectorAll(".nav-links a")

window.addEventListener("scroll", () => {
  let current = ""
  const navHeight = document.getElementById("navbar").offsetHeight

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - navHeight - 100
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.style.color = ""
    if (link.getAttribute("href") === `#${current}`) {
      link.style.color = "var(--accent)"
    }
  })
})

/* Projects carousel controls and See-more toggles (safe init) */
document.addEventListener('DOMContentLoaded', () => {

  /* Projects carousel controls and See-more toggles (safe init) */
  const carousel = document.querySelector('.projects-carousel')
  const prevBtn = document.querySelector('.carousel-nav.prev')
  const nextBtn = document.querySelector('.carousel-nav.next')

  // Initialize view and click counters
  initializeCounters();

  if (!carousel) return

  const scrollAmount = () => Math.round(carousel.clientWidth * 0.8)

  prevBtn && prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' })
  })

  nextBtn && nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' })
  })

  // Keyboard support when carousel is focused
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn && nextBtn.click()
    if (e.key === 'ArrowLeft') prevBtn && prevBtn.click()
  })

  // See-more toggles
  carousel.querySelectorAll('.see-more').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.project-card')
      if (!card) return
      const more = card.querySelector('.project-more')
      const isHidden = more ? more.hasAttribute('hidden') : true

      if (!more) return

      if (!isHidden) {
        more.setAttribute('hidden', '')
        card.classList.remove('expanded')
        e.currentTarget.setAttribute('aria-expanded', 'false')
        e.currentTarget.textContent = 'See more'
      } else {
        more.removeAttribute('hidden')
        card.classList.add('expanded')
        e.currentTarget.setAttribute('aria-expanded', 'true')
        e.currentTarget.textContent = 'Show less'
        // ensure card is visible after expand
        card.scrollIntoView({ behavior: 'smooth', inline: 'center' })
      }
    })
  })
})
