export const CHARITY_REALITIES = [
    "volunteer burnout",
    "an audit deadline",
    "donor silence",
    "a grant rejection",
    "board resistance",
    "a PR gaffe",
    "an executive departure",
    "operational bottlenecks",
    "funding drying up",
    "compliance panic",
    "a toxic culture",
    "founding myth paralysis",
    "overworked staff",
    "broken infrastructure",
    "community mistrust",
    "charity duplication",
    "an economic downturn",
    "micromanaging donors",
    "scope creep",
    "lack of succession"
];

// Replaces non-charity terms with better lexicon terms
const charityLexiconFilter = (str) => {
    return str
        .replace(/\bsolve(s)?\b/gi, 'address$1')
        .replace(/\blegacy\s+mindset(s)?\b/gi, 'old habit$1')
        .replace(/\boptics\b/gi, 'how it looks to others')
        .replace(/\bquantum\b/gi, 'amount / level')
        .replace(/\bcomplacency\b/gi, 'lack of action');
};

const formatText = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export const generateScenarios = async (subject, persona, constraint) => {
    let sub = charityLexiconFilter((subject || "the core issue").toLowerCase());
    let per = charityLexiconFilter((persona || "the stakeholders").toLowerCase());
    let con = charityLexiconFilter((constraint || "current limits").toLowerCase());

    // Grammar Filter for Persona Subject-Verb Agreement
    const isPlural = per.endsWith('s') && !per.endsWith('ss') || per.includes('staff');

    // Tension Hooks
    const verbAttempt = isPlural ? 'attempt' : 'attempts';
    const verbIgnore = isPlural ? 'ignore' : 'ignores';
    const verbAre = isPlural ? 'are' : 'is';

    let realities = [...CHARITY_REALITIES].sort(() => 0.5 - Math.random()).slice(0, 3);

    // Scenario A: The Collision
    const collision = `When the ${per} ${verbAttempt} to address ${sub}, they immediately clash with the hard wall of ${con}.`;

    // Scenario B: The Quiet Failure
    const quietFailure = `Terrified of ${con}, the ${per} quietly ${verbIgnore} the reality of ${sub}, leading to ${realities[0]}.`;

    // Scenario C: The External Pressure
    const externalPressure = `A major donor explicitly asks about ${sub}, but the ${per} ${verbAre} forced to provide vague excuses because of ${con}.`;

    return [collision, quietFailure, externalPressure].map(formatText);
};

export const generateDeepDiveQuestions = async (primaryContext, scenario) => {
    let per = scenario?.persona ? charityLexiconFilter(scenario.persona.toLowerCase()) : "the persona";
    let sub = scenario?.subject ? charityLexiconFilter(scenario.subject.toLowerCase()) : "the issue";
    let con = scenario?.constraint ? charityLexiconFilter(scenario.constraint.toLowerCase()) : "the limitation";
    
    // Round 2 Pivot: Micro-Action framework
    return [
        `If you had only 5 minutes to address this, what would you say?`,
        `What is the smallest thing you can change without asking for permission?`,
        `Who is the one person you are avoiding talking to about this?`
    ];
};
