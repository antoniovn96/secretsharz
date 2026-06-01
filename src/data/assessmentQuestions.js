/**
 * assessmentQuestions.js
 *
 * Comprehensive Psychometric Career Assessment Data
 * Based on the Holland Code (RIASEC) Framework
 *
 * Structure:
 *  - demographicQuestions   : Age, maturity, grades, subjects
 *  - riasecQuestions        : 6 Holland categories, each with multiple questions
 *  - extracurricularQuestions: Hobbies, work values, stress tolerance
 *
 * Each question object follows this schema:
 * {
 *   id        : string   – unique identifier
 *   section   : string   – section key (e.g. "demographic", "realistic", …)
 *   type      : string   – "single" | "multiple" | "scale" | "text" | "ranking"
 *   question  : string   – the question text shown to the user
 *   options   : Array    – answer choices (omitted for "text" type)
 *   scaleMin  : number   – (scale only) minimum value
 *   scaleMax  : number   – (scale only) maximum value
 *   scaleLabels: object  – (scale only) { min: string, max: string }
 *   riasecKey : string   – (riasec only) "R"|"I"|"A"|"S"|"E"|"C"
 *   weight    : number   – scoring weight (default 1)
 * }
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 – DEMOGRAPHIC & ACADEMIC PROFILING
// ─────────────────────────────────────────────────────────────────────────────
export const demographicQuestions = [
  {
    id: "dem_01",
    section: "demographic",
    type: "single",
    question: "What is your current age?",
    options: [
      "Under 14",
      "14 – 15",
      "16 – 17",
      "18 – 19",
      "20 – 22",
      "23 and above",
    ],
  },
  {
    id: "dem_02",
    section: "demographic",
    type: "single",
    question: "What is your current level of education?",
    options: [
      "Middle School (Class 6–8)",
      "High School (Class 9–10)",
      "Senior Secondary (Class 11–12)",
      "Undergraduate (College / University)",
      "Postgraduate",
      "Working Professional",
    ],
  },
  {
    id: "dem_03",
    section: "demographic",
    type: "single",
    question:
      "What is your current overall academic performance (percentage / CGPA equivalent)?",
    options: [
      "Below 50%",
      "50% – 59%",
      "60% – 69%",
      "70% – 79%",
      "80% – 89%",
      "90% and above",
    ],
  },
  {
    id: "dem_04",
    section: "demographic",
    type: "multiple",
    question:
      "Which subjects do you enjoy the most or perform best in? (Select all that apply)",
    options: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology / Life Sciences",
      "Computer Science / IT",
      "History / Political Science",
      "Geography / Environmental Studies",
      "Economics / Business Studies",
      "Accountancy / Commerce",
      "English / Literature",
      "Hindi / Regional Language",
      "Fine Arts / Music / Drama",
      "Physical Education / Sports",
      "Psychology / Sociology",
      "Philosophy / Ethics",
    ],
  },
  {
    id: "dem_05",
    section: "demographic",
    type: "single",
    question:
      "You receive a complex group project with a tight deadline. Your team is disorganised. What do you do?",
    options: [
      "Take charge immediately — divide tasks, set mini-deadlines, and track progress",
      "Suggest a quick meeting to align everyone before starting",
      "Focus on your own portion and trust others to manage theirs",
      "Ask the teacher/supervisor for an extension",
      "Feel overwhelmed but push through on your own",
    ],
  },
  {
    id: "dem_06",
    section: "demographic",
    type: "single",
    question:
      "A friend asks you to help them cheat on an important exam. You value your friendship. What do you do?",
    options: [
      "Firmly decline and explain why it is wrong",
      "Decline but offer to help them study instead",
      "Feel conflicted but ultimately refuse",
      "Help them because friendship matters more",
      "Ignore the request and hope they figure it out",
    ],
  },
  {
    id: "dem_07",
    section: "demographic",
    type: "single",
    question:
      "You notice a classmate is being bullied but the bully is popular. What is your most likely response?",
    options: [
      "Intervene directly and stand up for the classmate",
      "Report it to a teacher or authority figure",
      "Comfort the classmate privately after the incident",
      "Stay silent to avoid conflict",
      "Join others in ignoring it",
    ],
  },
  {
    id: "dem_08",
    section: "demographic",
    type: "single",
    question:
      "You are given a long-term project with no fixed checkpoints. How do you manage your time?",
    options: [
      "Create a detailed schedule with milestones from day one",
      "Work steadily but without a strict plan",
      "Start early but lose momentum midway",
      "Work intensively only near the deadline",
      "Struggle to start without external pressure",
    ],
  },
  {
    id: "dem_09",
    section: "demographic",
    type: "single",
    question:
      "When you make a significant mistake, what is your typical first reaction?",
    options: [
      "Analyse what went wrong and immediately plan a correction",
      "Feel bad briefly, then move on and learn from it",
      "Seek advice from someone more experienced",
      "Dwell on it for a while before recovering",
      "Blame external circumstances",
    ],
  },
  {
    id: "dem_10",
    section: "demographic",
    type: "scale",
    question:
      "How would you rate your overall sense of responsibility and self-discipline?",
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: {
      min: "Very low — I need constant reminders",
      max: "Very high — I am highly self-directed",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 – RIASEC QUESTION BANK
// ─────────────────────────────────────────────────────────────────────────────

// ── R: REALISTIC (Doers) ──────────────────────────────────────────────────────
export const realisticQuestions = [
  {
    id: "r_01",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question: "I enjoy working with tools, machines, or physical equipment.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_02",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I prefer hands-on tasks over reading or writing-based activities.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_03",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I find satisfaction in building, repairing, or assembling physical objects.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_04",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I am comfortable working outdoors or in physically demanding environments.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_05",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I enjoy activities like carpentry, electronics, mechanics, or engineering projects.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_06",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I prefer concrete, practical problems over abstract or theoretical ones.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_07",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I am good at reading maps, blueprints, or technical diagrams.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_08",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I would enjoy a career in construction, manufacturing, or skilled trades.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_09",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I like working with animals, plants, or natural environments (farming, forestry, veterinary work).",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_10",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I feel more productive when I can see a tangible result of my work at the end of the day.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_11",
    section: "riasec",
    riasecKey: "R",
    type: "single",
    question:
      "If you had to choose one, which of these activities would you find most enjoyable?",
    options: [
      "Assembling a complex piece of furniture from scratch",
      "Designing a new app interface",
      "Tutoring a struggling student",
      "Analysing a business strategy",
      "Organising a filing system",
    ],
    weight: 2,
  },
  {
    id: "r_12",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I enjoy physical sports, athletics, or activities that require body coordination.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_13",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I am interested in how machines, engines, or electronic devices work.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_14",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I would rather fix something broken myself than hire someone to do it.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "r_15",
    section: "riasec",
    riasecKey: "R",
    type: "scale",
    question:
      "I am comfortable with physical risk or working in challenging conditions (heights, heat, machinery).",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
];

// ── I: INVESTIGATIVE (Thinkers) ───────────────────────────────────────────────
export const investigativeQuestions = [
  {
    id: "i_01",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I enjoy researching topics in depth, even beyond what is required for school.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_02",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I am fascinated by scientific questions and how the natural world works.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_03",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I prefer to understand the 'why' behind things rather than just accepting facts.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_04",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I enjoy solving complex mathematical or logical puzzles.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_05",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I like conducting experiments or testing hypotheses to find answers.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_06",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I am drawn to careers in science, medicine, technology, or research.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_07",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I enjoy reading academic articles, non-fiction books, or scientific journals.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_08",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I am comfortable working independently for long periods on intellectual tasks.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_09",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I enjoy analysing data, identifying patterns, and drawing conclusions.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_10",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I often question conventional wisdom and like to form my own evidence-based opinions.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_11",
    section: "riasec",
    riasecKey: "I",
    type: "single",
    question:
      "Which of the following tasks would you find most intellectually stimulating?",
    options: [
      "Designing a controlled experiment to test a new drug",
      "Writing a short story with complex characters",
      "Coaching a sports team to victory",
      "Negotiating a business deal",
      "Preparing a detailed financial report",
    ],
    weight: 2,
  },
  {
    id: "i_12",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I find it satisfying to solve a problem that others have given up on.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_13",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I enjoy learning about topics like astronomy, genetics, neuroscience, or quantum physics.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_14",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I prefer working in environments where precision and accuracy are highly valued.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "i_15",
    section: "riasec",
    riasecKey: "I",
    type: "scale",
    question:
      "I am good at breaking down complex problems into smaller, manageable components.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
];

// ── A: ARTISTIC (Creators) ────────────────────────────────────────────────────
export const artisticQuestions = [
  {
    id: "a_01",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I enjoy expressing myself through art, music, writing, or performance.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_02",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I prefer open-ended tasks where I can use my imagination over structured, rule-based tasks.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_03",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I am drawn to aesthetics — I notice and appreciate beauty in design, nature, or art.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_04",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I enjoy creative writing, poetry, storytelling, or scriptwriting.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_05",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I feel most alive when I am creating something new — a painting, a song, a design, or a story.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_06",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I am interested in careers in film, fashion, architecture, graphic design, or the performing arts.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_07",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I find rigid rules and strict procedures creatively stifling.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_08",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I enjoy visiting museums, galleries, theatres, or attending concerts.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_09",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I often think in images, metaphors, or unconventional ways.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_10",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I value originality and self-expression more than following established conventions.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_11",
    section: "riasec",
    riasecKey: "A",
    type: "single",
    question:
      "If you were given a free afternoon with no obligations, what would you most likely do?",
    options: [
      "Sketch, paint, or work on a creative project",
      "Read a science book or watch a documentary",
      "Volunteer at a community event",
      "Plan a new business idea",
      "Organise your room or study space",
    ],
    weight: 2,
  },
  {
    id: "a_12",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I enjoy photography, videography, or digital content creation.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_13",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I am sensitive to emotions and often use creative outlets to process my feelings.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_14",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I enjoy learning about the history of art, literature, or cultural movements.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "a_15",
    section: "riasec",
    riasecKey: "A",
    type: "scale",
    question:
      "I am good at coming up with creative solutions that others would not think of.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
];

// ── S: SOCIAL (Helpers) ───────────────────────────────────────────────────────
export const socialQuestions = [
  {
    id: "s_01",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I genuinely enjoy helping others solve their personal or academic problems.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_02",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am a good listener and people often come to me for advice or support.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_03",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I find teaching, mentoring, or coaching others deeply rewarding.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_04",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am drawn to careers in healthcare, counselling, social work, or education.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_05",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I feel energised after spending time with people and engaging in meaningful conversations.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_06",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am empathetic — I can easily understand and share the feelings of others.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_07",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I enjoy working in teams and collaborating with diverse groups of people.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_08",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am passionate about social justice, community development, or humanitarian causes.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_09",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am skilled at resolving conflicts and mediating between people with opposing views.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_10",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I prefer working in environments where I can make a direct positive impact on people's lives.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_11",
    section: "riasec",
    riasecKey: "S",
    type: "single",
    question:
      "A new student joins your class and seems lost and anxious. What do you do?",
    options: [
      "Immediately introduce yourself and offer to show them around",
      "Smile and wait for them to approach you",
      "Mention it to the teacher so they can help",
      "Focus on your own work — they will settle in eventually",
      "Observe from a distance to see if they need help",
    ],
    weight: 2,
  },
  {
    id: "s_12",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I enjoy volunteering, community service, or NGO/charity work.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_13",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am patient and can explain things clearly to people who are struggling to understand.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_14",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I find it meaningful to be part of a cause larger than myself.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "s_15",
    section: "riasec",
    riasecKey: "S",
    type: "scale",
    question:
      "I am comfortable discussing sensitive or emotional topics with others.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
];

// ── E: ENTERPRISING (Persuaders) ──────────────────────────────────────────────
export const enterprisingQuestions = [
  {
    id: "e_01",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I enjoy leading groups, taking charge, and directing others towards a goal.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_02",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am persuasive — I can convince others to see my point of view.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_03",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am excited by the idea of starting my own business or entrepreneurial venture.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_04",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I enjoy competitive environments where I can prove my abilities.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_05",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am drawn to careers in sales, marketing, law, politics, or management.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_06",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am comfortable speaking in public and presenting ideas to large audiences.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_07",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am motivated by financial success, status, and recognition.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_08",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I enjoy negotiating, deal-making, and finding win-win solutions.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_09",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am a risk-taker — I am willing to take calculated risks to achieve big goals.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_10",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I naturally take initiative and do not wait for others to tell me what to do.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_11",
    section: "riasec",
    riasecKey: "E",
    type: "single",
    question:
      "Your school is organising a fundraiser. What role would you most naturally take on?",
    options: [
      "Lead the entire event — plan, delegate, and drive results",
      "Design the posters and promotional materials",
      "Manage the accounts and track all expenses",
      "Counsel students who are stressed about the event",
      "Research the best fundraising strategies",
    ],
    weight: 2,
  },
  {
    id: "e_12",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I enjoy debating, arguing a position, and winning an argument with logic.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_13",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am good at reading people and understanding what motivates them.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_14",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I thrive in fast-paced, high-pressure environments with high stakes.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "e_15",
    section: "riasec",
    riasecKey: "E",
    type: "scale",
    question:
      "I am ambitious — I set high goals for myself and work hard to achieve them.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
];

// ── C: CONVENTIONAL (Organizers) ──────────────────────────────────────────────
export const conventionalQuestions = [
  {
    id: "c_01",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I enjoy organising information, files, data, or systems in a structured way.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_02",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I prefer clear instructions and well-defined procedures over ambiguous tasks.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_03",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I am detail-oriented and rarely make careless mistakes.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_04",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I am drawn to careers in accounting, finance, administration, banking, or data management.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_05",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I feel comfortable following established rules, policies, and standard operating procedures.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_06",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I enjoy working with numbers, spreadsheets, budgets, or financial records.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_07",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I like having a predictable, stable routine in my work or study life.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_08",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I am good at managing time, meeting deadlines, and keeping track of multiple tasks.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_09",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I enjoy proofreading, editing, or checking work for errors and inconsistencies.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_10",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I value job security, stability, and a clear career progression path.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_11",
    section: "riasec",
    riasecKey: "C",
    type: "single",
    question:
      "You are given a large dataset with errors. What is your approach?",
    options: [
      "Systematically go through each entry, correct errors, and document changes",
      "Write a script or formula to automate the correction",
      "Visualise the data to spot patterns and anomalies",
      "Ask a colleague to help review it together",
      "Summarise the key findings and present them to the team",
    ],
    weight: 2,
  },
  {
    id: "c_12",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I am comfortable with repetitive tasks as long as they are done correctly and efficiently.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_13",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I enjoy using software tools like Excel, databases, or ERP systems.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_14",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I prefer working in an office or structured environment over fieldwork or travel.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
  {
    id: "c_15",
    section: "riasec",
    riasecKey: "C",
    type: "scale",
    question:
      "I take pride in producing neat, accurate, and well-organised work.",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: { min: "Strongly Disagree", max: "Strongly Agree" },
    weight: 1,
  },
];

// Consolidated RIASEC array for easy iteration
export const riasecQuestions = [
  ...realisticQuestions,
  ...investigativeQuestions,
  ...artisticQuestions,
  ...socialQuestions,
  ...enterprisingQuestions,
  ...conventionalQuestions,
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 – EXTRACURRICULARS, WORK VALUES & STRESS TOLERANCE
// ─────────────────────────────────────────────────────────────────────────────
export const extracurricularQuestions = [
  // ── Hobbies & Interests ──────────────────────────────────────────────────
  {
    id: "ext_01",
    section: "extracurricular",
    type: "multiple",
    question:
      "Which of the following extracurricular activities do you participate in or enjoy? (Select all that apply)",
    options: [
      "Sports / Athletics",
      "Music (instrument, singing, composing)",
      "Visual Arts (drawing, painting, sculpture)",
      "Drama / Theatre / Dance",
      "Coding / App / Game Development",
      "Robotics / Science Olympiad",
      "Debate / MUN / Public Speaking",
      "Writing / Journalism / Blogging",
      "Photography / Videography / Filmmaking",
      "Community Service / NGO Work",
      "Student Government / Leadership Roles",
      "Cooking / Culinary Arts",
      "Gaming (competitive or casual)",
      "Reading / Book Clubs",
      "Fitness / Yoga / Martial Arts",
      "Travel / Adventure / Trekking",
      "None of the above",
    ],
  },
  {
    id: "ext_02",
    section: "extracurricular",
    type: "single",
    question:
      "How many hours per week do you typically spend on hobbies or extracurricular activities?",
    options: [
      "Less than 1 hour",
      "1 – 3 hours",
      "4 – 7 hours",
      "8 – 14 hours",
      "More than 14 hours",
    ],
  },
  {
    id: "ext_03",
    section: "extracurricular",
    type: "single",
    question:
      "Have you ever won an award, competition, or recognition for any extracurricular activity?",
    options: [
      "Yes, at a national or international level",
      "Yes, at a state or district level",
      "Yes, at a school or local level",
      "No, but I have participated in competitions",
      "No, I have not competed",
    ],
  },

  // ── Work Environment Preferences ─────────────────────────────────────────
  {
    id: "ext_04",
    section: "extracurricular",
    type: "single",
    question:
      "Which work environment would you find most fulfilling?",
    options: [
      "Outdoors / Field-based (nature, construction, sports)",
      "Laboratory / Research facility",
      "Creative studio / Design agency / Media house",
      "School / Hospital / NGO / Community centre",
      "Corporate office / Boardroom / Startup",
      "Government office / Bank / Administrative centre",
    ],
  },
  {
    id: "ext_05",
    section: "extracurricular",
    type: "single",
    question:
      "What type of work schedule appeals to you most?",
    options: [
      "Fixed 9-to-5 with clear boundaries",
      "Flexible hours with remote work options",
      "Shift-based or rotational (e.g., healthcare, hospitality)",
      "Project-based with intense bursts and breaks",
      "Entrepreneurial — I set my own schedule",
    ],
  },
  {
    id: "ext_06",
    section: "extracurricular",
    type: "single",
    question:
      "How important is work-life balance to you?",
    options: [
      "Extremely important — I will not compromise on personal time",
      "Very important — I want balance but can occasionally work extra",
      "Moderately important — I am willing to work hard for career growth",
      "Less important — I am willing to sacrifice balance for success",
      "Not important — I want to dedicate myself fully to my career",
    ],
  },
  {
    id: "ext_07",
    section: "extracurricular",
    type: "ranking",
    question:
      "Rank the following work values from most important (1) to least important (5) to you:",
    options: [
      "High salary and financial rewards",
      "Job security and stability",
      "Making a positive social impact",
      "Creative freedom and autonomy",
      "Prestige and recognition",
    ],
  },
  {
    id: "ext_08",
    section: "extracurricular",
    type: "multiple",
    question:
      "Which of the following factors are most important to you in a future career? (Select up to 3)",
    options: [
      "High earning potential",
      "Job security",
      "Opportunities for growth and promotion",
      "Work-life balance",
      "Making a difference in society",
      "Creative expression",
      "Intellectual challenge",
      "Travel and variety",
      "Prestige and social status",
      "Independence and entrepreneurship",
      "Teamwork and collaboration",
      "Helping individuals directly",
    ],
  },
  {
    id: "ext_09",
    section: "extracurricular",
    type: "single",
    question:
      "Would you prefer to work primarily alone, in a small team, or with large groups?",
    options: [
      "Primarily alone — I am most productive independently",
      "Small team (2–5 people) — close collaboration",
      "Medium team (6–15 people) — structured teamwork",
      "Large organisation — I enjoy being part of a big system",
      "It depends on the task",
    ],
  },
  {
    id: "ext_10",
    section: "extracurricular",
    type: "single",
    question:
      "How do you feel about frequent travel as part of your career?",
    options: [
      "I love it — travel excites me",
      "I am open to occasional travel",
      "I prefer minimal travel",
      "I strongly prefer staying in one location",
    ],
  },

  // ── Stress Tolerance & Resilience ─────────────────────────────────────────
  {
    id: "ext_11",
    section: "extracurricular",
    type: "scale",
    question:
      "How well do you handle stress and pressure in high-stakes situations?",
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: {
      min: "I struggle significantly under pressure",
      max: "I thrive and perform best under pressure",
    },
  },
  {
    id: "ext_12",
    section: "extracurricular",
    type: "single",
    question:
      "When you face a major setback (e.g., failing an exam, losing a competition), how do you typically respond?",
    options: [
      "Bounce back quickly — I analyse what went wrong and try again",
      "Take some time to recover, then get back on track",
      "Seek support from friends, family, or a mentor",
      "Feel demotivated for a significant period",
      "Avoid similar situations in the future",
    ],
  },
  {
    id: "ext_13",
    section: "extracurricular",
    type: "scale",
    question:
      "How comfortable are you with uncertainty and ambiguity in your work or studies?",
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: "Very uncomfortable — I need clarity and structure",
      max: "Very comfortable — I embrace uncertainty",
    },
  },
  {
    id: "ext_14",
    section: "extracurricular",
    type: "single",
    question:
      "How do you typically manage your stress? (Select the most common method)",
    options: [
      "Physical exercise or sports",
      "Creative activities (art, music, writing)",
      "Talking to friends or family",
      "Meditation, mindfulness, or yoga",
      "Taking breaks and resting",
      "Focusing harder on work to distract myself",
      "I struggle to manage stress effectively",
    ],
  },
  {
    id: "ext_15",
    section: "extracurricular",
    type: "scale",
    question:
      "How motivated are you to pursue a career that aligns with your passions, even if it is unconventional or risky?",
    scaleMin: 1,
    scaleMax: 10,
    scaleLabels: {
      min: "Not at all — I prefer a safe, conventional path",
      max: "Extremely — I will pursue my passion regardless of risk",
    },
  },
  {
    id: "ext_16",
    section: "extracurricular",
    type: "single",
    question:
      "How do you feel about receiving critical feedback on your work?",
    options: [
      "I welcome it — it helps me grow",
      "I accept it but it takes time to process",
      "I find it difficult but try to use it constructively",
      "I feel defensive initially but come around",
      "I find it very hard to accept criticism",
    ],
  },
  {
    id: "ext_17",
    section: "extracurricular",
    type: "single",
    question:
      "Which statement best describes your relationship with long-term goals?",
    options: [
      "I have a clear 5–10 year plan and work towards it daily",
      "I have a general direction but remain flexible",
      "I focus on short-term goals and let the future unfold",
      "I find it hard to plan beyond the next few months",
      "I have not thought seriously about long-term goals yet",
    ],
  },
  {
    id: "ext_18",
    section: "extracurricular",
    type: "multiple",
    question:
      "Which of the following skills do you consider your strongest? (Select up to 4)",
    options: [
      "Analytical thinking and problem-solving",
      "Creative thinking and innovation",
      "Communication and public speaking",
      "Empathy and interpersonal skills",
      "Leadership and decision-making",
      "Organisation and time management",
      "Technical / coding / engineering skills",
      "Artistic / design / musical skills",
      "Research and critical thinking",
      "Sales, negotiation, and persuasion",
      "Physical coordination and athleticism",
      "Writing and storytelling",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MASTER EXPORT — all questions in a single flat array
// ─────────────────────────────────────────────────────────────────────────────
export const allQuestions = [
  ...demographicQuestions,
  ...riasecQuestions,
  ...extracurricularQuestions,
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION METADATA — useful for rendering section headers / progress bars
// ─────────────────────────────────────────────────────────────────────────────
export const sectionMeta = {
  demographic: {
    key: "demographic",
    label: "About You",
    description:
      "Help us understand your academic background and maturity level.",
    icon: "👤",
    color: "#6C63FF",
  },
  realistic: {
    key: "realistic",
    riasecKey: "R",
    label: "Realistic — The Doer",
    description:
      "Practical, hands-on problem solvers who enjoy working with tools, machines, and physical systems.",
    icon: "🔧",
    color: "#E74C3C",
  },
  investigative: {
    key: "investigative",
    riasecKey: "I",
    label: "Investigative — The Thinker",
    description:
      "Analytical, intellectual individuals who enjoy research, science, and solving complex problems.",
    icon: "🔬",
    color: "#3498DB",
  },
  artistic: {
    key: "artistic",
    riasecKey: "A",
    label: "Artistic — The Creator",
    description:
      "Creative, expressive individuals who value originality, aesthetics, and self-expression.",
    icon: "🎨",
    color: "#9B59B6",
  },
  social: {
    key: "social",
    riasecKey: "S",
    label: "Social — The Helper",
    description:
      "Empathetic, collaborative individuals who enjoy helping, teaching, and supporting others.",
    icon: "🤝",
    color: "#2ECC71",
  },
  enterprising: {
    key: "enterprising",
    riasecKey: "E",
    label: "Enterprising — The Persuader",
    description:
      "Ambitious, persuasive leaders who enjoy influencing others and driving results.",
    icon: "🚀",
    color: "#F39C12",
  },
  conventional: {
    key: "conventional",
    riasecKey: "C",
    label: "Conventional — The Organizer",
    description:
      "Detail-oriented, structured individuals who excel at organising information and following systems.",
    icon: "📊",
    color: "#1ABC9C",
  },
  extracurricular: {
    key: "extracurricular",
    label: "Interests & Work Values",
    description:
      "Tell us about your hobbies, preferred work environment, and how you handle stress.",
    icon: "🌟",
    color: "#E67E22",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RIASEC SCORING GUIDE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * To compute a RIASEC score from responses:
 *
 * 1. Filter `riasecQuestions` by `riasecKey` (R, I, A, S, E, C).
 * 2. For each answered question:
 *    - scale (1–5): score = (answer - 1) * question.weight
 *    - single (with riasecKey): score = question.weight * 4 if the
 *      option index matches the riasecKey-aligned option (index 0), else 0.
 * 3. Normalise each category score to a 0–100 range.
 * 4. The top 2–3 categories form the Holland Code (e.g., "RIA", "SEC").
 *
 * Example usage in a React component:
 *
 *   import { allQuestions, sectionMeta, riasecQuestions } from '../data/assessmentQuestions';
 *
 *   const sections = Object.values(sectionMeta);
 *   const currentSectionQuestions = allQuestions.filter(q => q.section === currentSection);
 */

export default allQuestions;
