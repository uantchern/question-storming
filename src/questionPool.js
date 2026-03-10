export const QUESTION_POOL = [
    "Why are you asking this question?",
    "Did a previous staff member get fired for pointing this out?",
    "Are you protecting someone's feelings at the cost of the charity's mission?",
    "If the Commissioner of Charities investigated this tomorrow, what would they find?",
    "Who is getting paid to keep this inefficiency alive?",
    "Is this a genuine problem, or just a pet project of a noisy Board Member?",
    "Are we using 'compliance' as an excuse to do absolutely nothing?",
    "If we stopped doing this entirely, would anyone outside this room actually care?",
    "What would happen if we gave the budget for this to our beneficiaries directly?",
    "Is the Executive Director afraid to hear the real answer to this?",
    "Why do we secretly pretend this broken process is working?",
    "Who are we desperately afraid of offending if we fix this?",
    "If a lean tech startup took over our charity, what is the first thing they would kill?",
    "Are we just doing this so it looks good in our annual impact report?",
    "How much donor money are we burning by debating this instead of acting?",
    "Has someone already tried to solve this and given up quietly?",
    "Is this just another 'wayang' (show) for the funding agencies?",
    "If our biggest corporate sponsor knew the truth about this, would they pull their funding?",
    "What is the absolute worst thing that happens if we do nothing about this?",
    "Who is sitting on the solution right now but too exhausted to speak up?",
    "Are we solving a mere symptom just so we can feel productive today?",
    "What is the most uncomfortable, unspoken truth about this scenario?",
    "Could we solve this in an hour if we completely ignored the hierarchy?",
    "Is someone's ego the only real bottleneck here?",
    "If we didn't have any government grants, would we still care about this?",
    "Why are we the ones trying to solve this? Shouldn't another IPC be doing it?",
    "How would we explain this mess to a skeptical five-year-old?",
    "What happens if our NCSS evaluator specifically targets this area next year?",
    "What 'sacred cow' in our constitution is blinding us right now?",
    "Are we overcomplicating this just to justify someone's job?",
    "If our success depended entirely on abandoning this, how fast would we drop it?",
    "What is the hidden, selfish opportunity here for whoever solves this?",
    "What unwritten rule of the Singapore social sector are we blindly following?",
    "If we had a budget of $0, what would our first step truly be?",
    "Could this massive problem actually be a blessing in disguise?",
    "How does solving this make another department's work significantly harder?",
    "What if answering this honestly meant we needed to rip up our strategic plan?",
    "Is this challenge just a distraction from our actual, failing core mission?",
    "What is the brutal 'Band-Aid' solution we keep applying?",
    "What fear is actively holding the management team back from taking bold action?"
];

// 10 Common Challenges as defined in SessionSetup.jsx Preset List
const CHALLENGES = [
    "How can we reach out to more donors?",
    "How can we attract more volunteers?",
    "What is the biggest inefficiency in our operations?",
    "How do we diversify our funding sources?",
    "How can we improve board engagement?",
    "How do we effectively measure and report our impact?",
    "How can we retain our staff and prevent burnout?",
    "How do we increase our digital presence and awareness?",
    "How can we build strategic partnerships with corporates?",
    "How do we ensure long-term financial sustainability?"
];

