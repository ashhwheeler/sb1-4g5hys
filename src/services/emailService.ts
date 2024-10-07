import { Loops } from '@loops-to/node-sdk';

const loops = new Loops(import.meta.env.VITE_LOOPS_API_KEY);

interface EmailOptions {
  to: string;
  transactionalId: string;
  variables: Record<string, any>;
}

export async function sendEmail({ to, transactionalId, variables }: EmailOptions): Promise<void> {
  try {
    await loops.sendTransactional({
      transactionalId,
      email: to,
      dataVariables: variables,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

// These functions now return the transactionalId and variables for Loops.so templates
export function getWelcomeEmailData(username: string): { transactionalId: string; variables: Record<string, any> } {
  return {
    transactionalId: 'welcome-email', // Replace with your actual Loops.so template ID
    variables: {
      username,
      dashboardUrl: 'https://surfsessionassistant.com/dashboard',
    },
  };
}

export function getLoginNotificationData(username: string): { transactionalId: string; variables: Record<string, any> } {
  return {
    transactionalId: 'login-notification', // Replace with your actual Loops.so template ID
    variables: {
      username,
    },
  };
}

export function getForecastEmailData(username: string, forecast: string): { transactionalId: string; variables: Record<string, any> } {
  return {
    transactionalId: 'forecast-email', // Replace with your actual Loops.so template ID
    variables: {
      username,
      forecast,
    },
  };
}