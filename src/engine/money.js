/**
 * MSTIC MAKING MONEY ENGINE (Class #6)
 * ------------------------------------
 * Calculates the "Financial Strategy Profile" based on:
 * 1. 2nd House (The Relationship with Money)
 * 2. 2nd House Ruler (The Manager) - Sign AND House placement
 * 3. Venus (The Magnet)
 * 4. Money Generators (Specific strategies based on Rising Sign/2nd House)
 */

export const calculateMoneyProfile = (chart, aspects) => {
    // 1. Identify Key Components
    const secondHouse = chart.houses[1]; // 0-indexed, so 1 is 2nd house
    const secondHouseRuler = getRuler(secondHouse.sign);
    const venus = chart.planets.find(p => p.name === 'Venus');
    const rulerPlanet = chart.planets.find(p => p.name === secondHouseRuler);
    const risingSign = chart.houses[0].sign;

    // 2. Get Relationship Profile (The "Container")
    const relationship = getMoneyRelationship(secondHouse.sign, secondHouseRuler);

    // 3. Get Venus Profile (The "Magnet")
    const magnet = getVenusMagnet(venus.sign);

    // 4. Get Money Generators (The "Strategy")
    const generators = getMoneyGenerators(risingSign, secondHouse.sign);

    // 5. Get Ruler House Profile (The "Location")
    // Note: chart.planets has 'house' property which is 1-indexed number
    const rulerHouseId = rulerPlanet ? rulerPlanet.house : 1;
    const rulerHouseProfile = getRulerHouseInterpretation(rulerHouseId);

    // 5b. Get Ruler State (Retrograde vs Direct) - Class #6 Nuance (Warren Buffet example)
    const isRetrograde = rulerPlanet ? rulerPlanet.isRetrograde : false;
    const managerStyle = isRetrograde
        ? "The Maverick (Retrograde). You cannot follow standard advice. You must find your own unique way to wealth, often becoming a 'late bloomer'."
        : "The Direct Path. You can follow established roadmaps and traditional methods effectively.";

    // 6. Get Libra House Profile (The "Secondary Factor" from Class #6)
    // "Anytime you look at Venus/Taurus for money, you always look at Libra."
    const libraHouse = chart.houses.find(h => h.sign === 'Libra');
    // Libra House is 1-indexed in the 'house' property of the finding, or index+1
    // The chart.houses array is usually 0=1st, 1=2nd. So we find the index plus 1.
    const libraHouseNum = chart.houses.indexOf(libraHouse) + 1;
    const libraStrategy = getLibraHouseInterpretation(libraHouseNum);


    return {
        secondHouse: {
            sign: secondHouse.sign,
            ruler: secondHouseRuler,
            description: relationship.description,
            challenge: relationship.challenge
        },
        ruler: {
            name: secondHouseRuler,
            sign: rulerPlanet ? rulerPlanet.sign : 'Unknown',
            house: rulerHouseId,
            role: relationship.rulerRole,
            style: managerStyle,
            houseDescription: rulerHouseProfile
        },
        libra: {
            house: libraHouseNum,
            strategy: libraStrategy
        },
        venus: {
            sign: venus.sign,
            strategy: magnet
        },
        generators: generators
    };
};

// Helper: Get Libra House Interpretation (The "Hidden Partner" from Class #6)
const getLibraHouseInterpretation = (houseNum) => {
    const interpretations = {
        1: "Your personal brand and appearance are hidden money multipliers. People buy YOU.",
        2: "Your ability to save and manage assets directly impacts your income flow.",
        3: "Communication, contracts, and local networks are where you find financial balance.",
        4: "Your home, family, or real estate holdings provides the stability needed to build wealth.",
        5: "Creative risks and speculative investments (or children) are tied to your financial karma.",
        6: "Daily work habits and service to others are the backbone of your financial balance.",
        7: "Partnerships are ESSENTIAL. You likely make more money with a partner than alone.",
        8: "Joint resources, investments, and other people's money are key. Don't go it alone financially.",
        9: "Teaching, publishing, or international reach brings the necessary expansion for wealth.",
        10: "Your public professional reputation is your greatest asset. Protect it.",
        11: "Your social network and community are your safety net. Friends = Funds.",
        12: "Spiritual work or hidden sources of income provide the balance you need."
    };
    return interpretations[houseNum] || "Balance is key.";
};

