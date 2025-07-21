import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';

const HomePage = ({ 
  onGenerateQuiz = () => {},
  recentTopics = [],
  isLoading = false 
}) => {
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusAnim] = useState(new Animated.Value(0));

  const handleInputFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleGenerateQuiz = () => {
    if (!topic.trim()) return;
    onGenerateQuiz(topic.trim());
  };

  const handleTopicSelect = (selectedTopic) => {
    setTopic(selectedTopic);
  };

  // Filter recent topics based on search query
  const filteredTopics = recentTopics.filter(recentTopic =>
    recentTopic.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTopicInput = () => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>What topic would you like to quiz on?</Text>
      
      <Animated.View style={[
        styles.inputContainer,
        {
          borderColor: focusAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['#1A1A2E', '#00D2D3'],
          }),
        }
      ]}>
        <TextInput
          style={styles.topicInput}
          placeholder="Enter your topic here..."
          placeholderTextColor="#A0A0B2"
          value={topic}
          onChangeText={setTopic}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          multiline
          textAlignVertical="top"
        />
      </Animated.View>
      
      <TouchableOpacity
        style={[
          styles.generateButton,
          (!topic.trim() || isLoading) && styles.disabledButton
        ]}
        onPress={handleGenerateQuiz}
        disabled={!topic.trim() || isLoading}
      >
        <Text style={[
          styles.generateButtonText,
          (!topic.trim() || isLoading) && styles.disabledButtonText
        ]}>
          {isLoading ? 'Generating...' : 'Generate Quiz'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecentTopics = () => {
    if (recentTopics.length === 0) return null;

    return (
      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>Recent Topics</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search recent topics..."
            placeholderTextColor="#A0A0B2"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.topicsList} showsVerticalScrollIndicator={false}>
          {filteredTopics.map((recentTopic, index) => (
            <TouchableOpacity
              key={index}
              style={styles.topicItem}
              onPress={() => handleTopicSelect(recentTopic.topic)}
            >
              <Text style={styles.topicText}>{recentTopic.topic}</Text>
              <Text style={styles.topicDate}>{recentTopic.date}</Text>
            </TouchableOpacity>
          ))}
          
          {filteredTopics.length === 0 && searchQuery && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No topics found</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F23" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz Generator</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderTopicInput()}
        {renderRecentTopics()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1A1A2E',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  topicInput: {
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 100,
    maxHeight: 150,
  },
  generateButton: {
    backgroundColor: '#00D2D3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#1A1A2E',
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F0F23',
  },
  disabledButtonText: {
    color: '#A0A0B2',
  },
  recentSection: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  topicsList: {
    flex: 1,
    maxHeight: 400,
  },
  topicItem: {
    backgroundColor: '#16213E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  topicText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  topicDate: {
    fontSize: 14,
    color: '#A0A0B2',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#A0A0B2',
  },
});

export default HomePage;