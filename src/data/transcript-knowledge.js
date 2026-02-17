/**
 * TRANSCRIPT KNOWLEDGE BASE
 * Extracted wisdom from all provided transcripts (Reverse Vantage, Class #2, Class #5, Class #6, etc.)
 */

export const TRANSCRIPT_KNOWLEDGE = [
    // ===========================================
    // REVERSE VANTAGE (Video 8)
    // ===========================================
    {
        id: 'reverse-vantage-core',
        category: 'Advanced Technique',
        keywords: ['reverse vantage', 'vantage', 'receiver', 'receiving', 'perspective'],
        content: `**Reverse Vantage** is a technique where you stop looking at how Planet A pushes onto Planet B, and instead ask: *"How is Planet B receiving this?"*.\n\nOften, the receiving planet (Planet 2) is not prepared or willing to accept the energy. The solution is to adjust the receiver (Planet 2) to be able to integrate the incoming energy, rather than trying to fix the sender.`
    },
    {
        id: 'forced-aspect',
        category: 'Advanced Technique',
        keywords: ['forced aspect', 'force', 'orb', 'chiron orbital'],
        content: `A **Forced Aspect** occurs when one planet (usually faster or with a wider orb) reaches out to another that doesn't "see" it back. For example, the Moon has a 3° orb, but Chiron only has 1°. If they are 2° apart, the Moon is *forcing* a connection to Chiron, but Chiron isn't naturally reciprocating. This feels like one side of you is dragging the other along.`
    },
    {
        id: 'chiron-vantage',
        category: 'Chiron',
        keywords: ['chiron', 'wound', 'healing', 'reverse vantage chiron'],
        content: `In Reverse Vantage, Chiron is often the "Sender" of a wound. But you must look at what it hits (e.g., the Moon). Is your emotional safety (Moon) built *upon* a wound? If so, your sense of security might actually depend on things *not* working out. You have to reprogram the Moon to feel safe *without* the wound.`
    },

    // ===========================================
    // CLASS #6 - MAKING MONEY (Deep Cuts)
    // ===========================================
    {
        id: 'money-libra',
        category: 'Money',
        keywords: ['libra point', 'balance', 'hidden money', 'money partner'],
        content: `**The Libra Factor:** Anytime you look at the 2nd House (Money/Taurus), you MUST look at the Libra house in your chart. Venus rules both. The Libra house shows the *balance* required to keep the money you make. If you ignore your Libra placement, your financial bucket will have a hole in it.`
    },
    {
        id: 'money-retrograde',
        category: 'Money',
        keywords: ['retrograde money', 'retrograde ruler', 'financial delay'],
        content: `If your 2nd House ruler is **Retrograde**, standard financial advice (save 10%, buy index funds) likely won't work for you. You are a "Maverick." You make money in weird, non-linear ways, and often bloom later in life financially. You must trust your unique path, even if it looks risky to others.`
    },

    // ===========================================
    // CLASS #5 - MANIFESTATION
    // ===========================================
    {
        id: 'manifest-power',
        category: 'Manifestation',
        keywords: ['manifest', 'manifestation', 'power source', 'pluto power'],
        content: `True manifestation isn't just "thinking positive." It's aligning your **Sun** (The Goal/Desire) with your **Pluto** (The Nuclear Engine). If your Sun wants fame but your Pluto in the 4th house wants privacy, you'll self-sabotage. You must use your Pluto placement to *fuel* your Sun's desire.`
    },
    {
        id: 'transmutation',
        category: 'Manifestation',
        keywords: ['transmutation', 'square', 'opposition', 'hard aspect'],
        content: `**Transmutation** is the art of using "bad" aspects (Squares/Oppositions) as fuel. Squares create friction; friction creates heat; heat creates energy. Don't try to "fix" a square—use the tension to launch yourself forward. Success requires the heat of a square.`
    },

    // ===========================================
    // CLASS #2 - RETROGRADES & KARMA
    // ===========================================
    {
        id: 'natal-retrograde-meaning',
        category: 'Retrogrades',
        keywords: ['retrograde', 'natal retrograde', 'internalized'],
        content: `A **Natal Retrograde** means that planet's energy is turned *inward*. It is not weak; it is highly pressurized. You process that energy internally (psychologically) rather than externally. It often indicates a "Karmic Do-Over"—you are here to master that energy for *yourself*, not for the world.`
    },

    // ===========================================
    // PHILOSOPHY & BASICS
    // ===========================================
    {
        id: 'phsr',
        category: 'Philosophy',
        keywords: ['phsr', 'reading order', 'how to read'],
        content: `**PHSR** is the Golden Rule of reading energy: **P**lanet (The Actor) -> **H**ouse (The Stage) -> **S**ign (The Costume) -> **R**uler (The Director). Never read a placement without following the chain of rulership to see who is actually in charge.`
    },
    {
        id: 'ascendant-importance',
        category: 'Philosophy',
        keywords: ['ascendant', 'rising sign', 'importance'],
        content: `Your **Ascendant** is the most important point in your chart. It determines the entire house structure (the "Game Board" of your life). The Sun is just your battery; the Ascendant is the *Vehicle* you are driving.`
    },
    {
        id: 'vibe-higher',
        category: 'Philosophy',
        keywords: ['vibe higher', 'vibration', 'frequency'],
        content: `"Vibe Higher" isn't just a catchphrase. It means choosing the *highest expression* of your placements. Every placement has a basement (shadow) and a balcony (light). You can't change your chart, but you can choose which floor you live on. Mars in Aries can be "Violence" (Basement) or "Courageous Leadership" (Balcony).`
    }
];

// Helper to search knowledge
export function searchKnowledge(query) {
    const q = query.toLowerCase();

    // exact match score
    return TRANSCRIPT_KNOWLEDGE.filter(item => {
        return item.keywords.some(k => q.includes(k));
    }).map(item => ({
        ...item,
        relevance: 1 // simplified for now
    }));
}
