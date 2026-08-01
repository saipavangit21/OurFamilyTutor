import React, { useState, useMemo, useRef, useEffect } from "react";
import { Calculator, BookOpen, Printer, RotateCcw, CheckCircle2, XCircle, Star, ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Mic, Square, Volume2, Library, PartyPopper } from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Lexend:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
`;

const COLORS = {
  bg: "#FBF6EC",
  paper: "#FFFDF8",
  ink: "#2E3A59",
  inkSoft: "#5B6584",
  green: "#4C9A6A",
  greenDark: "#2F6E48",
  blue: "#5AA9E6",
  blueDark: "#2E6FA3",
  gold: "#F2A93B",
  goldDark: "#B97A17",
  coral: "#EF6F5B",
  coralDark: "#B23F2E",
  line: "#E4DCC8",
};

// ---------- helpers ----------
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const reduceFraction = (n, d) => {
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
};

const cleanWord = (w) => w.toLowerCase().replace(/[^a-z']/g, "");
const tokenize = (text) => text.split(/(\s+)/).filter((t) => t.length > 0);

const NAMES = ["Maya", "Leo", "Zara", "Finn", "Nina", "Omar", "Ava", "Kofi", "Priya", "Sam"];
const THINGS2 = ["apples", "stickers", "marbles", "crayons", "shells"];
const THINGS4 = ["pencils", "candies", "postcards", "stamps", "beads"];

function genClass2(id) {
  const type = pick(["add", "add", "sub", "sub", "mult", "wordAdd", "wordSub"]);
  if (type === "add") {
    const a = randInt(10, 60), b = randInt(10, 38 - Math.max(0, a - 60));
    const aa = Math.min(a, 60), bb = Math.min(b, 99 - aa);
    return { id, prompt: `${aa} + ${bb} =`, answer: String(aa + bb) };
  }
  if (type === "sub") {
    const a = randInt(20, 90), b = randInt(5, a - 1);
    return { id, prompt: `${a} - ${b} =`, answer: String(a - b) };
  }
  if (type === "mult") {
    const a = randInt(2, 5), b = randInt(2, 9);
    return { id, prompt: `${a} x ${b} =`, answer: String(a * b) };
  }
  const name = pick(NAMES), name2 = pick(NAMES.filter((n) => n !== name)), thing = pick(THINGS2);
  if (type === "wordAdd") {
    const a = randInt(5, 30), b = randInt(3, 20);
    return { id, prompt: `${name} has ${a} ${thing}. ${name2} gives ${name} ${b} more. How many ${thing} does ${name} have now?`, answer: String(a + b), isWord: true };
  }
  const a = randInt(15, 40), b = randInt(3, a - 2);
  return { id, prompt: `${name} had ${a} ${thing}. ${name} gave away ${b} ${thing}. How many ${thing} are left?`, answer: String(a - b), isWord: true };
}

function genClass4(id) {
  const type = pick(["mult", "mult", "div", "div", "frac", "wordMult", "wordDiv"]);
  if (type === "mult") {
    const a = randInt(12, 89), b = randInt(2, 9);
    return { id, prompt: `${a} x ${b} =`, answer: String(a * b) };
  }
  if (type === "div") {
    const b = randInt(2, 9), q = randInt(3, 12), r = pick([0, 0, randInt(1, b - 1)]);
    const a = b * q + r;
    return { id, prompt: `${a} ÷ ${b} =`, answer: r === 0 ? String(q) : `${q} r ${r}` };
  }
  if (type === "frac") {
    const d = randInt(4, 10);
    let n1 = randInt(1, d - 2), n2 = randInt(1, d - 1 - n1);
    const [rn, rd] = reduceFraction(n1 + n2, d);
    return { id, prompt: `${n1}/${d} + ${n2}/${d} =`, answer: `${rn}/${rd}` };
  }
  const name = pick(NAMES), thing = pick(THINGS4);
  if (type === "wordMult") {
    const a = randInt(3, 9), b = randInt(6, 20);
    return { id, prompt: `${name} bought ${a} packs of ${thing}. Each pack has ${b}. How many ${thing} in total?`, answer: String(a * b), isWord: true };
  }
  const b = randInt(2, 9), q = randInt(3, 12), a = b * q;
  return { id, prompt: `${name} has ${a} ${thing} to share equally among ${b} friends. How many does each friend get?`, answer: String(q), isWord: true };
}

function makeWorksheet(classLevel) {
  const gen = classLevel === 2 ? genClass2 : genClass4;
  return Array.from({ length: 10 }, (_, i) => gen(i));
}

// ---------- English content ----------
const PASSAGES = {
  2: [
    {
      title: "The Little Seed",
      text: "Every morning, Mia watered the small brown seed she had planted in a clay pot. For many days, nothing happened, and Mia worried the seed was asleep forever. Then one sunny morning, she saw a tiny green shoot poking out of the soil. Mia clapped her hands with joy. Day by day, the shoot grew taller and grew two soft leaves. By summer, the little seed had become a tall sunflower with a bright yellow face that turned toward the sun. Mia loved to sit beside her sunflower and tell it about her day.",
      questions: [
        { q: "What did Mia plant in the clay pot?", options: ["A seed", "A flower", "A leaf", "A stone"], correct: 0 },
        { q: "What color was the sunflower's face?", options: ["Blue", "Green", "Yellow", "Red"], correct: 2 },
        { q: "What did Mia do every morning?", options: ["Watered the seed", "Painted the pot", "Sang a song", "Read a book"], correct: 0 },
      ],
      vocabulary: [
        { word: "shoot", def: "a new small part of a plant that is just starting to grow" },
        { word: "clapped", def: "hit hands together to show happiness" },
        { word: "joy", def: "a feeling of great happiness" },
      ],
    },
    {
      title: "Milo the Curious Cat",
      text: "Milo was a small grey cat who loved to explore. Every afternoon, he tiptoed around the garden, sniffing flowers and chasing butterflies. One day, Milo noticed a strange box near the fence. He crept closer, his whiskers twitching with curiosity. Inside the box, he found a family of baby birds who had fallen from their nest. Milo did not eat them. Instead, he sat beside the box and gently guarded them until the children next door found them and put them back in their nest. From that day on, the birds always sang for Milo when he walked by.",
      questions: [
        { q: "What color was Milo?", options: ["Grey", "Black", "White", "Orange"], correct: 0 },
        { q: "What did Milo find in the box?", options: ["Toys", "Baby birds", "Food", "Books"], correct: 1 },
        { q: "What did Milo do with the baby birds?", options: ["Ate them", "Guarded them", "Ignored them", "Chased them"], correct: 1 },
      ],
      vocabulary: [
        { word: "tiptoed", def: "walked very quietly and carefully" },
        { word: "twitching", def: "moving slightly and quickly" },
        { word: "guarded", def: "kept safe and watched over" },
      ],
    },
    {
      title: "Rainy Day Fun",
      text: "It rained all day, so Sam and his sister Ella could not play outside. At first, they felt bored and grumpy. Then their mother brought out a big box of old buttons, ribbons, and colored paper. Sam and Ella spent the whole afternoon making funny paper puppets and telling silly stories with them. By the time the rain stopped, they almost did not want to go outside anymore. Sam said rainy days could be just as fun as sunny ones, as long as you had a good imagination.",
      questions: [
        { q: "Why couldn't Sam and Ella play outside?", options: ["It was raining", "It was dark", "They were sick", "School was open"], correct: 0 },
        { q: "What did they make?", options: ["Paper puppets", "Sandcastles", "Paper boats", "Kites"], correct: 0 },
        { q: "What did Sam say at the end?", options: ["Rainy days are boring", "Rainy days can be fun too", "He wanted the sun", "He was tired"], correct: 1 },
      ],
      vocabulary: [
        { word: "grumpy", def: "feeling annoyed or in a bad mood" },
        { word: "imagination", def: "the ability to think of new and creative ideas" },
        { word: "silly", def: "funny and not serious" },
      ],
    },
  ],
  4: [
    {
      title: "How Bees Make Honey",
      text: "Honeybees are remarkable insects that work together to produce one of nature's sweetest treats. A worker bee visits flowers and collects a sugary liquid called nectar using its long, tube-shaped tongue. The bee stores the nectar in a special pouch inside its body called a honey stomach. When the bee returns to the hive, it passes the nectar to another bee, who chews it and mixes it with enzymes. This process slowly changes the nectar's chemistry. The bees then spread the thickened liquid into the six-sided cells of the honeycomb and fan it with their wings to remove extra moisture. Once the mixture becomes thick, sticky honey, the bees seal the cell with a thin layer of beeswax to keep it fresh. A single bee produces only a tiny amount of honey in its lifetime, so it takes an entire hive working together, visiting millions of flowers, to fill just one jar.",
      questions: [
        { q: "What liquid do bees collect from flowers?", options: ["Honey", "Nectar", "Pollen", "Water"], correct: 1 },
        { q: "What do bees use to remove extra moisture from the honey?", options: ["Their legs", "Their wings", "Sunlight", "Their tongue"], correct: 1 },
        { q: "Why does it take a whole hive to make honey?", options: ["One bee eats too much", "One bee makes only a tiny amount", "Bees are lazy", "Flowers are rare"], correct: 1 },
      ],
      vocabulary: [
        { word: "nectar", def: "a sweet liquid found inside flowers" },
        { word: "enzymes", def: "substances that help speed up chemical changes in living things" },
        { word: "honeycomb", def: "the six-sided wax structure bees use to store honey" },
      ],
    },
    {
      title: "The Mystery of the Missing Kite",
      text: "Every Saturday, Arjun flew his red kite in the park behind his house. One windy afternoon, he tied the kite string loosely to a bench while he tied his shoelace. When he looked up, the kite was gone. Arjun searched under benches and behind trees, but there was no sign of it. His neighbor, Priya, suggested they follow the direction of the wind. They walked for ten minutes until they spotted a bright red speck caught high in an old oak tree at the edge of the park. Using a long stick, Priya carefully knocked the tangled string loose while Arjun stood ready to catch it. The kite fluttered down, a little torn but still flyable. Arjun learned an important lesson that day: always tie your kite string tightly, especially on a breezy day. From then on, he checked his knot twice before letting the kite soar into the sky.",
      questions: [
        { q: "What color was Arjun's kite?", options: ["Blue", "Red", "Yellow", "Green"], correct: 1 },
        { q: "Where did they find the kite?", options: ["In a pond", "On the bench", "In an oak tree", "Under a car"], correct: 2 },
        { q: "What lesson did Arjun learn?", options: ["Fly kites only indoors", "Tie his kite string tightly", "Avoid windy days entirely", "Buy a new kite"], correct: 1 },
      ],
      vocabulary: [
        { word: "tangled", def: "twisted together in a messy way" },
        { word: "fluttered", def: "moved lightly and quickly through the air" },
        { word: "soar", def: "to fly or rise high in the sky" },
      ],
    },
    {
      title: "The Great Barrier Reef",
      text: "Stretching over two thousand kilometers along the coast of Australia, the Great Barrier Reef is the largest living structure on Earth, so enormous it can be seen from space. It is not made of rock, but of billions of tiny animals called coral polyps. Each polyp builds a hard skeleton around its soft body, and over thousands of years, these skeletons pile up to form the colorful reef structures we see today. The reef provides a home for an incredible variety of life, including sea turtles, reef sharks, and thousands of species of fish. Unfortunately, rising ocean temperatures can cause a problem called coral bleaching, where stressed coral polyps expel the colorful algae living inside them, turning the reef pale white. Scientists around the world are studying ways to protect this fragile ecosystem, because losing the reef would mean losing a home for countless sea creatures. Protecting coral reefs starts with small actions, like reducing pollution and being careful about what enters our oceans and rivers.",
      questions: [
        { q: "What is the Great Barrier Reef mostly made of?", options: ["Rocks", "Coral polyps", "Sand", "Seaweed"], correct: 1 },
        { q: "What causes coral bleaching?", options: ["Too much rain", "Rising ocean temperatures", "Too many fish", "Strong winds"], correct: 1 },
        { q: "What happens to bleached coral?", options: ["It turns bright red", "It turns pale white", "It grows faster", "It disappears instantly"], correct: 1 },
      ],
      vocabulary: [
        { word: "polyp", def: "a tiny sea animal with a soft body that can build a hard skeleton" },
        { word: "ecosystem", def: "a community of living things and their environment" },
        { word: "fragile", def: "easily damaged or broken" },
      ],
    },
  ],
};

// ---------- Storybook content ----------
const STORYBOOKS = [
  {
    id: "bumble",
    title: "Bumble the Bunny's Big Hop",
    blurb: "The smallest bunny in the meadow learns that little hops still count.",
    level: "First reads",
    color: COLORS.coral,
    colorDark: COLORS.coralDark,
    emoji: "🐰",
    pages: [
      "Bumble was the smallest bunny in the whole meadow. All of his brothers and sisters could hop over the tall grass in one big jump, but Bumble could only hop a little way.",
      "\"I will never hop far,\" said Bumble sadly. He sat down next to a big grey rock and watched the other bunnies play in the sunshine.",
      "An old tortoise named Pebbles walked slowly by. \"Small hops still get you somewhere,\" said Pebbles with a smile. \"You just have to keep hopping.\"",
      "So Bumble hopped once. Then he hopped again, and again. By the end of the day, he had hopped all the way around the meadow, one small hop at a time.",
      "From that day on, Bumble was proud of every hop, big or small. He had learned that little steps can take you a very long way.",
    ],
  },
  {
    id: "lighthouse",
    title: "The Lighthouse Keeper's Kite",
    blurb: "A keeper's daughter builds a kite to guide boats home on a foggy night.",
    level: "Growing readers",
    color: COLORS.blue,
    colorDark: COLORS.blueDark,
    emoji: "🪁",
    pages: [
      "On a rocky island far from shore, a girl named Wren lived with her father in a tall white lighthouse. Every night, he lit the great lamp so ships could find their way home safely.",
      "One evening, thick fog rolled in from the sea and covered the lighthouse light completely. Wren's father worried that no ship would be able to see it through the grey mist.",
      "Wren remembered the old kite in the shed, the one with a bright lantern hook sewn into its tail. She tied a small lamp to the string and ran to the highest cliff on the island.",
      "Up, up, up the kite climbed above the fog, its little lantern glowing like a floating star. Far out at sea, a tired captain looked up and finally spotted the light.",
      "The ship turned safely toward the harbor, guided home by Wren's clever kite. From then on, her father kept the kite ready by the door, just in case the fog ever returned.",
    ],
  },
  {
    id: "clockmaker",
    title: "The Clockmaker Who Lost Time",
    blurb: "A distracted clockmaker discovers that the best moments can't be measured.",
    level: "Confident readers",
    color: COLORS.gold,
    colorDark: COLORS.goldDark,
    emoji: "⏰",
    pages: [
      "In a narrow shop at the end of Maple Street, a clockmaker named Mr. Higgins spent every hour fixing the gears and springs of other people's clocks. He was always in a hurry, checking his own pocket watch again and again.",
      "One rainy afternoon, a young boy came in carrying a broken cuckoo clock that had belonged to his grandmother. \"Can you fix it before her birthday?\" the boy asked. Mr. Higgins nodded quickly, already thinking of his next task.",
      "As he worked, Mr. Higgins realized he could not remember the last time he had watched the rain, or laughed with a neighbor, or simply sat still without checking the time. He had spent so long measuring minutes that he had forgotten to enjoy them.",
      "He finished the cuckoo clock early and delivered it himself, staying for tea and stories with the boy's grandmother instead of rushing back to his shop. For the first time in years, he did not check his pocket watch once.",
      "That night, Mr. Higgins hung a small sign in his window: \"Clocks mended here — but don't forget to lose track of time now and then.\" His customers always smiled when they read it.",
    ],
  },
];

// ---------- shared read-aloud hook ----------
function useReadAloud(text) {
  const [listening, setListening] = useState(false);
  const [wordStatus, setWordStatus] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const recognitionRef = useRef(null);
  const pointerRef = useRef(0);
  const statusRef = useRef([]);

  const expectedWords = useMemo(() => tokenize(text).filter((t) => t.trim() !== "").map(cleanWord), [text]);
  const unsupported = typeof window === "undefined" || !(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    statusRef.current = Array(expectedWords.length).fill("pending");
    setWordStatus(statusRef.current);
    pointerRef.current = 0;
    setShowSummary(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => () => { if (recognitionRef.current) recognitionRef.current.stop(); }, []);

  const markStatus = (i, status) => {
    if (i < 0 || i >= statusRef.current.length) return;
    statusRef.current[i] = status;
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    setShowSummary(true);
  };

  const processTranscript = (transcript) => {
    const spokenWords = transcript.trim().toLowerCase().split(/\s+/).map((w) => w.replace(/[^a-z']/g, "")).filter(Boolean);
    spokenWords.forEach((word) => {
      if (pointerRef.current >= expectedWords.length) return;
      if (word === expectedWords[pointerRef.current]) {
        markStatus(pointerRef.current, "correct");
        pointerRef.current += 1;
        return;
      }
      let matched = false;
      for (let look = 1; look <= 2 && pointerRef.current + look < expectedWords.length; look++) {
        if (word === expectedWords[pointerRef.current + look]) {
          for (let k = 0; k < look; k++) markStatus(pointerRef.current + k, "wrong");
          markStatus(pointerRef.current + look, "correct");
          pointerRef.current += look + 1;
          matched = true;
          break;
        }
      }
      if (!matched) {
        markStatus(pointerRef.current, "wrong");
        pointerRef.current += 1;
      }
    });
    setWordStatus([...statusRef.current]);
    if (pointerRef.current >= expectedWords.length) stop();
  };

  const start = () => {
    if (unsupported) return;
    statusRef.current = Array(expectedWords.length).fill("pending");
    setWordStatus(statusRef.current);
    pointerRef.current = 0;
    setShowSummary(false);
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) processTranscript(event.results[i][0].transcript);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const reviewWords = useMemo(() => {
    const toks = tokenize(text).filter((t) => t.trim() !== "");
    return toks.filter((_, i) => wordStatus[i] === "wrong");
  }, [text, wordStatus]);

  const readCorrect = wordStatus.filter((s) => s === "correct").length;
  const readWrong = wordStatus.filter((s) => s === "wrong").length;

  return { listening, wordStatus, showSummary, start, stop, pointerRef, reviewWords, readCorrect, readWrong, unsupported, totalWords: expectedWords.length };
}

function HighlightedText({ text, wordStatus, listening, pointerRef, accent, ink }) {
  let wIdx = -1;
  return tokenize(text).map((tok, ti) => {
    if (tok.trim() === "") return <span key={ti}>{tok}</span>;
    wIdx += 1;
    const status = wordStatus[wIdx];
    const isCurrent = listening && wIdx === pointerRef.current;
    const bg = status === "correct" ? "#EAF5EE" : status === "wrong" ? "#FCEDEA" : "transparent";
    const col = status === "correct" ? COLORS.greenDark : status === "wrong" ? COLORS.coralDark : ink;
    return (
      <span
        key={ti}
        style={{
          background: bg,
          color: col,
          borderRadius: 4,
          padding: bg !== "transparent" ? "1px 2px" : 0,
          outline: isCurrent ? `2px solid ${accent}` : "none",
        }}
      >
        {tok}
      </span>
    );
  });
}

function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.85;
  utter.pitch = 1.05;
  window.speechSynthesis.speak(utter);
}

// ---------- shared bits ----------
function TornHeader({ children, color }) {
  return (
    <div
      style={{
        background: color,
        clipPath: "polygon(0 0,100% 0,100% 100%,97% 92%,94% 100%,91% 92%,88% 100%,85% 92%,82% 100%,79% 92%,76% 100%,73% 92%,70% 100%,67% 92%,64% 100%,61% 92%,58% 100%,55% 92%,52% 100%,49% 92%,46% 100%,43% 92%,40% 100%,37% 92%,34% 100%,31% 92%,28% 100%,25% 92%,22% 100%,19% 92%,16% 100%,13% 92%,10% 100%,7% 92%,4% 100%,1% 92%,0 100%)",
        padding: "14px 22px 22px",
        color: "#fff",
        fontFamily: "'Baloo 2', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function Stamp({ score, total }) {
  const pct = Math.round((score / total) * 100);
  const good = pct >= 70;
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 96,
        height: 96,
        borderRadius: "50%",
        border: `3px dashed ${good ? COLORS.green : COLORS.coral}`,
        color: good ? COLORS.greenDark : COLORS.coralDark,
        transform: "rotate(-8deg)",
        fontFamily: "'Baloo 2', sans-serif",
        background: good ? "#EAF5EE" : "#FCEDEA",
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{score}/{total}</span>
      <span style={{ fontSize: 10, letterSpacing: 1, marginTop: 2, textTransform: "uppercase" }}>{good ? "Nice work" : "Keep going"}</span>
    </div>
  );
}

function Dashes({ color }) {
  return <div style={{ borderTop: `2px dashed ${color}`, margin: "18px 0" }} />;
}

// ---------- Maths view ----------
function MathsView({ onBack }) {
  const [classLevel, setClassLevel] = useState(2);
  const [worksheet, setWorksheet] = useState(() => makeWorksheet(2));
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [includeKey, setIncludeKey] = useState(false);

  const accent = classLevel === 2 ? COLORS.green : COLORS.blue;
  const accentDark = classLevel === 2 ? COLORS.greenDark : COLORS.blueDark;

  const score = useMemo(() => {
    if (!checked) return 0;
    return worksheet.filter((p) => (answers[p.id] || "").trim().toLowerCase() === p.answer.toLowerCase()).length;
  }, [checked, worksheet, answers]);

  const regenerate = (lvl) => {
    setClassLevel(lvl);
    setWorksheet(makeWorksheet(lvl));
    setAnswers({});
    setChecked(false);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={16} /> Home</button>
        <div style={{ display: "flex", gap: 8 }}>
          {[2, 4].map((lvl) => (
            <button
              key={lvl}
              onClick={() => regenerate(lvl)}
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 999,
                border: `2px solid ${lvl === 2 ? COLORS.green : COLORS.blue}`,
                background: classLevel === lvl ? (lvl === 2 ? COLORS.green : COLORS.blue) : "transparent",
                color: classLevel === lvl ? "#fff" : lvl === 2 ? COLORS.greenDark : COLORS.blueDark,
                cursor: "pointer",
              }}
            >
              Class {lvl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: COLORS.paper, borderRadius: 16, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
        <TornHeader color={accent}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Calculator size={26} />
            <div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Maths worksheet</div>
              <div style={{ fontSize: 13, opacity: 0.9, fontFamily: "'Lexend', sans-serif" }}>Class {classLevel} · 10 problems</div>
            </div>
          </div>
        </TornHeader>

        <div style={{ padding: "24px 28px 28px", fontFamily: "'Lexend', sans-serif" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
            {worksheet.map((p, i) => {
              const userAns = answers[p.id] || "";
              const isCorrect = checked && userAns.trim().toLowerCase() === p.answer.toLowerCase();
              const isWrong = checked && userAns.trim() !== "" && !isCorrect;
              return (
                <div
                  key={p.id}
                  style={{
                    gridColumn: p.isWord ? "1 / -1" : "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isCorrect ? "#EAF5EE" : isWrong ? "#FCEDEA" : "#FAF7EF",
                    border: `1px solid ${isCorrect ? COLORS.green : isWrong ? COLORS.coral : COLORS.line}`,
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: COLORS.inkSoft, fontSize: 13 }}>{i + 1}.</span>
                  <span style={{ flex: 1, fontSize: p.isWord ? 14 : 16, color: COLORS.ink, fontFamily: p.isWord ? "'Lexend', sans-serif" : "'JetBrains Mono', monospace" }}>{p.prompt}</span>
                  <input
                    value={userAns}
                    onChange={(e) => setAnswers({ ...answers, [p.id]: e.target.value })}
                    placeholder="?"
                    style={{
                      width: 64,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      textAlign: "center",
                      padding: "6px 4px",
                      borderRadius: 6,
                      border: `1.5px solid ${COLORS.line}`,
                      background: "#fff",
                    }}
                  />
                  {checked && (isCorrect ? <CheckCircle2 size={18} color={COLORS.green} /> : userAns.trim() !== "" ? <XCircle size={18} color={COLORS.coral} /> : null)}
                  {checked && isWrong && <span style={{ fontSize: 12, color: COLORS.coralDark, fontFamily: "'JetBrains Mono', monospace" }}>({p.answer})</span>}
                </div>
              );
            })}
          </div>

          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
            <button onClick={() => setChecked(true)} style={{ ...primaryBtnStyle, background: accent }}>
              <CheckCircle2 size={16} /> Check answers
            </button>
            <button onClick={() => regenerate(classLevel)} style={secondaryBtnStyle}>
              <RotateCcw size={16} /> New worksheet
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: COLORS.inkSoft }}>
              <input type="checkbox" checked={includeKey} onChange={(e) => setIncludeKey(e.target.checked)} />
              Include answer key when printing
            </label>
            <button onClick={() => window.print()} style={secondaryBtnStyle}>
              <Printer size={16} /> Print
            </button>
            {checked && <Stamp score={score} total={worksheet.length} />}
          </div>

          {includeKey && (
            <div className="print-only" style={{ display: "none", marginTop: 24, paddingTop: 16, borderTop: `2px dashed ${COLORS.line}` }}>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: accentDark, marginBottom: 8 }}>Answer key</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                {worksheet.map((p, i) => (
                  <div key={p.id}>{i + 1}. {p.answer}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- English view ----------
function EnglishView({ onBack }) {
  const [classLevel, setClassLevel] = useState(2);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const [checked, setChecked] = useState(false);

  const list = PASSAGES[classLevel];
  const passage = list[idx];
  const accent = classLevel === 2 ? COLORS.green : COLORS.blue;
  const accentDark = classLevel === 2 ? COLORS.greenDark : COLORS.blueDark;

  const ra = useReadAloud(passage.text);
  const { listening, wordStatus, showSummary, start: startReading, stop: stopReading, pointerRef, reviewWords, readCorrect, readWrong, unsupported } = ra;

  const score = useMemo(() => {
    if (!checked) return 0;
    return passage.questions.filter((q, i) => selected[i] === q.correct).length;
  }, [checked, passage, selected]);

  const changeLevel = (lvl) => {
    setClassLevel(lvl);
    setIdx(0);
    setSelected({});
    setChecked(false);
  };
  const changePassage = (dir) => {
    setIdx((prev) => (prev + dir + list.length) % list.length);
    setSelected({});
    setChecked(false);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={16} /> Home</button>
        <div style={{ display: "flex", gap: 8 }}>
          {[2, 4].map((lvl) => (
            <button
              key={lvl}
              onClick={() => changeLevel(lvl)}
              style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                padding: "8px 18px",
                borderRadius: 999,
                border: `2px solid ${lvl === 2 ? COLORS.green : COLORS.blue}`,
                background: classLevel === lvl ? (lvl === 2 ? COLORS.green : COLORS.blue) : "transparent",
                color: classLevel === lvl ? "#fff" : lvl === 2 ? COLORS.greenDark : COLORS.blueDark,
                cursor: "pointer",
              }}
            >
              Class {lvl}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: COLORS.paper, borderRadius: 16, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
        <TornHeader color={accent}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <BookOpen size={26} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{passage.title}</div>
                <div style={{ fontSize: 13, opacity: 0.9, fontFamily: "'Lexend', sans-serif" }}>Class {classLevel} reading journal</div>
              </div>
            </div>
            <div className="no-print" style={{ display: "flex", gap: 6 }}>
              <button onClick={() => changePassage(-1)} style={iconBtnStyle}><ChevronLeft size={18} /></button>
              <button onClick={() => changePassage(1)} style={iconBtnStyle}><ChevronRight size={18} /></button>
            </div>
          </div>
        </TornHeader>

        <div style={{ padding: "24px 28px 28px", fontFamily: "'Lexend', sans-serif" }}>
          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {unsupported ? (
              <span style={{ fontSize: 13, color: COLORS.coralDark }}>
                Speech recognition isn't supported in this browser. Try Chrome or Edge on desktop, and allow microphone access when asked.
              </span>
            ) : listening ? (
              <button onClick={stopReading} style={{ ...primaryBtnStyle, background: COLORS.coral }}>
                <Square size={14} /> Stop reading
              </button>
            ) : (
              <button onClick={startReading} style={{ ...primaryBtnStyle, background: accent }}>
                <Mic size={16} /> Practice reading aloud
              </button>
            )}
            {listening && (
              <span style={{ fontSize: 13, color: accentDark, display: "flex", alignItems: "center", gap: 4 }}>
                <Volume2 size={14} /> Listening — read the passage out loud
              </span>
            )}
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.9, color: COLORS.ink }}>
            <HighlightedText text={passage.text} wordStatus={wordStatus} listening={listening} pointerRef={pointerRef} accent={accent} ink={COLORS.ink} />
          </p>

          {showSummary && (
            <div className="no-print" style={{ background: "#FAF7EF", border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: accentDark, fontSize: 14, marginBottom: 6 }}>
                Reading check: {readCorrect} read clearly, {readWrong} to practice
              </div>
              {reviewWords.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {reviewWords.map((w, i) => (
                    <span key={i} style={{ fontSize: 13, color: COLORS.coralDark, background: "#FCEDEA", padding: "3px 9px", borderRadius: 999 }}>{w}</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: COLORS.inkSoft }}>Every word came through clearly. Nice reading!</div>
              )}
            </div>
          )}

          <Dashes color={COLORS.line} />

          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: accentDark, fontSize: 15, marginBottom: 10 }}>
            Word bank
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10, marginBottom: 20 }}>
            {passage.vocabulary.map((v) => (
              <div key={v.word} style={{ background: "#FAF7EF", border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontWeight: 600, color: COLORS.ink, fontSize: 14 }}>{v.word}</div>
                <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 2 }}>{v.def}</div>
              </div>
            ))}
          </div>

          <Dashes color={COLORS.line} />

          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: accentDark, fontSize: 15, marginBottom: 10 }}>
            Check your understanding
          </div>
          {passage.questions.map((q, qi) => (
            <div key={qi} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, color: COLORS.ink, marginBottom: 8, fontWeight: 500 }}>{qi + 1}. {q.q}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {q.options.map((opt, oi) => {
                  const isSel = selected[qi] === oi;
                  const isRight = checked && oi === q.correct;
                  const isWrongSel = checked && isSel && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      onClick={() => !checked && setSelected({ ...selected, [qi]: oi })}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontSize: 13,
                        cursor: checked ? "default" : "pointer",
                        border: `1.5px solid ${isRight ? COLORS.green : isWrongSel ? COLORS.coral : isSel ? accent : COLORS.line}`,
                        background: isRight ? "#EAF5EE" : isWrongSel ? "#FCEDEA" : isSel ? "#FAF7EF" : "#fff",
                        color: COLORS.ink,
                        fontFamily: "'Lexend', sans-serif",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <button onClick={() => setChecked(true)} style={{ ...primaryBtnStyle, background: accent }}>
              <CheckCircle2 size={16} /> Check answers
            </button>
            <button onClick={() => changePassage(1)} style={secondaryBtnStyle}>
              <RotateCcw size={16} /> New passage
            </button>
            <button onClick={() => window.print()} style={secondaryBtnStyle}>
              <Printer size={16} /> Print
            </button>
            {checked && <Stamp score={score} total={passage.questions.length} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Storybook view ----------
function StorybookView({ onBack }) {
  const [storyIdx, setStoryIdx] = useState(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [finished, setFinished] = useState(false);

  const story = storyIdx !== null ? STORYBOOKS[storyIdx] : null;
  const pageText = story ? story.pages[pageIdx] : "";
  const ra = useReadAloud(pageText);
  const { listening, wordStatus, showSummary, start, stop, pointerRef, reviewWords, readCorrect, readWrong, unsupported } = ra;

  const openStory = (i) => {
    setStoryIdx(i);
    setPageIdx(0);
    setFinished(false);
  };

  const goPage = (dir) => {
    if (!story) return;
    const next = pageIdx + dir;
    if (next < 0) return;
    if (next >= story.pages.length) {
      setFinished(true);
      return;
    }
    setPageIdx(next);
  };

  if (!story) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={16} /> Home</button>
        </div>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.gold, marginBottom: 8 }}>
            <Library size={20} />
            <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: "uppercase" }}>Storybook shelf</span>
          </div>
          <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 30, color: COLORS.ink, margin: "0 0 8px" }}>Pick a story to read aloud</h1>
          <p style={{ fontFamily: "'Lexend', sans-serif", color: COLORS.inkSoft, fontSize: 14 }}>
            Listen to each page, then read it back — the reading buddy highlights every word green as you get it right.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18 }}>
          {STORYBOOKS.map((s, i) => (
            <button key={s.id} onClick={() => openStory(i)} style={{ ...pathCardStyle, borderColor: s.color, textAlign: "left", alignItems: "flex-start" }}>
              <div style={{ fontSize: 40 }}>{s.emoji}</div>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 17, color: s.colorDark, marginTop: 10 }}>{s.title}</div>
              <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 12, color: COLORS.inkSoft, marginTop: 4 }}>{s.blurb}</div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: s.colorDark, background: "#fff", border: `1px solid ${s.color}`, borderRadius: 999, padding: "3px 10px", fontFamily: "'Baloo 2', sans-serif" }}>
                {s.level} · {s.pages.length} pages
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <div style={{ background: COLORS.paper, borderRadius: 16, border: `1px solid ${COLORS.line}`, padding: "48px 28px" }}>
          <PartyPopper size={44} color={story.colorDark} />
          <h2 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 26, color: COLORS.ink, margin: "14px 0 6px" }}>
            You finished "{story.title}"!
          </h2>
          <p style={{ fontFamily: "'Lexend', sans-serif", color: COLORS.inkSoft, fontSize: 14, marginBottom: 24 }}>
            Great reading. Try it again, or pick another story from the shelf.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={() => { setPageIdx(0); setFinished(false); }} style={{ ...primaryBtnStyle, background: story.color }}>
              <RotateCcw size={16} /> Read again
            </button>
            <button onClick={() => setStoryIdx(null)} style={secondaryBtnStyle}>
              <Library size={16} /> Storybook shelf
            </button>
          </div>
        </div>
      </div>
    );
  }

  const accent = story.color;
  const accentDark = story.colorDark;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={() => setStoryIdx(null)} style={backBtnStyle}><ArrowLeft size={16} /> Storybook shelf</button>
        <div style={{ display: "flex", gap: 6 }}>
          {story.pages.map((_, i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === pageIdx ? accent : COLORS.line }} />
          ))}
        </div>
      </div>

      <div style={{ background: COLORS.paper, borderRadius: 16, border: `1px solid ${COLORS.line}`, overflow: "hidden" }}>
        <TornHeader color={accent}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 30 }}>{story.emoji}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{story.title}</div>
              <div style={{ fontSize: 13, opacity: 0.9, fontFamily: "'Lexend', sans-serif" }}>Page {pageIdx + 1} of {story.pages.length}</div>
            </div>
          </div>
        </TornHeader>

        <div style={{ padding: "24px 28px 28px", fontFamily: "'Lexend', sans-serif" }}>
          <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <button onClick={() => speak(pageText)} style={secondaryBtnStyle}>
              <Volume2 size={16} /> Read this page to me
            </button>
            {unsupported ? (
              <span style={{ fontSize: 13, color: COLORS.coralDark }}>
                Reading-aloud practice needs Chrome or Edge with microphone access.
              </span>
            ) : listening ? (
              <button onClick={stop} style={{ ...primaryBtnStyle, background: COLORS.coral }}>
                <Square size={14} /> Stop reading
              </button>
            ) : (
              <button onClick={start} style={{ ...primaryBtnStyle, background: accent }}>
                <Mic size={16} /> Your turn — read aloud
              </button>
            )}
            {listening && (
              <span style={{ fontSize: 13, color: accentDark, display: "flex", alignItems: "center", gap: 4 }}>
                <Volume2 size={14} /> Listening — read the page out loud
              </span>
            )}
          </div>

          <p style={{ fontSize: 19, lineHeight: 2, color: COLORS.ink, fontFamily: "'Lexend', sans-serif" }}>
            <HighlightedText text={pageText} wordStatus={wordStatus} listening={listening} pointerRef={pointerRef} accent={accent} ink={COLORS.ink} />
          </p>

          {showSummary && (
            <div className="no-print" style={{ background: "#FAF7EF", border: `1px solid ${COLORS.line}`, borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
              <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, color: accentDark, fontSize: 14, marginBottom: 6 }}>
                Reading buddy check: {readCorrect} read clearly, {readWrong} to practice
              </div>
              {reviewWords.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {reviewWords.map((w, i) => (
                    <span key={i} style={{ fontSize: 13, color: COLORS.coralDark, background: "#FCEDEA", padding: "3px 9px", borderRadius: 999 }}>{w}</span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: COLORS.inkSoft }}>Every word came through clearly. Nice reading!</div>
              )}
            </div>
          )}

          <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22 }}>
            <button onClick={() => goPage(-1)} disabled={pageIdx === 0} style={{ ...secondaryBtnStyle, opacity: pageIdx === 0 ? 0.4 : 1, cursor: pageIdx === 0 ? "default" : "pointer" }}>
              <ChevronLeft size={16} /> Previous page
            </button>
            <button onClick={() => goPage(1)} style={{ ...primaryBtnStyle, background: accent }}>
              {pageIdx === story.pages.length - 1 ? "Finish story" : "Next page"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Home ----------
function Home({ onSelect }) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: COLORS.gold, marginBottom: 8 }}>
        <Sparkles size={20} />
        <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: "uppercase" }}>Family learning trail</span>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: 34, color: COLORS.ink, margin: "0 0 8px" }}>
        Pick a path for today
      </h1>
      <p style={{ fontFamily: "'Lexend', sans-serif", color: COLORS.inkSoft, fontSize: 15, marginBottom: 36 }}>
        Fresh worksheets, reading passages, and storybooks for class 2 and class 4, every time.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
        <button onClick={() => onSelect("maths")} style={{ ...pathCardStyle, borderColor: COLORS.green }}>
          <Calculator size={34} color={COLORS.greenDark} />
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 20, color: COLORS.greenDark, marginTop: 10 }}>Maths explorer</div>
          <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>Generate and print worksheets</div>
        </button>
        <button onClick={() => onSelect("english")} style={{ ...pathCardStyle, borderColor: COLORS.blue }}>
          <BookOpen size={34} color={COLORS.blueDark} />
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 20, color: COLORS.blueDark, marginTop: 10 }}>Reading journal</div>
          <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>Passages, questions and word bank</div>
        </button>
        <button onClick={() => onSelect("storybook")} style={{ ...pathCardStyle, borderColor: COLORS.coral }}>
          <Library size={34} color={COLORS.coralDark} />
          <div style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 20, color: COLORS.coralDark, marginTop: 10 }}>Storybook</div>
          <div style={{ fontFamily: "'Lexend', sans-serif", fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>Listen, then read aloud with the reading buddy</div>
        </button>
      </div>
    </div>
  );
}

const backBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  border: "none",
  color: COLORS.inkSoft,
  fontFamily: "'Lexend', sans-serif",
  fontSize: 14,
  cursor: "pointer",
};

const primaryBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "#fff",
  border: "none",
  padding: "9px 16px",
  borderRadius: 999,
  fontFamily: "'Baloo 2', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

const secondaryBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "transparent",
  border: `1.5px solid ${COLORS.line}`,
  padding: "9px 16px",
  borderRadius: 999,
  fontFamily: "'Baloo 2', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  color: COLORS.ink,
  cursor: "pointer",
};

const iconBtnStyle = {
  background: "rgba(255,255,255,0.25)",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const pathCardStyle = {
  background: COLORS.paper,
  border: "2px solid",
  borderRadius: 16,
  padding: "28px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
};

export default function App() {
  const [view, setView] = useState("home");
  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, padding: "40px 20px 60px" }}>
      <style>{FONTS}{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: #fff !important; }
        }
      `}</style>
      {view === "home" && <Home onSelect={setView} />}
      {view === "maths" && <MathsView onBack={() => setView("home")} />}
      {view === "english" && <EnglishView onBack={() => setView("home")} />}
      {view === "storybook" && <StorybookView onBack={() => setView("home")} />}
    </div>
  );
}
