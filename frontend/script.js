// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle")
const themeIcon = document.querySelector(".theme-icon")
const html = document.documentElement
const API_BASE = "https://fjwy1ub4ge.execute-api.us-east-1.amazonaws.com";

// Load saved theme from localStorage
const savedTheme = localStorage.getItem("theme") || "light"
html.setAttribute("data-theme", savedTheme)
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

// Initialize both counters on page load
async function initializeCounters() {
  // 1. Optimistic loading from cache to prevent jarring "0" flashes
  const cachedViews = localStorage.getItem("viewCount");
  const cachedClicks = localStorage.getItem("clickCount");

  if (cachedViews) viewCountDisplay.textContent = cachedViews;
  else viewCountDisplay.innerHTML = '<span class="loading-dots" style="opacity: 0.5;">...</span>';

  if (cachedClicks) clickCountDisplay.textContent = cachedClicks;
  else clickCountDisplay.innerHTML = '<span class="loading-dots" style="opacity: 0.5;">...</span>';

  try {
    // 2. Fetch parallel to save time. Using Promise.allSettled so if one fails, the other can still succeed
    const [viewsResponse, clicksResponse] = await Promise.allSettled([
      fetch(`${API_BASE}/views`, { method: "POST" }),
      fetch(`${API_BASE}/clicks`, { method: "GET" })
    ]);

    // 3. Update Views
    if (viewsResponse.status === "fulfilled" && viewsResponse.value.ok) {
      const viewsData = await viewsResponse.value.json();
      viewCountDisplay.textContent = viewsData.count;
      localStorage.setItem("viewCount", viewsData.count);
    } else {
      console.error("Failed to load view count");
    }

    // 4. Update Clicks
    if (clicksResponse.status === "fulfilled" && clicksResponse.value.ok) {
      const clicksData = await clicksResponse.value.json();
      clickCountDisplay.textContent = clicksData.count;
      localStorage.setItem("clickCount", clicksData.count);
    } else {
      console.error("Failed to load click count");
    }
  } catch (error) {
    console.error("Error loading counters:", error);
  }
}

// Click Counter Interaction
clickButton.addEventListener("click", async () => {
  // Animation
  clickButton.style.transform = "scale(0.95)";
  setTimeout(() => {
    clickButton.style.transform = "scale(1)";
  }, 100);

  // Optimistic UI Update (instant feedback)
  let currentCount = parseInt(clickCountDisplay.textContent) || 0;
  clickCountDisplay.textContent = currentCount + 1;

  try {
    const response = await fetch(`${API_BASE}/clicks`, {
      method: "POST"
    });

    if (!response.ok) throw new Error("Backend error - status " + response.status);

    const data = await response.json();
    // Update with authoritative value from server
    clickCountDisplay.textContent = data.count;
    localStorage.setItem("clickCount", data.count);

  } catch (error) {
    console.error("Error updating clicks:", error);
    // Revert count if failed so UI remains accurate
    clickCountDisplay.textContent = currentCount;
    console.warn("Could not register click. The backend might be experiencing issues with DynamoDB Updates.");
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
