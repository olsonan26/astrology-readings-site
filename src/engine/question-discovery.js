/**
 * INTELLIGENT ASTROLOGY READING SYSTEM
 * Interactive Question Discovery & Autonomous Analysis Engine
 * 
 * Implements the spec's core features:
 * 1. Interactive Question Discovery (guided category + follow-up flow)
 * 2. Autonomous Analysis Engine (smart chart factor routing)
 * 3. Analysis Progress Tracking (animated factor-by-factor progress)
 * 4. Session Context Management (remembers across queries)
 */

// ============================================
// QUESTION DISCOVERY SYSTEM
// ============================================

export const DISCOVERY_CATEGORIES = [
    {
        id: 'relationships',
        label: '💕 Relationships & Love',
        description: 'Partnership patterns, compatibility, timing',
        icon: '💕',
        color: '#f472b6'
    },
    {
        id: 'career',
        label: '💼 Career & Life Purpose',
        description: 'Vocation, calling, professional path',
        icon: '💼',
        color: '#60a5fa'
    },
    {
        id: 'personal_growth',
        label: '🌱 Personal Growth & Healing',
        description: 'Shadow work, wounds, transformation',
        icon: '🌱',
        color: '#34d399'
    },
    {
        id: 'timing',
        label: '⏰ Current Life Situation',
        description: "What's happening now, transits, timing",
        icon: '⏰',
        color: '#fbbf24'
    },
    {
        id: 'general',
        label: '🎯 Complete Profile',
        description: 'Comprehensive reading of all areas',
        icon: '🎯',
        color: '#c084fc'
    },
    {
        id: 'specific',
        label: '❓ Specific Question',
        description: 'I have something particular to ask',
        icon: '❓',
        color: '#fb923c'
    }
];

export const FOLLOW_UP_QUESTIONS = {
    relationships: [
        {
            id: 'rel_status',
            question: 'Current relationship status?',
            type: 'choice',
            options: [
                'Single, looking',
                'Dating someone',
                'In a relationship',
                'Married / Long-term',
                'Complicated situation',
                'Recently ended'
            ]
        },
        {
            id: 'rel_focus',
            question: 'What do you want to understand?',
            type: 'multi',
            options: [
                'Why my relationships follow certain patterns',
                'Compatibility with someone specific',
                'When I\'ll meet someone',
                'How to heal from past relationships',
                'What I need in a partner',
                'Current relationship challenges'
            ]
        }
    ],
    career: [
        {
            id: 'career_status',
            question: 'Where are you in your career journey?',
            type: 'choice',
            options: [
                'Just starting / exploring',
                'Established but unfulfilled',
                'Considering a change',
                'Between careers',
                'Building something new',
                'Successful, seeking next level'
            ]
        },
        {
            id: 'career_focus',
            question: 'What do you want to understand?',
            type: 'multi',
            options: [
                'My true calling / life purpose',
                'Best career paths for me',
                'Timing for career changes',
                'How to overcome obstacles',
                'Financial patterns & opportunities',
                'Work-life balance'
            ]
        }
    ],
    personal_growth: [
        {
            id: 'growth_focus',
            question: 'What areas of growth are calling to you?',
            type: 'multi',
            options: [
                'Healing old wounds',
                'Understanding shadow patterns',
                'Embracing my power',
                'Breaking free from limitations',
                'Spiritual development',
                'Self-acceptance'
            ]
        }
    ],
    timing: [
        {
            id: 'timing_context',
            question: "What's happening in your life right now?",
            type: 'text'
        },
        {
            id: 'timing_focus',
            question: 'What do you want to understand about this time?',
            type: 'multi',
            options: [
                'Why things feel challenging',
                'What opportunities are available',
                'When will things shift',
                'What lessons am I learning',
                'How to navigate this period'
            ]
        }
    ]
};


// ============================================
// AUTONOMOUS ANALYSIS ENGINE
// ============================================

/**
 * Maps user question categories to chart factors the system should examine.
 * This is the "brain" - it decides what's relevant like an expert astrologer would.
 */
