import React from 'react';
import { Card, Button, Form } from 'react-bootstrap';

export default function LeagueInput() {
  
  const styles = {
    cardTitle: {
      padding: '2rem',
      fontWeight: 'bold'
    },
    input: {
      width: '15rem',
      margin: 'auto',
      marginBottom: '1rem'
    }
  }

  return (
    <>
      <Card className='text-center'>
        <Card.Body>
          <Card.Title style={styles.cardTitle}>Get your ESPN Fantasy Football league's Start/Sit data in under 10 min!</Card.Title>
          <Card.Text>
            <b>Step 1)</b> Go to your fantasy team's page.
          </Card.Text>
          <Card.Text>
              <b>Step 2)</b> Copy your "leagueId" from the url and enter it below.
          </Card.Text>  
          <Form.Control id="leagueId" style={styles.input} aria-describedby="leagueId input" placeholder='Enter leagueId (ex: 84532749)' />
          <Button>Run the numbers!</Button>
        </Card.Body>
      </Card>
    </>
  );
}