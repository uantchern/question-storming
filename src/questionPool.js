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
        // 5 Whys Strategy
        `Why is it that whenever we attempt to improve ${subject}, the immovable reality of ${constraint} forces ${persona} to immediately compromise their standards?`,
        `Given the absolute blockade of ${constraint}, why does ${persona} stubbornly continue with strategic approaches to ${subject} that are virtually guaranteed to fail?`,
        `Why do we systematically allow ${constraint} to dictate exactly how ${persona} must operate, rather than completely reinventing our assumptions about ${subject}?`,
        `What is the deeply held, unspoken assumption about ${constraint} that currently prevents ${persona} from radically altering their approach to ${subject}?`,
        `Why hasn't ${persona} admitted that their day-to-day efforts toward ${subject} are just cowardly ways of avoiding the direct friction of ${constraint}?`,
        
        // Inversion Strategy
        `If ${persona} actively wanted to completely sabotage ${subject} without getting caught, how would they weaponize ${constraint} to justify their lack of progress?`,
        `What is the most administratively efficient way for ${persona} to permanently guarantee failure in ${subject} by intentionally leaning into ${constraint}?`,
        `If the existence of ${constraint} was exactly what we secretly wanted, how would ${persona} confidently explain away their current performance regarding ${subject}?`,
        `To ensure that a breakthrough in ${subject} never occurs, how could ${persona} use ${constraint} as the ultimate, unquestionable excuse to the board?`,
        
        // Radical Utility (RUT) Strategy
        `How incredibly can ${persona} aggressively advance ${subject} starting tomorrow morning without requiring a single concession regarding the severe friction of ${constraint}?`,
        `What is the most uncomfortable, devastating truth that ${persona} actively refuses to confront regarding how ${constraint} fundamentally neuters ${subject}?`,
        `If the severity of ${constraint} were to instantly double tomorrow, what drastic, unprecedented shift must ${persona} immediately make to salvage ${subject}?`,
        `What highly cherished element of our work in ${subject} must ${persona} ruthlessly assassinate in order to functionally survive the pressure of ${constraint}?`
    ];

    const formatSentence = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    // Density Check: Reject generic fluff under 10 words per the prompt checklist
    let denseQuestions = rawTemplates
        .map(t => formatSentence(t))
        .filter(text => text.split(' ').length >= 10);

    // If they generated questions from a previous selection, add a purely context-aware meta-probe
    if (selectedText && typeof selectedText === 'string') {
        const metaTemplates = [
            `You just chose to focus on that specific angle. If an absolute cynic analyzed your choice, would they say you are using ${constraint} to excuse poor management of ${persona}?`,
            `Does agonizing over your previous selection actually solve ${subject}, or does it just make ${persona} look remarkably busy while ${constraint} steadily destroys us?`
        ];
        denseQuestions.push(...metaTemplates);
    }

    const available = denseQuestions.filter(q => !excludeTexts.includes(q));
    
    // Shuffle and slice
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