export const ANALYSIS_ROUTING = {
    relationships: {
        chartFactors: [
            { name: 'Venus', key: 'venus', description: 'Love style & attraction', icon: '♀' },
            { name: 'Mars', key: 'mars', description: 'Pursuit & desire patterns', icon: '♂' },
            { name: '7th House', key: 'house_7', description: 'Partnerships & commitment', icon: '⚖' },
            { name: '5th House', key: 'house_5', description: 'Romance & pleasure', icon: '🎭' },
            { name: '8th House', key: 'house_8', description: 'Intimacy & shared resources', icon: '🦂' },
            { name: 'Chiron', key: 'chiron', description: 'Relationship wounds', icon: '⚷' },
            { name: 'Black Moon Lilith', key: 'lilith', description: 'Shadow dynamics in love', icon: '⚸' },
            { name: 'Descendant', key: 'descendant', description: 'What you attract', icon: '↓' }
        ],
        methodologies: [
            'Taming & Embracing Black Moon Lilith',
            'Accepting Chiron',
            'Delegates and house conditions'
        ],
        knowledgeQueries: [
            'Venus placement interpretation love',
            '7th house relationships partnership',
            'Chiron relationship wounds healing',
            'Black Moon Lilith shadow love'
        ]
    },
    career: {
        chartFactors: [
            { name: 'Midheaven (MC)', key: 'midheaven', description: 'Career path & public image', icon: 'MC' },
            { name: '10th House', key: 'house_10', description: 'Public role & reputation', icon: '🏛' },
            { name: 'Sun', key: 'sun', description: 'Core identity & vitality', icon: '☉' },
            { name: 'Saturn', key: 'saturn', description: 'Discipline & mastery', icon: '♄' },
            { name: '2nd House', key: 'house_2', description: 'Income & values', icon: '💰' },
            { name: '6th House', key: 'house_6', description: 'Daily work & service', icon: '⚒' },
            { name: 'North Node', key: 'northNode', description: 'Life direction', icon: '☊' }
        ],
        methodologies: [
            'True Placements + Base',
            'Delegates and house conditions'
        ],
        knowledgeQueries: [
            'Midheaven career path vocation',
            '10th house public role reputation',
            'Saturn work discipline mastery',
            'North Node life direction purpose'
        ]
    },
    personal_growth: {
        chartFactors: [
            { name: 'Chiron', key: 'chiron', description: 'Core wound & healing', icon: '⚷' },
            { name: 'Black Moon Lilith', key: 'lilith', description: 'Shadow integration', icon: '⚸' },
            { name: 'North Node', key: 'northNode', description: 'Evolutionary direction', icon: '☊' },
            { name: '12th House', key: 'house_12', description: 'Unconscious patterns', icon: '🌊' },
            { name: 'Pluto', key: 'pluto', description: 'Transformation power', icon: '♇' },
            { name: 'Saturn', key: 'saturn', description: 'Limitations to overcome', icon: '♄' },
            { name: 'Neptune', key: 'neptune', description: 'Spiritual connection', icon: '♆' }
        ],
        methodologies: [
            'Accepting Chiron',
            'Taming & Embracing Black Moon Lilith',
            'Reverse Vantage',
            'Natal Retrograde Optimization'
        ],
        knowledgeQueries: [
            'Chiron wound healing acceptance',
            'Black Moon Lilith shadow embrace',
            'Pluto transformation rebirth',
            'North Node growth evolution'
        ]
    },
    timing: {
        chartFactors: [
            { name: 'Current Transits', key: 'transits', description: 'Active planetary influences', icon: '🌐' },
            { name: 'Spark Points', key: 'spark', description: 'Activation moments', icon: '⚡' },
            { name: 'Jupiter Transit', key: 'jupiter_transit', description: 'Expansion & opportunity', icon: '♃' },
            { name: 'Saturn Transit', key: 'saturn_transit', description: 'Structure & lessons', icon: '♄' },
            { name: 'Pluto Transit', key: 'pluto_transit', description: 'Deep transformation', icon: '♇' },
            { name: 'Uranus Transit', key: 'uranus_transit', description: 'Sudden changes', icon: '♅' }
        ],
        methodologies: [
            'True Placements + Base + Intro to Spark',
            'Transit interpretation'
        ],
        knowledgeQueries: [
            'transit interpretation timing',
            'spark point activation current',
            'Saturn transit lessons structure'
        ]
    },
    general: {
        chartFactors: [
            { name: 'Sun', key: 'sun', description: 'Core identity', icon: '☉' },
            { name: 'Moon', key: 'moon', description: 'Emotional needs', icon: '☽' },
            { name: 'Ascendant', key: 'ascendant', description: 'Surface personality', icon: 'AC' },
            { name: 'Venus', key: 'venus', description: 'Love & values', icon: '♀' },
            { name: 'Mars', key: 'mars', description: 'Drive & action', icon: '♂' },
            { name: 'Saturn', key: 'saturn', description: 'Discipline & fears', icon: '♄' },
            { name: 'Chiron', key: 'chiron', description: 'Core wound', icon: '⚷' },
            { name: 'North Node', key: 'northNode', description: 'Life direction', icon: '☊' },
            { name: 'Current Transits', key: 'transits', description: 'What\'s happening now', icon: '🌐' }
        ],
        methodologies: [
            'True Placements + Base',
            'Accepting Chiron',
            'Delegates and house conditions',
            'Aspect Spectrum'
        ],
        knowledgeQueries: [
            'true placement base identity',
            'Chiron wound healing',
            'aspect spectrum interpretation'
        ]
    }
};


