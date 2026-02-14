/* script.js — navigation active + formulaire contact (front-end)
   Sans dépendances externes.
*/
(function () {
  "use strict";

  function getCurrentFile() {
    const path = window.location.pathname;
    const file = path.split("/").pop();
    return file && file.length ? file : "index.html";
  }

  function setActiveLinks(currentFile) {
    // Menus header + footer (data-site-nav)
    const navs = document.querySelectorAll("[data-site-nav]");
    navs.forEach((nav) => {
      const links = nav.querySelectorAll("a[href]");
      links.forEach((a) => {
        const href = a.getAttribute("href") || "";
        const isCurrent = href === currentFile;

        if (isCurrent) {
          a.classList.add("is-active");
          a.setAttribute("aria-current", "page");
        } else {
          a.classList.remove("is-active");
          a.removeAttribute("aria-current");
        }
      });
    });
  }

  function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function normalizePhone(value) {
    // Nettoie espaces, points, tirets, parenthèses, etc.
    return (value || "").replace(/[^\d+]/g, "");
  }

  function updateContactValidity(form) {
    // Champs
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const phone = form.querySelector("#phone");
    const service = form.querySelector("#service");
    const message = form.querySelector("#message");
    const consent = form.querySelector("#consent");

    // Règles simples (exemples)
    if (name) {
      const v = (name.value || "").trim();
      name.setCustomValidity(v.length < 2 ? "Merci d’indiquer un nom (au moins 2 caractères)." : "");
    }

    if (email) {
      if (email.validity.valueMissing) {
        email.setCustomValidity("Merci d’indiquer une adresse e‑mail.");
      } else if (email.validity.typeMismatch) {
        email.setCustomValidity("Adresse e‑mail invalide (ex. nom@domaine.fr).");
      } else {
        email.setCustomValidity("");
      }
    }

    if (phone) {
      const raw = normalizePhone(phone.value);
      // Tolère +33XXXXXXXXX ou 0XXXXXXXXX (9 chiffres après +33 / 10 chiffres après 0)
      const ok = /^(\+33[1-9]\d{8}|0[1-9]\d{8})$/.test(raw);

      if (phone.validity.valueMissing) {
        phone.setCustomValidity("Merci d’indiquer un numéro de téléphone.");
      } else if (!ok) {
        phone.setCustomValidity("Numéro invalide. Format attendu : 06 00 00 00 00 ou +33 6 00 00 00 00.");
      } else {
        phone.setCustomValidity("");
      }
    }

    if (service) {
      service.setCustomValidity(service.value ? "" : "Merci de choisir une prestation.");
    }

    if (message) {
      const v = (message.value || "").trim();
      message.setCustomValidity(v.length < 10 ? "Merci de préciser votre demande (au moins 10 caractères)." : "");
    }

    if (consent) {
      consent.setCustomValidity(consent.checked ? "" : "Merci de cocher la case de consentement.");
    }
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const status = document.getElementById("formStatus");
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      form.dataset.submitted = "true";
      updateContactValidity(form);

      // Constraint Validation API : on déclenche l’affichage natif des erreurs
      if (!form.reportValidity()) return;

      // Simulation d’envoi (front-end uniquement).
      if (submitBtn) submitBtn.disabled = true;

      if (status) {
        status.hidden = false;
        status.textContent = "Merci ! Votre demande a été enregistrée (démo). Nous vous recontactons rapidement.";
      }

      form.reset();

      window.setTimeout(() => {
        if (submitBtn) submitBtn.disabled = false;
      }, 700);
    });

    // Au fil de l’eau : mise à jour des messages personnalisés sans afficher d’erreurs trop tôt.
    form.addEventListener("input", () => {
      if (status && !status.hidden) status.hidden = true;
      updateContactValidity(form);

      // Si l’utilisateur a déjà tenté d’envoyer, on peut ré-afficher les erreurs
      if (form.dataset.submitted === "true") form.reportValidity();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setActiveLinks(getCurrentFile());
    initYear();
    initContactForm();
  });
})();
