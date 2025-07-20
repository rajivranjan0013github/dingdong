import React from 'react';
import { View } from 'react-native';
import QuizGame from '../components/customUI/Demo';

const sampleQuestions = [
  {
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    question: "What is the largest mammal in the world?",
    answers: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Monet"],
    correctAnswer: 2
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2
  },
  {
    question: "Which programming language is known as the 'language of the web'?",
    answers: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1
  }
];

const DemoScreen = () => {
  const handleQuizComplete = (finalScore) => {
    console.log('Quiz completed with score:', finalScore);
    // Handle quiz completion (save score, navigate, etc.)
  };

  return (
    <View style={{ flex: 1 }}>
      <QuizGame
        questions={sampleQuestions}
        onQuizComplete={handleQuizComplete}
        timePerQuestion={30}
        showTimer={true}
      />
    </View>
  );
};

export default DemoScreen;