// Mock AI Service for HealyMate
// Simulates realistic AI responses for sentiment analysis, insights, and recommendations

// Sentiment analysis keywords
const NEGATIVE_KEYWORDS = [
  'sad', 'depressed', 'anxious', 'stressed', 'worried', 'afraid', 'scared', 'angry', 'frustrated',
  'disappointed', 'overwhelmed', 'exhausted', 'tired', 'lonely', 'isolated', 'hurt', 'broken',
  'failed', 'mistake', 'problem', 'difficult', 'struggle', 'pain', 'suffering'
];

const POSITIVE_KEYWORDS = [
  'happy', 'joyful', 'excited', 'grateful', 'proud', 'accomplished', 'peaceful', 'calm',
  'loved', 'supported', 'motivated', 'inspired', 'confident', 'hopeful', 'energetic',
  'successful', 'achieved', 'amazing', 'wonderful', 'beautiful', 'grateful', 'blessed'
];

const NEUTRAL_KEYWORDS = [
  'thinking', 'wondering', 'considering', 'exploring', 'learning', 'growing', 'reflecting',
  'understanding', 'discovering', 'processing', 'working', 'planning', 'preparing'
];

interface AIInsight {
  sentiment: string;
  score: number; // -1 to 1
  keyThemes: string[];
  suggestion: string;
}

interface AIResponse {
  type: 'analysis' | 'insight' | 'recommendation';
  content: string;
}

export async function analyzeSentiment(text: string): Promise<AIInsight> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      let negativeCount = 0;
      let positiveCount = 0;
      let neutralCount = 0;

      // Count keyword occurrences
      NEGATIVE_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) negativeCount++;
      });

      POSITIVE_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) positiveCount++;
      });

      NEUTRAL_KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) neutralCount++;
      });

      // Calculate sentiment score
      let score = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1);
      let sentiment: string;

      if (score > 0.3) {
        sentiment = 'Positive';
      } else if (score < -0.3) {
        sentiment = 'Negative';
      } else {
        sentiment = 'Neutral';
      }

      // Extract key themes
      const keyThemes: string[] = [];
      if (negativeCount > 0) keyThemes.push('Challenging emotions');
      if (positiveCount > 0) keyThemes.push('Positive growth');
      if (lowerText.includes('work') || lowerText.includes('job')) keyThemes.push('Career focus');
      if (lowerText.includes('relationship') || lowerText.includes('friend')) keyThemes.push('Relationships');
      if (lowerText.includes('health') || lowerText.includes('exercise')) keyThemes.push('Health & wellness');
      if (lowerText.includes('family')) keyThemes.push('Family matters');

      // Generate suggestion
      let suggestion = '';
      if (sentiment === 'Negative') {
        suggestion = 'Consider a grounding exercise or meditation to help process these emotions.';
      } else if (sentiment === 'Positive') {
        suggestion = 'Great energy! Consider sharing this positivity or journaling about what made today special.';
      } else {
        suggestion = 'You seem to be reflecting thoughtfully. Continue exploring these thoughts in your next journal entry.';
      }

      resolve({
        sentiment,
        score,
        keyThemes: keyThemes.length > 0 ? keyThemes : ['Self-reflection'],
        suggestion,
      });
    }, 800); // Simulate network delay
  });
}

export async function generateJournalInsight(entries: string[]): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const insights = [
        'Based on your recent entries, you\'re showing remarkable self-awareness. The patterns you\'re noticing suggest continued growth.',
        'Your journaling reveals a strong connection between your daily activities and emotional well-being. Keep leveraging this insight.',
        'There\'s a clear thread of resilience running through your reflections. You\'re navigating challenges with grace.',
        'Your entries show significant progress in emotional regulation. The coping strategies you\'ve developed are working well.',
        'Pattern recognition suggests your mood improves after physical activity. Consider incorporating more movement into your routine.',
        'Your reflections demonstrate deep introspection. Use these insights to set meaningful goals for yourself.',
      ];

      const randomInsight = insights[Math.floor(Math.random() * insights.length)];
      resolve(randomInsight);
    }, 1000);
  });
}

export async function generateMeditationRecommendation(moodLevel: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const recommendations: { [key: number]: string } = {
        1: 'A calming body scan meditation would help you relax and release tension. Start with a 10-minute session.',
        2: 'Try a grounding exercise to help stabilize your emotions. Box breathing is particularly effective right now.',
        3: 'A mindfulness meditation focusing on the present moment would be beneficial.',
        4: 'A gentle visualization meditation could enhance your already positive mood.',
        5: 'An energizing meditation with positive affirmations could amplify your great mood and set intentions for the day.',
      };

      resolve(recommendations[moodLevel] || recommendations[3]);
    }, 900);
  });
}

export async function generateGoalSuggestion(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const suggestions = [
        'Consider setting a goal around consistency - establish a daily journaling or meditation habit.',
        'A meaningful goal might be to deepen a specific relationship through quality time or communication.',
        'Physical wellness goals often have powerful positive effects on mental health.',
        'Creative goals can provide fulfillment and a healthy outlet for self-expression.',
        'Learning something new can boost confidence and open new perspectives.',
        'Volunteering or helping others creates meaningful purpose and connection.',
      ];

      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      resolve(randomSuggestion);
    }, 850);
  });
}

export async function generateCommunityModeration(content: string): Promise<{ 
  isAppropriate: boolean; 
  reason?: string;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const blockedPatterns = [
        /hate|violence|threat/i,
        /spam|promotional/i,
        /self.harm|suicide/i,
      ];

      const isBlocked = blockedPatterns.some(pattern => pattern.test(content));

      resolve({
        isAppropriate: !isBlocked,
        reason: isBlocked ? 'This content violates community guidelines' : undefined,
      });
    }, 500);
  });
}

export async function generateCommunityResponse(topic: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses: { [key: string]: string[] } = {
        support: [
          'Your courage in sharing this is admirable. Remember, vulnerability is strength.',
          'You\'re not alone in this. Many of us have walked similar paths.',
          'Thank you for opening up. Your honesty helps others feel less isolated.',
        ],
        achievement: [
          'This is absolutely worth celebrating! You should be proud of yourself.',
          'What an amazing accomplishment! Share more about your journey.',
          'This kind of progress is inspiring. Keep building on this momentum!',
        ],
        discussion: [
          'That\'s an insightful perspective. It reminds me of...',
          'Great point! Have you considered...',
          'I appreciate this discussion. It\'s helping me think differently about...',
        ],
        resource: [
          'Thank you for sharing this valuable resource with the community.',
          'This looks really helpful. I\'ll definitely explore it.',
          'Great recommendation! I\'m sure this will help many people here.',
        ],
      };

      const topicResponses = responses[topic] || responses['support'];
      const randomResponse = topicResponses[Math.floor(Math.random() * topicResponses.length)];
      resolve(randomResponse);
    }, 700);
  });
}
