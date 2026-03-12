export const generateGeminiQuestions = async (scenario, selectedText, apiKey, isParadoxMode, paradoxConstraint) => {
    let targetModel = "gemini-1.5-flash";

    let scenarioText = typeof scenario === 'object' ? `Subject: ${scenario.subject}\nPersona: ${scenario.persona}\nConstraint: ${scenario.constraint}` : scenario;
    let selectedTextLocal = typeof selectedText === 'object' ? `Subject: ${selectedText.subject}\nPersona: ${selectedText.persona}\nConstraint: ${selectedText.constraint}` : selectedText;
    let isInitialGeneration = scenarioText === selectedTextLocal;

    let systemPrompt = `SYSTEM ROLE: You are a Tier-1 Non-Profit Strategist and Philanthropic Consultant. You possess deep, systemic knowledge of the global charities sector. You understand the complex, real-world frictions NGOs face: the 'overhead myth', donor reporting fatigue, restricted vs. unrestricted funding challenges, the difficulty of Monitoring & Evaluation (M&E) for long-term systemic change, and shifting philanthropic trends. Filter every user input through this highly realistic, expert worldview. Do not generate scenarios that are naive or ignore the operational realities of running a modern charity.`;

    if (isInitialGeneration) {
        systemPrompt += `\n[TASK] The user is trying to achieve a core Subject for a target Persona, but they are facing a severe Constraint. Your task is to generate exactly 3 realistic, highly specific "Storming Scenarios" to challenge their entrenched mindset.
[RULES FOR SYNTHESIS - CRITICAL]
Crucial Rule: Treat the user's inputs for Subject, Persona, and Constraint as conceptual seeds, not exact text strings. Do not parrot, quote, or forcefully paste the user's exact phrasing into the scenarios. Instead, extract the underlying meaning of the inputs and synthesize them smoothly into your own natural, professional prose.
Translate the Constraint into a real-world structural barrier (e.g., funding blocks, staff burnout, regulatory hurdles). Show how it hurts the charity; do not just state that it exists.
Keep each scenario extremely concise (under 25 words).
[SCENARIO FRAMEWORKS]
Scenario 1 (The Funder's Ultimatum): Frame the constraint as a catastrophic funding block from an institutional donor demanding impossible metrics.
Scenario 2 (The Operational Bottleneck): Frame the constraint as an operational bottleneck causing the charity to lose ground to a more agile, tech-driven competitor.
Scenario 3 (The Competitive Disruption): Frame the constraint as an internal crisis of trust or strategic drift, revealed by an external audit or changing sector trends.
DO NOT return questions. Return actual situation descriptions (scenarios).
Return ONLY a valid JSON array of exactly 3 string scenarios. DO NOT wrap in markdown.`;
    } else {
        systemPrompt += `\nYour goal is to generate exactly 3 practical, insightful, and highly relevant follow-up questions to help them solve their specific issue.
The user is brainstorming about a core challenge scenario. They have selected a specific follow-up context to dive deeper into.
You must NOT repeat typical boilerplate questions. You must deeply analyze the specific context and ask actionable, uncomfortable questions that are concise and directly address the core tension.
Return ONLY a valid JSON array of exactly 3 string questions. DO NOT wrap in markdown.`;
    }

    let userPrompt;
    if (isInitialGeneration) {
        userPrompt = `[INPUTS]\n${scenarioText}\n\nGenerate 3 realistic, concise scenarios (situations) based on the specific frameworks provided. KEEP EACH SCENARIO UNDER 25 WORDS.`;
        userPrompt += `\n\n[SYSTEM RANDOMIZER SEED: ${Math.random()}]\nEnsure these scenarios are highly relevant to the abstracted meaning of the provided parameters without quoting them directly.`;
    } else {
        userPrompt = `SCENARIO CHOSEN:\n${scenarioText}\nTHEIR CURRENT THREAD / FOCUS: "${selectedTextLocal}"\n`;
    }

    if (isParadoxMode && paradoxConstraint) {
        userPrompt += `\nCRITICAL PARADOX CONSTRAINT: You must violently warp logic applying this constraint: "${paradoxConstraint}". Break normal assumptions. Force them outside their structural thinking.\n`;
    } else if (!isInitialGeneration) {
        userPrompt += `\nGenerate highly contextual and practical questions that will help them directly resolve the specific situation they are focusing on. Ensure the questions force them to grapple with actual local governance issues, transparency requirements, and the realities of running an IPC or charity in Singapore.\n`;
    }

    if (isInitialGeneration) {
        userPrompt += `\nGenerate exactly 3 uniquely challenging scenarios as a JSON array of strings. Do not use code blocks.`;
    } else {
        userPrompt += `\nGenerate exactly 3 uniquely practical follow-up questions as a JSON array of strings. Do not use code blocks.`;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `SYSTEM INSTRUCTIONS:\n${systemPrompt}\n\n${userPrompt}` }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        const aiReply = data.candidates[0].content.parts[0].text;

        let parsed = null;
        try {
            parsed = JSON.parse(aiReply.trim());
        } catch (e) {
            // Strip potential markdown wrapping just in case
            const cleaned = aiReply.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleaned);
        }

        if (Array.isArray(parsed) && parsed.length >= 3) {
            return parsed.slice(0, 3);
        } else {
            throw new Error("Invalid format from AI");
        }
    } catch (err) {
        console.error("Gemini API Error:", err);
        return null; // Return null so the app gracefully falls back to the offline static pool
    }
};