// ============================================
// ANALYSIS PLAN BUILDER
// ============================================

/**
 * Builds an analysis plan from user's discovery responses.
 * This is the autonomous "thinking" - determining WHAT to examine.
 */
export function buildAnalysisPlan(selectedCategories, followUpResponses = {}) {
    const plan = {
        categories: selectedCategories,
        chartFactors: [],
        methodologies: new Set(),
        knowledgeQueries: [],
        userContext: followUpResponses,
        estimatedSteps: 0,
        estimatedTime: 0
    };

    for (const category of selectedCategories) {
        const routing = ANALYSIS_ROUTING[category];
        if (!routing) continue;

        plan.chartFactors.push(...routing.chartFactors);
        routing.methodologies.forEach(m => plan.methodologies.add(m));
        plan.knowledgeQueries.push(...routing.knowledgeQueries);
    }

    // Deduplicate chart factors by key
    const seen = new Set();
    plan.chartFactors = plan.chartFactors.filter(f => {
        if (seen.has(f.key)) return false;
        seen.add(f.key);
        return true;
    });

    plan.methodologies = [...plan.methodologies];
    plan.estimatedSteps = plan.chartFactors.length + 2; // +2 for retrieval + synthesis
    plan.estimatedTime = Math.max(3, plan.estimatedSteps * 0.8);

    return plan;
}


/**
 * Infers an analysis plan from a free-text question (for the "specific question" path).
 */
export function inferPlanFromQuestion(question) {
    const q = question.toLowerCase();
    const categories = [];

    // Relationship keywords
    const relWords = ['relationship', 'love', 'partner', 'dating', 'marriage', 'boyfriend', 'girlfriend', 'spouse', 'attract', 'connection', 'romance', 'crush', 'ex'];
    if (relWords.some(w => q.includes(w))) categories.push('relationships');

    // Career keywords
    const careerWords = ['career', 'job', 'work', 'profession', 'calling', 'vocation', 'purpose', 'path', 'success', 'money', 'income', 'business'];
    if (careerWords.some(w => q.includes(w))) categories.push('career');

    // Growth keywords
    const growthWords = ['grow', 'heal', 'overcome', 'challenge', 'shadow', 'wound', 'pattern', 'struggle', 'block', 'fear', 'anxiety', 'trauma'];
    if (growthWords.some(w => q.includes(w))) categories.push('personal_growth');

    // Timing keywords
    const timingWords = ['when', 'timing', 'now', 'currently', 'happening', 'future', 'soon', 'period', 'this year', 'month'];
    if (timingWords.some(w => q.includes(w))) categories.push('timing');

    // Default to general if nothing detected
    if (categories.length === 0) categories.push('general');

    return buildAnalysisPlan(categories, { specificQuestion: question });
}


// ============================================
// FOCUSED READING GENERATOR
// ============================================

/**
 * Generates a focused reading based on the analysis plan.
 * Uses the existing chart data + interpretation engine but filters to relevant factors.
 */
