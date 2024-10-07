import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
});

function getNextThreeDays(): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return Array.from({ length: 3 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return days[date.getDay()];
  }).join(', ');
}

export async function getForecast(sportType: string, location: string, timeFrame: string) {
  const nextThreeDays = getNextThreeDays();
  let prompt = '';

  if (sportType === 'kitesurf') {
    prompt = `You are a kitesurfing wind analysis expert. Give users a summary of the conditions of ${location} for the ${timeFrame === 'next three days' ? nextThreeDays : 'coming week'}. The wind direction needs to be on shore or cross shore for safety and wind above 15 knots is good. Include details on the wind speed, wind gusts, Wind direction, Swell height & Tides for each day. Provide the best day and time for them to kitesurf. Add emojis to the report.`;
  } else if (sportType === 'surf') {
    prompt = `You are an expert surf report and forecaster. Provide a detailed surf forecast for ${location} for the ${timeFrame === 'next three days' ? nextThreeDays : 'coming week'}. Include details on the Swell Size, Wind direction, Swell Period & Tides for each day. Give the users a best time to surf advice based on the forecast and your knowledge of the location.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

export async function getFollowUpResponse(sportType: string, location: string, timeFrame: string, initialForecast: string, followUpQuestion: string) {
  const nextThreeDays = getNextThreeDays();
  let prompt = '';

  if (sportType === 'kitesurf') {
    prompt = `You are a kitesurfing wind analysis expert. Given the following kitesurfing forecast for ${location} for the ${timeFrame === 'next three days' ? nextThreeDays : 'coming week'}:

${initialForecast}

Please answer the following follow-up question, maintaining your role as a kitesurfing expert and including relevant emojis:
${followUpQuestion}`;
  } else if (sportType === 'surf') {
    prompt = `You are an expert surf report and forecaster. Given the following surf forecast for ${location} for the ${timeFrame === 'next three days' ? nextThreeDays : 'coming week'}:

${initialForecast}

Please answer the following follow-up question, maintaining your role as a surfing expert and providing detailed information about swell, wind, and tides if relevant:
${followUpQuestion}`;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching follow-up response:', error);
    throw error;
  }
}