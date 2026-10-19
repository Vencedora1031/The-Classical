const riddles = [
  {
    clue: "I sparkle on a stair, yet I’m not a star. I’m left behind when a carriage races away. What am I?",
    answer: "glass slipper",
    choices: ["glass slipper", "silver crown", "rose ribbon", "crystal comb"],
  },
  {
    clue: "I count down the night with twelve little chimes. When I arrive, the magic must end. What am I?",
    answer: "midnight",
    choices: ["sunrise", "midnight", "lunchtime", "the weekend"],
  },
  {
    clue: "I start as a garden treasure, then roll away beneath the stars. What am I?",
    answer: "pumpkin carriage",
    choices: ["flying carpet", "pumpkin carriage", "golden coach", "swan boat"],
  },
  {
    clue: "I’m filled with music, twirling skirts, and one unforgettable dance. Where am I?",
    answer: "the ballroom",
    choices: ["the garden", "the library", "the clocktower", "the ballroom"],
  },
];

const elements = {
  clue: document.querySelector("#riddle-text"),
  options: document.querySelector("#answer-options"),
  message: document.querySelector("#game-message"),
  current: document.querySelector("#progress-current"),
  total: document.querySelector("#progress-total"),
  progress: document.querySelector("#progress-fill"),
  counter: document.querySelector("#piece-counter"),
  board: document.querySelector("#puzzle-board"),
  caption: document.querySelector("#puzzle-caption"),
  completion: document.querySelector("#complete-stamp"),
};

let currentRiddle = 0;
let solvedCount = 0;

elements.total.textContent = String(riddles.length).padStart(2, "0");
showRiddle();

const landing = document.querySelector("#landing");
const gameScreen = document.querySelector("#game-screen");
const playButton = document.querySelector("#play-button");
const homeButton = document.querySelector("#home-button");
const musicButton = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const musicStatus = document.querySelector("#music-status");
const endScreen = document.querySelector("#end-screen");
const backStartButton = document.querySelector("#back-start-button");
const rewardNotice = document.querySelector("#reward-notice");
const rewardDismiss = document.querySelector("#reward-dismiss");
const rewardSaveNote = document.querySelector("#reward-save-note");
const walletMessage = document.querySelector("#wallet-message");
const walletDisplays = [
  document.querySelector("#wallet-balance-landing"),
  document.querySelector("#wallet-balance-game"),
  document.querySelector("#wallet-balance-end"),
  document.querySelector("#wallet-balance-reward"),
];
const walletStorageKey = "onceUponARiddle.luvexBucks";
const completionReward = 150;

class FairytaleMusic {
  constructor() {
    this.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = null;
    this.master = null;
    this.enabled = false;
    this.timer = null;
    this.step = 0;
    this.nextNoteTime = 0;
    this.beat = 0.72;
    this.melody = [72, 79, 76, 79, 83, 79, 76, 74, 72, 76, 79, 84, 83, 79, 76, 74];
    this.chords = [
      [48, 55, 60, 64],
      [45, 52, 57, 60],
      [41, 48, 53, 57],
      [43, 50, 55, 59],
    ];
  }

  get supported() {
    return typeof this.AudioContext === "function";
  }

  async setEnabled(enabled) {
    if (enabled && !this.supported) {
      throw new Error("Web Audio is not supported by this browser.");
    }

    if (enabled && this.enabled) {
      return;
    }

    if (!enabled) {
      this.enabled = false;
      window.clearTimeout(this.timer);
      this.timer = null;
      if (this.master && this.context.state === "running") {
        this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.12);
      }
      return;
    }

    if (!this.context) {
      this.context = new this.AudioContext();
      this.master = this.context.createGain();
      this.master.gain.setValueAtTime(0, this.context.currentTime);
      this.master.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    this.enabled = true;
    this.master.gain.setTargetAtTime(0.55, this.context.currentTime, 0.45);
    this.step = 0;
    this.nextNoteTime = this.context.currentTime + 0.08;
    this.scheduleNotes();
  }