export function generateFocusedReading(chartReading, analysisPlan) {
    const { chart, aspects, interpretations, guidance } = chartReading;
    const sections = [];

    // Build sections based on each chart factor in the plan
    for (const factor of analysisPlan.chartFactors) {
        const section = generateFactorSection(factor, chart, aspects, interpretations);
        if (section) sections.push(section);
    }

    // Add methodology-specific synthesis
    const synthesis = generateSynthesis(analysisPlan, chart, aspects, interpretations, guidance);

    return {
        title: getReadingTitle(analysisPlan),
        subtitle: getReadingSubtitle(analysisPlan),
        categories: analysisPlan.categories,
        sections,
        synthesis,
        methodologies: analysisPlan.methodologies,
        factorCount: analysisPlan.chartFactors.length,
        generatedAt: new Date().toISOString()
    };
}


function generateFactorSection(factor, chart, aspects, interpretations) {
    const planets = chart.planets || {};
    const houses = chart.houses || {};
    const angles = chart.angles || {};

    switch (factor.key) {
        case 'sun':
        case 'moon':
        case 'mercury':
        case 'venus':
        case 'mars':
        case 'jupiter':
        case 'saturn':
        case 'uranus':
        case 'neptune':
        case 'pluto':
        case 'chiron':
        case 'lilith':
        case 'northNode': {
            const planetKey = factor.key === 'northNode' ? 'north node' : factor.key;
            const planetData = planets[planetKey] || planets[factor.key];
            if (!planetData) return null;

            const interp = interpretations?.planets?.[planetKey] || interpretations?.planets?.[factor.key];
            const planetAspects = aspects.filter(a =>
                a.planetOne?.name === planetKey || a.planetTwo?.name === planetKey ||
                a.planetOne?.name === factor.key || a.planetTwo?.name === factor.key
            );

            return {
                title: `${factor.icon} ${factor.name}`,
                subtitle: factor.description,
                type: 'planet',
                data: {
                    sign: planetData.sign,
                    house: planetData.house,
                    degree: planetData.degree,
                    retrograde: planetData.motionState === 'retrograde',
                    interpretation: interp,
                    aspects: planetAspects.slice(0, 5).map(a => ({
                        type: a.type,
                        symbol: a.symbol,
                        otherPlanet: a.planetOne?.name === planetKey ? a.planetTwo?.name : a.planetOne?.name,
                        perception: a.perception,
                        reality: a.reality,
                        resolution: a.resolution
                    }))
                }
            };
        }

        case 'ascendant':
        case 'descendant':
        case 'midheaven': {
            const angleData = angles[factor.key];
            if (!angleData) return null;
            return {
                title: `${factor.icon} ${factor.name}`,
                subtitle: factor.description,
                type: 'angle',
                data: {
                    sign: angleData.sign,
                    degree: angleData.degree
                }
            };
        }

        case 'house_2':
        case 'house_5':
        case 'house_6':
        case 'house_7':
        case 'house_8':
        case 'house_10':
        case 'house_12': {
            const houseNum = parseInt(factor.key.split('_')[1]);
            const houseData = houses[houseNum];
            if (!houseData) return null;

            const planetsInHouse = Object.entries(planets)
                .filter(([, p]) => p.house === houseNum)
                .map(([name, data]) => ({ name, ...data }));

            return {
                title: `${factor.icon} ${factor.name}`,
                subtitle: factor.description,
                type: 'house',
                data: {
                    number: houseNum,
                    sign: houseData.sign,
                    planets: planetsInHouse
                }
            };
        }

        case 'transits':
        case 'spark':
        case 'jupiter_transit':
        case 'saturn_transit':
        case 'pluto_transit':
        case 'uranus_transit':
            return {
                title: `${factor.icon} ${factor.name}`,
                subtitle: factor.description,
                type: 'transit',
                data: { note: 'Transit data available in yearly forecast section.' }
            };

        default:
            return null;
    }
}


