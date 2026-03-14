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

// Click Counter Functionality
const clickButton = document.getElementById("click-button")
const clickCountDisplay = document.getElementById("click-count")
let clickCount = 0

clickButton.addEventListener("click", async () => {
  try {
    const response = await fetch(`${API_BASE}/clicks`, {
      method: "POST"
    });

    const data = await response.json();
    clickCountDisplay.textContent = data.count;

  } catch (error) {
    console.error("Error updating clicks:", error);
  }

  // animation
  clickButton.style.transform = "scale(0.95)";
  setTimeout(() => {
    clickButton.style.transform = "scale(1)";
  }, 100);
});

// View Counter
const viewCountDisplay = document.getElementById("view-count");

// Increment view counter on page load
async function incrementViewCounter() {
  try {
    const response = await fetch(`${API_BASE}/views`, {
      method: "POST"
    });

    const data = await response.json();
    viewCountDisplay.textContent = data.count;

  } catch (error) {
    console.error("Error updating views:", error);
  }
}


// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  incrementViewCounter();
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
  const carousel = document.querySelector('.projects-carousel')
  const prevBtn = document.querySelector('.carousel-nav.prev')
  const nextBtn = document.querySelector('.carousel-nav.next')
  
  // Increment view counter on page load
  incrementViewCounter();

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
