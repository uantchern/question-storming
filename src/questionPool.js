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
        .replace(/\blegacy\s+mindset(s)?\b/gi, 'old habit$1');
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
    const quietFailure = `Terrified of ${con}, the ${per} quietly ${verbIgnore} the reality of ${sub}, accelerating ${realities[0]}.`;

    // Scenario C: The External Pressure
    const externalPressure = `A major donor explicitly asks about ${sub}, but the ${per} ${verbAre} forced to provide vague excuses because of ${con}.`;

    return [collision, quietFailure, externalPressure].map(formatText);
};

export const generateDeepDiveQuestions = async (primaryContext, scenario) => {
    let per = scenario?.persona ? charityLexiconFilter(scenario.persona.toLowerCase()) : "the persona";
    let sub = scenario?.subject ? charityLexiconFilter(scenario.subject.toLowerCase()) : "the issue";
    let con = scenario?.constraint ? charityLexiconFilter(scenario.constraint.toLowerCase()) : "the limitation";
    
    // Round 2 Pivot: bypassing limitation without permission
    return [
        `What is the one thing the ${per} can do without permission to bypass ${con}?`,
        `If nobody was looking, who could physically start improving ${sub} today despite ${con}?`,
        `Why do the ${per} sincerely believe they need authorization to outsmart ${con}?`
    ].map(formatText);
};
