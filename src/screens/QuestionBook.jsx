import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Text } from '../components/ui/text';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentQuestionBook, updateCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { useFocusEffect } from '@react-navigation/native';

// Initial set of questions
const initialQuestions = [
  {
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "answer": 1,
    "explanation": "Paris is the capital and largest city of France, known for its iconic Eiffel Tower."
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
    "answer": 1,
    "explanation": "Mars appears red due to iron oxide (rust) on its surface."
  },
  {
    "question": "Who painted the Mona Lisa?",
    "options": ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    "answer": 1,
    "explanation": "The Mona Lisa was painted by Leonardo da Vinci in the early 16th century."
  }
];

// Additional questions to load
const additionalQuestions = [ 
  {
    "question": "Which is the largest ocean on Earth?",
    "options": ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    "answer": 2,
    "explanation": "The Pacific Ocean is the largest and deepest ocean on Earth."
  },
  {
    "question": "What is the chemical symbol for gold?",
    "options": ["Ag", "Au", "Fe", "Cu"],
    "answer": 1,
    "explanation": "Au (from the Latin 'aurum') is the chemical symbol for gold."
  },
  {
    "question": "Who wrote 'Romeo and Juliet'?",
    "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    "answer": 1,
    "explanation": "Romeo and Juliet was written by William Shakespeare in the late 16th century."
  }
];

const ResultsDrawer = ({ isVisible, onClose, questions }) => {
  // Calculate stats similar to QuizResultScreen
  const stats = useMemo(() => {
    const totalQuestions = questions.length;
    const attemptedQuestions = questions.filter(q => q.userAnswer !== null).length;
    
    let score = 0;
    questions.forEach((question, index) => {
      if (question.userAnswer !== null && question.userAnswer === question.answer) {
        score += 1;
      }
    });

    const percentage = attemptedQuestions > 0 
      ? Math.round((score / attemptedQuestions) * 100)
      : 0;

    return {
      score,
      totalQuestions,
      attemptedQuestions,
      percentage,
      isExcellent: percentage >= 80,
      isGood: percentage >= 60
    };
  }, [questions]);

  const screenHeight = Dimensions.get('window').height;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ height: screenHeight * 0.3 }}
        onPress={onClose}
        className="bg-secondary/30"
      />
      <View className="bg-secondary rounded-t-3xl flex-1">
        <View className="items-center py-4">
          <View className="w-12 h-1.5 rounded-full bg-primary" />
        </View>
        
        <ScrollView className="flex-1 px-6">
          <Card className="mb-8 bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-3xl text-center ">Progress Summary 📊</CardTitle>
            </CardHeader>
          </Card>
          
          {/* Score Circle */}
          <View className="items-center mb-8">
            <View className={`w-40 h-40 rounded-full border-4 items-center justify-center bg-secondary
              ${stats.isExcellent ? 'border-green-500' : stats.isGood ? 'border-yellow-500' : 'border-red-500'}`}>
              <Text className={`text-4xl font-bold 
                ${stats.isExcellent ? 'text-green-500' : stats.isGood ? 'text-yellow-500' : 'text-red-500'}`}>
                {stats.percentage}%
              </Text>
              <Text className="text-muted-foreground text-sm mt-1">Progress</Text>
            </View>
          </View>
          
          {/* Stats */}
          <Card className="mb-8 bg-secondary/30 border-primary">
            <CardContent className="flex-row justify-between py-6">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-primary mb-1">{stats.score}</Text>
                <Text className="text-muted-foreground text-xs">Correct</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-primary mb-1">{stats.attemptedQuestions}</Text>
                <Text className="text-muted-foreground text-xs">Attempted</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-primary mb-1">{stats.totalQuestions}</Text>
                <Text className="text-muted-foreground text-xs">Total</Text>
              </View>
            </CardContent>
          </Card>
          
          {/* Result Message */}
          <Card className="mb-8 bg-secondary/30 border-primary">
            <CardContent className="py-6">
              <Text className="text-center text-muted-foreground mb-2">
                You've answered {stats.score} out of {stats.attemptedQuestions} attempted questions correctly
                {stats.attemptedQuestions < stats.totalQuestions && (
                  `\n(${stats.totalQuestions - stats.attemptedQuestions} questions remaining)`
                )}
              </Text>
              <Text className={`text-xl font-bold text-center
                ${stats.isExcellent ? 'text-green-500' : stats.isGood ? 'text-yellow-500' : 'text-red-500'}`}>
                {stats.isExcellent ? 'Excellent Progress! 🎉' : stats.isGood ? 'Good Progress! 👍' : 'Keep Learning! 💪'}
              </Text>
            </CardContent>
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
};

