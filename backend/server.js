const { GoogleGenerativeAI } = require('@google/generative-ai');
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

app.get('/api/projects', async (req, res) => {
    try {
        const snapshot = await db.collection('projects').get();
        const projectsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.status(200).json(projectsList);
    } catch (error) {
        console.error("Error fetching projects: ", error);
        res.status(500).json({ error: 'Could not load the feed.' });
    }
});

// AI Pitch Polisher route
app.post('/api/polish-pitch', async (req, res) => {
    try {
        const { roughText } = req.body;
        
        if (!roughText) {
            return res.status(400).json({ error: "No text provided" });
        }

        // Initialize Gemini with secret key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-2.5-flash 
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an expert technical writer helping a developer pitch their software project on a platform called MzansiBuilds.
        Take the following rough idea and rewrite it into a professional, engaging, 2-paragraph project description.
        Do not invent features that aren't mentioned. Keep the tone inspiring and clear.
        
        Rough idea: "${roughText}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const polishedText = response.text();

        // Send the AI's polished text back to the Vue frontend
        res.status(200).json({ polishedText });
        
    } catch (error) {
        console.error("Gemini AI Error: ", error);
        res.status(500).json({ error: 'Failed to polish pitch with AI.' });
    }
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