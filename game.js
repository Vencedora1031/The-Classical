const levels = [
  {
    title: "A Cinderella story",
    puzzleTitle: "A night to remember",
    image: "assets/cinderella-puzzle.jpg",
    artTitle: "Cinderella and the prince at the palace",
    artDescription: "Cinderella and the prince share a glass slipper in front of a glowing palace. The picture is revealed as four interlocking puzzle pieces.",
    endingTitle: "The day has danced away, but leaves you with another clue. Collect the letters, for at the end they unite.",
    dayLetter: "D",
    riddles: [
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
    ],
  },
  {
    title: "A Rapunzel story",
    puzzleTitle: "A tower full of wonder",
    image: "assets/rapunzel-puzzle.jpg",
    artTitle: "Rapunzel and Flynn Rider beneath the tower",
    artDescription: "Rapunzel looks out from her tower as Flynn Rider holds her long, glowing hair. The picture is revealed as four interlocking puzzle pieces.",
    endingTitle: "The tower's secret is yours. Keep your courage close as you journey into the next story.",
    dayLetter: "AI",
    riddles: [
      {
        clue: "Golden and glowing, I grow impossibly long and hold a little magic. What am I?",
        answer: "Rapunzel's hair",
        choices: ["Rapunzel's hair", "a golden ribbon", "a sunbeam", "a silk rope"],
      },
      {
        clue: "I have a window high above the ground, but no door at its foot. What am I?",
        answer: "the tower",
        choices: ["the palace", "the tower", "the garden", "the cottage"],
      },
      {
        clue: "A drop of my magic made Rapunzel's hair shine and heal. What am I?",
        answer: "the sundrop flower",
        choices: ["the sundrop flower", "a purple orchid", "a golden apple", "a magic rose"],
      },
      {
        clue: "To climb the tower, Flynn calls, 'Rapunzel, Rapunzel, let down your ...'",
        answer: "hair",
        choices: ["ladder", "basket", "hair", "ribbon"],
      },
    ],
  },
  {
    type: "reveal",
    title: "A Daisy story",
    endingTitle: "You found the letters hidden in the meadow. Keep them safe for the final word.",
    dayLetter: "SY",
    answer: "daisy",
    riddles: [],
  },
  {
    type: "love",
    title: "A Daisy love story",
    puzzleTitle: "A heart for Daisy",
    artTitle: "A glowing heart drawn in red light",
    artDescription: "A red heart is traced by glowing particles on a dark background.",
    riddles: [],
  },
  {
    type: "finale",
    title: "Stuck on You",
    puzzleTitle: "A final note from the heart",
    artTitle: "A swirl of memories",
    artDescription: "Three photographs from a love story.",
    riddles: [],
  },
];