const QuestionBook = ({navigation}) => {
  const dispatch = useDispatch();
  const { currentQuestionBook } = useSelector(state => state.questionBook);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);

  useEffect(() => {
    dispatch(fetchCurrentQuestionBook("687bf7755bb9c617173edb06"));
  }, []);

  useEffect(() => {
    if(currentQuestionBook) {
      setQuestions(currentQuestionBook.questions);
    }
  }, [currentQuestionBook]);

  const saveQuestionBook = () => {
    dispatch(updateCurrentQuestionBook({
      questions: questions,
      questionBookId: currentQuestionBook._id
    }));
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        saveQuestionBook();
      };
    }, [])
  );

  const handleOptionSelect = (questionIndex, selectedOptionIndex) => {
    setQuestions(prev => prev.map((q, index) => 
      index === questionIndex ? { ...q, userAnswer: selectedOptionIndex } : q
    ));
  };

  const loadMoreQuestions = () => {
    setQuestions(prev => [...prev, ...additionalQuestions.map(q => ({ ...q, userAnswer: null }))]);
    setHasMoreQuestions(false); // Disable button after loading all questions
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View className="px-4 py-4">
          {/* Header Card */}
          <Card className="mb-6">
            <CardHeader>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <CardTitle>Question Book</CardTitle>
                  <CardDescription>
                    Practice questions with immediate feedback. Select any option to see the correct answer and explanation.
                  </CardDescription>
                </View>
                <Button
                  onPress={() => setQuestions(prev => prev.map(q => ({ ...q, userAnswer: null })))}
                  variant="outline"
                  className="ml-4"
                >
                  <Text className="font-bold text-primary">Retry</Text>
                </Button>
              </View>
            </CardHeader>
          </Card>

          {/* Questions */}
          <View className="gap-6">
            {questions.map((question, questionIndex) => {
              const userAnswer = question?.userAnswer;
              const isAnswered = userAnswer !== null;
              const isCorrect = isAnswered && userAnswer === question?.answer;

              return (
                <Card className="rounded-2xl" key={questionIndex}>
                  <CardHeader className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-primary text-sm font-semibold uppercase tracking-wide">
                        Question {questionIndex + 1}
                      </Text>
                      {isAnswered && (
                        <Badge 
                          variant={isCorrect ? 'success' : 'destructive'} 
                          className='rounded-full px-2 py-1'
                        >
                          <Text>{isCorrect ? 'Correct' : 'Incorrect'}</Text>
                        </Badge>
                      )}
                    </View>
                    <CardTitle className="text-xl">{question?.question}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <View className="gap-4">
                      {question?.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question?.answer === optionIndex;
                        
                        let bgColor = 'bg-card';
                        let borderColor = 'border-border';
                        let textColor = 'text-foreground';
                        
                        if (isAnswered) {
                          if (isCorrectAnswer) {
                            bgColor = 'bg-green-500/10';
                            borderColor = 'border-green-500';
                            textColor = 'text-green-500';
                          } else if (isUserAnswer) {
                            bgColor = 'bg-red-500/10';
                            borderColor = 'border-red-500';
                            textColor = 'text-red-500';
                          }
                        }

                        return (
                          <TouchableOpacity
                            key={optionIndex}
                            onPress={() => !isAnswered && handleOptionSelect(questionIndex, optionIndex)}
                            disabled={isAnswered}
                          >
                            <View
                              className={`relative p-4 rounded-xl border-2 flex-row items-center ${bgColor} ${borderColor}`}
                            >
                              <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-4">
                                <Text className="text-sm font-bold text-muted-foreground">
                                  {String.fromCharCode(65 + optionIndex)}
                                </Text>
                              </View>
                              <Text className={`flex-1 text-base ${textColor}`}>
                                {option}
                              </Text>
                              {isAnswered && (isUserAnswer || isCorrectAnswer) && (
                                <Badge variant='secondary' className='absolute -right-0 -top-0'>
                                  <Text className='text-xs'>
                                    {isUserAnswer ? 'Your Answer' : 'Correct Answer'}
                                  </Text>
                                </Badge>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}

                      {/* Explanation section - shown after answering */}
                      {isAnswered && (
                        <View className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <Text className="text-sm font-medium text-primary">
                            Explanation:
                          </Text>
                          <Text className="text-sm text-muted-foreground mt-1">
                            {question?.explanation}
                          </Text>
                        </View>
                      )}
                    </View>
                  </CardContent>
                </Card>
              );
            })}

            {/* Action Buttons at the end of questions */}
            <View className="mt-4 gap-4">
              <Button
                onPress={() => setIsDrawerVisible(true)}
                variant="secondary"
                className="flex-1"
              >
                <Text className="text-lg font-bold text-center text-primary">
                  Progress 📊
                </Text>
              </Button>

              <Button
                onPress={saveQuestionBook}
                variant="secondary"
                className="flex-1"
              >
                <Text className="text-lg font-bold text-center text-primary">
                  Save Progress
                </Text>
              </Button>

              {hasMoreQuestions && (
                <Button
                  onPress={loadMoreQuestions}
                  variant="outline"
                  className="flex-1"
                >
                  <Text className="font-bold text-center text-primary">
                    More Questions 📚
                  </Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Results Drawer */}
      <ResultsDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        questions={questions}
      />
    </SafeAreaView>
  );
};

export default QuestionBook;