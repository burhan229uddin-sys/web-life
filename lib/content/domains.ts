export type DomainPage = {
  slug: string;
  kicker: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  free: { heading: string; body: string; cite?: string }[];
  pro: { heading: string; body: string; cite?: string }[];
  plus: { heading: string; body: string; cite?: string }[];
};

export const DOMAINS: DomainPage[] = [
  {
    slug: "sleep",
    kicker: "Recovery",
    title: "Sleep and energy",
    lede: "Energy is not a personality. It is sleep pressure, circadian timing, iron, thyroid, mood, and the chemical half-life of yesterday's caffeine.",
    image: "/images/sleep-still.jpg",
    imageAlt: "A still bedroom at blue hour",
    free: [
      {
        heading: "The non-negotiable window",
        body: "Adults need a sleep opportunity of 7–9 hours. Protect a fixed wake time — even after a short night. Irregularity is as costly as short duration. Weekend catch-up does not fully repay the debt; it just shifts the clock.",
        cite: "Why We Sleep — Walker; circadian literature",
      },
      {
        heading: "Light is a drug",
        body: "Outdoor light within an hour of waking. Dim indoor light 60 minutes before bed. Phones in another room beat 'night mode' theatre. Even a cloudy morning outdoors is typically brighter than a well-lit kitchen.",
        cite: "Czeisler; melanopsin photoreception",
      },
      {
        heading: "Caffeine math",
        body: "Caffeine's half-life is often 5–6 hours. A 3pm cup can still be on board at 9pm. Cut it after early afternoon if sleep is fragile. Delay the first cup 60–90 minutes if you crash at 2pm.",
      },
      {
        heading: "Alcohol fragments the second half of the night",
        body: "It knocks you out and then steals REM and stability after midnight. For a 14-day experiment, drop it and watch sleep quality — that data is more persuasive than a lecture.",
      },
      {
        heading: "The bedroom is for sleep and sex",
        body: "Cool, dark, reserved. If you cannot sleep after ~20 minutes, get up, dim light, return when sleepy (stimulus control). Clock-watching is arousal.",
        cite: "CBT-I stimulus control — AASM / ACP",
      },
      {
        heading: "When energy is still poor",
        body: "After sleep is honest: consider iron (ferritin), thyroid, mood, apnea (snore, choke, sleepy after 8 hours). Wearables estimate. They do not diagnose.",
        cite: "NICE fatigue in adults (clinical judgement)",
      },
      {
        heading: "A 10pm rule that is actually a rule",
        body: "Kitchen closed. Phone charges in another room. One paper book if the mind is loud. This is stimulus control, not aesthetic monasticism.",
        cite: "AASM stimulus control",
      },
      {
        heading: "Naps, if you take them",
        body: "Before 3pm, 20 minutes, alarm set. Longer daytime sleep steals the night. Shift workers are a different protocol — protect the cave.",
      },
    ],
    pro: [
      {
        heading: "The 14-day reset",
        body: "Same wake time ±30 min. No alcohol for 14 days. Morning outdoor light 10 minutes. Bedroom cool, dark. If you snore, choke, or stay sleepy after 8 hours — screen for apnea.",
        cite: "Why We Sleep — Walker; AASM insomnia (CBT-I first line)",
      },
      {
        heading: "CBT-I over pills",
        body: "Stimulus control, sleep restriction (clinician/app guided), and cognitive work beat chronic hypnotics for lasting insomnia. Pills can be a bridge, not a personality.",
        cite: "Qaseem et al., ACP insomnia guideline",
      },
      {
        heading: "Daytime energy stack",
        body: "10-minute walk after meals. Protein at breakfast. 20-minute well-timed nap if needed (before 3pm). Strength training 2× this week — mitochondrial work, not a latte.",
        cite: "Huberman Lab public notes; ACSM activity",
      },
    ],
    plus: [
      {
        heading: "When to test",
        body: "Ferritin, CBC, TSH, A1c, B12, and a conversation about depression if energy is still poor after sleep is honest.",
        cite: "NICE fatigue pathway",
      },
      {
        heading: "Travel and shift",
        body: "Anchor to destination light. Melatonin is a timing signal at low dose, not a sedative — use with a clinician if you have other meds. Shift workers: protect the sleep cave; don't 'tough it out.'",
      },
    ],
  },
  {
    slug: "mind",
    kicker: "Cognition",
    title: "Thinking, intelligence, purpose, discipline",
    lede: "A sharper mind is sleep, attention training, deliberate practice, and a reason to get out of bed. Intelligence is not a mood. Discipline is not self-hate.",
    image: "/images/mind.jpg",
    imageAlt: "A morning walk under trees",
    free: [
      {
        heading: "Protect the deep block",
        body: "Fifty to ninety minutes, phone in another room, one hard thing. Deep Work is still the most practical manual for a distracted century. Shallow work expands to fill the unguarded day.",
        cite: "Deep Work — Cal Newport",
      },
      {
        heading: "Make the unit tiny",
        body: "Atomic Habits: you do not rise to goals, you fall to systems. Two minutes is a valid start. Identity: 'I am someone who trains attention.' Implementation intention: If it is 7:30, then shoes on.",
        cite: "Clear; Gollwitzer",
      },
      {
        heading: "Purpose is a sentence",
        body: "Frankl: meaning is found, not delivered. Write one sentence that would make this quarter coherent. Revisit Sunday nights. Ambiguity is more exhausting than hard work.",
        cite: "Man's Search for Meaning — Frankl",
      },
      {
        heading: "Train System 2, for free",
        body: "Once a day, write the opposite of your first conclusion. Notice base-rate neglect and sunk cost. Intelligence includes the pause.",
        cite: "Thinking, Fast and Slow — Kahneman",
      },
      {
        heading: "Anti-procrastination in one chair",
        body: "Name the next physical action. Set a 25-minute timer. Sit before you feel ready. If avoidance is fused with dread for weeks, that is mood or ADHD territory — see the clinic Mind chapter, not another planner.",
        cite: "Behavioral activation; Steel / Pychyl on procrastination",
      },
      {
        heading: "Mood is medical",
        body: "Sleep, daylight, 20 minutes of brisk walking, and fewer than 7 drinks a week change mood biology. If function is dropping or you might hurt yourself: 988 (US) or local emergency services. This site cannot hold a crisis.",
        cite: "NICE depression; 988 lifeline",
      },
      {
        heading: "Intelligence is practice, not a podcast",
        body: "One hard problem a day beats ten explainers. Teach it back. Write the opposite of your first take. That is Kahneman, operationalized.",
        cite: "Peak — Ericsson; Thinking, Fast and Slow",
      },
      {
        heading: "Discipline is geography",
        body: "Phone in another room. Shoes by the door. The document already open. You will not out-motivate a frictionless feed.",
        cite: "Clear; Fogg tiny habits",
      },
    ],
    pro: [
      {
        heading: "Deliberate practice",
        body: "Ericsson: isolate a sub-skill just beyond comfort, get feedback, repeat. Reading more articles is not practice. Solving, teaching, and being corrected is.",
        cite: "Peak — Ericsson",
      },
      {
        heading: "Cognitive distortions, on paper",
        body: "Burns: catch all-or-nothing, mind-reading, catastrophizing. Write the evidence for and against. CBT workbooks are not a therapist — they are a start.",
        cite: "Feeling Good — Burns",
      },
      {
        heading: "When to involve a clinician",
        body: "Symptoms >2 weeks, function dropping, trauma loops, mania, psychosis, or inability to care for self. Medication (SSRIs etc.) is a clinical decision. We discuss classes educationally, never start or stop them for you.",
        cite: "APA / NICE",
      },
    ],
    plus: [
      {
        heading: "Time architecture",
        body: "Theme days. Shutdown ritual. One evening without inputs. Track where 10 hours actually went — people underestimate shallow work by half.",
      },
      {
        heading: "Aesthetics of a mind",
        body: "Single-task rooms. A desk that only does one class of work. Beauty is not decadence; visual noise is cognitive load.",
      },
    ],
  },
  {
    slug: "strength",
    kicker: "Frame",
    title: "Body, strength, and longevity",
    lede: "Muscle is a glucose sink, a fall-prevention organ, and a mood drug. Cardio is a life-span insurance policy. You do not have to enjoy it. You have to repeat it.",
    image: "/images/strength.jpg",
    imageAlt: "Dawn training in a stone courtyard",
    free: [
      {
        heading: "The minimum that works",
        body: "Two full-body strength sessions. Walking most days. One harder cardio effort. That is already more than most adults do.",
        cite: "ACSM; WHO 2020",
      },
      {
        heading: "Progressive overload",
        body: "Add a rep, a kilo, or a slower eccentric. Soreness is not the metric. What you can lift in 8 weeks is.",
      },
      {
        heading: "A beginner session you can start tonight",
        body: "Goblet squat 3×8, Romanian deadlift 3×8, push-up 3× as many clean, row 3×8, farmer carry 3×40 m. Rest 90 seconds. Two times this week.",
      },
      {
        heading: "Walk after meals",
        body: "Ten minutes lowers the post-meal glucose curve. It is not cross-training. It is plumbing.",
      },
      {
        heading: "Protein is a training partner",
        body: "Around 1.6 g/kg/day is a practical ceiling for most hypertrophy if kidneys are well. Distribute it. Food first.",
        cite: "Morton et al., 2018",
      },
      {
        heading: "Pain rules",
        body: "Train around, not through, sharp joint pain. Low back: keep walking. Red flags (saddle anesthesia, fever, trauma, unexplained weight loss) are clinic, not foam rolling.",
        cite: "Lancet low back pain; Choosing Wisely",
      },
      {
        heading: "Zone 2 in one sentence",
        body: "You can talk, not sing. Most days you can spare 30–45 minutes. Stairs count. The 'I don't have a gym' objection dies here.",
        cite: "Attia; ACSM aerobic",
      },
      {
        heading: "Rest is not laziness",
        body: "One easier day a week. Sleep debt is not paid with a heroic Saturday session. Tendons adapt slower than Instagram.",
      },
    ],
    pro: [
      {
        heading: "Attia-shaped week",
        body: "3–4 zone 2 sessions you can talk through. 1 VO2 max interval session. 2–3 strength: squat/hinge/push/pull/carry. Stability daily in minutes, not hours.",
        cite: "Outlive — Attia; ACSM",
      },
      {
        heading: "By decade",
        body: "20s: skill and tendon resilience. 30s: keep VO2 max. 40s: fight sarcopenia like it is a diagnosis. 50s+: power and balance — the un-glamorous fall-prevention work.",
      },
      {
        heading: "Bone is a use-it tissue",
        body: "Impact, lifting, and protein. Vitamin D if deficient; calcium from food first. DEXA is a conversation with a clinician, not a shopping list.",
      },
    ],
    plus: [
      {
        heading: "Aesthetics without the circus",
        body: "Body composition is sleep, protein, steps, and a small calorie gap — not a 12-week shred supplement. Photo in the same light monthly. Waist and strength beat the scale.",
      },
      {
        heading: "VO2 max intervals, simply",
        body: "After a warm-up: 4 minutes hard (7–8/10), 3 minutes easy, repeat 4 times. Once a week. Not on no-sleep weeks.",
      },
    ],
  },
  {
    slug: "nutrition",
    kicker: "Fuel",
    title: "Diet, plates, organic food",
    lede: "The pattern beats the product. Mediterranean-style eating has outcome data. Organic is a residue and soil choice, not a morality test. Aesthetics live next door, in their own room.",
    image: "/images/food-table.jpg",
    imageAlt: "Mediterranean foods on linen",
    free: [
      {
        heading: "Build a plate",
        body: "Half plants, a palm of protein, a thumb of olive oil or nuts, slow starch if you train. Water. That is the influencer industry, collapsed.",
        cite: "Harvard Healthy Eating Plate",
      },
      {
        heading: "PREDIMED in one line",
        body: "Vegetables, fruit, legumes, extra-virgin olive oil, nuts, fish, fermented dairy if you tolerate it. Wine is optional and easy to overdo.",
        cite: "PREDIMED — Estruch et al.",
      },
      {
        heading: "Organic, ranked",
        body: "Spend first on berries, leafy herbs, and thin-skinned fruit if residue worries you. Skip the organic cookie. Wash everything. The best diet is the one with plants you will actually eat.",
      },
      {
        heading: "Sugar-sweetened drinks first",
        body: "If you change one thing, change this. Liquid sugar is a metabolic vandal with no satiety signal worth mentioning.",
      },
      {
        heading: "Alcohol, without the folklore",
        body: "Risk is dose-dependent. 'Healthy drinking' is thinner than marketing. For sleep and blood pressure, less is better.",
      },
      {
        heading: "By goal, without a cult",
        body: "Fat loss: protein high, fiber high, liquid calories out, 300–500 kcal gap. Muscle: small surplus, protein ~1.6 g/kg. 50+: protein at every meal, creatine discussed with a clinician, vitamin D if low.",
      },
      {
        heading: "Organic is a spend order",
        body: "Berries, herbs, and thin-skinned fruit first if residue worries you. Avocado and onions last. Wash everything. The sticker is not the diet.",
        cite: "USDA PDP; consumer residue rankings as a heuristic",
      },
      {
        heading: "Cooking is adherence",
        body: "A pan, olive oil, protein, and a bag of frozen vegetables beats a 40-ingredient 'wellness' bowl you will not repeat.",
      },
    ],
    pro: [
      {
        heading: "DASH if blood pressure is the story",
        body: "Plants, low-fat dairy, less sodium. Outcome data, not a brand.",
        cite: "Appel et al.; NHLBI DASH",
      },
      {
        heading: "Diabetes prevention is a walking club",
        body: "≈7% weight loss plus 150 minutes of activity beat metformin in the DPP — both beat placebo. Metformin remains a clinician tool.",
        cite: "Knowler et al., 2002",
      },
      {
        heading: "Fiber as a drug with side effects",
        body: "Build toward 30 plants/week. Psyllium if constipation. Gas in week one is expected. Blood in stool is not fiber-deficiency — it is a clinic visit.",
      },
    ],
    plus: [
      {
        heading: "When labs matter",
        body: "A1c, ApoB, triglycerides, ferritin, B12 if vegan, 25-OH D. Food diaries without labs are guesswork if you have a family history.",
      },
      {
        heading: "GLP-1 era, educationally",
        body: "Incretins are clinician-prescribed tools with trial data. Shortages are common. Compounded copies are a safety minefield. Lifestyle does not become optional on a pen.",
      },
    ],
  },
  {
    slug: "relations",
    kicker: "Bond",
    title: "Emotion, social potential, therapy",
    lede: "Loneliness is a physiologic stressor. Contempt is a relationship toxin. A therapist is indicated when the same loop keeps costing you years — not when you have 'failed.'",
    image: "/images/relations.jpg",
    imageAlt: "Two people talking in a walled garden",
    free: [
      {
        heading: "Turn toward bids",
        body: "Gottman: small reaches ('look at this') are the relationship. Turning toward, not away, predicts stability more than grand gestures.",
        cite: "Gottman Institute",
      },
      {
        heading: "When to go to a therapist",
        body: "Function dropping. Symptoms >2 weeks. Trauma loops. A relationship that frightens you. Parenting rage you don't recognize. You do not need a worse story.",
        cite: "APA / NAMI public guidance",
      },
      {
        heading: "Emergency",
        body: "If you might hurt yourself: 988 in the US, or local emergency services. This site cannot hold a crisis.",
      },
      {
        heading: "Loneliness is medical",
        body: "Holt-Lunstad: weak social connection is a mortality risk on the order of well-known clinical factors. One standing weekly meal with humans is a protocol.",
        cite: "Holt-Lunstad meta-analyses",
      },
      {
        heading: "Name the feeling specifically",
        body: "'I feel dismissed' is usable. 'I feel bad' is a fog. Regulate before you send the message. Empathy is a skill of attention.",
        cite: "Emotional Intelligence — Goleman (public summary)",
      },
      {
        heading: "Conflict starter that is not an attack",
        body: "'When X, I feel Y, I need Z.' Soft start-up. 20-minute pause if flooded. Return — don't disappear.",
      },
      {
        heading: "Friendship is scheduled",
        body: "One standing weekly contact that is not a group chat. Social potential is a calendar, not a personality type.",
      },
      {
        heading: "What a therapist actually does",
        body: "A licensed person with a named method (CBT, IPT, EFT, trauma-focused). Six sessions then review. Chemistry matters; credentials are not optional.",
        cite: "APA; NICE",
      },
    ],
    pro: [
      {
        heading: "The four acids",
        body: "Criticism, defensiveness, stonewalling, contempt. Contempt is the worst. Repair attempts matter more than never fighting.",
        cite: "Gottman Institute",
      },
      {
        heading: "Body and bond",
        body: "van der Kolk: some pain is stored as physiology. Yoga, EMDR, and trauma-focused CBT are clinical tools — shop for licensed people, not charisma.",
        cite: "The Body Keeps the Score",
      },
      {
        heading: "Social potential, scheduled",
        body: "One group that requires your presence (choir, team, class). Online only is not a nervous system.",
      },
    ],
    plus: [
      {
        heading: "A 30-day repair experiment",
        body: "Daily bid. Weekly undistracted hour. No contempt, including in jokes. If fear is in the house, skip experiments and get help.",
      },
      {
        heading: "Choosing a therapist without folklore",
        body: "Licensed. A method you can name (CBT, IPT, EFT, trauma-focused). Chemistry matters; credentials are not optional. Six sessions then review.",
      },
    ],
  },
  {
    slug: "career",
    kicker: "World",
    title: "Career confusion and the present century",
    lede: "The labor market is noisy, the news is engineered for arousal, and your nervous system was not built for a global firehose. Clarity is designed, not awaited.",
    image: "/images/career.jpg",
    imageAlt: "A sunlit desk by a window",
    free: [
      {
        heading: "Prototype, don't declare",
        body: "Designing Your Life: run a two-week experiment (informational conversation, tiny project, class) instead of a five-year proclamation.",
        cite: "Burnett & Evans",
      },
      {
        heading: "News diet",
        body: "One digest, not a feed. The world is serious; your cortisol does not help distant fires or interest rates. Act locally where you have agency.",
      },
      {
        heading: "Deep work as career strategy",
        body: "The scarce asset is undistracted cognitive output. Calendar it. Careers stall in inbox performance.",
        cite: "Deep Work — Newport",
      },
      {
        heading: "The stoic split",
        body: "Controllable vs not. Skills that compound (writing, quantitative reasoning, people). Community > commentary. A 3-month runway if you can.",
        cite: "Seneca; modern career-buffer research",
      },
      {
        heading: "How to live in a loud century",
        body: "Sleep, daylight, training, one civic action a month. Despair without a next action is entertainment. Hope without a next action is also entertainment.",
      },
      {
        heading: "Range vs specialize, briefly",
        body: "In kind domains (chess, some crafts), specialize. In wicked domains (most knowledge work), analogical generalists who ship outperform early hyper-specialists.",
        cite: "Range — Epstein (public thesis)",
      },
      {
        heading: "The firehose is the product",
        body: "Feeds are engineered for arousal. One written briefing, then close it. Distant fires will not be improved by your cortisol.",
      },
      {
        heading: "A 3-month runway if you can",
        body: "Cash, a skill that compounds, and a person who will tell you the truth. Panic career moves are expensive.",
      },
    ],
    pro: [
      {
        heading: "Range vs specialize, in practice",
        body: "Collect adjacent skills. Ship. Informational conversations beat another course you will not finish.",
        cite: "Range — Epstein",
      },
      {
        heading: "Energy audit of the current job",
        body: "For five days, mark each hour as giving or taking. The map is usually more honest than a LinkedIn bio.",
      },
      {
        heading: "Uncertainty protocol",
        body: "Financial runway. One public artifact every quarter. A person who will tell you the truth. Less commentary.",
      },
    ],
    plus: [
      {
        heading: "A 90-day career lab",
        body: "Week 1: energy audit. Week 2–3: three conversations with people who have a life you respect. Week 4–8: a public artifact. Week 9–12: decide to stay, twist, or leave with data.",
      },
      {
        heading: "World-situation hygiene",
        body: "Sleep, daylight, training, one civic action a month. The firehose will still be there tomorrow.",
      },
    ],
  },
];