const elements = {
  clue: document.querySelector("#riddle-text"),
  title: document.querySelector("#page-title"),
  card: document.querySelector("#game-card"),
  chapterLabel: document.querySelector("#chapter-label"),
  options: document.querySelector("#answer-options"),
  message: document.querySelector("#game-message"),
  current: document.querySelector("#progress-current"),
  total: document.querySelector("#progress-total"),
  progress: document.querySelector("#progress-fill"),
  counter: document.querySelector("#piece-counter"),
  board: document.querySelector("#puzzle-board"),
  caption: document.querySelector("#puzzle-caption"),
  completion: document.querySelector("#complete-stamp"),
  puzzleTitle: document.querySelector("#puzzle-title"),
  artTitle: document.querySelector("#art-title"),
  artDescription: document.querySelector("#art-description"),
  chapter: document.querySelector("#end-chapter-label"),
  endTitle: document.querySelector("#end-title"),
  dayLetterLabel: document.querySelector("#day-letter-label"),
  dayLetter: document.querySelector("#day-letter"),
  endPrompt: document.querySelector("#end-prompt"),
  meadow: document.querySelector("#meadow-level"),
  meadowUncover: document.querySelector("#meadow-uncover"),
  meadowRock: document.querySelector("#meadow-rock"),
  meadowLetters: document.querySelector("#meadow-letters"),
  meadowAnswerCard: document.querySelector("#meadow-answer-card"),
  meadowForm: document.querySelector("#meadow-answer-form"),
  meadowAnswer: document.querySelector("#meadow-answer"),
  meadowMessage: document.querySelector("#meadow-message"),
  love: document.querySelector("#love-level"),
  loveTitle: document.querySelector("#love-title"),
  loveCanvas: document.querySelector("#love-heart"),
  loveNext: document.querySelector("#love-next"),
  finale: document.querySelector("#finale-level"),
  finaleTitle: document.querySelector("#finale-title"),
  finaleBack: document.querySelector("#finale-back-button"),
  memoryPhotos: document.querySelectorAll(".memory-photo"),
  memoryStage: document.querySelector("#memory-stage"),
  memoryPrevious: document.querySelector("#memory-previous"),
  memoryNext: document.querySelector("#memory-next"),
  memoryIndicators: document.querySelector("#memory-indicators"),
  poemInvitation: document.querySelector("#poem-invitation"),
  poem: document.querySelector(".finale-poem"),
  photoDialog: document.querySelector("#photo-dialog"),
  photoDialogImage: document.querySelector("#photo-dialog-image"),
  photoDialogCaption: document.querySelector("#photo-dialog-caption"),
  photoDialogClose: document.querySelector("#photo-dialog-close"),
};

let currentLevelIndex = 0;
let currentRiddle = 0;
let solvedCount = 0;
let loveAnimationFrame = 0;
let activeMemoryPhoto = 0;
let memoryCarouselTimer = 0;
let memorySwipeStartX = null;
let memorySwipeHandled = false;
let poemObserver = null;

const landing = document.querySelector("#landing");
const gameScreen = document.querySelector("#game-screen");
const playButton = document.querySelector("#play-button");
const homeButton = document.querySelector("#home-button");
const meadowHomeButton = document.querySelector("#meadow-home-button");
const musicButton = document.querySelector("#music-toggle");
const musicLabel = document.querySelector("#music-label");
const musicStatus = document.querySelector("#music-status");
const endScreen = document.querySelector("#end-screen");
const backStartButton = document.querySelector("#back-start-button");
const walletMessage = document.querySelector("#wallet-message");
const walletDisplays = [
  document.querySelector("#wallet-balance-landing"),
  document.querySelector("#wallet-balance-game"),
  document.querySelector("#wallet-balance-end"),
  document.querySelector("#wallet-balance-meadow"),
];
const walletStorageKey = "onceUponARiddle.luvexBucks";
const completionReward = 150;
const wrongAnswerCost = 1;
const rapunzelMusic = new Audio(
  window.location.protocol === "file:"
    ? rapunzelAudioSource
    : new URL("assets/rapunzel-level.mp3", document.baseURI),
);
rapunzelMusic.loop = true;
rapunzelMusic.preload = "auto";
const rapunzelMusicSupported = Boolean(rapunzelMusic.canPlayType("audio/mpeg"));
const levelFourMusic = new Audio(
  window.location.protocol === "file:"
    ? levelFourAudioSource
    : new URL("assets/level-four-song.mp3", document.baseURI),
);
levelFourMusic.loop = true;
levelFourMusic.preload = "auto";
const levelFourMusicSupported = Boolean(levelFourMusic.canPlayType("audio/mpeg"));

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
    this.master.gain.setTargetAtTime(0.7, this.context.currentTime, 0.45);
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
let musicPreference = true;
let musicRequestId = 0;
let walletBalance = readWalletBalance();
updateWalletDisplays();

function currentLevel() {
  return levels[currentLevelIndex];
}

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

function saveWalletBalance() {
  try {
    window.localStorage.setItem(walletStorageKey, String(walletBalance));
    walletMessage.textContent = "";
    return true;
  } catch {
    walletMessage.textContent = "Your LUVEX balance was updated for this visit, but your browser couldn't save it.";
    return false;
  }
}

