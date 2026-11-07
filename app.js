const scene = document.querySelector("#scene");
const sceneWrap = document.querySelector(".scene-wrap");
const pages = [...document.querySelectorAll("[data-page]")];
const modalLayer = document.querySelector("#modal-layer");
const popupCard = document.querySelector("#popup-card");
const popupContent = document.querySelector("#popup-content");
let lastFocusedElement = null;

const popups = {
  intro: {
    className: "popup-intro",
    title: "About this digital journal",
    width: 975,
    height: 1584,
    position: { left: 557, top: 746 },
    copy:
      "This digital web-twin explores my personal archive of handwritten notes, charms, and other trinkets beyond institutional walls. It stands on the belief that personal history is never just individual, rather a part of our shared human archive. By elevating intimate, everyday memories that official repositories often overlook, this project invites you to explore how private stories become collective heritage.",
  },
  bird: {
    className: "popup-bird",
    title: "Little Bird Charm details",
    position: { left: 260, top: 556 },
    image: "photographs/design/bird-charm-popup.png",
    copy:
      "<p>Name: Little Bird Charm</p><p></p><p>Material: Handmade Glass</p><p></p><p>Year: 2024</p><p></p><p>Creator: (name unknown) an artist in Nazarköy, Izmir</p><p></p><p>Acquired in Izmir, Turkey</p>",
    link: "glass-history",
  },
  eye: {
    className: "popup-eye",
    title: "Evil Eye Charm details",
    position: { left: 2808, top: 556 },
    image: "photographs/design/evil-eye-popup.png",
    copy:
      "<p>Name: Evil Eye Charm</p><p></p><p>Material: handmade glass</p><p></p><p>Year: 2021</p><p></p><p>Creator: (name unknown) an artist in Nazarköy, Izmir</p><p></p><p>Acquired in Izmir, Turkey</p>",
    link: "evil-history",
  },
  sticker: {
    className: "popup-sticker",
    title: "I saw you called? sticker",
    position: { left: 905, top: 266 },
    image: "photographs/design/sticker-popup.png",
    copy:
      '<p>Name: “i saw you called?” sticker w/a qr code to an interactive game on the back</p><p></p><p>Material: laminated sticker paper</p><p></p><p>Year: 2026</p><p></p><p>Creator: <a href="https://www.hebbel-am-ufer.de/en/about-us/profile/" target="_blank" rel="noreferrer">HAU</a>, a digital arts organization in Berlin</p><p></p><p>Acquired in Berlin, Germany</p>',
  },
  commonplace: {
    className: "popup-commonplace",
    title: "Commonplace notebook",
    position: { left: 883, top: 276 },
    image: "photographs/design/commonplace-popup.png",
    heading: "Name: Commonplace notebook",
    copy:
      "<p></p><p></p><p>Material: paper bounded by thread</p><p></p><p>Year: 2026</p><p></p><p>Creator: Moleskin US</p><p></p><p>Acquired in Rhode Island, US</p>",
    link: "commonplacing",
  },
  diary: {
    className: "popup-diary",
    title: "Memory Keeping notebook",
    position: { left: 985, top: 210 },
    image: "photographs/design/diary-popup.png",
    copy:
      "<p>Name: Memory Keeping notebook</p><p></p><p>Material: paper bounded by thread</p><p></p><p>Year: 205</p><p>Creator: Moleskin US</p><p></p><p>Acquired in Izmir, Turkey</p>",
  },
};

function updateScale() {
  const scale = sceneWrap.clientWidth / 4246;
  scene.style.setProperty("--scene-scale", scale);

  const width = Number(popupCard.dataset.width || 1203);
  const height = Number(popupCard.dataset.height || 2006);
  const popupScale = scale;
  modalLayer.style.setProperty("--popup-width", `${width}px`);
  modalLayer.style.setProperty("--popup-height", `${height}px`);
  modalLayer.style.setProperty("--popup-scale", popupScale);
  modalLayer.style.setProperty(
    "--popup-left",
    `${Number(popupCard.dataset.left || 0) * scale}px`,
  );
  modalLayer.style.setProperty(
    "--popup-top",
    `${Number(popupCard.dataset.top || 0) * scale}px`,
  );
}

function showPage(name) {
  pages.forEach((page) => {
    const active = page.dataset.page === name;
    page.classList.toggle("is-active", active);
    page.setAttribute("aria-hidden", String(!active));
  });
  document.title =
    name === "cover" ? "Welcome to my journal" : "My journal";
}

function closePopup() {
  if (modalLayer.hidden) return;
  modalLayer.hidden = true;
  popupContent.replaceChildren();
  popupCard.className = "popup-card";
  popupCard.dataset.width = "";
  popupCard.dataset.height = "";
  popupCard.dataset.left = "";
  popupCard.dataset.top = "";

  const focusTarget = lastFocusedElement;
  lastFocusedElement = null;
  if (focusTarget instanceof HTMLElement && focusTarget.isConnected) {
    focusTarget.focus({ preventScroll: true });
  }
}

function openPopup(name) {
  const popup = popups[name];
  if (!popup) return;

  if (!modalLayer.hidden) closePopup();
  lastFocusedElement = document.activeElement;
  popupCard.classList.add(popup.className);
  popupCard.dataset.width = String(popup.width || 1203);
  popupCard.dataset.height = String(popup.height || 2006);
  popupCard.dataset.left = String(
    popup.position?.left ?? (4246 - (popup.width || 1203)) / 2,
  );
  popupCard.dataset.top = String(
    popup.position?.top ?? (2858 - (popup.height || 2006)) / 2,
  );

  const title = document.createElement("h2");
  title.className = "popup-title";
  title.id = "popup-title";
  title.textContent = popup.title;
  popupContent.append(title);

  if (popup.heading) {
    const heading = document.createElement("p");
    heading.className = "popup-visible-heading";
    heading.textContent = popup.heading;
    popupContent.append(heading);
  }

  if (popup.image) {
    const frame = document.createElement("div");
    frame.className = "popup-art";
    const image = document.createElement("img");
    image.src = popup.image;
    image.alt = "";
    if (["eye", "commonplace", "diary"].includes(name)) {
      const innerFrame = document.createElement("div");
      innerFrame.className = "popup-art-inner";
      innerFrame.append(image);
      frame.append(innerFrame);
    } else {
      frame.append(image);
    }
    popupContent.append(frame);
  }

  const copy = document.createElement("div");
  copy.className = "popup-copy";
  copy.innerHTML = popup.copy;
  popupContent.append(copy);

  if (popup.link) {
    const link = document.createElement("a");
    link.className = "popup-link";
    link.href = "#";
    link.textContent = "learn more";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      closePopup();
      showPage(popup.link);
    });
    popupContent.append(link);
  }

  modalLayer.hidden = false;
  updateScale();
  popupCard.focus({ preventScroll: true });
}

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const target = event.target.closest(
    "[data-go], [data-open], [data-close-modal]",
  );
  if (!target) return;

  if (target.dataset.go) showPage(target.dataset.go);
  if (target.dataset.open) openPopup(target.dataset.open);
  if (target.hasAttribute("data-close-modal")) closePopup();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePopup();
});

window.addEventListener("resize", updateScale);
updateScale();
showPage("cover");
