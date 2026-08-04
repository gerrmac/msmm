/* =========================================================
   MSMM — interactions
   ========================================================= */
(function () {
  "use strict";

  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const navLinks = Array.from(document.querySelectorAll(".nav__link"));

  /* ---------- sticky header shadow ---------- */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const closeMenu = () => {
    nav.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const toggleMenu = () => {
    const open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  burger.addEventListener("click", toggleMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- active nav link on scroll ---------- */
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === id)
            );
          }
        });
      },
      { threshold: 0.4, rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- contact form ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.className = "form__status";
      status.textContent = "";

      let valid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        const field = input.closest(".field");
        const ok = input.value.trim().length > 0;
        field.classList.toggle("is-invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        status.classList.add("is-err");
        status.textContent = "Пожалуйста, заполните обязательные поля.";
        return;
      }

      // Здесь можно отправить данные на сервер (fetch / Formspree / Telegram bot).
      status.classList.add("is-ok");
      status.textContent = "Спасибо! Заявка отправлена — скоро свяжусь с вами.";
      form.reset();
    });

    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => {
        input.closest(".field").classList.remove("is-invalid");
      });
    });
  }

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- copywriting modal ---------- */
  const copyModal = document.getElementById("copyModal");
  const openCopyBtn = document.getElementById("openCopyModal");
  const closeCopyBtn = document.getElementById("closeCopyModal");

  const openModal = () => {
    copyModal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    copyModal.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  if (openCopyBtn) openCopyBtn.addEventListener("click", openModal);
  if (closeCopyBtn) closeCopyBtn.addEventListener("click", closeModal);

  // Close modal on overlay click
  if (copyModal) {
    copyModal.addEventListener("click", (e) => {
      if (e.target === copyModal) closeModal();
    });
  }

  // Close modal on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && copyModal && copyModal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();