function resetLevel() {
  currentRiddle = 0;
  solvedCount = 0;
  elements.board.classList.remove("has-pieces", "is-complete");
  document.querySelectorAll(".puzzle-piece").forEach((piece) => {
    piece.classList.remove("is-revealed");
  });
  elements.counter.textContent = `0 of ${currentLevel().riddles.length} pieces`;
  elements.caption.textContent = "Solve a riddle to reveal the first piece";
  elements.completion.setAttribute("aria-hidden", "true");
  elements.total.textContent = String(currentLevel().riddles.length).padStart(2, "0");
  if (currentLevel().image) {
    document.querySelectorAll(".puzzle-piece image").forEach((image) => {
      image.setAttribute("href", currentLevel().image);
    });
  }
  elements.title.textContent = currentLevel().title;
  elements.card.setAttribute("aria-label", `${currentLevel().title} riddle game`);
  elements.chapterLabel.textContent = `${currentLevel().title.replace(/^A /, "").replace(/ story$/, "")} · Level ${currentLevelIndex + 1}`;
  elements.puzzleTitle.textContent = currentLevel().puzzleTitle;
  elements.artTitle.textContent = currentLevel().artTitle;
  elements.artDescription.textContent = currentLevel().artDescription;
  elements.board.setAttribute("aria-label", `A four-piece ${currentLevel().title} picture puzzle`);
  if (currentLevel().riddles.length > 0) {
    showRiddle();
  }
}

function awardCompletionReward() {
  walletBalance += completionReward;
  updateWalletDisplays();
  const saved = saveWalletBalance();
  elements.endPrompt.textContent = `You earned ${completionReward} LUVEX Bucks! Your wallet now has ${walletBalance.toLocaleString()} LUVEX.${saved ? "" : " Your updated balance is available for this visit but could not be saved."}`;
}

function deductWrongAnswerCost() {
  if (walletBalance === 0) {
    return "Not quite — you have no LUVEX Bucks left to lose. Try again.";
  }

  walletBalance = Math.max(0, walletBalance - wrongAnswerCost);
  updateWalletDisplays();
  const saved = saveWalletBalance();
  return `Not quite — ${wrongAnswerCost} LUVEX Buck${wrongAnswerCost === 1 ? "" : "s"} deducted. Try again.${saved ? "" : " Your updated balance is available for this visit but could not be saved."}`;
}

function updateEndScreen() {
  const level = currentLevel();
  elements.chapter.textContent = `${level.title} · Chapter complete`;
  elements.endTitle.textContent = level.endingTitle;
  elements.dayLetterLabel.textContent = level.dayLetter.length > 1
    ? "The letters of the day are"
    : "The letter of the day is";
  elements.dayLetter.textContent = level.dayLetter;
  const action = document.createElement("span");
  action.setAttribute("aria-hidden", "true");
  action.textContent = "→";
  backStartButton.replaceChildren(
    action,
    document.createTextNode(" Next level"),
  );
}

function startLevel(levelIndex) {
  currentLevelIndex = levelIndex;
  resetLevel();
  setLevelMusicAvailability();
  endScreen.hidden = true;
  landing.hidden = true;
  const isRevealLevel = currentLevel().type === "reveal";
  const isLoveLevel = currentLevel().type === "love";
  const isFinale = currentLevel().type === "finale";
  gameScreen.hidden = isRevealLevel || isLoveLevel || isFinale;
  elements.meadow.hidden = !isRevealLevel;
  elements.love.hidden = !isLoveLevel;
  elements.finale.hidden = !isFinale;
  document.body.classList.toggle("love-level-active", isLoveLevel || isFinale);
  musicButton.hidden = false;
  if (isRevealLevel) {
    resetMeadowLevel();
  } else if (isLoveLevel) {
    startLoveAnimation();
  } else if (isFinale) {
    resetMemoryGallery();
  }
  if (musicPreference && !musicButton.disabled) {
    setMusicEnabled(true);
  }
  window.scrollTo(0, 0);
  if (isRevealLevel) {
    elements.meadowUncover.focus({ preventScroll: true });
  } else if (isLoveLevel) {
    elements.loveTitle.focus({ preventScroll: true });
  } else if (isFinale) {
    elements.finaleTitle.focus({ preventScroll: true });
  } else {
    document.querySelector("#riddle-title").focus({ preventScroll: true });
  }
}