  scheduleNotes() {
    if (!this.enabled) {
      return;
    }

    while (this.nextNoteTime < this.context.currentTime + 0.25) {
      const melodyIndex = this.step % this.melody.length;
      this.playTone(this.melody[melodyIndex], this.nextNoteTime, this.beat * 1.25, "sine", 0.12, 0.04, 0.48);

      if (this.step % 8 === 0) {
        const chord = this.chords[Math.floor(this.step / 8) % this.chords.length];
        for (const note of chord) {
          this.playTone(note, this.nextNoteTime, this.beat * 8, "triangle", 0.022, 1.1, 1.8);
        }
      }

      this.step += 1;
      this.nextNoteTime += this.beat;
    }

    this.timer = window.setTimeout(() => this.scheduleNotes(), 100);
  }

  playTone(note, start, duration, waveform, volume, attack, release) {
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    const end = start + duration;
    const frequency = 440 * (2 ** ((note - 69) / 12));

    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + attack);
    envelope.gain.setValueAtTime(volume, end - release);
    envelope.gain.exponentialRampToValueAtTime(0.0001, end);
    oscillator.connect(envelope);
    envelope.connect(this.master);
    oscillator.start(start);
    oscillator.stop(end);
  }
}

const fairytaleMusic = new FairytaleMusic();
let musicWasChosen = false;
let completionPendingReward = false;
let storyComplete = false;
let walletBalance = readWalletBalance();
updateWalletDisplays();

function readWalletBalance() {
  try {
    const savedBalance = window.localStorage.getItem(walletStorageKey);
    if (savedBalance === null) {
      return 0;
    }

    const balance = Number(savedBalance);
    if (!Number.isSafeInteger(balance) || balance < 0) {
      throw new Error("The saved LUVEX balance is invalid.");
    }
    return balance;
  } catch {
    walletMessage.textContent = "Your saved LUVEX balance could not be read. A new balance will be kept for this visit.";
    return 0;
  }
}

function updateWalletDisplays() {
  const formattedBalance = walletBalance.toLocaleString();
  walletDisplays.forEach((display) => {
    display.textContent = formattedBalance;
  });
}

function resetCompletedGame() {
  currentRiddle = 0;
  solvedCount = 0;
  storyComplete = false;
  elements.board.classList.remove("has-pieces", "is-complete");
  document.querySelectorAll(".puzzle-piece").forEach((piece) => {
    piece.classList.remove("is-revealed");
  });
  elements.counter.textContent = `0 of ${riddles.length} pieces`;
  elements.caption.textContent = "Solve a riddle to reveal the first piece";
  elements.completion.setAttribute("aria-hidden", "true");
  showRiddle();
}

function awardCompletionReward() {
  if (!completionPendingReward) {
    return;
  }

  completionPendingReward = false;
  walletBalance += completionReward;
  updateWalletDisplays();
  rewardSaveNote.hidden = true;
  walletMessage.textContent = "";

  try {
    window.localStorage.setItem(walletStorageKey, String(walletBalance));
  } catch {
    const warning = "Your LUVEX Bucks were added for this visit, but your browser couldn't save them.";
    rewardSaveNote.textContent = warning;
    rewardSaveNote.hidden = false;
    walletMessage.textContent = warning;
  }

  rewardNotice.hidden = false;
  landing.classList.add("has-reward");
}

function updateMusicButton(enabled) {
  musicButton.setAttribute("aria-pressed", String(enabled));
  musicButton.setAttribute("aria-label", enabled ? "Turn music off" : "Turn music on");
  musicLabel.textContent = enabled ? "Music: on" : "Music: off";
}

async function setMusicEnabled(enabled) {
  try {
    await fairytaleMusic.setEnabled(enabled);
    updateMusicButton(enabled);
    musicStatus.textContent = enabled ? "Fairytale music is on." : "Fairytale music is off.";
  } catch {
    await fairytaleMusic.setEnabled(false);
    updateMusicButton(false);
    musicStatus.textContent = "Music could not start. Check your browser's audio settings and try again.";
  }
}

