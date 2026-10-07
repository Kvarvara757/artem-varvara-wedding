const $ = (selector) => document.querySelector(selector);
const c = WEDDING;

/* =========================
   BASIC CONTENT
========================= */

const setText = (selector, value) => {
  const element = $(selector);
  if (element) element.textContent = value;
};

setText("#groom", c.groom);
setText("#groom2", c.groom);
setText("#bride", c.bride);
setText("#bride2", c.bride);

setText("#dateLong", c.dateLong);
setText("#heroText", c.heroText);
setText("#welcomeTitle", c.welcomeTitle);
setText("#welcomeText", c.welcomeText);

setText(
  "#signature",
  `С любовью, ${c.groom} & ${c.bride}`
);

setText("#placeName", c.placeName);
setText("#placeAddress", c.placeAddress);
setText("#dressText", c.dressText);

const mapLink = $("#mapLink");

if (mapLink) {
  mapLink.href = c.mapUrl;
}

/* =========================
   CALENDAR
========================= */

const weddingDate = new Date(c.dateISO);

const monthName = weddingDate.toLocaleDateString("ru-RU", {
  month: "long",
  year: "numeric"
});

setText(
  "#month",
  monthName.charAt(0).toUpperCase() + monthName.slice(1)
);

const calendar = $("#calendar");

if (calendar) {

  let html = "";

  let firstDay = new Date(
    weddingDate.getFullYear(),
    weddingDate.getMonth(),
    1
  ).getDay();

  firstDay = (firstDay + 6) % 7;

  const weekDays = [
    "ПН",
    "ВТ",
    "СР",
    "ЧТ",
    "ПТ",
    "СБ",
    "ВС"
  ];

  weekDays.forEach(day => {
    html += `<div class="day">${day}</div>`;
  });

  for (let i = 0; i < firstDay; i++) {
    html += `<div></div>`;
  }

  const daysInMonth = new Date(
    weddingDate.getFullYear(),
    weddingDate.getMonth() + 1,
    0
  ).getDate();

  for (let day = 1; day <= daysInMonth; day++) {

    const chosen =
      day === weddingDate.getDate()
        ? "chosen"
        : "";

    html += `
      <div class="${chosen}">
        ${day}
      </div>
    `;
  }

  calendar.innerHTML = html;
}

/* =========================
   TIMELINE
========================= */

const timeline = $("#timeline");

if (timeline) {

  timeline.innerHTML = c.timeline
    .map(event => `
      <div class="event reveal">
        <div class="time">${event[0]}</div>

        <div>
          <h3>${event[1]}</h3>
          <p>${event[2]}</p>
        </div>
      </div>
    `)
    .join("");
}

/* =========================
   NOTES
========================= */

const notes = $("#notes");

if (notes) {

  notes.innerHTML = c.notes
    .map(note => `
      <div class="note reveal">
        <h3>${note[0]}</h3>
        <p>${note[1]}</p>
      </div>
    `)
    .join("");
}

/* =========================
   WISHES
========================= */

const wishes = $("#wishes");

if (wishes) {

  wishes.innerHTML = c.wishes
    .map(wish => `
      <div class="wish reveal">
        <h3>${wish[0]}</h3>
        <p>${wish[1]}</p>
      </div>
    `)
    .join("");
}

/* =========================
   COLOR PALETTE
========================= */

const swatches = $("#swatches");

if (swatches) {

  swatches.innerHTML = c.colors
    .map(color => `
      <span
        style="background:${color}"
        aria-label="Цвет дресс-кода">
      </span>
    `)
    .join("");
}

/* =========================
   COUNTDOWN
========================= */

const countdown = $("#countdown");