function returnToLanding() {
  endScreen.hidden = true;
  elements.meadow.hidden = true;
  elements.love.hidden = true;
  elements.finale.hidden = true;
  gameScreen.hidden = true;
  landing.hidden = false;
  document.body.classList.remove("love-level-active");
  if (elements.photoDialog.open) {
    elements.photoDialog.close();
  }
  musicButton.hidden = false;
  window.scrollTo(0, 0);
  playButton.focus({ preventScroll: true });
}

function showEndScreen() {
  updateEndScreen();
  gameScreen.hidden = true;
  elements.meadow.hidden = true;
  elements.love.hidden = true;
  elements.finale.hidden = true;
  endScreen.hidden = false;
  document.body.classList.remove("love-level-active");
  window.scrollTo(0, 0);
  elements.endTitle.focus({ preventScroll: true });
}

function stopMusic() {
  setMusicEnabled(false, false);
}

function setLevelMusicAvailability() {
  const supported = currentLevelIndex === 0
    ? fairytaleMusic.supported
    : currentLevelIndex >= 3
      ? levelFourMusicSupported
      : rapunzelMusicSupported;
  musicButton.disabled = !supported;
  if (!supported) {
    musicLabel.textContent = "Music unavailable";
    musicButton.setAttribute("aria-label", "Music is unavailable in this browser");
    musicStatus.textContent = "This browser does not support the game's music.";
  } else {
    updateMusicButton(false);
  }
}

function resetMeadowLevel() {
  elements.meadow.classList.remove("is-uncovered");
  document.querySelector("#meadow-instruction").textContent = "A bright light is hiding something in the meadow. Tap to uncover it.";
  elements.meadowUncover.hidden = false;
  elements.meadowRock.hidden = true;
  elements.meadowRock.disabled = false;
  elements.meadowLetters.hidden = true;
  elements.meadowAnswerCard.hidden = true;
  elements.meadowAnswer.value = "";
  elements.meadowMessage.textContent = "";
}

function resetMemoryGallery() {
  activeMemoryPhoto = 0;
  renderMemoryCarousel();
  prepareCinematicPoem();
  startMemoryCarouselAutoplay();
  if (elements.photoDialog.open) {
    elements.photoDialog.close();
  }
}

