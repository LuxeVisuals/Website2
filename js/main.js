(function () {
  "use strict";
  var cfg = window.CROSSROAD_CONFIG || {};
  var isPlaceholder = !cfg.phoneIntl || cfg.phoneIntl === "27000000000";
  var greeting = "Hi CrossRoad Driving School, I'd like to find out about lessons.";

  /* Mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
  }

  /* Contact details from config.js */
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.href = "tel:+" + cfg.phoneIntl; });
  document.querySelectorAll("[data-phone-text]").forEach(function (el) { el.textContent = cfg.phoneDisplay; });
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.href = "https://wa.me/" + cfg.phoneIntl + "?text=" + encodeURIComponent(greeting);
    el.target = "_blank"; el.rel = "noopener";
  });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.href = "mailto:" + cfg.email; });
  document.querySelectorAll("[data-email-text]").forEach(function (el) { el.textContent = cfg.email; });

  /* Enquiry form: opens WhatsApp or email with the message filled in */
  var form = document.getElementById("enquiry");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var channel = (e.submitter && e.submitter.getAttribute("data-channel")) || "whatsapp";
      var d = new FormData(form);
      var lines = [
        "Hi CrossRoad Driving School,",
        "My name is " + d.get("name") + ".",
        "I live in: " + d.get("area") + ".",
        "I'm interested in: " + d.get("package") + ".",
        d.get("message") ? "Message: " + d.get("message") : "",
        "Please contact me on " + d.get("phone") + "."
      ].filter(Boolean).join("\n");

      if (isPlaceholder) {
        status.style.color = "#B3261E";
        status.textContent = "Contact details are not set up yet. Add them in js/config.js.";
        return;
      }
      status.style.color = "#146C2E";
      if (channel === "email") {
        status.textContent = "Opening your email app\u2026";
        window.location.href = "mailto:" + cfg.email + "?subject=" +
          encodeURIComponent("Driving lessons enquiry") + "&body=" + encodeURIComponent(lines);
      } else {
        status.textContent = "Opening WhatsApp with your message ready to send\u2026";
        window.open("https://wa.me/" + cfg.phoneIntl + "?text=" + encodeURIComponent(lines), "_blank", "noopener");
      }
    });
  }
})();
