const seeds = {
  attention: {
    title: "Attention",
    body:
      "Attention is the quiet agreement that something is worth being with before it is worth solving. It turns an ordinary question into a door.",
    prompt: "Ask: what am I noticing that I usually rush past?"
  },
  practice: {
    title: "Practice",
    body:
      "Practice is how wonder becomes a tool you can actually hold. Not all at once. Just a little more precisely each time.",
    prompt: "Ask: what would improve if I repeated it kindly?"
  },
  doubt: {
    title: "Doubt",
    body:
      "Doubt does not have to be a wall. Sometimes it is a lantern, showing where the floor is uneven and where care should go next.",
    prompt: "Ask: what evidence would make this clearer?"
  },
  memory: {
    title: "Memory",
    body:
      "The best conversations leave behind more than answers. They leave better instincts, better language, and a small appetite for the next attempt.",
    prompt: "Ask: what did this teach me to see?"
  },
  play: {
    title: "Play",
    body:
      "Play keeps the mind flexible. It gives serious work a second entrance, and sometimes that entrance is the one that opens.",
    prompt: "Ask: what happens if this is allowed to be interesting?"
  },
  tomorrow: {
    title: "Tomorrow",
    body:
      "Tomorrow is not abstract. It is the place where a useful question becomes a choice, a note, a repair, a sketch, a call, a beginning.",
    prompt: "Ask: what is the smallest next honest move?"
  }
};

const dialog = document.querySelector("[data-dialog]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogBody = document.querySelector("[data-dialog-body]");
const dialogPrompt = document.querySelector("[data-dialog-prompt]");
const dialogKicker = document.querySelector("[data-dialog-kicker]");
const seedButtons = [...document.querySelectorAll("[data-seed]")];
const randomButton = document.querySelector("[data-random-seed]");
const closeButton = document.querySelector("[data-close]");
const motionButton = document.querySelector("[data-toggle-sound]");
const wonder = document.querySelector("[data-wonder]");
const wonderOutput = document.querySelector("[data-wonder-output]");
const lanternForm = document.querySelector("[data-lantern-form]");
const lanternInput = document.querySelector("[data-lantern-input]");
const lanternCount = document.querySelector("[data-lantern-count]");
const lanterns = document.querySelector("[data-lanterns]");
const lanternStorageKey = "garden-of-questions-lanterns";
let sessionLanterns = [];

function openSeed(key) {
  const seed = seeds[key];
  if (!seed) return;

  dialogKicker.textContent = "seed";
  dialogTitle.textContent = seed.title;
  dialogBody.textContent = seed.body;
  dialogPrompt.textContent = seed.prompt;
  dialog.showModal();
}

seedButtons.forEach((button) => {
  button.addEventListener("click", () => openSeed(button.dataset.seed));
});

randomButton.addEventListener("click", () => {
  const keys = Object.keys(seeds);
  openSeed(keys[Math.floor(Math.random() * keys.length)]);
});

closeButton.addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  const box = dialog.getBoundingClientRect();
  const clickedBackdrop =
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom;

  if (clickedBackdrop) dialog.close();
});

motionButton.addEventListener("click", () => {
  document.body.classList.toggle("is-still");
  const isStill = document.body.classList.contains("is-still");
  motionButton.setAttribute("aria-pressed", String(isStill));
});

function describeWonder(value) {
  if (value < 24) return "Quiet enough to hear the first true sentence.";
  if (value < 50) return "Patient, observant, ready to sort the pieces.";
  if (value < 78) return "Curious, steady, awake.";
  return "Bright with possibility, but still holding the thread.";
}

wonder.addEventListener("input", () => {
  wonderOutput.textContent = describeWonder(Number(wonder.value));
});

function readLanterns() {
  try {
    if (typeof localStorage === "undefined") return sessionLanterns;
    return JSON.parse(localStorage.getItem(lanternStorageKey)) || [];
  } catch {
    return sessionLanterns;
  }
}

function saveLanterns(items) {
  sessionLanterns = items.slice(0, 8);

  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(lanternStorageKey, JSON.stringify(sessionLanterns));
    }
  } catch {
    // Some privacy modes disable localStorage; the wall still works for this visit.
  }
}

function createLantern(question, isNew = false) {
  const lantern = document.createElement("article");
  lantern.className = isNew ? "lantern is-new" : "lantern";

  const glow = document.createElement("span");
  glow.className = "lantern__glow";
  glow.setAttribute("aria-hidden", "true");

  const text = document.createElement("p");
  text.textContent = question;

  lantern.append(glow, text);
  return lantern;
}

function renderSavedLanterns() {
  readLanterns().forEach((question) => {
    lanterns.append(createLantern(question));
  });
}

function updateLanternCount() {
  lanternCount.textContent = `${lanternInput.value.length} / ${lanternInput.maxLength}`;
}

lanternInput.addEventListener("input", updateLanternCount);

lanternForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const question = lanternInput.value.trim().replace(/\s+/g, " ");
  if (!question) {
    lanternInput.focus();
    return;
  }

  const saved = [question, ...readLanterns()].slice(0, 8);
  saveLanterns(saved);
  lanterns.prepend(createLantern(question, true));
  lanternInput.value = "";
  updateLanternCount();
});

renderSavedLanterns();
