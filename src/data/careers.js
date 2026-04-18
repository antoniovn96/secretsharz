// Comprehensive Career Database for VidyaVantage
// Each career includes detailed information for student decision-making

export const CAREER_DATA = [
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Arts & Design',
    riasec: 'AI',
    shortDesc: 'Design digital experiences that millions of people use every day.',
    longDesc: `UI/UX Designers are the architects of digital experiences. They research user behavior, design intuitive interfaces, and ensure that apps and websites are not just beautiful, but genuinely easy to use. This role sits at the intersection of psychology, art, and technology — you need to understand how people think, create visually compelling designs, and work closely with developers to bring your vision to life.

The field has exploded in India over the last 5 years. Every startup, every tech company, every bank now needs designers. Unlike traditional graphic design, UX design is rooted in data and user research. You'll conduct interviews, run A/B tests, create wireframes and prototypes, and iterate based on real user feedback. It's creative work that's also deeply analytical.

The best part? You don't need to code (though basic HTML/CSS helps). You need empathy, visual taste, and the ability to solve problems creatively. Portfolio matters more than degree — many successful UX designers are self-taught or come from non-design backgrounds like psychology or engineering.`,
    dayInTheLife: [
      'Conduct user interviews to understand pain points in the current app flow',
      'Create wireframes and high-fidelity prototypes in Figma for the new checkout experience',
      'Present design concepts to product managers and developers, iterate based on feedback'
    ],
    futureOutlook: 'High Growth',
    salaryRange: '₹4L - ₹30L+',
    education: 'B.Des, Any Degree + Portfolio, or Self-taught with strong portfolio',
    skills: ['Figma/Sketch', 'User Research', 'Visual Design', 'Empathy & Communication'],
    studentTags: ['Creative', 'Introvert Friendly', 'High Paying']
  },

  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology & Data',
    riasec: 'I',
    shortDesc: 'Turn massive datasets into business insights using AI and statistics.',
    longDesc: `Data Scientists are the detectives of the digital age. They take messy, massive datasets and extract patterns, predictions, and actionable insights that drive billion-dollar decisions. This role combines statistics, programming, and business acumen. You'll build machine learning models to predict customer behavior, analyze A/B test results, and communicate complex findings to non-technical stakeholders.

The demand is astronomical in India. Every company — from Flipkart to HDFC Bank to Ola — is hiring data scientists. The work is intellectually challenging: you're solving real-world problems with math and code. One day you might be predicting loan defaults, the next day optimizing delivery routes, the next building a recommendation engine.

Strong math and programming skills are non-negotiable. You need to be comfortable with Python/R, SQL, statistics, and machine learning algorithms. But equally important is business sense — the ability to ask the right questions and translate technical findings into stories that executives can act on. It's a rare blend of left-brain and right-brain thinking.`,
    dayInTheLife: [
      'Clean and explore a new dataset of 10 million customer transactions',
      'Build and validate a machine learning model to predict customer churn',
      'Present findings to the marketing team with actionable recommendations'
    ],
    futureOutlook: 'High Growth',
    salaryRange: '₹8L - ₹50L+',
    education: 'B.Tech/B.Sc in CS, Maths, Stats, or Engineering + certifications',
    skills: ['Python/R', 'Statistics & ML', 'SQL', 'Data Visualization'],
    studentTags: ['Math Heavy', 'High Paying', 'Introvert Friendly']
  },

  {
    id: 'clinical-psychologist',
    title: 'Clinical Psychologist',
    category: 'Healthcare & Psychology',
    riasec: 'SI',
    shortDesc: 'Help people overcome mental health challenges through therapy and assessment.',
    longDesc: `Clinical Psychologists diagnose and treat mental health conditions through evidence-based therapy. You'll work with individuals dealing with depression, anxiety, trauma, relationship issues, and more. This is one of the most meaningful careers you can choose — you directly improve lives, often saving them. The work involves conducting assessments, delivering therapy (CBT, DBT, psychodynamic), and sometimes conducting research.

Mental health awareness has exploded in India post-COVID. The stigma is reducing, and demand for qualified psychologists has never been higher. You can work in hospitals, private practice, schools, corporates, or NGOs. The flexibility is incredible — many psychologists build thriving private practices working 20-25 hours a week.

The path is long but rewarding. You need a BA in Psychology, then an MA (Clinical Psychology), followed by an MPhil or PsyD for independent practice. RCI registration is mandatory. The work is emotionally demanding — you carry people's pain with you. But if you have deep empathy, patience, and genuine curiosity about the human mind, this is one of the most fulfilling careers in existence.`,
    dayInTheLife: [
      'Conduct therapy sessions with 4-5 clients dealing with anxiety and depression',
      'Administer psychological assessments and write detailed clinical reports',
      'Attend supervision meetings and stay updated on latest research in trauma therapy'
    ],
    futureOutlook: 'High Growth',
    salaryRange: '₹3L - ₹20L+',
    education: 'BA Psychology + MA Clinical Psychology + MPhil/PsyD + RCI License',
    skills: ['Active Listening', 'Empathy', 'Clinical Assessment', 'Therapeutic Techniques'],
    studentTags: ['Meaningful Work', 'Flexible Hours', 'People-Focused']
  },

  {
    id: 'investment-banker',
    title: 'Investment Banker',
    category: 'Business & Finance',
    riasec: 'E',
    shortDesc: 'Advise companies on mergers, acquisitions, and raising billions in capital.',
    longDesc: `Investment Bankers are the dealmakers of the corporate world. You'll advise companies on massive financial transactions — mergers, acquisitions, IPOs, and fundraising. This is high-stakes, high-pressure work. You'll build complex financial models, pitch to CEOs and boards, negotiate billion-dollar deals, and work with legal and accounting teams to close transactions.

The money is exceptional, even in India. Top investment banks (Goldman Sachs, Morgan Stanley, JP Morgan) pay ₹15-20L to fresh graduates, with bonuses that can double your salary. But you earn every rupee — 80-100 hour weeks are standard, especially during live deals. You'll sacrifice weekends, sleep, and social life, especially in your 20s.

This career is for the hyper-ambitious. You need razor-sharp analytical skills, the ability to work under extreme pressure, and thick skin (seniors can be brutal). An MBA from a top school (IIM A/B/C, ISB) or a degree from a target undergrad (St. Stephens, SRCC, IIT) is almost mandatory. If you want wealth, prestige, and are willing to grind, this is the path.`,
    dayInTheLife: [
      'Build a financial model projecting 5-year revenue for a client\'s acquisition target',
      'Prepare pitch deck for a ₹500 crore IPO, work until 2 AM to meet deadline',
      'Attend client meetings with senior bankers, take detailed notes and follow up on action items'
    ],
    futureOutlook: 'Stable',
    salaryRange: '₹15L - ₹1Cr+',
    education: 'Top undergrad (Commerce/Econ) + MBA from IIM/ISB, or CA',
    skills: ['Financial Modeling', 'Excel Mastery', 'Communication', 'Stress Management'],
    studentTags: ['High Paying', 'Prestige', 'Intense Hours']
  },

  {
    id: 'commercial-pilot',
    title: 'Commercial Pilot',
    category: 'Aviation & Transport',
    riasec: 'R',
    shortDesc: 'Fly aircraft and transport passengers safely across the world.',
    longDesc: `Commercial Pilots operate aircraft for airlines, cargo companies, or private charters. You're responsible for the safety of hundreds of passengers, navigating complex weather systems, and making split-second decisions at 35,000 feet. This is one of the most prestigious and well-compensated careers in India, but also one of the most expensive to enter.

The training is rigorous and costly. You'll need to complete a Commercial Pilot License (CPL) from a DGCA-approved flying school, which costs ₹25-40 lakhs and takes 18-24 months. You'll log hundreds of flight hours, pass multiple exams, and undergo medical checks. Once licensed, you'll start as a First Officer (co-pilot) before becoming a Captain after 3,000+ flight hours.

The lifestyle is unique. You'll have irregular schedules, spend nights in different cities, and deal with jet lag. But you'll also see the world, enjoy excellent pay and benefits, and experience the thrill of flight every single day. If you love travel, have strong spatial awareness, and can handle high responsibility, this is an incredible career.`,
    dayInTheLife: [
      'Pre-flight briefing: review weather, flight plan, and aircraft status',
      'Fly a 3-hour domestic route, coordinate with air traffic control and cabin crew',
      'Complete post-flight paperwork and debrief with co-pilot on any incidents'
    ],
    futureOutlook: 'Stable',
    salaryRange: '₹2L - ₹8L per month',
    education: '12th Science (Physics, Maths) + CPL from DGCA-approved school',
    skills: ['Spatial Awareness', 'Decision Making', 'Stress Management', 'Technical Knowledge'],
    studentTags: ['High Paying', 'Travel', 'Prestige']
  },

  {
    id: 'content-creator',
    title: 'Content Creator / YouTuber',
    category: 'Media & Entertainment',
    riasec: 'AE',
    shortDesc: 'Build an audience and monetize your creativity through digital content.',
    longDesc: `Content Creators build audiences on platforms like YouTube, Instagram, and LinkedIn by creating videos, posts, or podcasts. This is the ultimate entrepreneurial career — you're your own boss, you choose your niche, and your income potential is unlimited. Successful creators earn through ads, sponsorships, merchandise, courses, and consulting.

The barrier to entry is zero. You need a phone, an idea, and consistency. But the barrier to success is high — only 1-2% of creators make a full-time living. You need to understand your audience deeply, create content consistently (often daily), master video editing and SEO, and build a personal brand. It's a mix of creativity, marketing, and business.

The lifestyle is flexible but demanding. You work when you want, but you're always "on" — responding to comments, analyzing metrics, brainstorming ideas. Income is unpredictable, especially early on. But if you build a loyal audience of even 50,000 people, you can earn ₹5-10L/month through multiple revenue streams. This career rewards authenticity, persistence, and the ability to adapt quickly.`,
    dayInTheLife: [
      'Film and edit a 10-minute YouTube video on personal finance tips',
      'Respond to 100+ comments and DMs, engage with your community',
      'Negotiate a ₹50,000 brand sponsorship deal and plan integration into next video'
    ],
    futureOutlook: 'High Growth',
    salaryRange: '₹0 - ₹50L+ (highly variable)',
    education: 'No formal education required — portfolio and audience matter',
    skills: ['Video Editing', 'Storytelling', 'Marketing', 'Consistency'],
    studentTags: ['Creative', 'Flexible Hours', 'Entrepreneurial']
  },

  {
    id: 'software-engineer',
    title: 'Software Engineer',
    category: 'Technology & Data',
    riasec: 'IR',
    shortDesc: 'Build the apps, websites, and systems that power the digital world.',
    longDesc: `Software Engineers write code to build applications, websites, and systems. You might work on a mobile app used by millions, backend systems processing billions of transactions, or AI models powering recommendation engines. This is the most in-demand career in India right now — every company is a tech company, and every tech company needs engineers.

The work is intellectually stimulating. You solve complex problems, learn new technologies constantly, and see your code impact real users. You'll write code, review teammates' code, debug issues, and collaborate with designers and product managers. The best part? Remote work is standard — you can work from anywhere, often for global companies paying in dollars.

You don't necessarily need a CS degree. Many successful engineers are self-taught or come from bootcamps. What matters is your ability to code, solve problems, and learn quickly. Starting salaries are ₹6-12L for freshers, but top engineers at FAANG companies earn ₹50L+ within 5 years. The career ceiling is incredibly high, and the skills are globally portable.`,
    dayInTheLife: [
      'Write and test code for a new feature in the mobile app',
      'Debug a production issue affecting 10,000 users, deploy fix within 2 hours',
      'Attend stand-up meeting, code review session, and pair programming with junior engineer'
    ],
    futureOutlook: 'High Growth',
    salaryRange: '₹6L - ₹80L+',
    education: 'B.Tech CS, Self-taught, or Bootcamp + strong portfolio',
    skills: ['Programming (Python/Java/JS)', 'Problem Solving', 'Algorithms', 'Collaboration'],
    studentTags: ['High Paying', 'Introvert Friendly', 'Remote Work']
  },

  {
    id: 'chartered-accountant',
    title: 'Chartered Accountant (CA)',
    category: 'Business & Finance',
    riasec: 'CE',
    shortDesc: 'Manage finances, audits, and taxation for businesses and individuals.',
    longDesc: `Chartered Accountants are the financial guardians of businesses. You'll audit company accounts, file taxes, provide financial advisory, and ensure compliance with complex regulations. CAs are among the most respected professionals in India — every company, from startups to MNCs, needs a CA. You can work in a firm, in-house, or start your own practice.

The CA qualification is notoriously difficult — only 5-10% pass the final exam on their first attempt. You'll spend 3-5 years studying while doing articleship (internship) on a modest stipend. But once qualified, the doors are wide open. You can specialize in taxation, audit, corporate finance, or consulting. The work is detail-oriented and deadline-driven, especially during tax season.

The financial rewards are excellent. Starting salaries are ₹7-12L, and senior CAs in Big 4 firms earn ₹30-50L+. If you start your own practice, income potential is unlimited. This career suits people who love numbers, have high attention to detail, and can handle pressure. It's stable, prestigious, and recession-proof.`,
    dayInTheLife: [
      'Review and audit financial statements for a mid-sized manufacturing company',
      'File GST returns and advise client on tax-saving strategies',
      'Attend client meeting to discuss annual financial planning and compliance requirements'
    ],
    futureOutlook: 'Stable',
    salaryRange: '₹7L - ₹50L+',
    education: 'CA Foundation → Intermediate → Final (ICAI)',
    skills: ['Accounting', 'Taxation', 'Attention to Detail', 'Analytical Thinking'],
    studentTags: ['Prestige', 'Math Heavy', 'Stable Income']
  },

  {
    id: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering & Infrastructure',
    riasec: 'RI',
    shortDesc: 'Design and build the infrastructure that shapes cities and nations.',
    longDesc: `Civil Engineers design, build, and maintain the physical infrastructure of society — roads, bridges, dams, buildings, water systems, and more. This is one of the oldest and most essential engineering disciplines. You'll work on projects that last decades and impact millions of lives. From metro rail systems to smart cities, civil engineers are building modern India.

The work is a mix of office and field. You'll create structural designs using AutoCAD and software, but you'll also spend significant time on construction sites supervising work, solving on-ground problems, and coordinating with contractors. It's hands-on, practical engineering. You see your designs become physical reality.

Government jobs (CPWD, NHAI, Railways) are a major draw — stable, pensioned, and respected. Private sector pays better but demands longer hours. Starting salaries are modest (₹3-5L), but experienced engineers, especially in project management or consulting, earn ₹15-30L+. If you love math, physics, and the idea of building things that outlast you, this is a deeply satisfying career.`,
    dayInTheLife: [
      'Review structural drawings for a new residential complex, check for safety compliance',
      'Visit construction site to inspect foundation work and resolve contractor issues',
      'Prepare quantity estimates and cost projections for upcoming highway project'
    ],
    futureOutlook: 'Stable',
    salaryRange: '₹3L - ₹25L+',
    education: 'B.Tech Civil Engineering',
    skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'Problem Solving'],
    studentTags: ['Outdoors', 'Math Heavy', 'Government Jobs']
  },

  {
    id: 'digital-marketer',
    title: 'Digital Marketing Manager',
    category: 'Business & Marketing',
    riasec: 'E',
    shortDesc: 'Drive business growth through online advertising, SEO, and social media.',
    longDesc: `Digital Marketers help businesses grow by attracting customers online. You'll run ad campaigns on Google and Facebook, optimize websites for search engines (SEO), create content strategies, analyze data, and manage social media. Every rupee you spend needs to generate measurable results — this is marketing as a science, not an art.

The field is booming in India. Every business — from local restaurants to billion-dollar startups — needs digital marketing. The barrier to entry is low (no specific degree required), but the skill ceiling is high. You need to understand consumer psychology, master multiple tools (Google Ads, Facebook Ads Manager, Google Analytics), and stay updated as platforms change constantly.

The work is fast-paced and results-driven. You'll A/B test ad creatives, analyze conversion funnels, and present ROI reports to leadership. Income varies widely — freshers earn ₹3-5L, but experienced marketers managing ₹1Cr+ ad budgets earn ₹15-30L+. Freelancing is common and lucrative. If you're creative, analytical, and love the internet, this is a great career.`,
    dayInTheLife: [
      'Launch a new Facebook ad campaign targeting 25-35 year olds in metro cities',
      'Analyze website traffic data and identify why conversion rate dropped 15% last week',
      'Create content calendar for Instagram and brief designer on upcoming posts'
    ],
    futureOutlook: 'High Growth',
    salaryRange: '₹3L - ₹30L+',
    education: 'Any degree + certifications (Google Ads, Facebook Blueprint) + portfolio',
    skills: ['Google Ads', 'SEO', 'Data Analysis', 'Copywriting'],
    studentTags: ['Creative', 'Flexible Hours', 'High Growth']
  }
];