// Helper: Get Ruler of a Sign
const getRuler = (sign) => {
    const rulers = {
        'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
        'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Pluto',
        'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Uranus', 'Pisces': 'Neptune'
    };
    return rulers[sign] || 'Venus'; // Fallback
};

// Helper: Get Ruler House Interpretation (The "Where" from Class #6)
const getRulerHouseInterpretation = (houseNum) => {
    const interpretations = {
        1: "Income depends on YOU. Your physical body, image, or personal action is the product. You must be pioneering and hands-on.",
        2: "Income stacks on income. You make money through finance, assets, accumulating possessions, and banking. Money makes money.",
        3: "Income from communication. Sales, writing, teaching, logistics, or using your hands/dexterity. Local travel is involved.",
        4: "Income from the foundation. Real estate, working from home, family business, or creating safe emotional spaces/nests.",
        5: "Income from creativity/risk. Entertainment, gambling/speculation (careful!), performance, or things involving children/fun.",
        6: "Income from service. Healthcare, daily admin, employment (working for others), organization, and solving practical problems.",
        7: "Income from others. Law, consulting, contracts, marriage/business partners, and 1-on-1 client work. You need a 'other' to bank.",
        8: "Income from hidden sources. Investments, insurance, debt/credit, psychology, or transformation. Using other people's resources.",
        9: "Income from expansion. Teaching, publishing, international travel, higher education, or religious/philosophical institutions.",
        10: "Income from status. Corporate career, government, climbing the ladder, public reputation, and being an authority figure.",
        11: "Income from networks. Technology, social media, groups, memberships, humanitarian efforts, and 'future' industries.",
        12: "Income from the unseen. Spiritual work, backstage roles (film/production), hospitals/institutions, or subconscious healing."
    };
    return interpretations[houseNum] || "Income comes from general life activities.";
};

