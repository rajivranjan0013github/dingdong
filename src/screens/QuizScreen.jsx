import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Text } from '../components/ui/text';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import CustomHeader from '../components/common/CustomHeader';

const questions = [
  {
    "question": "When did India gain independence from British rule?",
    "options": ["15th August 1947", "26th January 1950", "2nd October 1947", "14th August 1947"],
    "answer": 0
  },
  {
    "question": "Who was the last Viceroy of British India?",
    "options": ["Lord Mountbatten", "Lord Curzon", "Lord Ripon", "Lord Dalhousie"],
    "answer": 0
  },
  {
    "question": "Which movement is considered as the final phase of India’s freedom struggle?",
    "options": ["Civil Disobedience Movement", "Non-Cooperation Movement", "Quit India Movement", "Swadeshi Movement"],
    "answer": 2
  },
  {
    "question": "Who gave the slogan 'Do or Die' during the Quit India Movement?",
    "options": ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Sardar Patel"],
    "answer": 0
  },
  {
    "question": "Which Indian freedom fighter founded the Indian National Army (INA)?",
    "options": ["Bhagat Singh", "Subhas Chandra Bose", "Chandra Shekhar Azad", "Lala Lajpat Rai"],
    "answer": 1
  },
  {
    "question": "The Indian Independence Act was passed by which country's parliament?",
    "options": ["USA", "France", "United Kingdom", "Russia"],
    "answer": 2
  },
  {
    "question": "Which day is celebrated as India’s Republic Day?",
    "options": ["15th August", "26th January", "2nd October", "5th September"],
    "answer": 1
  },
  {
    "question": "Who was the first Governor-General of independent India?",
    "options": ["C. Rajagopalachari", "Dr. Rajendra Prasad", "Lord Mountbatten", "Sardar Patel"],
    "answer": 2
  },
  {
    "question": "Which freedom fighter is known as the 'Iron Man of India'?",
    "options": ["Bal Gangadhar Tilak", "Sardar Vallabhbhai Patel", "Lala Lajpat Rai", "Jawaharlal Nehru"],
    "answer": 1
  },
  {
    "question": "The Partition of India took place in which year?",
    "options": ["1942", "1945", "1946", "1947"],
    "answer": 3
  }
]

const QuizScreen = ({ navigation }) => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = useCallback(() => {
    setIsActive(false);
    navigation.navigate('QuizResult', {
      userAnswers,
      resetQuiz: () => {
        setUserAnswers([]);
        setTimer(0);
        setIsActive(true);
        navigation.navigate('Quiz');
      }
    });
  }, [navigation, userAnswers]);

  const answeredCount = userAnswers.filter(a => a.yourAnswer !== null).length;

  useEffect(() => {
    const headerComponent = () => (
      <CustomHeader 
        title="Quiz" 
        timer={timer}
        onSubmit={handleSubmit}
        totalQuestions={questions.length}
        currentQuestion={answeredCount}
      />
    );

    navigation.setOptions({
      header: headerComponent
    });
  }, [navigation, timer, handleSubmit, answeredCount]);

  useEffect(() => {
    setUserAnswers(questions.map(question => ({
      ...question,
      yourAnswer: null
    })));
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setUserAnswers(prev => {
      const tempAnswers = [...prev];
      tempAnswers[questionIndex].yourAnswer = answerIndex;
      return tempAnswers;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          {/* Header Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>History Quiz</CardTitle>
              <CardDescription>
                Answer the questions and submit when you're ready
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Questions */}
          <View className="gap-6">
            {userAnswers.map((question, questionIndex) => (
              <Card key={questionIndex}>
                <CardHeader className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-primary text-sm font-semibold uppercase tracking-wide">
                      Question {questionIndex + 1}
                    </Text>
                  </View>
                  <CardTitle className="text-xl">{question.question}</CardTitle>
                </CardHeader>

                <CardContent>
                  <View className="gap-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = question.yourAnswer === optionIndex;

                      return (
                        <TouchableOpacity
                          key={optionIndex}
                          className={`p-4 rounded-xl border-2 flex-row items-center
                            ${isSelected ? 'bg-primary/10 border-primary' : 'bg-card border-border'}
                          `}
                          onPress={() => handleAnswer(questionIndex, optionIndex)}
                        >
                          <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-4">
                            <Text className="text-sm font-bold text-muted-foreground">
                              {String.fromCharCode(65 + optionIndex)}
                            </Text>
                          </View>
                          <Text className="flex-1 text-base text-foreground">
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>

          {/* Submit Button */}
          <Card className="mt-6 border-0 bg-transparent shadow-none">
            <CardFooter>
              <TouchableOpacity
                className="bg-primary w-full px-8 py-4 rounded-full"
                onPress={handleSubmit}
              >
                <Text className="text-lg font-bold text-center text-primary-foreground">
                  Submit Quiz
                </Text>
              </TouchableOpacity>
            </CardFooter>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizScreen; 