const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // The tool to talk to Firebase
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); 

app.get('/', (req, res) => {
    res.send('MzansiBuilds Backend Engine is running!');
});

app.post('/api/projects', async (req, res) => {
    try {
        const projectData = req.body; 
        const newProjectRef = await db.collection('projects').add(projectData);
        
        res.status(201).json({ 
            message: 'Project saved successfully!', 
            id: newProjectRef.id 
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).json({ error: 'Something went wrong saving the project.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is awake and listening on http://localhost:${PORT}`);
});