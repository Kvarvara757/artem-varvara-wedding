document.addEventListener("DOMContentLoaded", () => {

const wedding = typeof WEDDING !== "undefined" ? WEDDING : {};

  /* =====================================================
     ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
  ===================================================== */

  function setText(selector, text) {
    const element = document.querySelector(selector);

    if (element && text !== undefined) {
      element.textContent = text;
    }
  }


  /* =====================================================
     ДАННЫЕ СВАДЬБЫ
  ===================================================== */

  setText(".hero-date", wedding.dateLong);
  setText(".hero-location", "САМАРА");
  setText(".venue-city", wedding.placeAddress);
  setText(".venue-address", wedding.placeAddress);
  setText("#dressText", wedding.dressText);


  /* =====================================================
     КОНВЕРТ
  ===================================================== */

  const intro = document.querySelector("#intro");
  const envelope = document.querySelector("#envelope");
  const seal = document.querySelector("#openEnvelope");

  let envelopeOpened = false;

  if (intro && envelope && seal) {

    document.body.style.overflow = "hidden";

    seal.addEventListener("click", (event) => {

      event.preventDefault();
      event.stopPropagation();

      if (envelopeOpened) return;

      envelopeOpened = true;

      envelope.classList.add("open");

      /*
        Сначала открывается клапан,
        потом карточка выходит наружу,
        потом исчезает весь первый экран.
      */

      setTimeout(() => {
        intro.classList.add("hidden");

        document.body.style.overflow = "";

      }, 1500);

    });
  }


  /* =====================================================
     КАЛЕНДАРЬ — МАЙ 2027
  ===================================================== */

  const calendar = document.querySelector("#calendar");

  if (calendar) {

    const weddingDate = new Date(
      wedding.dateISO || "2027-05-26T12:00:00+04:00"
    );

    const year = weddingDate.getFullYear();
    const month = weddingDate.getMonth();
    const selectedDay = weddingDate.getDate();

    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь"
    ];

    const weekdays = [
      "ПН",
      "ВТ",
      "СР",
      "ЧТ",
      "ПТ",
      "СБ",
      "ВС"
    ];

    let firstDay = new Date(year, month, 1).getDay();

    /*
      JS считает воскресенье первым.
      Нам нужен понедельник.
    */

    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth =
      new Date(year, month + 1, 0).getDate();

    let calendarHTML = `

      <div class="calendar-month">
        ${months[month]}
        <span>${year}</span>
      </div>

      <div class="calendar-week">
        ${weekdays.map(day => `<span>${day}</span>`).join("")}
      </div>

      <div class="calendar-days">
    `;


    for (let i = 0; i < firstDay; i++) {
      calendarHTML += `<span></span>`;
    }


    for (let day = 1; day <= daysInMonth; day++) {

      if (day === selectedDay) {

        calendarHTML += `
          <span class="chosen-day">
            <b>${day}</b>
            <i>♥</i>
          </span>
        `;

      } else {

        calendarHTML += `
          <span>${day}</span>
        `;
      }
    }


    calendarHTML += `
      </div>
    `;

    calendar.innerHTML = calendarHTML;
  }


  /* =====================================================
     РАСПИСАНИЕ
  ===================================================== */

  const timeline = document.querySelector("#timeline");

  if (timeline && Array.isArray(wedding.timeline)) {

    const items = wedding.timeline;

    timeline.innerHTML = `

      <div class="timeline-track">

        <div class="timeline-progress"></div>

        <div class="timeline-heart">
          ♥
        </div>

      </div>

      <div class="timeline-items">

        ${items.map((item, index) => `

          <article class="timeline-item">

            <time>
              ${item[0]}
            </time>

            <div class="timeline-dot">
              ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="timeline-info">

              <h3>
                ${item[1]}
              </h3>

              <p>
                ${item[2]}
              </p>

            </div>

          </article>

        `).join("")}

      </div>
    `;
  }


  /* =====================================================
     КАРТА
  ===================================================== */

  const mapLink = document.querySelector("#mapLink");

  if (mapLink && wedding.mapUrl) {

    mapLink.href = wedding.mapUrl;

    mapLink.target = "_blank";

    mapLink.rel = "noopener noreferrer";
  }


  /* =====================================================
     ОБРАТНЫЙ ОТСЧЁТ
  ===================================================== */

  const daysElement =
    document.querySelector("#countDays");

  const hoursElement =
    document.querySelector("#countHours");

  const minutesElement =
    document.querySelector("#countMinutes");

  const secondsElement =
    document.querySelector("#countSeconds");


  function updateCountdown() {

    const target = new Date(
      wedding.dateISO || "2027-05-26T12:00:00+04:00"
    ).getTime();

    const now = Date.now();

    let difference = target - now;

    if (difference < 0) {
      difference = 0;
    }


    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
      (difference %
        (1000 * 60 * 60 * 24))
      /
      (1000 * 60 * 60)
    );


    const minutes = Math.floor(
      (difference %
        (1000 * 60 * 60))
      /
      (1000 * 60)
    );


    const seconds = Math.floor(
      (difference %
        (1000 * 60))
      /
      1000
    );


    if (daysElement) {
      daysElement.textContent = days;
    }

    if (hoursElement) {
      hoursElement.textContent =
        String(hours).padStart(2, "0");
    }

    if (minutesElement) {
      minutesElement.textContent =
        String(minutes).padStart(2, "0");
    }

    if (secondsElement) {
      secondsElement.textContent =
        String(seconds).padStart(2, "0");
    }
  }


  updateCountdown();

  setInterval(updateCountdown, 1000);


  /* =====================================================
     АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
  ===================================================== */

  const animatedElements =
    document.querySelectorAll(
      ".section-inner > *, .timeline-item, .venue-content, .chat-inner, .countdown-inner, .final-inner"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

              observer.unobserve(entry.target);
            }

          });

        },
        {
          threshold: 0.12
        }
      );


    animatedElements.forEach((element) => {

      observer.observe(element);

    });

  } else {

    animatedElements.forEach((element) => {

      element.classList.add("visible");

    });
  }


  /* =====================================================
     СЕРДЕЧКО-ПОЛЗУНОК НА РАСПИСАНИИ
  ===================================================== */

  const timelineSection =
    document.querySelector(".timeline-section");

  const timelineHeart =
    document.querySelector(".timeline-heart");

  const timelineProgress =
    document.querySelector(".timeline-progress");


  function updateTimeline() {

    if (
      !timelineSection ||
      !timelineHeart ||
      !timelineProgress
    ) {
      return;
    }


    const rect =
      timelineSection.getBoundingClientRect();

    const viewportHeight =
      window.innerHeight;


    /*
      Сердечко начинает движение,
      когда расписание появляется
      примерно в середине экрана.
    */

    const start =
      viewportHeight * 0.72;


    const end =
      viewportHeight * 0.18;


    const total =
      rect.height - start + end;


    let progress =
      (start - rect.top) / total;


    progress =
      Math.max(
        0,
        Math.min(1, progress)
      );


    timelineHeart.style.top =
      `${progress * 100}%`;


    timelineProgress.style.height =
      `${progress * 100}%`;
  }


  window.addEventListener(
    "scroll",
    updateTimeline,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    updateTimeline
  );


  updateTimeline();


  /* =====================================================
     ПЛАВНАЯ ПРОКРУТКА
  ===================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const id =
            link.getAttribute("href");

          if (!id || id === "#") {
            return;
          }


          const target =
            document.querySelector(id);

          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );
    });


  /* =====================================================
     RSVP
  ===================================================== */

  const rsvp =
    document.querySelector("#rsvp");


  if (rsvp) {

    rsvp.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const data =
          new FormData(rsvp);


        const name =
          data.get("name") || "";

        const attendance =
          data.get("attendance") || "";

        const guests =
          data.get("guests") || "";

        const food =
          data.get("food") || "";

        const comment =
          data.get("comment") || "";


        /*
          Пока email не указан,
          показываем красивое сообщение.
        */

        if (!wedding.rsvpEmail) {

          alert(
            "Спасибо, " +
            name +
            "! Ваш ответ принят ❤️"
          );

          rsvp.reset();

          return;
        }


        const subject =
          encodeURIComponent(
            `Свадьба Артём & Варвара — ${name}`
          );


        const body =
          encodeURIComponent(

`Имя: ${name}

Присутствие: ${attendance}

Количество гостей: ${guests}

Питание: ${food}

Комментарий:
${comment}`
          );


        window.location.href =
          `mailto:${wedding.rsvpEmail}?subject=${subject}&body=${body}`;

      }
    );
  }


  /* =====================================================
     ДЕКОРАТИВНЫЕ СЕРДЕЧКИ ПРИ КЛИКЕ
  ===================================================== */

  document.addEventListener(
    "click",
    (event) => {

      if (
        event.target.closest("input") ||
        event.target.closest("textarea") ||
        event.target.closest("select") ||
        event.target.closest("button") ||
        event.target.closest("a")
      ) {
        return;
      }


      const heart =
        document.createElement("span");


      heart.className =
        "click-heart";


      heart.textContent =
        "♥";


      heart.style.left =
        `${event.clientX}px`;


      heart.style.top =
        `${event.clientY}px`;


      document.body.appendChild(
        heart
      );


      setTimeout(() => {

        heart.remove();

      }, 1200);

    }
  );

});