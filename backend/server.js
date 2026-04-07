const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // The tool to talk to Firebase
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


let db;

// only try to log into Firebase if not running a Jest test
if (process.env.NODE_ENV !== 'test') {
    const serviceAccount = require(process.env.FIREBASE_CREDENTIALS);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore(); 
}


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

// Get all projects by a specific author
app.get('/api/projects/author/:email', async (req, res) => {
    try {
        const snapshot = await db.collection('projects').where('author', '==', req.params.email).get();
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(projects);
    } catch (error) {
        console.error("Error fetching author projects: ", error);
        res.status(500).json({ error: 'Failed to fetch author projects.' });
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

        const upgradedProjectData = {
            ...projectData,
            supportRequired: projectData.supportRequired || '',
            milestones: [], // Empty array ready for timeline updates
            comments: [],   // Empty array ready for community feedback
            createdAt: new Date().toISOString() // Timestamp for sorting
        };

        const newProjectRef = await db.collection('projects').add(upgradedProjectData);
        
        res.status(201).json({ 
            message: 'Project saved successfully!', 
            id: newProjectRef.id 
        });
    } catch (error) {
        console.error("Error adding document: ", error);
        res.status(500).json({ error: 'Something went wrong saving the project.' });
    }
});

//Get a specific project by its ID
app.get('/api/projects/:id', async (req, res) => {
    try {
        const doc = await db.collection('projects').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error fetching project: ", error);
        res.status(500).json({ error: 'Failed to fetch project.' });
    }
});

// Update a specific project (Edits, Milestones, and Completion)
app.put('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const updateData = req.body;
        
        // Add a timestamp for when it was last edited
        updateData.updatedAt = new Date().toISOString();

        await db.collection('projects').doc(projectId).update(updateData);
        res.status(200).json({ message: 'Project updated successfully!' });
    } catch (error) {
        console.error("Error updating project: ", error);
        res.status(500).json({ error: 'Failed to update project.' });
    }
});

// Delete a Project
app.delete('/api/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        
        // Wipe it completely from the Firestore database
        await db.collection('projects').doc(projectId).delete();
        
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        console.error("Error deleting project: ", error);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
});

// Add a Comment to a Project
app.post('/api/projects/:id/comments', async (req, res) => {
    try {
        const projectId = req.params.id;
        const { text, author, avatarIcon } = req.body;
        
        const newComment = {
            text,
            author, // The display name
            avatarIcon, // Their chosen emoji
            timestamp: new Date().toISOString()
        };

        // FieldValue.arrayUnion to push the new comment into the existing array
        await db.collection('projects').doc(projectId).update({
            comments: admin.firestore.FieldValue.arrayUnion(newComment)
        });

        res.status(200).json(newComment);
    } catch (error) {
        console.error("Error adding comment: ", error);
        res.status(500).json({ error: 'Failed to add comment.' });
    }
});

// Raise Hand (Volunteer to Collaborate)
app.post('/api/projects/:id/raise-hand', async (req, res) => {
    try {
        const projectId = req.params.id;
        const { userEmail } = req.body;

        const projectRef = db.collection('projects').doc(projectId);
        const doc = await projectRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const projectData = doc.data();
        const collaborators = projectData.collaborators || [];

        // Toggle Logic: If they are already in the array, remove them. Otherwise, add them.
        if (collaborators.includes(userEmail)) {
            await projectRef.update({
                collaborators: admin.firestore.FieldValue.arrayRemove(userEmail)
            });
            res.status(200).json({ message: 'Hand lowered', status: 'removed' });
        } else {
            await projectRef.update({
                collaborators: admin.firestore.FieldValue.arrayUnion(userEmail)
            });
            res.status(200).json({ message: 'Hand raised', status: 'added' });
        }
    } catch (error) {
        console.error("Error toggling hand: ", error);
        res.status(500).json({ error: 'Failed to toggle hand.' });
    }
});

// Get a user's profile by their email
app.get('/api/users/:email', async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.params.email).get();
        if (!userDoc.exists) {
            return res.status(200).json(null); // User exists in Auth, but hasn't set up a profile yet
        }
        res.status(200).json(userDoc.data());
    } catch (error) {
        console.error("Error fetching profile: ", error);
        res.status(500).json({ error: 'Failed to fetch profile.' });
    }
});

// Create or Update a user profile
app.post('/api/users', async (req, res) => {
    try {
        const { email, displayName, bio, githubUrl, avatarClass, avatarIcon } = req.body;
        
        await db.collection('users').doc(email).set({
            email,
            displayName,
            bio,
            githubUrl,
            avatarClass,
            avatarIcon,
            updatedAt: new Date().toISOString()
        }, { merge: true }); 

        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error("Error saving profile: ", error);
        res.status(500).json({ error: 'Failed to save profile.' });
    }
});

// Only listen on the port if we are not running a test
if (process.env.NODE_ENV !== 'test') {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Server is awake and listening on http://localhost:${PORT}`);
    });
}

// Exports the app so Jest can test it
module.exports = app;