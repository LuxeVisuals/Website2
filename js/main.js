(function () {
  "use strict";
  var cfg = window.CROSSROAD_CONFIG || {};
  var isPlaceholderPhone = !cfg.phoneIntl || cfg.phoneIntl === "27000000000";
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

      var firstName = (d.get("firstName") || d.get("name") || "").toString().trim();
      var surname = (d.get("surname") || "").toString().trim();
      var fullName = (firstName + " " + surname).trim() || "Prospective Student";
      var phone = (d.get("phone") || "").toString().trim();
      var area = (d.get("area") || "").toString().trim();
      var pkg = (d.get("package") || "").toString().trim();
      var msg = (d.get("message") || "").toString().trim();

      if (channel === "email") {
        var emailLines = [
          "Good day CrossRoad Driving School,",
          "",
          "I would like to enquire about your driving school services. Here are my details:",
          "",
          "• Full Name: " + fullName,
          "• Phone Number: " + phone,
          "• Location / Area: " + area,
          "• Service / Package Requested: " + pkg,
          msg ? "• Additional Notes / Message: " + msg : "",
          "",
          "Please contact me with a quote and further information.",
          "",
          "Kind regards,",
          fullName
        ].filter(function (line) { return line !== undefined && line !== null; }).join("\r\n");

        var subject = "Driving School Enquiry: " + pkg + " - " + fullName;
        status.style.color = "#146C2E";
        status.textContent = "Opening your email app with your details pre-filled\u2026";
        window.location.href = "mailto:" + (cfg.email || "CrossRoadDriving@gmail.com") +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(emailLines);
      } else {
        if (isPlaceholderPhone) {
          status.style.color = "#B3261E";
          status.textContent = "Phone number is being updated. Please use 'Send by email' or email CrossRoadDriving@gmail.com directly.";
          return;
        }
        var waLines = [
          "Hi CrossRoad Driving School,",
          "My name is " + fullName + ".",
          "I live in: " + area + ".",
          "I'm interested in: " + pkg + ".",
          msg ? "Message: " + msg : "",
          "Please contact me on " + phone + "."
        ].filter(Boolean).join("\n");

        status.style.color = "#146C2E";
        status.textContent = "Opening WhatsApp with your message ready to send\u2026";
        window.open("https://wa.me/" + cfg.phoneIntl + "?text=" + encodeURIComponent(waLines), "_blank", "noopener");
      }
    });
  }

  /* Sign click animation */
  document.querySelectorAll('.sign').forEach(function(sign){
    sign.addEventListener('click', function(){
      sign.classList.add('clicked');
      setTimeout(function(){ sign.classList.remove('clicked'); }, 300);
    });
  });
})();
