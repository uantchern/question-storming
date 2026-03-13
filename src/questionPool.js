// Phase 1: Keep the PRESET_SCENARIOS and getMatrixScenarios for the setup phase intact.
// These are hand-crafted, high-fidelity STARTING SCENARIOS for the top 5 Quick Starts.
const PRESET_SCENARIOS = {
    "Making a real impact on our beneficiaries": [
        "Your flagship program has run for 5 years, but independent data shows beneficiary lives haven't structurally improved at all, creating panic before the AGM.",
        "Major foundations are refusing to renew grants because you can only provide heartwarming anecdotes instead of rigorous long-term impact metrics.",
        "Beneficiaries are quietly bypassing your services entirely because your interventions don't address their actual, evolving long-term needs."
    ],
    "Building up financial reserves": [
        "A vocal block of major donors threatens to pull funding, angrily questioning why you are hoarding millions in cash reserves instead of serving the community today.",
        "The board is paralyzed by fear of a sudden economic downturn, aggressively cutting vital operational budgets just to endlessly pad the reserves account.",
        "A sudden, severe drop in unrestricted giving reveals that your current reserves won't even cover three months of basic staff payroll."
    ],
    "Changing successful but stale fundraising events": [
        "Your annual charity gala brings in identical revenue every year, but the overhead costs and staff burnout required to run it are quietly destroying the organization.",
        "A massive shift in donor demographics reveals that younger, high-net-worth individuals find your legacy fundraising events completely archaic and refuse to attend.",
        "The leadership team is terrified of experimenting with digital, high-leverage fundraising models out of purely irrational fear of losing the 'safe' gala revenue."
    ],
    "Aligning collectively on our true purpose": [
        "You realize the charity is aggressively chasing heavily restricted government grants that forcefully drift you entirely away from your founding constitutional purpose.",
        "A bitter ideological split emerges between the visionary staff who want systemic change and legacy board members who only want safe, traditional welfare distribution.",
        "Public confusion over your constantly shifting mission statement has caused two major corporate partners to quietly drop you for a more focused competitor."
    ],
    "Failing to attract staff": [
        "Your most talented junior executives are relentlessly poached by the private sector because you cynically use 'passion' to justify paying 40% below market rate.",
        "The organization's deeply bureaucratic, risk-averse culture has earned such a toxic reputation online that top-tier social work graduates refuse to even interview.",
        "Desperation for headcount forces you to hire unqualified candidates, causing a massive drop in service quality that directly harms the beneficiaries."
    ]
};

export const MATRIX_SCENARIOS = [
    "You are aggressively pushing for {subject}, but the target audience of {persona} is actively resisting due to the hard reality of {constraint}.",
    "A major long-term grant requires you to completely solve {subject} for {persona}, but {constraint} makes the timeline nearly impossible.",
    "Internal data brutally reveals that your current approach to {subject} is actively alienating {persona} entirely because of {constraint}.",
    "To rapidly scale {subject}, you must rely entirely on {persona}, yet you are paralyzed by {constraint}.",
    "A direct competitor successfully achieves {subject} for {persona} because they somehow bypassed the crushing limitation of {constraint}.",
    "The board demands immediate, visible progress on {subject}, but {persona} refuses to engage until you resolve {constraint}.",
    "A localized crisis abruptly forces you to scrap your plans for {subject} and deliver it to {persona} under the extreme pressure of {constraint}.",
    "Foundational funding for {subject} is immediately frozen until you can prove to {persona} that you have overcome {constraint}.",
    "You discover that {persona} fundamentally misunderstands your goal for {subject}, and communicating the truth is blocked by {constraint}.",
    "A critical strategic partner offers to fully fund {subject} for {persona}, but you ethically cannot accept because of {constraint}.",
    "Your most passionate team member quits out of frustration trying to deliver {subject} to {persona} while fighting the daily friction of {constraint}.",
    "The public desperately needs {subject}, but {persona} is structurally incapable of receiving it right now because of {constraint}."
];

export const getMatrixScenarios = (subject, persona, constraint, count = 3, excludeTexts = []) => {
    if (PRESET_SCENARIOS[subject]) {
        let pool = PRESET_SCENARIOS[subject];
        const available = pool.filter(q => !excludeTexts.includes(q));
        let shuffled = available.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    let pool = [];
    const sub = (subject || "the core issue").toLowerCase();
    const per = (persona || "our stakeholders").toLowerCase();
    const con = (constraint || "current limitations").toLowerCase();

    MATRIX_SCENARIOS.forEach(template => {
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