// Helper: Get Money Relationship (Class #6 Concepts)
const getMoneyRelationship = (sign, ruler) => {
    const relationships = {
        'Aries': { // Pisces Rising
            description: "Money is Action. You impulse-buy based on instant desire. You view money as a tool to 'get things done' immediately. You are a pioneer.",
            challenge: "Impulsiveness. Stop and think before spending on the first shiny thing.",
            rulerRole: "The Warrior"
        },
        'Taurus': { // Aries Rising
            description: "Money is Security. You need to see it to believe it. You love luxury, comfort, and tangible assets. You likely own 'two of everything'.",
            challenge: "Stagnation. Don't be afraid to spend money to make money.",
            rulerRole: "The Builder"
        },
        'Gemini': { // Taurus Rising
            description: "Money is Logic... usually. You rationalize every purchase but likely don't know your exact balance. You tend to have multiple streams of income.",
            challenge: "Scattered energy. You often have 'two of everything' or multiples of items.",
            rulerRole: "The Merchant"
        },
        'Cancer': { // Gemini Rising
            description: "Money is Emotion. You spend based on your mood ('I felt like buying this'). You are secretive about your finances—it's private!",
            challenge: "Emotional spending. Don't buy things just to soothe your feelings.",
            rulerRole: "The Protector"
        },
        'Leo': { // Cancer Rising
            description: "Money is Identity. You like fancy, flashy things that make a statement. The Rule: The happier you are, the more money you make.",
            challenge: "Risk. You love the thrill of the gamble, but don't sit at the table too long.",
            rulerRole: "The Monarch"
        },
        'Virgo': { // Leo Rising
            description: "Money is Stress (initially). You feel you MUST work hard for every dollar. You value details and strategy over luck.",
            challenge: "Poverty consciousness. Stop worrying there won't be enough.",
            rulerRole: "The Accountant"
        },
        'Libra': { // Virgo Rising
            description: "Money is Partnership. You may unknowingly spend double by constantly paying for others. You seek a 'Level' lifestyle, not necessarily excess.",
            challenge: "Dependency. Ensure you have your own financial identity.",
            rulerRole: "The Diplomat"
        },
        'Scorpio': { // Libra Rising
            description: "Money is Depth. You find wealth by diving deeper into a niche than anyone else. You become a 'Household Name' through specialization.",
            challenge: "Obsession. Don't let money define your entire sense of power.",
            rulerRole: "The Alchemist"
        },
        'Sagittarius': { // Scorpio Rising
            description: "Money is Philosophy. You experience 'High Highs' and 'Low Lows'. You may view money as a game or construct, separating from the material world.",
            challenge: "Gambling. Jupiter expands bad streaks just as much as good ones.",
            rulerRole: "The Explorer"
        },
        'Capricorn': { // Sagittarius Rising
            description: "Money is Mastery. You play the long game. You are likely a 'late bloomer' financially, often feeling you only need 'the basics' until you mature.",
            challenge: "Workaholism. Money is the means, not the end.",
            rulerRole: "The Executive"
        },
        'Aquarius': { // Capricorn Rising
            description: "Money is Freedom (Rebellious). Income can be erratic ('feast or famine'). You might overspend on friends (buying rounds) or chase 'The Next Big Thing'.",
            challenge: "Detachment. You still need to pay bills in the 3D world.",
            rulerRole: "The Innovator"
        },
        'Pisces': { // Aquarius Rising
            description: "Money is Spiritual. You may view money as an 'illusion' or unnecessary. Danger: Money slips through your fingers like water.",
            challenge: "Delusion. Check your bank account regularly, not just your feelings.",
            rulerRole: "The Mystic"
        }
    };
    return relationships[sign] || relationships['Taurus'];
};

// Helper: Get Venus Magnet (How they attract)
const getVenusMagnet = (sign) => {
    const magnets = {
        'Aries': "The Chase. Be bold, direct, and first. Launch new things.",
        'Taurus': "The Lure. Be sensual, stable, and high-quality. Let them come to you.",
        'Gemini': "The Word. Use wit, intelligence, and storytelling. Sell ideas.",
        'Cancer': "The Care. Be nurturing, protective, and make people feel at home.",
        'Leo': "The Star. Be loud, colorful, and confident. Sell your personal brand.",
        'Virgo': "The Fix. Be helpful, precise, and perfect. Solve their problems.",
        'Libra': "The Charm. Be beautiful, fair, and graceful. Partner up.",
        'Scorpio': "The Mystery. Be intense, private, and transformative. Sell the secret.",
        'Sagittarius': "The Truth. Be honest, adventurous, and wise. Sell the journey.",
        'Capricorn': "The Boss. Be authoritative, reliable, and premium. Sell the result.",
        'Aquarius': "The Rebel. Be different, weird, and futuristic. Sell the revolution.",
        'Pisces': "The Dream. Be magical, empathetic, and artistic. Sell the fantasy."
    };
    return magnets[sign] || "Attraction";
};

