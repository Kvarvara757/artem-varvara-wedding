/* =========================
   ENVELOPE OPENING
========================= */

const envelopeScreen = document.querySelector("#envelopeScreen");
const envelope = document.querySelector("#envelope");
const openEnvelope = document.querySelector("#openEnvelope");

if (envelope && envelopeScreen && openEnvelope) {

  openEnvelope.addEventListener("click", () => {

    envelope.classList.add("open");

    setTimeout(() => {
      envelopeScreen.classList.add("hidden");
      document.body.style.overflow = "";
    }, 1200);

  });

}