function updateCountdown() {

  if (!countdown) return;

  const now = new Date();
  const difference = weddingDate - now;

  if (difference <= 0) {

    countdown.textContent =
      "Этот день уже наступил ♥";

    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    difference / (1000 * 60 * 60)
  ) % 24;

  const minutes = Math.floor(
    difference / (1000 * 60)
  ) % 60;

  const seconds = Math.floor(
    difference / 1000
  ) % 60;

  countdown.innerHTML = `
    <span>${days} дней</span>
    ·
    <span>${String(hours).padStart(2, "0")} часов</span>
    ·
    <span>${String(minutes).padStart(2, "0")} минут</span>
    ·
    <span>${String(seconds).padStart(2, "0")} секунд</span>
  `;
}

updateCountdown();

setInterval(updateCountdown, 1000);

/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
  document.querySelectorAll(
    ".section, .event, .note, .wish, .calendar-card, .place-card"
  );

revealElements.forEach(element => {
  element.style.opacity = "0";
  element.style.transform = "translateY(35px)";
  element.style.transition =
    "opacity 1s ease, transform 1s ease";
});

const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.style.opacity = "1";
          entry.target.style.transform =
            "translateY(0)";

          revealObserver.unobserve(entry.target);
        }

      });

    },
    {
      threshold: 0.12
    }
  );

revealElements.forEach(element => {
  revealObserver.observe(element);
});

/* =========================
   STAGGERED CARD ANIMATION
========================= */

const cards = document.querySelectorAll(
  ".note, .wish, .event"
);

cards.forEach((card, index) => {

  card.style.transitionDelay =
    `${Math.min(index * 0.08, 0.4)}s`;

});

/* =========================
   HERO PARALLAX
========================= */

const hero = document.querySelector(".hero");
const heroContent =
  document.querySelector(".hero-content");

if (hero && heroContent) {

  window.addEventListener(
    "scroll",
    () => {

      const scroll =
        window.scrollY;

      if (scroll < window.innerHeight) {

        heroContent.style.transform =
          `translateY(${scroll * 0.15}px)`;

        heroContent.style.opacity =
          Math.max(
            0,
            1 - scroll / 650
          );
      }

    },
    { passive: true }
  );
}

/* =========================
   SMOOTH ANCHOR LINKS
========================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const target =
          document.querySelector(
            link.getAttribute("href")
          );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });

/* =========================
   RSVP
========================= */

const rsvp = $("#rsvp");

if (rsvp) {

  rsvp.addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const formData =
        new FormData(rsvp);

      const name =
        formData.get("name");

      const attendance =
        formData.get("attendance");

      const adults =
        formData.get("adults");

      const children =
        formData.get("children");

      const wishesText =
        formData.get("wishes") || "-";

      const body = `
Имя: ${name}

Присутствие: ${attendance}

Взрослых: ${adults}

Детей: ${children}

Пожелания:
${wishesText}
      `.trim();

      const hint =
        $("#formHint");

      if (c.rsvpEmail) {

        const subject =
          encodeURIComponent(
            `Ответ на приглашение — ${name}`
          );

        const encodedBody =
          encodeURIComponent(body);

        window.location.href =
          `mailto:${c.rsvpEmail}?subject=${subject}&body=${encodedBody}`;

        if (hint) {
          hint.textContent =
            "Откроется почтовое приложение для отправки ответа.";
        }

      } else {

        if (hint) {

          hint.textContent =
            "Анкета заполнена 💌 Чтобы получать ответы, укажи почту в config.js.";
        }

      }

    }
  );
}

/* =========================
   LITTLE HEART EFFECT
========================= */

document.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest("button");

    if (!button) return;

    const heart =
      document.createElement("span");

    heart.textContent = "♥";

    heart.style.position = "fixed";
    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;
    heart.style.pointerEvents = "none";
    heart.style.fontSize = "18px";
    heart.style.color = "#79655b";
    heart.style.zIndex = "9999";
    heart.style.animation =
      "heartFloat 1.2s ease forwards";

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);

  }
);

/* =========================
   EXTRA ANIMATION
========================= */

const style =
  document.createElement("style");

style.textContent = `
@keyframes heartFloat {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(.5);
  }

  20% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -70px) scale(1.3);
  }
}
`;

document.head.appendChild(style);