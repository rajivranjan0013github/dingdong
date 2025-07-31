import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.effectiveDate}>
            Effective Date: July 31, 2025
            Last Updated: July 31, 2025
          </Text>

          <Text style={styles.intro}>
            At TopicWise, we are committed to protecting your privacy. This
            Privacy Policy outlines how we collect, use, and protect your
            personal information when you use our app.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Google Account Information:</Text> When
              you log in via Google Sign-In, we collect your email address and
              basic profile details (such as your name and profile picture) as
              permitted.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>User Prompts & Generated Content:</Text>{' '}
              We collect any prompts you enter and the AI-generated questions.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Shared Content:</Text> If you share a
              question book, the shared content and related metadata (timestamp,
              recipient, etc.) are stored.
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Usage Data:</Text> We may collect
              anonymized data for analytics and performance monitoring.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              2. How We Use Your Information
            </Text>
            <Text style={styles.text}>• To allow you to log in securely</Text>
            <Text style={styles.text}>
              • To generate AI-based content based on your input
            </Text>
            <Text style={styles.text}>
              • To enable sharing of your generated content
            </Text>
            <Text style={styles.text}>
              • To improve and personalize your app experience
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Data Storage</Text>
            <Text style={styles.text}>
              All data is stored securely on our own servers or databases. We do
              not sell or share your personal information with third parties.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Your Rights</Text>
            <Text style={styles.text}>
              You may request to access, delete, or export your data by emailing
              us at ayushkumarsanu00@gmail.com.
            </Text>
            <Text style={styles.text}>
              If you are unable to access your account, please contact us, and
              we will verify your identity before processing your request.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Children's Privacy</Text>
            <Text style={styles.text}>
              We do not restrict use based on age, but we recommend supervision
              for users under 13 if required by your local laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
            <Text style={styles.text}>
              We may update this Privacy Policy periodically. Changes will be
              posted in-app or on our website with a revised effective date.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Contact</Text>
            <Text style={styles.text}>
              If you have any questions, reach out to us at
              ayushkumarsanu00@gmail.com.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  effectiveDate: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 22,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PrivacyPolicyScreen;
