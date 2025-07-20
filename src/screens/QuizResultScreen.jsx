import React, { useMemo } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { Text } from '../components/ui/text';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const QuizResultScreen = ({ route, navigation }) => {
  const { userAnswers, resetQuiz } = route.params || {};

  // Calculate all stats in one go
  const stats = useMemo(() => {
    const totalQuestions = userAnswers.length;
    const attemptedQuestions = userAnswers.filter(q => q.yourAnswer !== null).length;
    
    let score = 0;
    userAnswers.forEach(question => {
      if (question.yourAnswer !== null && question.yourAnswer === question.answer) {
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
  }, [userAnswers]);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 py-10">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Quiz Complete! 🎉</CardTitle>
          </CardHeader>
        </Card>
        
        {/* Score Circle */}
        <View className="items-center mb-8">
          <View className={`w-40 h-40 rounded-full border-4 items-center justify-center bg-card
            ${stats.isExcellent ? 'border-green-500' : stats.isGood ? 'border-yellow-500' : 'border-red-500'}`}>
            <Text className={`text-4xl font-bold 
              ${stats.isExcellent ? 'text-green-500' : stats.isGood ? 'text-yellow-500' : 'text-red-500'}`}>
              {stats.percentage}%
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">Score</Text>
          </View>
        </View>
        
        {/* Stats */}
        <Card className="mb-8">
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
        <Card className="mb-8">
          <CardContent className="py-6">
            <Text className="text-center text-muted-foreground mb-2">
              You answered {stats.score} out of {stats.attemptedQuestions} attempted questions correctly
              {stats.attemptedQuestions < stats.totalQuestions && (
                `\n(${stats.totalQuestions - stats.attemptedQuestions} questions skipped)`
              )}
            </Text>
            <Text className={`text-xl font-bold text-center
              ${stats.isExcellent ? 'text-green-500' : stats.isGood ? 'text-yellow-500' : 'text-red-500'}`}>
              {stats.isExcellent ? 'Excellent! 🎉' : stats.isGood ? 'Good job! 👍' : 'Keep practicing! 💪'}
            </Text>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <View className="gap-4">
          <TouchableOpacity 
            className="bg-primary px-8 py-4 rounded-full"
            onPress={() => navigation.navigate('QuizAnalysis', { userAnswers })}
          >
            <Text className="text-lg font-bold text-center text-primary-foreground">
              View Detailed Analysis 📊
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-primary/10 px-8 py-4 rounded-full"
            onPress={resetQuiz}
          >
            <Text className="text-lg font-bold text-center text-primary">
              Try Again 🔄
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default QuizResultScreen; 