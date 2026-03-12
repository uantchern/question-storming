export const generateGeminiQuestions = async (scenario, selectedText, apiKey, isParadoxMode, paradoxConstraint) => {
    let targetModel = "gemini-1.5-flash";

    let scenarioText = typeof scenario === 'object' ? `Subject: ${scenario.subject}\nPersona: ${scenario.persona}\nConstraint: ${scenario.constraint}` : scenario;
    let selectedTextLocal = typeof selectedText === 'object' ? `Subject: ${selectedText.subject}\nPersona: ${selectedText.persona}\nConstraint: ${selectedText.constraint}` : selectedText;
    let isInitialGeneration = scenarioText === selectedTextLocal;

    let systemPrompt = `You are a legendary, hyper-analytical Question Storming facilitator exclusively focused on the Singapore charity, non-profit, and IPC (Institutions of a Public Character) sector.`;

    if (isInitialGeneration) {
        systemPrompt += `\nYour goal is to generate exactly 3 distinct, highly realistic, and extremely concise SCENARIOS (under 20 words each) based on the user's focus triad.
The scenarios MUST be exceptionally relevant to the specific Subject, Persona, and Constraint provided. Keep the scenarios very punchy, practical, and highly focused on the core tension. Do not force heavy compliance jargon unless it fits naturally.
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
        userPrompt = `CORE PARAMETERS:\n${scenarioText}\n\nGenerate 3 realistic, concise scenarios (situations) merging these parameters accurately. KEEP EACH SCENARIO UNDER 20 WORDS.`;
        userPrompt += `\n\n[SYSTEM RANDOMIZER SEED: ${Math.random()}]\nEnsure these scenarios are highly relevant to the provided parameters, specific, and clearly state the tension without rambling.`;
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