function renderMemoryCarousel() {
  const stageWidth = elements.memoryStage.clientWidth || window.innerWidth;
  const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
  const orbitRadius = isSmallScreen
    ? stageWidth * 0.66
    : Math.min(stageWidth * 0.45, 520);
  elements.memoryPhotos.forEach((photo, index) => {
    const offset = ((index - activeMemoryPhoto + 4) % 3) - 1;
    const angle = offset * (Math.PI * 2 / 3);
    const isActive = offset === 0;
    const x = Math.sin(angle) * orbitRadius;
    const y = (1 - Math.cos(angle)) * 48;
    const scale = isActive ? 1 : 0.72;
    const depth = isActive ? 110 : -90;
    photo.classList.toggle("is-active", isActive);
    photo.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${depth}px) rotateY(${-offset * 9}deg) scale(${scale})`;
    photo.style.zIndex = isActive ? "3" : "1";
    photo.setAttribute("aria-current", String(isActive));
  });
  elements.memoryIndicators.replaceChildren();
  elements.memoryPhotos.forEach((_, index) => {
    const indicator = document.createElement("button");
    indicator.className = "memory-indicator";
    indicator.type = "button";
    indicator.setAttribute("aria-label", `Show photograph ${index + 1}`);
    indicator.setAttribute("aria-pressed", String(index === activeMemoryPhoto));
    indicator.addEventListener("click", () => {
      showMemoryPhoto(index);
      restartMemoryCarouselAutoplay();
    });
    elements.memoryIndicators.append(indicator);
  });
}

function showMemoryPhoto(index) {
  activeMemoryPhoto = (index + elements.memoryPhotos.length) % elements.memoryPhotos.length;
  renderMemoryCarousel();
}

function stopMemoryCarouselAutoplay() {
  window.clearInterval(memoryCarouselTimer);
  memoryCarouselTimer = 0;
}

function startMemoryCarouselAutoplay() {
  stopMemoryCarouselAutoplay();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  memoryCarouselTimer = window.setInterval(() => {
    showMemoryPhoto(activeMemoryPhoto + 1);
  }, 5200);
}

function restartMemoryCarouselAutoplay() {
  stopMemoryCarouselAutoplay();
  memoryCarouselTimer = window.setTimeout(startMemoryCarouselAutoplay, 7000);
}

function prepareCinematicPoem() {
  const paragraphs = [...elements.poem.querySelectorAll("p")];
  paragraphs.forEach((paragraph) => {
    if (paragraph.querySelector(".poem-word")) {
      paragraph.classList.remove("is-visible");
      return;
    }
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }
    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      let wordIndex = 0;
      textNode.textContent.match(/\S+|\s+/g)?.forEach((part) => {
        if (/^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "poem-word";
        word.style.setProperty("--word-index", String(wordIndex));
        word.textContent = part;
        wordIndex += 1;
        fragment.append(word);
      });
      textNode.replaceWith(fragment);
    });
  });

  if (!("IntersectionObserver" in window)) {
    paragraphs.forEach((paragraph) => paragraph.classList.add("is-visible"));
    return;
  }

  poemObserver?.disconnect();
  poemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        poemObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  paragraphs.forEach((paragraph) => poemObserver.observe(paragraph));
}

function drawLoveHeart(context, completedLines, activeLineProgress = 0) {
  const dotCount = 220;
  const lineColors = ["#ff243f", "#ff526b", "#ed193a", "#ff7185", "#df1234", "#ff344f"];
  const scale = 14;
  context.clearRect(0, 0, elements.loveCanvas.width, elements.loveCanvas.height);
  context.save();
  context.translate(elements.loveCanvas.width / 2, elements.loveCanvas.height / 2 + 12);

  for (let line = 0; line <= completedLines && line < lineColors.length; line += 1) {
    const lineProgress = line < completedLines ? 1 : activeLineProgress;
    const visibleDots = Math.ceil(dotCount * lineProgress);
    const lineScale = 1 - line * 0.085;
    context.fillStyle = lineColors[line];
    context.shadowColor = lineColors[line];
    context.shadowBlur = 10;

    for (let index = 0; index < visibleDots; index += 1) {
      const angle = (index / dotCount) * Math.PI * 2;
      const sine = Math.sin(angle);
      const heartX = 16 * sine ** 3;
      const heartY = 13 * Math.cos(angle)
        - 5 * Math.cos(2 * angle)
        - 2 * Math.cos(3 * angle)
        - Math.cos(4 * angle);
      const radius = index % 5 === 0 ? 3 : 2;

      context.beginPath();
      context.arc(heartX * scale * lineScale, -heartY * scale * lineScale, radius, 0, Math.PI * 2);
      context.fill();
    }
  }

  context.restore();
}

function drawLoveFireworks(context, elapsed) {
  const bursts = [
    { x: 125, y: 145, start: 0, color: "#ff244f" },
    { x: 350, y: 105, start: 520, color: "#ffcf59" },
    { x: 575, y: 150, start: 1040, color: "#ff6e91" },
  ];
  const particleCount = 42;
  const burstDuration = 1150;

  bursts.forEach((burst) => {
    const age = elapsed - burst.start;
    if (age < 0 || age > burstDuration) {
      return;
    }
    const progress = age / burstDuration;
    const radius = 18 + progress * 78;
    const opacity = 1 - progress;
    context.save();
    context.globalAlpha = opacity;
    context.fillStyle = burst.color;
    context.shadowColor = burst.color;
    context.shadowBlur = 12;

    for (let index = 0; index < particleCount; index += 1) {
      const angle = (index / particleCount) * Math.PI * 2;
      const variedRadius = radius * (0.82 + (index % 5) * 0.08);
      const x = burst.x + Math.cos(angle) * variedRadius;
      const y = burst.y + Math.sin(angle) * variedRadius + progress * progress * 30;
      const particleSize = index % 4 === 0 ? 3 : 2;
      context.beginPath();
      context.arc(x, y, particleSize, 0, Math.PI * 2);
      context.fill();
    }

    context.restore();
  });
}

function startLoveAnimation() {
  window.cancelAnimationFrame(loveAnimationFrame);
  elements.loveNext.hidden = true;
  const context = elements.loveCanvas.getContext("2d");
  if (!context) {
    throw new Error("This browser cannot display the animated heart.");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawLoveHeart(context, 6);
    elements.loveNext.hidden = false;
    return;
  }

  const lineDuration = 650;
  const lineCount = 6;
  const fireworksDuration = 2250;
  const heartDuration = lineDuration * lineCount;
  const startedAt = performance.now();
  const animate = (time) => {
    const elapsed = time - startedAt;
    if (elapsed < heartDuration) {
      const completedLines = Math.floor(elapsed / lineDuration);
      const activeLineProgress = (elapsed % lineDuration) / lineDuration;
      drawLoveHeart(context, completedLines, activeLineProgress);
      loveAnimationFrame = window.requestAnimationFrame(animate);
      return;
    }

    drawLoveHeart(context, lineCount);
    const fireworksElapsed = elapsed - heartDuration;
    if (fireworksElapsed < fireworksDuration) {
      drawLoveFireworks(context, fireworksElapsed);
      loveAnimationFrame = window.requestAnimationFrame(animate);
      return;
    }

    elements.loveNext.hidden = false;
    elements.loveNext.focus({ preventScroll: true });
  };

  loveAnimationFrame = window.requestAnimationFrame(animate);
}

function pauseRapunzelMusic() {
  rapunzelMusic.pause();
  rapunzelMusic.currentTime = 0;
}

function pauseLevelFourMusic() {
  levelFourMusic.pause();
  levelFourMusic.currentTime = 0;
}

function nextLevelOrReturnHome() {
  if (currentLevelIndex < levels.length - 1) {
    musicPreference = true;
    startLevel(currentLevelIndex + 1);
    return;
  }
  returnToLanding();
}

function synchronizeMusicForActiveLevel(enabled) {
  if (enabled && currentLevelIndex >= 3) {
    pauseRapunzelMusic();
    const playback = levelFourMusic.play();
    fairytaleMusic.setEnabled(false);
    return playback;
  }
  if (enabled && currentLevelIndex >= 1) {
    pauseLevelFourMusic();
    const playback = rapunzelMusic.play();
    fairytaleMusic.setEnabled(false);
    return playback;
  }
  if (enabled) {
    pauseRapunzelMusic();
    pauseLevelFourMusic();
    return fairytaleMusic.setEnabled(true);
  }
  pauseRapunzelMusic();
  pauseLevelFourMusic();
  return fairytaleMusic.setEnabled(false);
}

function readMusicPreferenceFromButton() {
  return musicButton.getAttribute("aria-pressed") !== "true";
}

function bindMusicToggle() {
  musicButton.addEventListener("click", () => {
    musicPreference = readMusicPreferenceFromButton();
    setMusicEnabled(musicPreference);
  });
}

function bindLevelNavigation() {
  playButton.addEventListener("click", () => {
    startLevel(0);
  });

  homeButton.addEventListener("click", () => {
    gameScreen.hidden = true;
    landing.hidden = false;
    window.scrollTo(0, 0);
    playButton.focus({ preventScroll: true });
  });

  meadowHomeButton.addEventListener("click", returnToLanding);
  backStartButton.addEventListener("click", nextLevelOrReturnHome);
  elements.loveNext.addEventListener("click", nextLevelOrReturnHome);
  elements.finaleBack.addEventListener("click", () => {
    musicPreference = false;
    stopMusic();
    returnToLanding();
  });
  elements.memoryPrevious.addEventListener("click", () => {
    showMemoryPhoto(activeMemoryPhoto - 1);
    restartMemoryCarouselAutoplay();
  });
  elements.memoryNext.addEventListener("click", () => {
    showMemoryPhoto(activeMemoryPhoto + 1);
    restartMemoryCarouselAutoplay();
  });
  elements.memoryStage.addEventListener("pointerdown", (event) => {
    memorySwipeStartX = event.clientX;
  });
  elements.memoryStage.addEventListener("pointerup", (event) => {
    if (memorySwipeStartX === null) {
      return;
    }
    const distance = event.clientX - memorySwipeStartX;
    memorySwipeStartX = null;
    if (Math.abs(distance) < 45) {
      return;
    }
    memorySwipeHandled = true;
    showMemoryPhoto(activeMemoryPhoto + (distance < 0 ? 1 : -1));
    restartMemoryCarouselAutoplay();
    window.setTimeout(() => {
      memorySwipeHandled = false;
    }, 0);
  });
  elements.memoryStage.addEventListener("pointercancel", () => {
    memorySwipeStartX = null;
  });
  elements.memoryStage.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }
    event.preventDefault();
    showMemoryPhoto(activeMemoryPhoto + (event.key === "ArrowRight" ? 1 : -1));
    restartMemoryCarouselAutoplay();
  });
  elements.memoryStage.addEventListener("pointerenter", stopMemoryCarouselAutoplay);
  elements.memoryStage.addEventListener("pointerleave", startMemoryCarouselAutoplay);
  elements.memoryStage.addEventListener("focusin", stopMemoryCarouselAutoplay);
  elements.memoryStage.addEventListener("focusout", (event) => {
    if (!elements.memoryStage.contains(event.relatedTarget)) {
      startMemoryCarouselAutoplay();
    }
  });
  window.addEventListener("resize", renderMemoryCarousel);
  elements.poemInvitation.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#poem-scroll").scrollIntoView({ behavior: "smooth" });
  });
  elements.memoryPhotos.forEach((photo) => {
    photo.addEventListener("click", (event) => {
      if (memorySwipeHandled) {
        event.preventDefault();
        return;
      }
      const photoIndex = Number(photo.dataset.photo);
      if (photoIndex !== activeMemoryPhoto) {
        showMemoryPhoto(photoIndex);
        restartMemoryCarouselAutoplay();
        return;
      }
      const image = photo.querySelector("img");
      elements.photoDialogImage.src = image.src;
      elements.photoDialogImage.alt = image.alt;
      elements.photoDialogCaption.textContent = image.alt;
      elements.photoDialog.showModal();
      restartMemoryCarouselAutoplay();
    });
  });
  elements.photoDialogClose.addEventListener("click", () => {
    elements.photoDialog.close();
  });
  elements.photoDialog.addEventListener("click", (event) => {
    if (event.target === elements.photoDialog) {
      elements.photoDialog.close();
    }
  });

  elements.meadowUncover.addEventListener("click", () => {
    elements.meadow.classList.add("is-uncovered");
    elements.meadowUncover.hidden = true;
    elements.meadowRock.hidden = false;
    document.querySelector("#meadow-instruction").textContent = "A stone is glowing in the corner. Tap it to reveal your letters.";
    elements.meadowRock.focus();
  });

  elements.meadowRock.addEventListener("click", () => {
    elements.meadowRock.disabled = true;
    elements.meadowLetters.hidden = false;
    document.querySelector("#meadow-instruction").textContent = "You uncovered the letters SY.";
    window.setTimeout(() => {
      elements.meadowAnswerCard.hidden = false;
      elements.meadowAnswer.focus();
    }, 900);
  });

  elements.meadowForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (elements.meadowAnswer.value.trim().toLocaleLowerCase() === currentLevel().answer) {
      awardCompletionReward();
      startLevel(currentLevelIndex + 1);
      return;
    }

    elements.meadowMessage.textContent = deductWrongAnswerCost();
    elements.meadowAnswer.select();
  });
}

function updateMusicButton(enabled) {
  musicButton.setAttribute("aria-pressed", String(enabled));
  musicButton.setAttribute("aria-label", enabled ? "Turn music off" : "Turn music on");
  musicLabel.textContent = enabled ? "Music: on" : "Music: off";
}

async function setMusicEnabled(enabled, rememberPreference = true) {
  const requestId = ++musicRequestId;
  try {
    await synchronizeMusicForActiveLevel(enabled);
    if (requestId !== musicRequestId) {
      return;
    }
    if (rememberPreference) {
      musicPreference = enabled;
    }
    updateMusicButton(enabled);
    musicStatus.textContent = enabled
      ? `${currentLevel().title} music is on.`
      : "Music is off.";
  } catch (error) {
    if (requestId !== musicRequestId) {
      return;
    }
    if (rememberPreference) {
      musicPreference = false;
    }
    pauseRapunzelMusic();
    pauseLevelFourMusic();
    fairytaleMusic.setEnabled(false);
    updateMusicButton(false);
    const reason = error instanceof Error ? ` ${error.message}` : "";
    musicStatus.textContent = currentLevelIndex === 1 || currentLevelIndex === 2
      ? `Rapunzel's song could not play.${reason} Check that the audio file is available and try again.`
      : currentLevelIndex >= 3
        ? `The Level 4 song could not play.${reason} Check that the audio file is available and try again.`
      : `Music could not start.${reason} Check your browser's audio settings and try again.`;
  }
}

