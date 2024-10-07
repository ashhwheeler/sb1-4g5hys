import { getForecast } from './openai';
import { sendEmail, getForecastEmailData } from './emailService';

export async function sendForecastEmails(forecast: any) {
  try {
    const { locations, forecastType, timeFrame, email } = forecast;
    
    for (const location of locations) {
      const forecastData = await getForecast(forecastType, location, timeFrame);
      const { transactionalId, variables } = getForecastEmailData(email, forecastData);
      
      await sendEmail({
        to: email,
        transactionalId,
        variables,
      });
    }
    
    console.log(`Forecast emails sent for forecast ID: ${forecast.id}`);
  } catch (error) {
    console.error(`Error sending forecast emails for forecast ID: ${forecast.id}`, error);
  }
}