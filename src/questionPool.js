// Phase 1: Keep the PRESET_SCENARIOS and getMatrixScenarios for the setup phase intact.
// These are hand-crafted, high-fidelity STARTING SCENARIOS for the top 5 Quick Starts.
const PRESET_SCENARIOS = {
    "Making a real impact on our beneficiaries": [
        "Metrics reveal failure.",
        "Funders demand proof.",
        "Beneficiaries quietly leave."
    ],
    "Building up financial reserves": [
        "Donors threaten withdrawal.",
        "Fear freezes budget.",
        "Reserves drain rapidly."
    ],
    "Changing successful but stale fundraising events": [
        "Burnout destroys staff.",
        "Young donors refuse.",
        "Fear blocks digital."
    ],
    "Aligning collectively on our true purpose": [
        "Grants drift mission.",
        "Staff fight board.",
        "Partners drop us."
    ],
    "Failing to attract staff": [
        "Private sector poaches.",
        "Toxic reputation spreads.",
        "Quality drops directly."
    ]
};

const NEGATIVE_TERMS = ['toxic', 'failure', 'debt', 'burnout', 'lack', 'poor', 'bad', 'crisis', 'complain', 'ignore'];

// Short "Three-Word Challenge" format
export const POSITIVE_SCENARIOS = [
    "{constraint} blocks {subject}.",
    "{persona} fears {constraint}.",
    "{constraint} delays {subject}.",
    "{persona} ignores {subject}.",
    "{constraint} limits {persona}.",
    "{persona} abandons {subject}."
];

// If subject is negative, the persona tries to FIX it, but is blocked
export const NEGATIVE_SCENARIOS = [
    "{persona} fights {subject}, {constraint} wins.",
    "{constraint} protects {subject}.",
    "{persona} accepts {subject}.",
    "{constraint} worsens {subject}.",
    "{persona} avoids {subject}.",
    "{constraint} hides {subject}."
];

export const getMatrixScenarios = (subject, persona, constraint, count = 3, excludeTexts = []) => {
    if (PRESET_SCENARIOS[subject]) {
        let pool = PRESET_SCENARIOS[subject];
        const available = pool.filter(q => !excludeTexts.includes(q));
        let shuffled = available.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    let pool = [];
    let sub = (subject || "core issue").toLowerCase();
    let per = (persona || "stakeholders").toLowerCase();
    let con = (constraint || "current limits").toLowerCase();

    // Subject-as-Problem Refactor (Pre-Check)
    const isNegative = NEGATIVE_TERMS.some(term => sub.includes(term));
    const templates = isNegative ? NEGATIVE_SCENARIOS : POSITIVE_SCENARIOS;

    templates.forEach(template => {
        let text = template
            .replace(/\{subject\}/g, sub)
            .replace(/\{persona\}/g, per)
            .replace(/\{constraint\}/g, con);
        pool.push(text.charAt(0).toUpperCase() + text.slice(1));
    });

    const available = pool.filter(q => !excludeTexts.includes(q));
    let shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};


// Phase 2: Dynamic Synthetic Brainstorm
// Replaces the old random static arrays with strict Triad filtering (Subject, Persona, Constraint).
export const getRandomQuestions = (count = 3, excludeTexts = [], scenarioData = null, selectedText = "") => {
    
    // Fallback logic if the request is to generate the first 3 SCENARIOS, rather than questions
    if (scenarioData && typeof scenarioData === 'object' && (!selectedText || typeof selectedText === 'object')) {
        return getMatrixScenarios(scenarioData.subject, scenarioData.persona, scenarioData.constraint, count, excludeTexts);
    }

    // Now actively generate QUESTIONS based on the AI System Prompt logic
    let subject = "the core issue";
    let persona = "the relevant stakeholders";
    let constraint = "current limitations";

    if (scenarioData && typeof scenarioData === 'object') {
        subject = (scenarioData.subject || subject).toLowerCase();
        persona = (scenarioData.persona || persona).toLowerCase();
        constraint = (scenarioData.constraint || constraint).toLowerCase();
    }

    // The Synthetic Logic Templates based on the prompt instructions
    // "Each question must contain the Constraint as a non-negotiable factor."
    // "Use 5 Whys and Inversion for this persona."
    const rawTemplates = [
        // 5 Whys Strategy (Simplified)
        `Why do we let ${constraint} stop us from fixing ${subject}?`,
        `How does our fear of ${constraint} make things worse for ${persona}?`,
        `If we completely ignored ${constraint}, what is the first thing we would change about ${subject}?`,
        `Why do we pretend that ${constraint} is the only way to manage ${subject}?`,
        `What small step can we take on ${subject} without touching ${constraint}?`,
        
        // Inversion Strategy (Simplified)
        `How would we use ${constraint} if we wanted to ruin ${subject} for ${persona}?`,
        `If ${constraint} was our main goal, how would ${persona} react to ${subject}?`,
        `What happens when we stop trying to fix ${subject} because of ${constraint}?`,
        `If ${persona} had full control, how quickly would they destroy ${constraint} to save ${subject}?`,
        
        // Radical Utility (RUT) Strategy (Simplified)
        `How can ${persona} improve ${subject} today without breaking ${constraint}?`,
        `What uncomfortable truth are we avoiding about ${subject} because of ${constraint}?`,
        `If ${constraint} doubled tomorrow, what must we do to save ${subject}?`,
        `What old rule about ${subject} must we drop to survive ${constraint}?`
    ];

    const formatSentence = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    // Filter length: maximum 15 words.
    let denseQuestions = rawTemplates
        .map(t => formatSentence(t))
        .filter(text => text.split(' ').length <= 15);

    // If they generated questions from a previous selection
    if (selectedText && typeof selectedText === 'string') {
        const metaTemplates = [
            `What if agonizing over this choice is just an excuse to stay stagnant?`,
            `How does focusing on this detail help us avoid the real problem?`
        ];
        denseQuestions.push(...metaTemplates);
    }

    const available = denseQuestions.filter(q => !excludeTexts.includes(q));
    
    // Shuffle and slice
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
