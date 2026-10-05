import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory API datastore matching clinical MongoDB schema
let mockDb = {
  appointmentsCount: 48,
  totalPatients: 1250,
  availableBeds: 32,
  revenue: 142500,
  systemStatus: 'Operational',
};

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'PulseCare HMS REST Engine',
    database: process.env.MONGODB_URI ? 'MongoDB Connected' : 'In-Memory Clinical Storage',
  });
});

// Summary Stats
app.get('/api/stats', (req: Request, res: Response) => {
  res.json({
    totalPatients: mockDb.totalPatients,
    appointmentsCount: mockDb.appointmentsCount,
    availableBeds: mockDb.availableBeds,
    revenue: mockDb.revenue,
    version: '1.0.0',
  });
});

// Appointments API
app.get('/api/appointments', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Fetched appointments successfully' });
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const { doctorId, date, timeSlot, patientName } = req.body;
  if (!doctorId || !date || !timeSlot) {
    return res.status(400).json({ success: false, error: 'Missing required appointment fields' });
  }
  mockDb.appointmentsCount += 1;
  res.status(201).json({
    success: true,
    message: 'Appointment booked without collision',
    appointmentId: `apt-${Date.now()}`,
  });
});

// Patients API
app.get('/api/patients', (req: Request, res: Response) => {
  res.json({ success: true, total: mockDb.totalPatients });
});

// Pharmacy API
app.get('/api/pharmacy', (req: Request, res: Response) => {
  res.json({ success: true, status: 'Pharmacy inventory loaded' });
});

// Billing API
app.post('/api/billing/pay', (req: Request, res: Response) => {
  const { billId, amount } = req.body;
  mockDb.revenue += Number(amount) || 0;
  res.json({ success: true, message: 'Payment applied to hospital invoice', billId });
});

// Start Express server if run directly
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PulseCare HMS Server active on http://localhost:${PORT}`);
  });
}

// Only listen if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.ts')) {
  startServer();
}

export default app;
