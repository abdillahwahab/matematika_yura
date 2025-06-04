let currentQuestion = 0;
let score = 0;
let questions = [];
let correctAnswer = 0;
let history = [];
let correctCount = 0;
let wrongCount = 0;

// Load questions from backend
async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        questions = await response.json();
        showQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
        document.getElementById('question').textContent = 'Error memuat soal!';
    }
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showGameOver();
        return;
    }
    
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    const options = ['option1', 'option2', 'option3', 'option4'];
    options.forEach((optionId, index) => {
        const btn = document.getElementById(optionId);
        btn.textContent = question.options[index];
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    correctAnswer = question.correct;
    document.getElementById('feedback').textContent = '';
    document.getElementById('nextBtn').style.display = 'none';
}

function checkAnswer(selectedOption) {
    const options = document.querySelectorAll('.answer-btn');
    options.forEach(btn => btn.disabled = true);
    
    const feedback = document.getElementById('feedback');
    const question = questions[currentQuestion];
    const isCorrect = selectedOption === correctAnswer;
    
    // Add to history
    const historyItem = {
        question: question.question,
        userAnswer: question.options[selectedOption],
        correctAnswer: question.options[correctAnswer],
        isCorrect: isCorrect,
        timestamp: new Date().toLocaleTimeString(),
        questionNumber: currentQuestion + 1
    };
    history.unshift(historyItem); // Add to beginning for newest first
    
    if (isCorrect) {
        score += 10;
        correctCount++;
        feedback.textContent = '🎉 Benar! Pintar sekali!';
        feedback.className = 'feedback correct';
    } else {
        wrongCount++;
        feedback.textContent = `❌ Salah! Jawaban yang benar: ${question.options[correctAnswer]}`;
        feedback.className = 'feedback wrong';
    }
    
    updateStats();
    updateHistoryDisplay(); // Auto-update history
    document.getElementById('nextBtn').style.display = 'block';
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct').textContent = correctCount;
    document.getElementById('wrong').textContent = wrongCount;
    document.getElementById('total').textContent = correctCount + wrongCount;
    
    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

function updateHistoryDisplay() {
    const content = document.getElementById('historyContent');
    
    if (history.length === 0) {
        content.innerHTML = '<p class="no-history">Belum ada riwayat jawaban.</p>';
        return;
    }
    
    let historyHTML = '';
    history.forEach((item, index) => {
        const resultClass = item.isCorrect ? 'correct' : 'wrong';
        const resultIcon = item.isCorrect ? '✅' : '❌';
        
        historyHTML += `
            <div class="history-item ${resultClass}">
                <div class="history-question">Soal ${item.questionNumber}: ${item.question}</div>
                <div class="history-answer">
                    Jawaban: ${item.userAnswer}
                    ${!item.isCorrect ? `<br>Benar: ${item.correctAnswer}` : ''}
                </div>
                <div class="history-time">
                    <span>${item.timestamp}</span>
                    <span class="history-result ${resultClass}">${resultIcon}</span>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = historyHTML;
    
    // Auto-scroll to top to show latest answer
    content.scrollTop = 0;
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function showGameOver() {
    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    
    document.querySelector('.game-area').innerHTML = `
        <div class="question-box">
            <h2>🎊 Permainan Selesai! 🎊</h2>
            <div style="font-size: 1.3em; margin: 20px 0;">
                <p>Skor Akhir: <strong>${score}</strong></p>
                <p>Jawaban Benar: <strong>${correctCount}</strong></p>
                <p>Jawaban Salah: <strong>${wrongCount}</strong></p>
                <p>Total Soal: <strong>${totalAnswered}</strong></p>
                <p>Akurasi: <strong>${accuracy}%</strong></p>
            </div>
            <div class="game-buttons">
                <button class="next-btn" onclick="restartGame()">Main Lagi</button>
                <button class="print-btn" onclick="printResults()">🖨️ Cetak Hasil</button>
            </div>
        </div>
    `;
}

function printResults() {
    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = currentDate.toLocaleTimeString('id-ID');
    
    // Determine performance level and message
    let performanceMessage = '';
    let performanceIcon = '';
    let performanceColor = '';
    
    if (accuracy >= 90) {
        performanceMessage = 'HEBAT SEKALI! 🌟';
        performanceIcon = '⭐⭐⭐';
        performanceColor = '#f39c12';
    } else if (accuracy >= 70) {
        performanceMessage = 'BAGUS! 👏';
        performanceIcon = '⭐⭐';
        performanceColor = '#e67e22';
    } else if (accuracy >= 50) {
        performanceMessage = 'TERUS BERLATIH! 💪';
        performanceIcon = '⭐';
        performanceColor = '#3498db';
    } else {
        performanceMessage = 'SEMANGAT BELAJAR! 📚';
        performanceIcon = '🌈';
        performanceColor = '#9b59b6';
    }
    
    // Create print content
    let printContent = `
        <html>
        <head>
            <title>Sertifikat Game Matematika Yura</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');
                
                body { 
                    font-family: 'Comic Neue', cursive; 
                    margin: 0;
                    padding: 0;
                    background: white;
                    color: #2c3e50;
                    font-size: 14px;
                }
                
                .page {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    padding: 15mm;
                    box-sizing: border-box;
                    page-break-after: always;
                    position: relative;
                }
                
                .certificate-page {
                    background: linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #ffd0e4 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                
                .certificate {
                    background: white;
                    width: 100%;
                    max-width: 180mm;
                    padding: 20mm;
                    border-radius: 15px;
                    border: 6px solid #ff6b6b;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                    position: relative;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                
                .certificate::before {
                    content: '🌟';
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    font-size: 2em;
                    opacity: 0.3;
                }
                
                .certificate::after {
                    content: '🎈';
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 2em;
                    opacity: 0.3;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .title {
                    font-size: 2.2em;
                    font-weight: bold;
                    color: #ff6b6b;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 8px;
                    line-height: 1.1;
                }
                
                .subtitle {
                    font-size: 1.1em;
                    color: #4ecdc4;
                    margin-bottom: 15px;
                }
                
                .child-name {
                    font-size: 1.3em;
                    color: #2c3e50;
                    background: #ffe45e;
                    padding: 8px 16px;
                    border-radius: 20px;
                    display: inline-block;
                    margin: 8px 0;
                    border: 3px solid #ff6b6b;
                }
                
                .performance-badge {
                    background: ${performanceColor};
                    color: white;
                    padding: 12px 24px;
                    border-radius: 40px;
                    font-size: 1.4em;
                    font-weight: bold;
                    margin: 15px 0;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .stars {
                    font-size: 1.8em;
                    margin: 8px 0;
                }
                
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin: 20px 0;
                }
                
                .result-card {
                    background: linear-gradient(45deg, #96ceb4, #ffeaa7);
                    padding: 12px;
                    border-radius: 10px;
                    text-align: center;
                    border: 2px solid #74b9ff;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
                }
                
                .result-number {
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #2d3436;
                    display: block;
                    line-height: 1;
                }
                
                .result-label {
                    font-size: 0.8em;
                    color: #636e72;
                    margin-top: 4px;
                    line-height: 1.2;
                }
                
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 2px dashed #ff6b6b;
                    color: #636e72;
                }
                
                .date-info {
                    background: #dda0dd;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 15px;
                    display: inline-block;
                    margin-top: 8px;
                    font-weight: bold;
                    font-size: 0.9em;
                }
                
                .achievement-note {
                    background: #e8f5e8;
                    border: 2px dashed #4ecdc4;
                    padding: 12px;
                    margin: 15px 0;
                    border-radius: 10px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #2c3e50;
                }
                
                /* History Page Styles */
                .history-page {
                    background: #f8f9fa;
                }
                
                .history-header {
                    text-align: center;
                    margin-bottom: 20px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #3498db;
                }
                
                .history-title {
                    color: #2c3e50;
                    font-size: 1.8em;
                    margin-bottom: 8px;
                }
                
                .history-subtitle {
                    color: #7f8c8d;
                    font-size: 1em;
                }
                
                .history-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    margin-top: 15px;
                }
                
                .history-item {
                    background: white;
                    padding: 10px;
                    border-radius: 8px;
                    border-left: 4px solid;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.08);
                    page-break-inside: avoid;
                    font-size: 0.85em;
                }
                
                .history-item.correct {
                    border-left-color: #00b894;
                    background: linear-gradient(to right, #d1f2eb, #ffffff);
                }
                
                .history-item.wrong {
                    border-left-color: #e17055;
                    background: linear-gradient(to right, #fadbd8, #ffffff);
                }
                
                .question {
                    font-weight: bold;
                    color: #2d3436;
                    margin-bottom: 4px;
                    font-size: 0.9em;
                    line-height: 1.3;
                }
                
                .answer {
                    color: #636e72;
                    font-size: 0.8em;
                    line-height: 1.3;
                }
                
                .summary-stats {
                    background: white;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                    border: 2px solid #3498db;
                    text-align: center;
                }
                
                @media print {
                    body { margin: 0; padding: 0; }
                    .page { margin: 0; box-shadow: none; }
                    @page { margin: 0; size: A4; }
                }
            </style>
        </head>
        <body>
            <!-- Certificate Page -->
            <div class="page certificate-page">
                <div class="certificate">
                    <div class="header">
                        <div class="title">🎉 SERTIFIKAT MATEMATIKA 🎉</div>
                        <div class="subtitle">Game Matematika Yura</div>
                        <div class="child-name">🌟 ANAK PINTAR 🌟</div>
                        
                        <div class="performance-badge">
                            ${performanceMessage}
                        </div>
                        <div class="stars">${performanceIcon}</div>
                    </div>
                    
                    <div class="results-grid">
                        <div class="result-card">
                            <span class="result-number">${score}</span>
                            <div class="result-label">🏆 Total Poin</div>
                        </div>
                        <div class="result-card">
                            <span class="result-number">${correctCount}</span>
                            <div class="result-label">✅ Benar</div>
                        </div>
                        <div class="result-card">
                            <span class="result-number">${wrongCount}</span>
                            <div class="result-label">❌ Salah</div>
                        </div>
                        <div class="result-card">
                            <span class="result-number">${totalAnswered}</span>
                            <div class="result-label">📝 Total Soal</div>
                        </div>
                        <div class="result-card">
                            <span class="result-number">${accuracy}%</span>
                            <div class="result-label">🎯 Ketepatan</div>
                        </div>
                        <div class="result-card">
                            <span class="result-number">${history.length}</span>
                            <div class="result-label">📋 Riwayat</div>
                        </div>
                    </div>
                    
                    <div class="achievement-note">
                        🌈 Selamat! Kamu telah menyelesaikan latihan matematika dengan baik! 
                        Terus semangat belajar ya! 🚀
                    </div>
                    
                    <div class="footer">
                        <div class="date-info">
                            📅 ${formattedDate} ⏰ ${formattedTime}
                        </div>
                        <div style="margin-top: 10px; font-size: 0.8em;">
                            👨‍🏫 Game Matematika Yura - Belajar Sambil Bermain 🎮
                        </div>
                        ${history.length > 0 ? '<div style="margin-top: 8px; font-size: 0.8em; color: #7f8c8d;">📎 Lihat halaman berikutnya untuk detail jawaban</div>' : ''}
                    </div>
                </div>
            </div>
    `;
    
    // Add history page if there are answered questions
    if (history.length > 0) {
        printContent += `
            <!-- History Attachment Page -->
            <div class="page history-page">
                <div class="history-header">
                    <div class="history-title">📋 Lampiran: Detail Riwayat Jawaban</div>
                    <div class="history-subtitle">Game Matematika Yura - ${formattedDate}</div>
                </div>
                
                <div class="summary-stats">
                    <strong>Ringkasan:</strong> ${correctCount} Benar, ${wrongCount} Salah dari ${totalAnswered} soal (${accuracy}% akurasi)
                </div>
                
                <div class="history-grid">
        `;
        
        // Reverse history to show chronological order in print
        const chronologicalHistory = [...history].reverse();
        
        chronologicalHistory.forEach((item, index) => {
            const resultClass = item.isCorrect ? 'correct' : 'wrong';
            const resultIcon = item.isCorrect ? '✅' : '❌';
            
            printContent += `
                <div class="history-item ${resultClass}">
                    <div class="question">
                        ${resultIcon} Soal ${item.questionNumber}: ${item.question}
                    </div>
                    <div class="answer">
                        Jawaban: <strong>${item.userAnswer}</strong>
                        ${!item.isCorrect ? `<br>Benar: <strong>${item.correctAnswer}</strong>` : ''}
                        <br>⏰ ${item.timestamp}
                    </div>
                </div>
            `;
        });
        
        printContent += `
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #7f8c8d; color: #7f8c8d; font-size: 0.9em;">
                    📚 Setiap kesalahan adalah kesempatan untuk belajar! 🌟
                </div>
            </div>
        `;
    }
    
    printContent += `
        </body>
        </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Trigger print dialog
    printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
            printWindow.close();
        };
    };
}

function restartGame() {
    currentQuestion = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    history = [];
    updateStats();
    updateHistoryDisplay();
    location.reload();
}

// Start the game
window.onload = loadQuestions;
