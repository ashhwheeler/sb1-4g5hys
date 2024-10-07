import express from 'express';
import cron from 'node-cron';
import { sendForecastEmails } from './services/forecastSer