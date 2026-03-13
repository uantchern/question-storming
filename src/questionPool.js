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

export const generateScenarios = async (subject, persona, constraint) => {
    let sub = (subject || "the core issue").toLowerCase();
    let per = (persona || "the stakeholders").toLowerCase();
    let con = (constraint || "current limits").toLowerCase();

    // Shuffle and pick 3 realities
    let realities = [...CHARITY_REALITIES].sort(() => 0.5 - Math.random()).slice(0, 3);

    return realities.map(reality => {
        let text = `If ${per} tries to fix ${sub}, how does ${con} and ${reality} stop them in the next 24 hours?`;
        return text.charAt(0).toUpperCase() + text.slice(1);
    });
};

export const generateDeepDiveQuestions = async (primaryContext, scenario) => {
    let per = scenario?.persona ? scenario.persona.toLowerCase() : "the persona";
    let con = scenario?.constraint ? scenario.constraint.toLowerCase() : "the limitation";
    
    // Round 2 Pivot: bypassing limitation without permission
    return [
        `What is the one thing ${per} can do without permission to bypass ${con}?`,
        `If no one is looking, how does ${per} quietly eliminate ${con} today?`,
        `Why does ${per} believe they need authorization to outsmart ${con}?`
    ].map(t => t.charAt(0).toUpperCase() + t.slice(1));
};
