// Debounce function to optimize scroll performance
const debounce = (func, wait = 20, immediate = true) => {
  let timeout;
  return function () {
    const context = this, args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

// Scroll event listener to highlight the current section in the navigation
window.addEventListener("scroll", debounce(() => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-item");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 60) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}));

// Function to dynamically load HTML content into sections
const includeHTML = async () => {
  const sections = [
    { id: "hero-section", path: "html/hero.html" },
    { id: "services-section", path: "html/services.html" },
    { id: "about-section", path: "html/about.html" },
    { id: "team-section", path: "html/team.html" },
    { id: "tech-stack-section", path: "html/tech-stack.html" },
  ];

  try {
    await Promise.all(
      sections.map(async (section) => {
        const response = await fetch(section.path);
        const data = await response.text();
        document.getElementById(section.id).innerHTML = data;
        console.log(`${section.id} loaded`);
      })
    );
  } catch (err) {
    console.error("Error loading sections: ", err);
  }
};

// Modal handling functions
const openModal = (modal) => {
  modal.style.display = "block";
};

const closeModal = (modal) => {
  modal.style.display = "none";
};

// Event listener for modal interactions
const initModal = () => {
  const modal = document.getElementById("contactModal");
  const btn = document.getElementById("contact");
  const span = document.getElementsByClassName("close")[0];

  btn.addEventListener("click", () => openModal(modal));
  span.addEventListener("click", () => closeModal(modal));
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
};

// Intersection Observer to apply animations when sections are visible
const observeSections = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fadeInVisible");
      }
    });
  }, { threshold: 0.1 });

  const sectionsToObserve = document.querySelectorAll(".services-section, .about-section, .team-section");
  sectionsToObserve.forEach((section) => observer.observe(section));
};

// Form submission handler for the contact form
const initContactForm = () => {
  document.getElementById("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const mailtoLink = `mailto:ratkostip@gmail.com?subject=Message from ${name}&body=${encodeURIComponent(message)}\n\nReply to: ${email}`;
    window.location.href = mailtoLink;
  });
};

// Initialize the page when content is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML();
  initModal();
  observeSections();
  initContactForm();
});
