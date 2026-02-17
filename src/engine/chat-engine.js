/**
 * COSMIC GUIDE CHAT ENGINE
 * 
 * A local "expert system" that parses user queries and routes them 
 * to specific astrological data modules (Lenses, Aspects, Placements).
 * 
 * DESIGN PHILOSOPHY:
 * - No external API (Privacy/Speed/Cost)
 * - Deterministic: "Love" ALWAYS triggers 7th House analysis
 * - Persona: "Cosmic Best Friend" - helpful, specific, actionable
 */

import { LOVE_LENS, CAREER_LENS, CHILDREN_LENS } from '../data/class4-lenses-system.js';
import { calculateManifestationProfile } from './manifestation.js';
import { calculateMoneyProfile } from './money.js';
import { searchKnowledge } from '../data/transcript-knowledge.js';
import { SIGN_RULERS, SIGN_ELEMENTS, HOUSE_THEMES, PLANET_SYMBOLS } from '../core/constants.js';

export class ChatEngine {
    constructor(chartReading) {
        this.chartReading = chartReading;
        this.context = {
            lastTopic: null,
            userName: 'friend'
        };
    }

    /**
     * Process a user specific query and return a response
     */
    processQuery(query) {
        const q = query.toLowerCase();

        // 1. GREETINGS
        if (q.match(/^(hi|hello|hey|yo)/)) {
            return {
                type: 'text',
                message: "Hey! point me to a topic. I can look at your *Love Life*, *Career*, or *Creativity*? 🌟"
            };
        }

        // 2. LOVE & RELATIONSHIPS
        if (q.match(/(love|relationship|partner|dating|marriage|crush|soulmate)/)) {
            return this.analyzeLove();
        }

        // 3. CAREER & PURPOSE (Removed 'money')
        if (q.match(/(career|job|work|business|purpose|legacy|boss)/)) {
            return this.analyzeCareer();
        }

        // 4. CREATIVITY & CHILDREN
        if (q.match(/(child|kid|creative|creativity|art|project|baby)/)) {
            return this.analyzeCreativity();
        }

        // 5. SELF / IDENTITY
        if (q.match(/(who am i|identity|self|personality|strength|weakness)/)) {
            return this.analyzeIdentity();
        }

        // 6. MANIFESTATION & POWER (Class #5)
        if (q.match(/(manifest|power|dream|goal|success|stuck|block)/)) {
            return this.analyzeManifestation();
        }

        // 6.5 MONEY TIMING (Hybrid Intent)
        if ((q.includes('money') || q.includes('wealth')) && (q.includes('when') || q.includes('time') || q.includes('timing'))) {
            return this.analyzeMoneyTiming();
        }

        // 7. MONEY & WEALTH (Class #6)
        if (q.match(/(money|wealth|finance|rich|bank|invest|debt|salary)/)) {
            return this.analyzeMoney();
        }

        // 8. DEEP KNOWLEDGE SEARCH (Transcripts)
        // Checks for specific concepts like "Reverse Vantage", "Retrogrades", "PHSR"
        const knowledgeHits = searchKnowledge(q);
        if (knowledgeHits.length > 0) {
            return this.formatKnowledgeResponse(knowledgeHits[0]);
        }

        // DEFAULT FALLBACK
        return {
            type: 'text',
            message: "I'm tuning into your chart... Try asking specifically about **Money**, **Love**, or **Career**, or ask me deep questions like *'What is Reverse Vantage?'* or *'How does manifestation work?'* 🔮"
        };
    }

