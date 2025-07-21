import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import HomePage from '../components/customUI/Demo';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recentTopics, setRecentTopics] = useState([
    {
      topic: 'JavaScript Fundamentals',
      date: '2 days ago',
    },
    {
      topic: 'World War II History',
      date: '1 week ago',
    },
    {
      topic: 'Basic Mathematics',
      date: '2 weeks ago',
    },
    {
      topic: 'Human Biology',
      date: '3 weeks ago',
    },
    {
      topic: 'Climate Change',
      date: '1 month ago',
    },
    {
      topic: 'Ancient Rome',
      date: '1 month ago',
    },
  ]);

  const handleGenerateQuiz = async (topic) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      console.log('Generating quiz for topic:', topic);
      
      // Add to recent topics
      const newRecentTopic = {
        topic: topic,
        date: 'Just now',
      };
      
      setRecentTopics(prev => [newRecentTopic, ...prev.slice(0, 9)]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Quiz Generated!',
        `Created quiz about "${topic}"`,
        [
          {
            text: 'Start Quiz',
            onPress: () => {
              console.log('Starting quiz...');
            }
          }
        ]
      );
      
    } catch (error) {
      Alert.alert('Error', 'Failed to generate quiz. Please try again.');
      console.error('Quiz generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <HomePage
        onGenerateQuiz={handleGenerateQuiz}
        recentTopics={recentTopics}
        isLoading={isLoading}
      />
    </View>
  );
};

export default App;