// Helper: Get Money Generators (Specific Strategies from Class #6)
const getMoneyGenerators = (risingSign, secondHouseSign) => {
    // Aries Rising (2nd House Taurus)
    if (risingSign === 'Aries') {
        return [
            "Banking & Finance: Direct involvement with money systems.",
            "Food & Culinary: High-quality, tangible consumables.",
            "Art & Collecting: Creating or trading valuable objects.",
            "Luxury Goods: Selling comfort and status items."
        ];
    }

    // Taurus Rising (2nd House Gemini)
    if (risingSign === 'Taurus') {
        return [
            "Communication: Writing, speaking, teaching.",
            "Logistics & Data: Organizing numbers and information (Accounting).",
            "Multiple Streams: Having 2-3 side hustles is essential.",
            "Hand-Crafted Goods: Using your hands to make valuable things."
        ];
    }

    // Gemini Rising (2nd House Cancer)
    if (risingSign === 'Gemini') {
        return [
            "Real Estate & Home: Buying/selling homes or domestic goods.",
            "Nurturing Professions: Nursing, caretaking, cooking.",
            "Family Business: Working with or for family legacies.",
            "Intuitive Work: Using 'gut feeling' to make financial moves."
        ];
    }

    // Cancer Rising (2nd House Leo)
    if (risingSign === 'Cancer') {
        return [
            "Entertainment: Performing, acting, being 'on stage'.",
            "Creativity: Any artistic pursuit where YOU are the star.",
            "Leadership: Being the boss or face of a company.",
            "Risk/Speculation: High-reward gambling or stock picks (use with caution)."
        ];
    }

    // Leo Rising (2nd House Virgo)
    if (risingSign === 'Leo') {
        return [
            "Service: Helping others solve practical problems.",
            "Health & Wellness: Medical, fitness, or nutrition services.",
            "Automation: Creating systems that work for you.",
            "Details: Editing, auditing, or perfecting others' work."
        ];
    }

    // Virgo Rising (2nd House Libra)
    if (risingSign === 'Virgo') {
        return [
            "Partnerships: Making money with or through a spouse/business partner.",
            "Beauty & Design: Fashion, decor, or aesthetic consulting.",
            "Law & Mediation: Balancing scales, contracts, or acting as a Mediator.",
            "Client Services: High-end 1-on-1 consulting."
        ];
    }

    // Libra Rising (2nd House Scorpio)
    if (risingSign === 'Libra') {
        return [
            "Other People's Money: Insurance, loans, debt management.",
            "Wealth Management: Managing portfolios for others.",
            "Transformation: Therapy, renovation, or fixing 'broken' things.",
            "Entrepreneurship: Starting your own unique business (often from home)."
        ];
    }

    // Scorpio Rising (2nd House Sagittarius)
    if (risingSign === 'Scorpio') {
        return [
            "Teaching & Coaching: Sharing your deep wisdom or philosophy.",
            "International Business: Import/Export or working with foreign cultures.",
            "Publishing: Getting your theories out into the world.",
            "Niche/Taboo Markets: Monetizing unique or 'weird' interests."
        ];
    }

    // Sagittarius Rising (2nd House Capricorn)
    if (risingSign === 'Sagittarius') {
        return [
            "Climbing the Ladder: Corporate hierarchy and promotion.",
            "Management: V.P. or C-Suite roles in established firms.",
            "Government/Structure: Working within large, solid systems.",
            "Stock Market/Systems: Playing the long game with investments."
        ];
    }

    // Capricorn Rising (2nd House Aquarius)
    if (risingSign === 'Capricorn') {
        return [
            "Technology: Coding, software, or future-tech.",
            "Innovation: Inventing new systems or 'hacks'.",
            "Groups/Networks: Monetizing communities or memberships.",
            "Behind the Scenes: Tech/Crypto where you don't show your face."
        ];
    }

    // Aquarius Rising (2nd House Pisces)
    if (risingSign === 'Aquarius') {
        return [
            "Spiritual Work: Astrology, tarot, healing.",
            "Film & Video Games: Visual storytelling and immersive worlds.",
            "Behind the Scenes: Production, ghostwriting, or anonymous work.",
            "Creative Flow: Making money through pure artistic inspiration."
        ];
    }

    // Pisces Rising (2nd House Aries)
    if (risingSign === 'Pisces') {
        return [
            "Solo Acts: Being a solopreneur or freelancer.",
            "The Product: Promoting YOURSELF as the brand.",
            "Pioneering: Starting something completely new.",
            "Active Income: Making money through physical action/hustle."
        ];
    }

    return ["General Wealth Building: Focus on saving and investing."];
};
