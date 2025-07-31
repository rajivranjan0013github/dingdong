import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';

const TermsOfServiceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.effectiveDate}>
            Effective Date: December 2024
          </Text>

          <Text style={styles.intro}>
            Welcome to TopicWise. By using our app, you agree to these Terms of
            Service. Please read them carefully.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Using the App</Text>
            <Text style={styles.text}>
              You must log in via Google Sign-In to access the full features of
              the app.
            </Text>
            <Text style={styles.text}>
              By using the app, you grant us permission to process your input
              prompts and generate AI-based content.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Content</Text>
            <Text style={styles.text}>
              You are responsible for any prompts you enter. Do not enter
              offensive, illegal, or harmful content.
            </Text>
            <Text style={styles.text}>
              All content you generate or share remains yours. However, we may
              store and analyze it to improve our services.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Sharing</Text>
            <Text style={styles.text}>
              You may share generated question books using the app's built-in
              sharing feature.
            </Text>
            <Text style={styles.text}>
              Do not misuse the platform to share harmful, spammy, or unlawful
              content.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Account Access</Text>
            <Text style={styles.text}>
              You are responsible for maintaining the security of your login
              credentials.
            </Text>
            <Text style={styles.text}>
              If you lose access to your account and want your data removed,
              contact us at ayushkumarsanu00@gmail.com.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Limitations</Text>
            <Text style={styles.text}>
              We do not guarantee the accuracy or appropriateness of the
              AI-generated content.
            </Text>
            <Text style={styles.text}>
              The app is provided "as is" without warranties of any kind.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Termination</Text>
            <Text style={styles.text}>
              We reserve the right to suspend or terminate access if you violate
              these terms or misuse the platform.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Changes</Text>
            <Text style={styles.text}>
              We may update these terms from time to time. Continued use of the
              app means you accept the revised terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Contact</Text>
            <Text style={styles.text}>
              For any questions, please contact us at
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

export default TermsOfServiceScreen;