function generateSynthesis(plan, chart, aspects, interpretations, guidance) {
    const lines = [];

    if (plan.categories.includes('relationships')) {
        const venus = chart.planets?.venus;
        const mars = chart.planets?.mars;
        if (venus && mars) {
            lines.push(`Your love style is shaped by Venus in ${capitalize(venus.sign)} (House ${venus.house}) — this defines how you attract and what you value in partnership.`);
            lines.push(`Mars in ${capitalize(mars.sign)} (House ${mars.house}) fuels your pursuit energy and shows how you go after what you desire.`);
        }
    }

    if (plan.categories.includes('career')) {
        const sun = chart.planets?.sun;
        const saturn = chart.planets?.saturn;
        if (sun) {
            lines.push(`Your career identity is anchored by the Sun in ${capitalize(sun.sign)} (House ${sun.house}) — this is your core vitality and what you're here to express.`);
        }
        if (saturn) {
            lines.push(`Saturn in ${capitalize(saturn.sign)} (House ${saturn.house}) shows where you must build mastery through discipline and patience.`);
        }
    }

    if (plan.categories.includes('personal_growth')) {
        const chiron = chart.planets?.chiron;
        const pluto = chart.planets?.pluto;
        if (chiron) {
            lines.push(`Chiron in ${capitalize(chiron.sign)} (House ${chiron.house}) reveals your deepest wound — and simultaneously your greatest gift for healing others.`);
        }
        if (pluto) {
            lines.push(`Pluto in ${capitalize(pluto.sign)} (House ${pluto.house}) is your engine of transformation. Embrace the cycles of death and rebirth here.`);
        }
    }

    // Add guidance action items
    if (guidance?.actions?.length > 0) {
        lines.push('');
        lines.push('**Key Actions:**');
        for (const action of guidance.actions.slice(0, 3)) {
            lines.push(`• ${action.focus}: ${action.action}`);
        }
    }

    return lines.join('\n');
}


function getReadingTitle(plan) {
    if (plan.categories.length === 1) {
        const titles = {
            relationships: 'Love & Relationships Reading',
            career: 'Career & Life Purpose Reading',
            personal_growth: 'Personal Growth & Healing Reading',
            timing: 'Current Transits & Timing Reading',
            general: 'Complete Profile Reading'
        };
        return titles[plan.categories[0]] || 'Your Astrological Reading';
    }
    return 'Focused Astrological Reading';
}

function getReadingSubtitle(plan) {
    const factorCount = plan.chartFactors.length;
    const methodCount = plan.methodologies.length;
    return `Examining ${factorCount} chart factors using ${methodCount} interpretive methods`;
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// ============================================
// SESSION CONTEXT (Client-Side)
// ============================================

export class SessionContext {
    constructor() {
        this.sessionId = this.generateId();
        this.clientInfo = {};
        this.chartReading = null;
        this.queries = [];
        this.discoveryResponses = {};
        this.createdAt = new Date();
        this.lastAccessed = new Date();
    }

    generateId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setClientInfo(info) {
        this.clientInfo = info;
        this.lastAccessed = new Date();
    }

    setChartReading(reading) {
        this.chartReading = reading;
        this.lastAccessed = new Date();
    }

    addQuery(question, response) {
        this.queries.push({
            question,
            response,
            timestamp: new Date()
        });
        this.lastAccessed = new Date();
    }

    setDiscoveryResponses(responses) {
        this.discoveryResponses = responses;
        this.lastAccessed = new Date();
    }

    save() {
        try {
            const data = {
                sessionId: this.sessionId,
                clientInfo: this.clientInfo,
                queries: this.queries,
                discoveryResponses: this.discoveryResponses,
                createdAt: this.createdAt.toISOString(),
                lastAccessed: this.lastAccessed.toISOString()
            };
            localStorage.setItem(`astro_session_${this.sessionId}`, JSON.stringify(data));
            localStorage.setItem('astro_last_session', this.sessionId);
        } catch (e) {
            console.warn('Could not save session:', e);
        }
    }

    static loadLast() {
        try {
            const lastId = localStorage.getItem('astro_last_session');
            if (!lastId) return null;
            const data = localStorage.getItem(`astro_session_${lastId}`);
            if (!data) return null;
            const parsed = JSON.parse(data);
            const session = new SessionContext();
            Object.assign(session, parsed);
            session.createdAt = new Date(parsed.createdAt);
            session.lastAccessed = new Date(parsed.lastAccessed);
            return session;
        } catch (e) {
            return null;
        }
    }
}
