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

export const generateDeepDiveQuestions = async (primaryContext, scenario, roundCounter, existingQuestions = []) => {
    let per = scenario?.persona ? charityLexiconFilter(scenario.persona.toLowerCase()) : "the persona";
    let sub = scenario?.subject ? charityLexiconFilter(scenario.subject.toLowerCase()) : "the issue";
    let con = scenario?.constraint ? charityLexiconFilter(scenario.constraint.toLowerCase()) : "the limitation";
    
    let pool = [];

    // Round 3 Pivot: Micro-Moves framework (Actionable imperative commands)
    if (roundCounter >= 2) {
        pool = [
            `Draft the one-sentence email addressing: "${primaryContext}"`,
            `Schedule a specific 15-minute meeting about this for tomorrow.`,
            `Execute the smallest visible change without asking for permission.`,
            `Write down the worst possible outcome and share it with a trusted peer.`,
            `Cancel one recurring meeting and use that time to attack this problem.`,
            `Send a direct message to the biggest blocker asking for a 5-minute call.`,
            `Delete the current project plan and write a 3-step action list.`,
            `Publicly commit to a deadline for the first step by the end of today.`,
            `Ask the people most affected by this for one piece of brutal feedback.`,
            `Remove one step from the process immediately and see what breaks.`,
            `Map out your exact next step on a sticky note and put it on your screen.`,
            `Identify the one person who can approve this today and call them directly.`,
            `Cut the current budget for this idea in half and write down the new plan.`
        ];
    } else {
        // Round 2 Pivot: Micro-Action framework (Interrogations)
        pool = [
            `If you had only 5 minutes to address this, what would you say?`,
            `What is the smallest thing you can change without asking for permission?`,
            `Who is the one person you are avoiding talking to about this?`,
            `What is the most obvious first step that everyone is ignoring?`,
            `If you had zero budget, how would you start solving this today?`,
            `What is the one rule you can purposefully break right now?`,
            `Who would be the most angry if you fixed this, and why?`,
            `If you were guaranteed not to fail, what would be your next move?`,
            `What happens if you do absolutely nothing about this for a month?`,
            `What is the most uncomfortable conversation you need to schedule?`,
            `How would a brand new hire tackle this problem on their first day?`,
            `What would happen if you did the exact opposite of your current approach?`,
            `Who is the one person that already knows how to fix this?`
        ];
    }

    let filtered = pool.filter(q => !existingQuestions.includes(q));
    
    // Fallback if the user somehow exhausts the entire unique logical array
    if (filtered.length < 3) {
        filtered = pool;
    }

    return filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
};
