import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Dimensions, BackHandler } from 'react-native';
import { Text } from '../components/ui/text';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentQuestionBook, updateCurrentQuestionBook } from '../redux/slices/questionBookSlice';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';

const ResultsBottomSheet = ({ isVisible, onClose, questions }) => {
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

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  // Callbacks
  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#1f2937' }} // bg-secondary
      handleIndicatorStyle={{ backgroundColor: '#6b7280' }} // text-muted-foreground
    >
      <BottomSheetView className="flex-1 px-6">
        <Card className="mb-8 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Progress Summary 📊</CardTitle>
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
      </BottomSheetView>
    </BottomSheet>
  );
};

const QuestionBook = ({ route }) => {
  const { questionBookId } = route.params;
  const dispatch = useDispatch();
  const { currentQuestionBook, fetchCurrentQuestionBookStatus, updateCurrentQuestionBookStatus } = useSelector(state => state.questionBook);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [questions, setQuestions] = useState([]);
  const questionsRef = useRef([]);
  const currentQuestionBookRef = useRef(null);
  const hasChangesRef = useRef(false);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (isDrawerVisible) {
        setIsDrawerVisible(false);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [isDrawerVisible]);

  useEffect(() => {
    if(fetchCurrentQuestionBookStatus === 'idle' || currentQuestionBook?._id !== questionBookId) {
      dispatch(fetchCurrentQuestionBook(questionBookId));
    }
  }, [fetchCurrentQuestionBookStatus, dispatch, questionBookId]);

  useEffect(() => {
    if(currentQuestionBook) {
      setQuestions(currentQuestionBook.questions);
      questionsRef.current = currentQuestionBook.questions;
      currentQuestionBookRef.current = currentQuestionBook;
      hasChangesRef.current = false; // Reset changes flag when new data is loaded
    }
  }, [currentQuestionBook]);

  // Update ref whenever questions change
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const saveQuestionBook = () => {
    if (hasChangesRef.current && currentQuestionBookRef.current && currentQuestionBookRef.current._id) {
      dispatch(updateCurrentQuestionBook({
        questions: questionsRef.current,
        questionBookId: currentQuestionBookRef.current._id
      }));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        saveQuestionBook();
      };
    }, []) // Remove questions dependency
  );

  const handleOptionSelect = (questionIndex, selectedOptionIndex) => {
    setQuestions(prev => prev.map((q, index) => 
      index === questionIndex ? { ...q, userAnswer: selectedOptionIndex } : q
    ));
    hasChangesRef.current = true; // Mark that changes have been made
  };

  // Show skeleton loading when fetching data
  if (fetchCurrentQuestionBookStatus === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
        <ScrollView className="flex-1">
          <View className="px-4 py-4">
            {/* Header Card Skeleton */}
            <Card className="mb-6">
              <CardHeader>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </View>
                  <Skeleton className="h-10 w-20 ml-4" />
                </View>
              </CardHeader>
            </Card>

            {/* Questions Skeleton */}
            <View className="gap-6">
              {[1, 2, 3].map((index) => (
                <Card className="rounded-2xl" key={index}>
                  <CardHeader className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </View>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>

                  <CardContent>
                    <View className="gap-4">
                      {[1, 2, 3, 4].map((optionIndex) => (
                        <View key={optionIndex} className="p-4 rounded-xl border-2 border-border">
                          <View className="flex-row items-center">
                            <Skeleton className="w-8 h-8 rounded-full mr-4" />
                            <Skeleton className="flex-1 h-5" />
                          </View>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              ))}

              {/* Action Buttons Skeleton */}
              <View className="mt-4 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  console.log('questions', questions);

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
                  onPress={() => {
                    setQuestions(prev => prev.map(q => ({ ...q, userAnswer: null })));
                    hasChangesRef.current = true; // Mark that changes have been made
                  }}
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
              const isAnswered = userAnswer !== undefined;
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
                  variant="outline"
                  className="flex-1"
                >
                  <Text className="font-bold text-center text-primary">
                    More Questions 📚
                  </Text>
                </Button>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Results Bottom Sheet */}
      <ResultsBottomSheet
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        questions={questions}
      />
    </SafeAreaView>
  );
};

export default QuestionBook;