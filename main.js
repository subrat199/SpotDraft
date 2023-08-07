const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Asana Webhook Endpoint
app.post('/asana-webhook', async (req, res) => {
  const { task } = req.body; // Assuming Asana sends task data in the request body

  // Extract relevant data from the task
  const taskData = {
    task_id: task.id,
    name: task.name,
    assignee: task.assignee.name,
    due_date: task.due_date,
    description: task.notes,
  };

  // POST the task data to Airtable
  try {
    const airtableResponse = await axios.post(
      'https://api.airtable.com/v0/YOUR_AIRTABLE_BASE_ID/Asana%20Tasks',
      {
        fields: taskData,
      },
      {
        headers: {
          Authorization: `Bearer YOUR_AIRTABLE_API_KEY`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Task copied to Airtable:', airtableResponse.data);
    res.status(200).send('Task copied to Airtable');
  } catch (error) {
    console.error('Error copying task to Airtable:', error);
    res.status(500).send('Error copying task to Airtable');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