if (!fairytaleMusic.supported) {
  musicButton.disabled = true;
  musicLabel.textContent = "Music unavailable";
  musicButton.setAttribute("aria-label", "Music is unavailable in this browser");
  musicStatus.textContent = "This browser does not support the game's music.";
}

musicButton.addEventListener("click", () => {
  musicWasChosen = true;
  setMusicEnabled(!fairytaleMusic.enabled);
});

playButton.addEventListener("click", () => {
  if (storyComplete) {
    resetCompletedGame();
  }
  if (!musicWasChosen && fairytaleMusic.supported) {
    setMusicEnabled(true);
  }
  rewardNotice.hidden = true;
  landing.classList.remove("has-reward");
  musicButton.hidden = false;
  landing.hidden = true;
  gameScreen.hidden = false;
  window.scrollTo(0, 0);
  document.querySelector("#riddle-title").focus({ preventScroll: true });
});

homeButton.addEventListener("click", () => {
  gameScreen.hidden = true;
  landing.hidden = false;
  window.scrollTo(0, 0);
  playButton.focus({ preventScroll: true });
});

backStartButton.addEventListener("click", () => {
  awardCompletionReward();
  endScreen.hidden = true;
  landing.hidden = false;
  musicButton.hidden = false;
  window.scrollTo(0, 0);
  rewardDismiss.focus({ preventScroll: true });
});

rewardDismiss.addEventListener("click", () => {
  rewardNotice.hidden = true;
  landing.classList.remove("has-reward");
  playButton.focus({ preventScroll: true });
});

function showRiddle() {
  const riddle = riddles[currentRiddle];
  elements.clue.textContent = riddle.clue;
  elements.current.textContent = String(currentRiddle + 1).padStart(2, "0");
  elements.progress.style.width = `${(solvedCount / riddles.length) * 100}%`;
  elements.message.textContent = "";
  elements.message.classList.remove("is-success");
  elements.options.replaceChildren();

  for (const choice of riddle.choices) {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => chooseAnswer(button, choice));
    elements.options.append(button);
  }
}

function chooseAnswer(button, choice) {
  const correct = choice === riddles[currentRiddle].answer;
  if (!correct) {
    button.classList.add("is-wrong");
    elements.message.textContent = "Not quite — give that riddle another little think.";
    return;
  }

  solvedCount += 1;
  button.classList.add("is-correct");
  elements.options.querySelectorAll("button").forEach((option) => {
    option.disabled = true;
  });

  const piece = document.querySelector(`[data-piece="${currentRiddle}"]`);
  piece.classList.add("is-revealed");
  elements.board.classList.add("has-pieces");
  elements.progress.style.width = `${(solvedCount / riddles.length) * 100}%`;
  elements.counter.textContent = `${solvedCount} of ${riddles.length} pieces`;

  if (solvedCount === riddles.length) {
    finishGame();
    return;
  }

  elements.message.textContent = "That’s it! A puzzle piece has appeared.";
  elements.message.classList.add("is-success");
  elements.caption.textContent = "Lovely! Your fairytale is taking shape";
  currentRiddle += 1;
  window.setTimeout(showRiddle, 1050);
}

function finishGame() {
  storyComplete = true;
  completionPendingReward = true;
  elements.progress.style.width = "100%";
  elements.clue.textContent = "A kind heart, a little courage, and one magical night — every piece was meant to find its place.";
  elements.options.replaceChildren();
  elements.message.textContent = "You solved every riddle. And they lived happily ever after!";
  elements.message.classList.add("is-success");
  elements.counter.textContent = "4 of 4 pieces";
  elements.caption.textContent = "The whole fairytale, pieced together";
  elements.board.classList.add("is-complete");
  elements.completion.setAttribute("aria-hidden", "false");
  musicButton.hidden = true;
  setMusicEnabled(false);
  gameScreen.hidden = true;
  endScreen.hidden = false;
  window.scrollTo(0, 0);
  document.querySelector("#end-title").focus({ preventScroll: true });
}
