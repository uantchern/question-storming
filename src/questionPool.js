const NEGATIVE_TERMS = ['toxic', 'failure', 'debt', 'burnout', 'lack', 'poor', 'bad', 'crisis', 'complain', 'ignore'];

export const generateScenarios = async (subject, persona, constraint, apiKey) => {
    let sub = (subject || "core issue").toLowerCase();
    let per = (persona || "stakeholders").toLowerCase();
    let con = (constraint || "current limits").toLowerCase();

    // Subject-as-Problem Refactor (Pre-Check)
    const isNegative = NEGATIVE_TERMS.some(term => sub.includes(term));
    const instructionFilter = isNegative 
        ? `The Subject [${sub}] is a NEGATIVE obstacle. Ensure the constraint makes fixing this obstacle feel impossible.` 
        : `Treat the Subject [${sub}] as a goal the persona wants to achieve.`;

    const systemPrompt = `You are an expert consultant for small charities. Create 3 distinct 1-sentence scenarios where the [Persona] wants to solve [Subject], but [Constraint] makes it feel impossible.
    
    RULES:
    1. Maximum 15 words per scenario.
    2. 5th-grade vocabulary. NO corporate jargon like 'legacy' or 'mission drift'.
    3. Return ONLY a valid JSON array of 3 strings. Example: ["Scenario 1", "Scenario 2", "Scenario 3"]
    
    CONTEXT:
    Persona: ${per}
    Subject: ${sub}
    Constraint: ${con}
    ${instructionFilter}`;

    return await callGemini(systemPrompt, apiKey);
};

export const generateDeepDiveQuestions = async (primaryContext, apiKey) => {
    const systemPrompt = `You are an expert Question Storming facilitator for small charities. 
    The user has selected a 'Primary Context' scenario that highlights an obstacle.
    
    TASK: Generate exactly 3 "What If" questions that increase pressure on the Constraint.
    FORMAT RULE: Each must act as the very first thing you'd say to the Persona to move past the Constraint. Example format: "What if [action] makes [constraint] irrelevant?"
    
    RULES:
    1. Maximum 15 words per question.
    2. 5th-grade vocabulary. Direct and challenging but empathetic.
    3. Return ONLY a valid JSON array of 3 strings. Example: ["Question 1", "Question 2", "Question 3"]
    
    PRIMARY CONTEXT:
    ${primaryContext}`;

    return await callGemini(systemPrompt, apiKey);
};

const callGemini = async (systemInstruction, apiKey) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ parts: [{ text: "Generate the response as a JSON array." }] }],
                generationConfig: {
                    temperature: 0.8,
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            throw new Error('API Request Failed');
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        
        let result = JSON.parse(text);
        if (!Array.isArray(result)) {
            result = [result];
        }
        return result.slice(0, 3);
    } catch (err) {
        console.error("Gemini Error:", err);
        return [
            "We hit an error connecting to the AI brain.",
            "Please check your API key in the Settings.",
            "Are you sure your internet connection is stable?"
        ];
    }
};