    /**
     * Generate Love Analysis (7th House Lens)
     */
    analyzeLove() {
        const house7 = this.chartReading.chart.houses[7];
        const ruler = SIGN_RULERS[house7.sign];
        const rulerPlanet = this.chartReading.chart.planets[ruler];

        let msg = `Ooh, let's look at your love life! ❤️\n\n`;
        msg += `Your **7th House of Partnership** is in **${this.capitalize(house7.sign)}**.\n`;
        msg += `This means you approach relationships with a **${house7.sign}** vibe—you settle down with people who are ${LOVE_LENS.truthAboutLove} (just kidding, but seriously, you need **${this.getElement(house7.sign)}** energy).\n\n`;

        msg += `**Your Match:** You are attracted to **${this.capitalize(ruler)}** energy because that's your 7th house ruler. `;
        msg += `I see your ${this.capitalize(ruler)} is in the **${rulerPlanet.house}th House**. `;
        msg += `This means for you, love is deeply connected to your **${HOUSE_THEMES[rulerPlanet.house].name}**.\n\n`;

        msg += `*Advice:* Look for partners who help you with ${HOUSE_THEMES[rulerPlanet.house].keywords[0]}.`;

        return { type: 'analysis', message: msg, topic: 'love' };
    }

    /**
     * Generate Career Analysis (10th House Lens)
     */
    analyzeCareer() {
        const house10 = this.chartReading.chart.houses[10];
        const ruler = SIGN_RULERS[house10.sign];
        const rulerPlanet = this.chartReading.chart.planets[ruler];

        let msg = `Time to talk boss moves! 💼\n\n`;
        msg += `Your **MC (Midheaven)** draws on **${this.capitalize(house10.sign)}** energy. `;
        msg += `The world wants you to be **${house10.sign}**-like: think ${CAREER_LENS.manifestation || 'leadership and structure'}.\n\n`;

        msg += `**Your Career Path:** Your career ruler, **${this.capitalize(ruler)}**, is over in the **${rulerPlanet.house}th House**. `;
        msg += `This is huge! It means your public success comes from focusing on **${HOUSE_THEMES[rulerPlanet.house].name}**.\n\n`;

        const mcInterp = this.chartReading.interpretations.angles.midheaven;
        if (mcInterp && mcInterp.guidance) {
            msg += `**Strategy:** ${mcInterp.guidance.replace('To succeed in your public life, you should', 'You should')}`;
        }

        return { type: 'analysis', message: msg, topic: 'career' };
    }

    /**
     * Generate Creativity/Children Analysis (5th House Lens)
     */
    analyzeCreativity() {
        const house5 = this.chartReading.chart.houses[5];
        const ruler = SIGN_RULERS[house5.sign];

        let msg = `Let's look at your creative spark (and kids)! 👶🎨\n\n`;
        msg += `Your **5th House** is ruled by **${this.capitalize(house5.sign)}**. `;
        msg += `This is the house of *Fun, Romance, and Creation*.\n\n`;

        msg += `You create best when you embody **${this.capitalize(house5.sign)}** energy. `;
        msg += `If you have children (or creative projects), they will likely take on the characteristics of this sign.`;

        return { type: 'analysis', message: msg, topic: 'creativity' };
    }

    /**
     * Generate Identity Analysis (Sun/ASC)
     */
    analyzeIdentity() {
        const sun = this.chartReading.chart.planets.sun;
        const asc = this.chartReading.chart.angles.ascendant;

        let msg = `The big question! "Who am I?" 🤔\n\n`;
        msg += `You are a **${this.capitalize(sun.sign)} Sun** (that's your core engine) with a **${this.capitalize(asc.sign)} Rising** (that's how you drive the car).\n\n`;
        msg += `People *see* your ${this.capitalize(asc.sign)} side first—${this.chartReading.interpretations.angles.ascendant.guidance.split('.')[1]}.\n\n`;
        msg += `But deep down, you find happiness through **${this.capitalize(sun.sign)}** pursuits.`;

        return { type: 'analysis', message: msg, topic: 'identity' };
    }

