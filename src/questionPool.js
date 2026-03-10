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

// Utility to randomly pick N unique questions from the pool
export const getRandomQuestions = (count = 3, excludeTexts = []) => {
    const available = QUESTION_POOL.filter(q => !excludeTexts.includes(q));

    // If we run out of questions, just recycle the whole pool (should rarely happen)
    const poolToUse = available.length >= count ? available : QUESTION_POOL;

    const shuffled = [...poolToUse].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
