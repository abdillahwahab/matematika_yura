const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const questionsFile = path.join(dataDir, 'questions.json');

// Generate math questions
function generateQuestions() {
    const questions = [];
    
    for (let i = 0; i < 1000; i++) {
        let question, correctAnswer;
        
        // Random between addition and subtraction
        if (Math.random() < 0.5) {
            // Addition (0-20 + 0-20)
            const num1 = Math.floor(Math.random() * 11);
            const num2 = Math.floor(Math.random() * 11);
            correctAnswer = num1 + num2;
            question = `${num1} + ${num2} = ?`;
        } else {
            // Subtraction (ensure positive result)
            const num1 = Math.floor(Math.random() * 11) + 10; // 10-30
            const num2 = Math.floor(Math.random() * num1); // 0 to num1
            correctAnswer = num1 - num2;
            question = `${num1} - ${num2} = ?`;
        }
        
        // Generate wrong answers
        const wrongAnswers = [];
        while (wrongAnswers.length < 3) {
            let wrongAnswer;
            if (Math.random() < 0.5) {
                wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) + 1;
            } else {
                wrongAnswer = Math.max(0, correctAnswer - Math.floor(Math.random() * 10) - 1);
            }
            
            if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer)) {
                wrongAnswers.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        const options = [correctAnswer, ...wrongAnswers];
        const correctIndex = Math.floor(Math.random() * 4);
        
        // Create final options array with correct answer at random position
        const finalOptions = [...wrongAnswers];
        finalOptions.splice(correctIndex, 0, correctAnswer);
        
        questions.push({
            id: i + 1,
            question: question,
            options: finalOptions,
            correct: correctIndex
        });
    }
    
    return questions;
}

// Generate and save questions if file doesn't exist
if (!fs.existsSync(questionsFile)) {
    console.log('Generating questions...');
    const questions = generateQuestions();
    try {
        fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
        console.log('Questions generated and saved!');
    } catch (error) {
        console.error('Error saving questions:', error);
    }
}

// API endpoint to get questions
app.get('/api/questions', (req, res) => {
    try {
        if (!fs.existsSync(questionsFile)) {
            console.log('Questions file not found, generating...');
            const questions = generateQuestions();
            fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
        }
        
        const questionsData = fs.readFileSync(questionsFile, 'utf8');
        const allQuestions = JSON.parse(questionsData);
        
        // Shuffle and return 50 random questions per session
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 50);
        
        res.json(selectedQuestions);
    } catch (error) {
        console.error('Error loading questions:', error);
        res.status(500).json({ error: 'Failed to load questions' });
    }
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Game Matematika Yura siap dimainkan!');
});
