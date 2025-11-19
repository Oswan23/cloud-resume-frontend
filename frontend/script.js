// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle")
const themeIcon = document.querySelector(".theme-icon")
const html = document.documentElement

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

// Load saved click count from localStorage
const savedClickCount = localStorage.getItem("clickCount")
if (savedClickCount) {
  clickCount = Number.parseInt(savedClickCount, 10)
  clickCountDisplay.textContent = clickCount
}

clickButton.addEventListener("click", () => {
  clickCount++
  clickCountDisplay.textContent = clickCount
  localStorage.setItem("clickCount", clickCount)

  // Add animation effect
  clickButton.style.transform = "scale(0.95)"
  setTimeout(() => {
    clickButton.style.transform = "scale(1)"
  }, 100)

  // TODO: Send click count to AWS Lambda + DynamoDB
  // Example: fetch('YOUR_API_GATEWAY_ENDPOINT', { method: 'POST', body: JSON.stringify({ clicks: clickCount }) });
})

// View Counter Placeholder
const viewCountDisplay = document.getElementById("view-count")

// Initialize view counter
function initializeViewCounter() {
  // TODO: Fetch view count from AWS API Gateway
  // Example: fetch('YOUR_API_GATEWAY_ENDPOINT')
  //     .then(response => response.json())
  //     .then(data => {
  //         viewCountDisplay.textContent = data.views;
  //     });

  // For now, use a placeholder
  viewCountDisplay.textContent = "0"
}

// Increment view counter on page load
function incrementViewCounter() {
  // TODO: Send increment request to AWS Lambda
  // Example: fetch('YOUR_API_GATEWAY_ENDPOINT/increment', { method: 'POST' })
  //     .then(response => response.json())
  //     .then(data => {
  //         viewCountDisplay.textContent = data.views;
  //     });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initializeViewCounter()
  // Uncomment when backend is ready:
  // incrementViewCounter();
})

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
