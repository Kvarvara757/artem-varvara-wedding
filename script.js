document.addEventListener("DOMContentLoaded", () => {

  const c = window.WEDDING || {};

  /* =========================
     ОСНОВНАЯ ИНФОРМАЦИЯ
  ========================= */

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el && value !== undefined) el.textContent = value;
  };

  setText("#groomName", c.groom);
  setText("#brideName", c.bride);
  setText("#heroDate", c.dateLong);
  setText("#welcomeTitle", c.welcomeTitle);
  setText("#welcomeText", c.welcomeText);
  setText("#placeName", c.placeName);
  setText("#placeAddress", c.placeAddress);
  setText("#dressText", c.dressText);

  /* =========================
     КОНВЕРТ
  ========================= */

  const envelopeScreen = document.querySelector("#envelopeScreen");
  const envelope = document.querySelector("#envelope");
  const openEnvelope = document.querySelector("#openEnvelope");

  if (envelopeScreen && envelope && openEnvelope) {

    document.body.style.overflow = "hidden";

    openEnvelope.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      envelope.classList.add("open");

      setTimeout(() => {
        envelopeScreen.classList.add("hidden");
        document.body.style.overflow = "";
      }, 1200);
    });
  }

  /* =========================
     КАЛЕНДАРЬ
  ========================= */

  const calendar = document.querySelector("#calendar");

  if (calendar && c.dateISO) {

    const weddingDate = new Date(c.dateISO);

    const year = weddingDate.getFullYear();
    const month = weddingDate.getMonth();
    const weddingDay = weddingDate.getDate();

    const monthNames = [
      "Январь", "Февраль", "Март", "Апрель",
      "Май", "Июнь", "Июль", "Август",
      "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    let html = `
      <div class="calendar-month">
        ${monthNames[month]} ${year}
      </div>

      <div class="calendar-week">
        ${weekDays.map(day => `<div>${day}</div>`).join("")}
      </div>

      <div class="calendar-days">
    `;

    let firstDay = new Date(year, month, 1).getDay();

    // Делаем понедельник первым днём недели
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="empty"></div>`;
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {

      if (day === weddingDay) {
        html += `
          <div class="wedding-day">
            <span class="calendar-heart">
              <b>${day}</b>
              <i>♥</i>
            </span>
          </div>
        `;
      } else {
        html += `<div>${day}</div>`;
      }
    }

    html += `</div>`;

    calendar.innerHTML = html;
  }

  /* =========================
     РАСПИСАНИЕ
  ========================= */

  const timeline = document.querySelector("#timeline");

  if (timeline && Array.isArray(c.timeline)) {

    timeline.innerHTML = `
      <div class="timeline-line">
        <div class="timeline-heart">♥</div>
      </div>

      <div class="timeline-items">
        ${c.timeline.map(item => `
          <div class="timeline-item">
            <div class="timeline-time">${item[0]}</div>

            <div class="timeline-dot">♥</div>

            <div class="timeline-content">
              <h3>${item[1]}</h3>
              <p>${item[2]}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  /* =========================
     ССЫЛКА НА КАРТУ
  ========================= */

  const mapLink = document.querySelector("#mapLink");

  if (mapLink && c.mapUrl) {
    mapLink.href = c.mapUrl;
    mapLink.target = "_blank";
    mapLink.rel = "noopener noreferrer";
  }

  /* =========================
     ОБРАТНЫЙ ОТСЧЁТ
  ========================= */

  const countdown = document.querySelector("#countdown");

  const countDays = document.querySelector("#countDays");
  const countHours = document.querySelector("#countHours");
  const countMinutes = document.querySelector("#countMinutes");
  const countSeconds = document.querySelector("#countSeconds");

  function updateCountdown() {

    if (!c.dateISO) return;

    const target = new Date(c.dateISO).getTime();
    const now = Date.now();

    let difference = target - now;

    if (difference <= 0) {
      difference = 0;
    }

    const days = Math.floor(difference / 86400000);

    const hours = Math.floor(
      (difference % 86400000) / 3600000
    );

    const minutes = Math.floor(
      (difference % 3600000) / 60000
    );

    const seconds = Math.floor(
      (difference % 60000) / 1000
    );

    if (countDays) countDays.textContent = days;
    if (countHours) countHours.textContent = String(hours).padStart(2, "0");
    if (countMinutes) countMinutes.textContent = String(minutes).padStart(2, "0");
    if (countSeconds) countSeconds.textContent = String(seconds).padStart(2, "0");
  }

  if (countdown) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* =========================
     RSVP
  ========================= */

  const form = document.querySelector("#rsvp");

  if (form) {

    form.addEventListener("submit", function (event) {

      event.preventDefault();

      const formData = new FormData(form);

      const name = formData.get("name") || "";
      const attendance = formData.get("attendance") || "";
      const guests = formData.get("guests") || "";
      const food = formData.get("food") || "";
      const comment = formData.get("comment") || "";

      if (!c.rsvpEmail) {
        alert("Анкета заполнена ❤️");
        return;
      }

      const subject = encodeURIComponent(
        `Свадьба Артём & Варвара — ${name}`
      );

      const body = encodeURIComponent(
`Имя: ${name}

Присутствие: ${attendance}

Количество гостей: ${guests}

Питание: ${food}

Комментарий:
${comment}`
      );

      window.location.href =
        `mailto:${c.rsvpEmail}?subject=${subject}&body=${body}`;
    });
  }

  /* =========================
     АНИМАЦИИ ПОЯВЛЕНИЯ
  ========================= */

  const animatedElements = document.querySelectorAll(
    ".reveal, .section, .timeline-item, .dress-card, .rsvp-card"
  );

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }

        });

      },
      {
        threshold: 0.12
      }
    );

    animatedElements.forEach(el => observer.observe(el));
  } else {

    animatedElements.forEach(el => {
      el.classList.add("visible");
    });

  }

  /* =========================
     ПЛАВНАЯ ПРОКРУТКА
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

      const id = this.getAttribute("href");

      if (!id || id === "#") return;

      const target = document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

  /* =========================
     СЕРДЕЧКИ ПРИ КЛИКЕ
  ========================= */

  document.addEventListener("click", function (event) {

    if (
      event.target.closest("#openEnvelope") ||
      event.target.closest("button") ||
      event.target.closest("input") ||
      event.target.closest("textarea") ||
      event.target.closest("select")
    ) {
      return;
    }

    const heart = document.createElement("span");

    heart.className = "click-heart";
    heart.textContent = "♥";

    heart.style.left = `${event.clientX}px`;
    heart.style.top = `${event.clientY}px`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 1200);

  });

  /* =========================
     СЕРДЕЧКО НА ЛИНИИ РАСПИСАНИЯ
  ========================= */

  const timelineSection = document.querySelector(".timeline");
  const timelineHeart = document.querySelector(".timeline-heart");

  function moveTimelineHeart() {

    if (!timelineSection || !timelineHeart) return;

    const rect = timelineSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress =
      (windowHeight * 0.7 - rect.top) /
      (rect.height - windowHeight * 0.3);

    const value = Math.max(0, Math.min(1, progress));

    timelineHeart.style.top = `${value * 100}%`;
  }

  window.addEventListener("scroll", moveTimelineHeart);
  window.addEventListener("resize", moveTimelineHeart);

  moveTimelineHeart();

});