const PROMPT_TEMPLATES = {
    "How can we reach out to more donors?": [
        "Are we treating donors like ATMs instead of partners in {X}?",
        "What if our current donor acquisition strategy is entirely ruined by {X}?",
        "Do donors secretly hate our {X}?",
        "Why would any donor actually care about {X} when there are 2,000 other charities?",
        "Who authored the last terrible appeal letter regarding {X}?",
        "Is our donor outreach model fundamentally broken because of {X}?"
    ],
    "How can we attract more volunteers?": [
        "Do we just want volunteers to do our {X} work for free?",
        "Why does our onboarding process for {X} feel like a punishment?",
        "Are we treating volunteers worse than {X}?",
        "If we had to pay our volunteers for {X}, how fast would we automate it?",
        "Who is alienating the volunteers the minute they touch {X}?",
        "Is our lack of volunteers a symptom of {X}?"
    ],
    "What is the biggest inefficiency in our operations?": [
        "Why is our process for {X} still stuck in the 1990s?",
        "Who is terrified of losing their job if we automate {X}?",
        "If we lost 50% of our budget tomorrow, would we still fund {X}?",
        "Are we spending 10 hours a week on {X} just to please one bored board member?",
        "What is the true financial cost of our incompetence in {X}?",
        "How is {X} dragging down the entire charity's performance?"
    ],
    "How do we diversify our funding sources?": [
        "Are we completely addicted to the government grant for {X}?",
        "If NCSS changed funding rules for {X}, would we close down?",
        "Why are our funding pitches for {X} so overwhelmingly boring?",
        "Who is blocking us from trying a risky new model for {X}?",
        "Are we too proud to ask for money to fund {X} directly?",
        "Does our over-reliance on one funder blind us to fixing {X}?"
    ],
    "How can we improve board engagement?": [
        "Is our board completely disconnected from the reality of {X}?",
        "Why does the board only care about {X} when it affects our public image?",
        "Are we feeding the board vanity metrics about {X} to hide our failures?",
        "Who are we afraid to remove from the board, despite them ruining {X}?",
        "Would a shadow board of 20-year-olds manage {X} better than we do?",
        "Does the board's interference in {X} actually hurt our mission?"
    ],
    "How do we effectively measure and report our impact?": [
        "Are our impact numbers completely fabricated regarding {X}?",
        "If an investigative journalist dug into our {X} numbers, what would they expose?",
        "Why do we measure outputs of {X} instead of actual societal change?",
        "Who benefits from keeping our {X} metrics impossibly vague?",
        "Are we confusing 'doing an activity' with 'making an impact' in {X}?",
        "Are we manipulating the data on {X} to secure future grants?"
    ],
    "How can we retain our staff and prevent burnout?": [
        "Are we using the phrase 'passion for the cause' to excuse underpaying staff for {X}?",
        "Who is the toxic manager driving people to quit over {X}?",
        "If a staff member was hospitalized over {X}, whose fault is it?",
        "Are we ignoring staff complaints about {X} because 'it has always been this way'?",
        "Would the Executive Director tolerate the workload required for {X}?",
        "Is our staff turnover directly tied to how we mismanage {X}?"
    ],
    "How do we increase our digital presence and awareness?": [
        "Are we posting about {X} just to make ourselves feel productive?",
        "Why is our social media presence for {X} so bureaucratic and lifeless?",
        "Are we afraid to show the ugly truth of {X} online?",
        "Who is enforcing the boring brand guidelines that cripple our voice on {X}?",
        "If our website crashed during {X}, would anyone actually notice?",
        "Does our digital presence just look like compliance theatre for {X}?"
    ],
    "How can we build strategic partnerships with corporates?": [
        "Are corporates just using our {X} as a cheap CSR photo-op?",
        "What are we afraid to demand from our corporate sponsor for {X}?",
        "Why do corporate partners disappear the moment we ask for hard cash for {X}?",
        "Are we compromising our charity's core values to secure funding for {X}?",
        "Who is signing off on these terrible corporate partnerships for {X}?",
        "Is corporate funding forcing us to prioritize {X} over our real beneficiaries?"
    ],
    "How do we ensure long-term financial sustainability?": [
        "Is our long-term plan for {X} just 'hope and pray'?",
        "If our reserves hit zero tomorrow, what happens to {X}?",
        "Why are we artificially keeping {X} alive at a massive financial loss?",
        "Who is treating the charity's endowment like a personal piggy bank for {X}?",
        "Are we financially unsustainable because our core model for {X} is fundamentally broken?",
        "Are we hiding a massive structural deficit behind our work on {X}?"
    ]
};

const ITEMS = [
    "the status quo",
    "our outdated policies",
    "staff compliance",
    "the Executive Director",
    "the founder's ego",
    "compliance theatre",
    "our vanity projects",
    "the actual beneficiaries",
    "bureaucracy",
    "board interference",
    "the NCSS evaluator",
    "our fear of failure",
    "our inability to adapt",
    "legacy software",
    "the toxic culture",
    "donor demands"
];

// Generate the specific 50 vaults dynamically
export const CHALLENGE_VAULTS = {};

CHALLENGES.forEach(challenge => {
    let qSet = new Set();
    const templates = PROMPT_TEMPLATES[challenge];

    // Safety check in case challenge is not found
    if (templates) {
        // Generate up to 50 unique questions for this challenge
        let attempts = 0;
        while (qSet.size < 50 && attempts < 500) {
            let t = templates[Math.floor(Math.random() * templates.length)];
            let item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
            let specificQ = t.replace("{X}", item);
            qSet.add(specificQ);
            attempts++;
        }
        CHALLENGE_VAULTS[challenge] = Array.from(qSet);
    } else {
        CHALLENGE_VAULTS[challenge] = [];
    }
});

// Utility to randomly pick N unique questions from the pool
// Now respects the challenge scenario selected!
export const getRandomQuestions = (count = 3, excludeTexts = [], scenario = null) => {
    let poolToUse = [...QUESTION_POOL];

    // Add specific vault questions if the scenario exactly matches a preset challenge
    if (scenario && CHALLENGE_VAULTS[scenario] && CHALLENGE_VAULTS[scenario].length > 0) {
        poolToUse = [...poolToUse, ...CHALLENGE_VAULTS[scenario]];
    }

    const available = poolToUse.filter(q => !excludeTexts.includes(q));

    // If we run out of unique questions, recycle the pool
    const poolFinal = available.length >= count ? available : poolToUse;

    const shuffled = [...poolFinal].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