bindMusicToggle();
bindLevelNavigation();
resetLevel();
setLevelMusicAvailability();

function showRiddle() {
  const riddle = currentLevel().riddles[currentRiddle];
  elements.clue.textContent = riddle.clue;
  elements.current.textContent = String(currentRiddle + 1).padStart(2, "0");
  elements.progress.style.width = `${(solvedCount / currentLevel().riddles.length) * 100}%`;
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
  const correct = choice === currentLevel().riddles[currentRiddle].answer;
  if (!correct) {
    button.classList.add("is-wrong");
    elements.message.textContent = currentLevelIndex === 1
      ? deductWrongAnswerCost()
      : "Not quite — give that riddle another little think.";
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
  elements.progress.style.width = `${(solvedCount / currentLevel().riddles.length) * 100}%`;
  elements.counter.textContent = `${solvedCount} of ${currentLevel().riddles.length} pieces`;

  if (solvedCount === currentLevel().riddles.length) {
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
  awardCompletionReward();
  elements.progress.style.width = "100%";
  elements.clue.textContent = `${currentLevel().title} has come together, one little piece at a time.`;
  elements.options.replaceChildren();
  elements.message.textContent = "You solved every riddle. And they lived happily ever after!";
  elements.message.classList.add("is-success");
  elements.counter.textContent = `${currentLevel().riddles.length} of ${currentLevel().riddles.length} pieces`;
  elements.caption.textContent = "The whole fairytale, pieced together";
  elements.board.classList.add("is-complete");
  elements.completion.setAttribute("aria-hidden", "false");
  musicButton.hidden = true;
  if (currentLevelIndex === 0) {
    fairytaleMusic.setEnabled(false);
  } else {
    stopMusic();
  }
  showEndScreen();
}
