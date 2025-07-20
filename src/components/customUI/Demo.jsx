import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const QuizGame = ({ 
  questions = [], 
  onQuizComplete = () => {},
  timePerQuestion = 30,
  showTimer = true 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [answered, setAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Animations
  const fadeAnim = new Animated.Value(1);
  const progressAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const pulseAnim = new Animated.Value(1);

  // Timer effect
  useEffect(() => {
    if (showTimer && !answered && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleNextQuestion();
            return timePerQuestion;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, answered, showResult]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestion + 1) / questions.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  // Timer pulse animation for urgency
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answerIndex) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    
    // Record user answer and time taken
    const timeTaken = timePerQuestion - timeLeft;
    const newUserAnswers = [...userAnswers];
    const newQuestionTimes = [...questionTimes];
    
    newUserAnswers[currentQuestion] = answerIndex;
    newQuestionTimes[currentQuestion] = timeTaken;
    
    setUserAnswers(newUserAnswers);
    setQuestionTimes(newQuestionTimes);
    
    // Scale animation for selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if answer is correct
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Auto advance after 1.5 seconds
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    // Handle timeout case
    if (!answered) {
      const newUserAnswers = [...userAnswers];
      const newQuestionTimes = [...questionTimes];
      
      newUserAnswers[currentQuestion] = -1; // -1 indicates timeout/no answer
      newQuestionTimes[currentQuestion] = timePerQuestion;
      
      setUserAnswers(newUserAnswers);
      setQuestionTimes(newQuestionTimes);
    }

    if (currentQuestion < questions.length - 1) {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
        setTimeLeft(timePerQuestion);
        
        // Fade in animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } else {
      const finalScore = score + (answered && selectedAnswer === questions[currentQuestion]?.correctAnswer ? 1 : 0);
      setShowResult(true);
      onQuizComplete(finalScore);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowSummary(false);
    setTimeLeft(timePerQuestion);
    setAnswered(false);
    setUserAnswers([]);
    setQuestionTimes([]);
    setStartTime(Date.now());
    progressAnim.setValue(0);
    fadeAnim.setValue(1);
  };

  const showDetailedSummary = () => {
    setShowSummary(true);
  };

  const getAnswerStyle = (index) => {
    if (!answered) return styles.answerButton;
    
    if (index === questions[currentQuestion].correctAnswer) {
      return [styles.answerButton, styles.correctAnswer];
    } else if (index === selectedAnswer) {
      return [styles.answerButton, styles.wrongAnswer];
    }
    return [styles.answerButton, styles.disabledAnswer];
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {currentQuestion + 1} / {questions.length}
      </Text>
    </View>
  );

  const renderTimer = () => {
    if (!showTimer) return null;
    
    const isUrgent = timeLeft <= 10;
    const timerColor = isUrgent ? '#FF4757' : '#00D2D3';
    
    return (
      <View style={styles.timerContainer}>
        <Animated.View 
          style={[
            styles.timerCircle, 
            { 
              borderColor: timerColor,
              transform: [{ scale: isUrgent ? pulseAnim : 1 }]
            }
          ]}
        >
          <Text style={[styles.timerText, { color: timerColor }]}>
            {timeLeft}
          </Text>
        </Animated.View>
      </View>
    );
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>
        </View>
        
        <View style={styles.answersContainer}>
          {question.answers.map((answer, index) => (
            <Animated.View key={index} style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={getAnswerStyle(index)}
                onPress={() => handleAnswerSelect(index)}
                disabled={answered}
                activeOpacity={0.7}
              >
                <View style={styles.answerContent}>
                  <View style={styles.answerLetter}>
                    <Text style={styles.answerLetterText}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={styles.answerText}>{answer}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderResult = () => {
    const percentage = Math.round((score / questions.length) * 100);
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;
    const totalTime = questionTimes.reduce((sum, time) => sum + time, 0);
    const avgTime = Math.round(totalTime / questions.length);
    
    let resultColor, resultMessage;
    if (isExcellent) {
      resultColor = '#00D2D3';
      resultMessage = 'Excellent! 🎉';
    } else if (isGood) {
      resultColor = '#FFA502';
      resultMessage = 'Good job! 👍';
    } else {
      resultColor = '#FF4757';
      resultMessage = 'Keep practicing! 💪';
    }
    
    return (
      <ScrollView style={styles.resultScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          
          <View style={[styles.scoreCircle, { borderColor: resultColor }]}>
            <Text style={[styles.scorePercentage, { color: resultColor }]}>
              {percentage}%
            </Text>
            <Text style={styles.scoreLabel}>Score</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{score}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{questions.length - score}</Text>
              <Text style={styles.statLabel}>Wrong</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{avgTime}s</Text>
              <Text style={styles.statLabel}>Avg Time</Text>
            </View>
          </View>
          
          <View style={styles.scoreDetailsCard}>
            <Text style={styles.scoreDetails}>
              You answered {score} out of {questions.length} questions correctly
            </Text>
            
            <Text style={[styles.resultMessage, { color: resultColor }]}>
              {resultMessage}
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.summaryButton} onPress={showDetailedSummary}>
              <Text style={styles.summaryButtonText}>📊 View Summary</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.restartButton} onPress={resetQuiz}>
              <Text style={styles.restartButtonText}>🔄 Play Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderSummary = () => {
    return (
      <ScrollView style={styles.summaryScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => setShowSummary(false)}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.summaryTitle}>Quiz Analysis</Text>
          </View>
          
          <View style={styles.overallStats}>
            <Text style={styles.overallStatsTitle}>Overall Performance</Text>
            <View style={styles.overallStatsGrid}>
              <View style={styles.overallStatItem}>
                <Text style={styles.overallStatNumber}>{score}/{questions.length}</Text>
                <Text style={styles.overallStatLabel}>Score</Text>
              </View>
              <View style={styles.overallStatItem}>
                <Text style={styles.overallStatNumber}>{Math.round((score / questions.length) * 100)}%</Text>
                <Text style={styles.overallStatLabel}>Accuracy</Text>
              </View>
            </View>
          </View>
          
          {questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const isTimeout = userAnswer === -1;
            const timeTaken = questionTimes[index] || 0;
            
            return (
              <View key={index} style={styles.questionSummaryCard}>
                <View style={styles.questionSummaryHeader}>
                  <Text style={styles.questionSummaryNumber}>Q{index + 1}</Text>
                  <View style={[
                    styles.resultBadge, 
                    { backgroundColor: isCorrect ? '#0F4C3A' : '#4A1E2C' }
                  ]}>
                    <Text style={[
                      styles.resultBadgeText,
                      { color: isCorrect ? '#00D2D3' : '#FF4757' }
                    ]}>
                      {isTimeout ? 'TIMEOUT' : isCorrect ? 'CORRECT' : 'WRONG'}
                    </Text>
                  </View>
                  <Text style={styles.timeTaken}>{timeTaken}s</Text>
                </View>
                
                <Text style={styles.questionSummaryText}>{question.question}</Text>
                
                <View style={styles.answersAnalysis}>
                  {question.answers.map((answer, answerIndex) => {
                    const isUserAnswer = userAnswer === answerIndex;
                    const isCorrectAnswer = answerIndex === question.correctAnswer;
                    
                    let answerStyle = styles.analysisAnswer;
                    if (isCorrectAnswer) {
                      answerStyle = [styles.analysisAnswer, styles.correctAnalysisAnswer];
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      answerStyle = [styles.analysisAnswer, styles.wrongAnalysisAnswer];
                    }
                    
                    return (
                      <View key={answerIndex} style={answerStyle}>
                        <View style={styles.analysisAnswerContent}>
                          <Text style={styles.analysisAnswerLetter}>
                            {String.fromCharCode(65 + answerIndex)}
                          </Text>
                          <Text style={styles.analysisAnswerText}>{answer}</Text>
                          {isUserAnswer && (
                            <Text style={styles.userAnswerIndicator}>👤</Text>
                          )}
                          {isCorrectAnswer && (
                            <Text style={styles.correctAnswerIndicator}>✓</Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
                
                {question.explanation && (
                  <View style={styles.explanationCard}>
                    <Text style={styles.explanationTitle}>💡 Explanation</Text>
                    <Text style={styles.explanationText}>{question.explanation}</Text>
                  </View>
                )}
              </View>
            );
          })}
          
          <TouchableOpacity style={styles.restartFromSummaryButton} onPress={resetQuiz}>
            <Text style={styles.restartFromSummaryButtonText}>🔄 Take Quiz Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No questions available</Text>
          <Text style={styles.errorSubtext}>Please add questions to start the quiz</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      {showSummary ? (
        renderSummary()
      ) : showResult ? (
        renderResult()
      ) : (
        <>
          {renderProgressBar()}
          {renderTimer()}
          {renderQuestion()}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#1A1A2E',
    borderRadius: 3,
    marginRight: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D2D3',
    borderRadius: 3,
    shadowColor: '#00D2D3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  progressText: {
    color: '#A0A0B2',
    fontSize: 14,
    fontWeight: '600',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16213E',
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionCard: {
    backgroundColor: '#16213E',
    padding: 25,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  questionNumber: {
    fontSize: 14,
    color: '#00D2D3',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 30,
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: '#16213E',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A2E',
  },
  correctAnswer: {
    backgroundColor: '#0F4C3A',
    borderColor: '#00D2D3',
    shadowColor: '#00D2D3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  wrongAnswer: {
    backgroundColor: '#4A1E2C',
    borderColor: '#FF4757',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledAnswer: {
    opacity: 0.4,
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  answerLetterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A0A0B2',
  },
  answerText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
  },
  resultScrollView: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#16213E',
  },
  scorePercentage: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#A0A0B2',
    fontWeight: '600',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213E',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D2D3',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0A0B2',
    fontWeight: '600',
  },
  scoreDetailsCard: {
    backgroundColor: '#16213E',
    padding: 25,
    borderRadius: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    alignItems: 'center',
    width: '100%',
  },
  scoreDetails: {
    fontSize: 16,
    color: '#A0A0B2',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  resultMessage: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  summaryButton: {
    backgroundColor: '#16213E',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00D2D3',
  },
  summaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D2D3',
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#00D2D3',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#00D2D3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  restartButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F0F23',
    textAlign: 'center',
  },
  // Summary Screen Styles
  summaryScrollView: {
    flex: 1,
  },
  summaryContainer: {
    paddingVertical: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00D2D3',
    fontWeight: '600',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  overallStats: {
    backgroundColor: '#16213E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  overallStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  overallStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overallStatItem: {
    alignItems: 'center',
  },
  overallStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00D2D3',
    marginBottom: 5,
  },
  overallStatLabel: {
    fontSize: 14,
    color: '#A0A0B2',
    fontWeight: '600',
  },
  questionSummaryCard: {
    backgroundColor: '#16213E',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  questionSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  questionSummaryNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D2D3',
    marginRight: 15,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flex: 1,
    marginRight: 15,
  },
  resultBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeTaken: {
    fontSize: 14,
    color: '#A0A0B2',
    fontWeight: '600',
  },
  questionSummaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 15,
    lineHeight: 22,
  },
  answersAnalysis: {
    gap: 8,
    marginBottom: 15,
  },
  analysisAnswer: {
    backgroundColor: '#1A1A2E',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  correctAnalysisAnswer: {
    backgroundColor: '#0F4C3A',
    borderColor: '#00D2D3',
  },
  wrongAnalysisAnswer: {
    backgroundColor: '#4A1E2C',
    borderColor: '#FF4757',
  },
  analysisAnswerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analysisAnswerLetter: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A0A0B2',
    marginRight: 10,
    width: 20,
  },
  analysisAnswerText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  userAnswerIndicator: {
    fontSize: 16,
    marginLeft: 10,
  },
  correctAnswerIndicator: {
    fontSize: 16,
    color: '#00D2D3',
    marginLeft: 10,
  },
  explanationCard: {
    backgroundColor: '#1A1A2E',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00D2D3',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00D2D3',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#A0A0B2',
    lineHeight: 20,
  },
  restartFromSummaryButton: {
    backgroundColor: '#00D2D3',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#00D2D3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  restartFromSummaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F0F23',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 24,
    color: '#FF4757',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#A0A0B2',
    textAlign: 'center',
  },
});

export default QuizGame;