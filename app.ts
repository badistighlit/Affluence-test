import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();

const API_URL = 'http://localhost:8080/reservations';

app.get('/rooms/:id/dispo/', async (req: Request, res: Response) => {
  const { id } = req.params;
  const datetime = req.query.datetime as string;




  if (!id || !datetime) 
  {
    return res.status(400).json({ error: 'errer' });
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        date: datetime,
        resourceId: id,
      },
    });



    const reservations = response.data.reservations;

    const isAvailable = id === '1337' && EstLibre(datetime, reservations) && !EstReserve(datetime, reservations);

    res.json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

function EstLibre(datetime: string, reservations: any[]): boolean {
    
  const start = new Date(datetime);
  start.setHours(8, 0);

  const end = new Date(datetime);
  end.setHours(17, 0);

  return start <= end;
}

function EstReserve(datetime: string, reservations: any[]): boolean {
  return reservations.some(
    (reservation) =>
      reservation.reservationStart === datetime || reservation.reservationEnd === datetime
  );
}

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