    /**
     * Generate Manifestation Analysis (Class #5)
     */
    analyzeManifestation() {
        const profile = calculateManifestationProfile(this.chartReading.chart, this.chartReading.aspects);
        const { core, transmutation, divineTiming } = profile;

        let msg = `✨ **Time to Manifest!** Let's align your energy.\n\n`;

        // 0. Divine Timing (Progressions)
        msg += `⏳ **Divine Timing:** You are currently in your **${divineTiming.progressedSign} Season** (Age ${divineTiming.age}).\n`;
        msg += `*${divineTiming.guidance}*\n\n`;

        // 1. The Why (Sun)
        msg += `**Your Goal:** You are designed to chase **${core.why.desire}**. ${core.why.guidance}\n\n`;

        // 2. The Power (Pluto)
        msg += `**Your Power:** Use your **${core.power.powerType}** in the **${HOUSE_THEMES[core.power.house].name}** sector to drive this. ${core.power.guidance}\n\n`;

        // 3. The Blocker (Chiron)
        if (core.blocker) {
            msg += `**The Block:** Watch out for **${core.blocker.wound}** in the ${HOUSE_THEMES[core.blocker.house].name} area. Don't let fear stop you.\n\n`;
        }

        // 4. Transmutation
        if (transmutation.length > 0) {
            msg += `**⚡ Kinetic Energy:** Use this tension to move forward:\n`;
            msg += `*${transmutation[0].guidance}*`;
        } else {
            msg += `**⚡ Flow State:** You have a lot of harmonious energy. You need to create your own discipline because the universe won't push you hard enough!`;
        }

        return { type: 'analysis', message: msg, topic: 'manifestation' };
    }

    /**
     * Generate Money Analysis (Class #6)
     */
    analyzeMoney() {
        const profile = calculateMoneyProfile(this.chartReading.chart, this.chartReading.aspects);

        let msg = `💰 **Let's Talk Money!** (The "Start Making Money" Protocol)\n\n`;

        msg += `**Your Relationship:** With 2nd House in **${profile.secondHouse.sign}**, ${profile.secondHouse.description}\n`;
        msg += `*Watch out for:* ${profile.secondHouse.challenge}\n\n`;

        msg += `**How You Attract Value:** Venus in **${profile.venus.sign}** says magnetism comes from: *${profile.venus.strategy}*\n\n`;

        msg += `**💸 Your Money Generators:**\n`;
        profile.generators.slice(0, 3).forEach(gen => {
            msg += `- ${gen}\n`;
        });

        return { type: 'analysis', message: msg, topic: 'money' };
    }

    /**
     * Generate Money Timing Analysis (Hybrid Class #5 & #6)
     */
    analyzeMoneyTiming() {
        const moneyProfile = calculateMoneyProfile(this.chartReading.chart, this.chartReading.aspects);
        const manifestProfile = calculateManifestationProfile(this.chartReading.chart, this.chartReading.aspects);
        const timing = manifestProfile.divineTiming;

        let msg = `⏰ **The "When" of Money:**\n\n`;
        msg += `Astrology says you are always capable of wealth, but the *flavor* changes based on your **Life Season** (Progressions).\n\n`;

        msg += `**Current Season:** You are in a **${timing.progressedSign}** Season (Age ${timing.age}).\n`;
        msg += `*${timing.guidance}*\n\n`;

        msg += `**Strategy Mix:**\n`;
        msg += `You need to apply your standard **${moneyProfile.secondHouse.sign}** money strategy ("${moneyProfile.secondHouse.description.split('.')[0]}") using **${timing.progressedSign}** energy.\n\n`;

        msg += `*Example:* If you are in an Aries Season, take bold action on your ${moneyProfile.secondHouse.sign} ideas *now*.`;

        return { type: 'analysis', message: msg, topic: 'money-timing' };
    }
    capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
    getElement(sign) { return SIGN_ELEMENTS[sign] || 'specific'; }

    formatKnowledgeResponse(item) {
        return {
            type: 'knowledge',
            topic: item.category,
            message: `📚 **From the Archives (${item.category}):**\n\n${item.content}\n\n*This is based on the ${item.id.replace(/-/g, ' ')} teachings.*`
        };
    }
}
