export const generateGeminiQuestions = async (scenario, selectedText, apiKey, isParadoxMode, paradoxConstraint) => {
    let targetModel = "gemini-2.5-flash";

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
[FEW-SHOT EXAMPLES]
User Input:
Subject: Improve marketing outreach
Persona: Tech-savvy youth
Constraint: Zero budget for ads

Ideal AI Output:
{
  "reasoning": "A zero budget means relying purely on organic reach, which is heavily algorithm-dependent. I need to frame scenarios around funding pressure, algorithmic invisibility, and reputational risk.",
  "items": [
    "A major funder warns your grant will not be renewed unless your youth engagement metrics drastically improve purely through organic social traction.",
    "A rival charity goes viral, effortlessly capturing your youth audience while your unpaid posts remain invisible due to algorithmic changes.",
    "A leaked internal report reveals youth view your brand as 'stale', triggering a crisis of confidence you cannot spend your way out of."
  ]
}

DO NOT return questions. Return actual situation descriptions (scenarios).
Return ONLY a valid JSON object containing 'reasoning' (string) and 'items' (array of exactly 3 string scenarios). DO NOT wrap in markdown.`;
    } else {
        systemPrompt += `\nYour goal is to generate exactly 3 practical, insightful, and highly relevant follow-up questions to help them solve their specific issue.
The user is brainstorming about a core challenge scenario. They have selected a specific follow-up context to dive deeper into.
You must NOT repeat typical boilerplate questions. You must deeply analyze the specific context and ask actionable, uncomfortable questions that are concise and directly address the core tension.

[FEW-SHOT EXAMPLES]
Ideal AI Output:
{
  "reasoning": "The user is concerned about losing major donors due to toxic board culture. The core tension is the power dynamic between governance and funding.",
  "items": [
    "If your largest donor demanded the removal of the board chair tomorrow to maintain funding, how would you navigate the legal fallout?",
    "Why are we allowing volunteer board members to unilaterally make operational decisions that jeopardize millions in institutional grants?",
    "What specific reporting mechanism can we implement today to shield frontline staff from toxic board interference?"
  ]
}

Return ONLY a valid JSON object containing 'reasoning' (string) and 'items' (array of exactly 3 string questions). DO NOT wrap in markdown.`;
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
        userPrompt += `\nGenerate exactly 3 uniquely challenging scenarios as a JSON object with 'reasoning' and 'items'. Do not use code blocks.`;
    } else {
        userPrompt += `\nGenerate exactly 3 uniquely practical follow-up questions as a JSON object with 'reasoning' and 'items'. Do not use code blocks.`;
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

        if (parsed && typeof parsed.reasoning === 'string' && Array.isArray(parsed.items) && parsed.items.length >= 3) {
            return {
                reasoning: parsed.reasoning,
                items: parsed.items.slice(0, 3)
            };
        } else if (Array.isArray(parsed) && parsed.length >= 3) {
            return {
                reasoning: "AI generated alternative formats. Using standard logic parameters.",
                items: parsed.slice(0, 3)
            };
        } else {
            throw new Error("Invalid format from AI");
        }
    } catch (err) {
        console.error("Gemini API Error:", err);
        return null; // Return null so the app gracefully falls back to the offline static pool
    }
};
