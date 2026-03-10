export const generateGeminiQuestions = async (scenario, selectedText, apiKey, isParadoxMode, paradoxConstraint) => {
    let targetModel = "gemini-1.5-flash";

    let scenarioText = typeof scenario === 'object' ? `Subject: ${scenario.subject}\nPersona: ${scenario.persona}\nConstraint: ${scenario.constraint}` : scenario;
    let selectedTextLocal = typeof selectedText === 'object' ? `Subject: ${selectedText.subject}\nPersona: ${selectedText.persona}\nConstraint: ${selectedText.constraint}` : selectedText;
    let isInitialGeneration = scenarioText === selectedTextLocal;

    let systemPrompt = `You are a legendary, hyper-analytical Question Storming facilitator for the Singapore charity, non-profit, and IPC sector.`;

    if (isInitialGeneration) {
        systemPrompt += `\nYour goal is to generate exactly 3 distinct, highly realistic, and difficult SCENARIOS (1-2 sentences each) based on the user's focus triad.
The scenarios must be grounded in the context of Singapore charities and directly tie together the Subject, Persona, and Constraint.
DO NOT return questions. Return actual situation descriptions (scenarios).
Return ONLY a valid JSON array of exactly 3 string scenarios. DO NOT wrap in markdown.`;
    } else {
        systemPrompt += `\nYour goal is to generate exactly 3 highly probing, uncomfortable, and deeply contextual follow-up questions to force a breakthrough.
The user is brainstorming about a core challenge scenario. They have selected a specific follow-up context to dive deeper into.
You must NOT repeat typical boilerplate questions. You must deeply analyze the context and push the boundaries of their thinking regarding governance, impact, operations, psychology, and organizational design.
Return ONLY a valid JSON array of exactly 3 string questions. DO NOT wrap in markdown.`;
    }

    let userPrompt;
    if (isInitialGeneration) {
        userPrompt = `CORE PARAMETERS:\n${scenarioText}\n\nGenerate 3 realistic, difficult scenarios (situations) merging these parameters.`;
        userPrompt += `\n\n[SYSTEM RANDOMIZER SEED: ${Math.random()}]\nEnsure these scenarios are entirely unique from any previous suggestions, highly specific, and creatively distinct. Do not fall into predictable charity tropes.`;
    } else {
        userPrompt = `SCENARIO CHOSEN:\n${scenarioText}\nTHEIR CURRENT THREAD / FOCUS: "${selectedTextLocal}"\n`;
    }

    if (isParadoxMode && paradoxConstraint) {
        userPrompt += `\nCRITICAL PARADOX CONSTRAINT: You must violently warp logic applying this constraint: "${paradoxConstraint}". Break normal assumptions. Force them outside their structural thinking.\n`;
    } else if (!isInitialGeneration) {
        userPrompt += `\nGenerate highly contextual, unpredictable questions. Challenge their ego, their metrics, their board, and the system.\n`;
    }

    if (isInitialGeneration) {
        userPrompt += `\nGenerate exactly 3 uniquely challenging scenarios as a JSON array of strings. Do not use code blocks.`;
    } else {
        userPrompt += `\nGenerate exactly 3 uniquely challenging follow-up questions as a JSON array of strings. Do not use code blocks.`;
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
