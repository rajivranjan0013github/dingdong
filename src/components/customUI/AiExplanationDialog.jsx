import React, { useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { Text } from '../ui/text';
import { X } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getAiExplanation } from '../../redux/slices/topicSlice';
import FormattedText from './FormattedText';

// A map of the robust section headers from our final prompt
const SECTION_HEADERS = {
  CorrectAnswer: "### ✅ The Correct Answer Explained",
  OtherOptions: "### 📚 Understanding the Other Options",
  RelatedFacts: "### 💡 Related Facts",
  MemoryTechnique: "### 🧠 Memory Technique",
};

// This function correctly parses the AI's Markdown output
const extractSection = (text, sectionKey) => {
  if (!text || !sectionKey) return '';
  
  const startMarker = SECTION_HEADERS[sectionKey];
  if (!startMarker) return '';

  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return '';

  // Content begins after the startMarker and a newline
  const contentStartIndex = startIndex + startMarker.length;
  
  // Find the start of the *next* section to determine the end
  let endIndex = text.length; // Default to the end of the text
  
  const allMarkers = Object.values(SECTION_HEADERS);
  // Find the closest next marker after our content starts
  for (const marker of allMarkers) {
    // Ensure we don't match our own start marker
    if (marker === startMarker) continue;
    
    const nextMarkerIndex = text.indexOf(marker, contentStartIndex);
    if (nextMarkerIndex !== -1 && nextMarkerIndex < endIndex) {
      endIndex = nextMarkerIndex;
    }
  }

  return text.slice(contentStartIndex, endIndex).trim();
};

const AiExplanationDialog = ({ visible, onClose, question, userAnswer }) => {
  const dispatch = useDispatch();
  const { getAiExplanationStatus, aiExplanation, error } = useSelector(state => state.topic);
  const height = useSharedValue(208); // 208px (h-52)

  const animatedStyles = useAnimatedStyle(() => ({
    height: height.value,
  }));

  useEffect(() => {
    if (visible) {
      // Reset height to loading state height when dialog opens
      height.value = 208; // h-52 (208px)
      dispatch(getAiExplanation({
        question: question.question,
        options: question.options,
        correctAnswer: question.answer,
        userAnswer: userAnswer,
        originalExplanation: question.explanation
      }));
    }
  }, [visible, dispatch]);

  // Animate height when content is loaded
  useEffect(() => {
    if (getAiExplanationStatus === 'succeeded') {
      height.value = withSpring(600, {
        damping: 15,
        mass: 1,
        stiffness: 100,
      });
    }
  }, [getAiExplanationStatus]);

  if (!visible) return null;

  // Extract content for each section using the robust function
  const correctAnswerContent = extractSection(aiExplanation, 'CorrectAnswer');
  const otherOptionsContent = extractSection(aiExplanation, 'OtherOptions');
  const relatedFactsContent = extractSection(aiExplanation, 'RelatedFacts');
  const memoryTechniqueContent = extractSection(aiExplanation, 'MemoryTechnique');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center">
        <Animated.View style={animatedStyles} className="mx-2 my-2 bg-[#1F1B24] rounded-2xl pb-4">
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-3 border-b border-border">
            <Text className="text-xl font-bold text-primary">
              Detailed Explanation
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1">
            {getAiExplanationStatus === 'loading' ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="text-muted-foreground mt-4">
                  Getting detailed explanation...
                </Text>
              </View>
            ) : getAiExplanationStatus === 'failed' ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-red-500 text-center">
                  {error || 'Failed to get explanation. Please try again.'}
                </Text>
              </View>
            ) : (
              <ScrollView className="flex-1">
                <View className="px-2 py-1">

                  {/* Correct Answer Explanation */}
                  {correctAnswerContent && (
                    <View className="border border-border rounded-lg mb-3">
                      <Text className="text-primary font-semibold text-base px-3 py-2">
                        ✅ The Correct Answer Explained
                      </Text>
                      <View className="border-t border-border px-3 py-2">
                        <FormattedText
                          content={correctAnswerContent}
                          baseColor="#ffffff"
                          fontSize={14}
                        />
                      </View>
                    </View>
                  )}

                  {/* Understanding the Other Options */}
                  {otherOptionsContent && (
                    <View className="border border-border rounded-lg mb-3">
                      <Text className="text-primary font-semibold text-base px-3 py-2">
                        📚 Understanding the Other Options
                      </Text>
                      <View className="border-t border-border px-3 py-2">
                        <FormattedText
                          content={otherOptionsContent}
                          baseColor="#ffffff"
                          fontSize={14}
                        />
                      </View>
                    </View>
                  )}

                  {/* Related Facts */}
                  {relatedFactsContent && (
                    <View className="border border-border rounded-lg mb-3">
                      <Text className="text-primary font-semibold text-base px-3 py-2">
                        💡 Related Facts
                      </Text>
                      <View className="border-t border-border px-3 py-2">
                        <FormattedText
                          content={relatedFactsContent}
                          baseColor="#ffffff"
                          fontSize={14}
                        />
                      </View>
                    </View>
                  )}
                  
                  {/* Memory Technique */}
                  {memoryTechniqueContent && (
                    <View className="border border-border rounded-lg">
                      <Text className="text-primary font-semibold text-base px-3 py-2">
                        🧠 Memory Technique
                      </Text>
                      <View className="border-t border-border px-3 py-2">
                        <FormattedText
                          content={memoryTechniqueContent}
                          baseColor="#ffffff"
                          fontSize={14}
                        />
                      </View>
                    </View>
                  )}

                </View>
              </ScrollView>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AiExplanationDialog;