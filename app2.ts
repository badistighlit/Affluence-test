import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const API_RESERVATION_URL = 'http://localhost:8080/reservations';
const API_HORAIRE_URL = "http://localhost:8080/timetables"



// vous pouvez tester sur ce lien : http://localhost:3000/1337/dispo?datetime=2023-06-21T10:30:00

app.get('/:id/dispo/', async (req: Request, res: Response) => {
    const { id } = req.params;
    const datetime = req.query.datetime as string;

    if (!id || !datetime) 
  {
    return res.status(400).json({ error: 'errer' });
  }

  try{

    // recuperation des horaires de reservations
  const response_reservations = await axios.get(API_RESERVATION_URL, {
    params: {
      date: datetime,
      resourceId: id,
    },
  });
  console.log(response_reservations.data.reservations)

  const reservations=response_reservations.data.reservations;

 
// recuperation des horaires d'ouvertutre

  const response_horaire = await axios.get(API_HORAIRE_URL, {
    params: {
      date: datetime,
      resourceId: id,
    },
  });
  const horaire=response_horaire.data.timetables
  //console.log(horaire)


 // console.log(estReserve(datetime,reservations))
 const isAvailable = id === '1337' && estOuvert(datetime, horaire) && !estReserve(datetime, reservations);
 res.json({ available: isAvailable });

}



  catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }


});







app.listen(3000, () => {
    console.log('Server started on port 3000');
  });

// fonction verifiant les horaires d'ouverture 
  function estOuvert(datetime: string, Horaire: any[]) {
    var a = false;
  
    for (var i = 0; i < Horaire.length; i++) {
      var opening = new Date(Horaire[i].opening);
      var closing = new Date(Horaire[i].closing);
      var actuel = new Date(datetime);
  
      if (actuel >= opening && actuel <= closing) {
        a = true;
        break;
      }
    }
  
    return a;
  }



  // fonction verifiant si c'est reservé a l'heur demandé 
  function estReserve(datetime: string, reservations: any[]) {
    const verif = new Date(datetime);
  
    for (let i = 0; i < reservations.length; i++) {
      const reservationStart = new Date(reservations[i].reservationStart);
      const reservationEnd = new Date(reservations[i].reservationEnd);
  
      if (verif >= reservationStart && verif <= reservationEnd) {
        return true;
      }
    }
  
    return false;
  }