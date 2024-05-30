const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// MongoDB connection string
const dbRoute = 'mongodb+srv://angelPortfolio:mongoDB@11@cluster1.anrpf9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1';

mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(dbRoute, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like the HTML file)
app.use(express.static('public'));

// Define the contact schema and model
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('contacts', contactSchema);

// Route to handle form submissions
app.post('/submit-form', (req, res) => {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
        name,
        email,
        subject,
        message
    });

    newContact.save((err) => {
        if (err) {
            return res.status(500).send('Error saving contact data.');
        }
        res.status(200).send('Contact data saved successfully!');
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
