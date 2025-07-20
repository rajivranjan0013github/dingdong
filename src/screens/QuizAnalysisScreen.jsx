import React from 'react';
import { View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Text } from '../components/ui/text';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const QuizAnalysisScreen = ({ route }) => {
  const { userAnswers } = route.params || {};

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          {/* Header Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quiz Analysis</CardTitle>
              <CardDescription>
                Review your answers and see the correct ones
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Questions */}
          <View className="gap-6">
            {userAnswers.map((question, questionIndex) => {
              const userAnswer = question.yourAnswer;
              const correctAnswer = question.answer;
              const isAnswered = userAnswer !== null;
              const isCorrect = isAnswered && userAnswer === correctAnswer;

              return (
                <Card className="rounded-2xl" key={questionIndex}>
                  <CardHeader className="gap-3">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-primary text-sm font-semibold uppercase tracking-wide">
                        Question {questionIndex + 1}
                      </Text>
                      {isAnswered ? (
                        <Badge variant={isCorrect ? 'success' : 'destructive'} className='rounded-full px-2 py-1'>
                          <Text>{isCorrect ? 'Correct' : 'Incorrect'}</Text>
                        </Badge>
                      ) : (
                        <Badge variant='secondary' className='rounded-full px-2 py-1'>
                          <Text>Not Answered</Text>
                        </Badge>
                      )}
                    </View>
                    <CardTitle className="text-xl">{question.question}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <View className="gap-4">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = correctAnswer === optionIndex;
                        
                        let bgColor = 'bg-card';
                        let borderColor = 'border-border';
                        let textColor = 'text-foreground';
                        
                        if (isUserAnswer && isCorrectAnswer) {
                          bgColor = 'bg-green-500/10';
                          borderColor = 'border-green-500';
                          textColor = 'text-green-500';
                        } else if (isUserAnswer && !isCorrectAnswer) {
                          bgColor = 'bg-red-500/10';
                          borderColor = 'border-red-500';
                          textColor = 'text-red-500';
                        } else if (isCorrectAnswer) {
                          bgColor = 'bg-green-500/10';
                          borderColor = 'border-green-500';
                          textColor = 'text-green-500';
                        }

                        return (
                          <View
                            key={optionIndex}
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
                            {(isUserAnswer || isCorrectAnswer) && (
                              <Badge variant='secondary' className='absolute -right-0 -top-0'>
                                <Text className='text-xs'>{isUserAnswer ? 'Your Answer' : 'Correct Answer'}</Text>
                              </Badge>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuizAnalysisScreen; 