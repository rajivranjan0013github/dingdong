import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Camera, Brain, ListChecks } from 'lucide-react-native';

const BulletRow = ({ title, subtitle, icon }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 14,
      borderRadius: 12,
      backgroundColor: '#0b0f12',
      borderWidth: 1,
      borderColor: '#1f2937',
      marginBottom: 12,
    }}
  >
    <View
      style={{
        height: 44,
        width: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        marginRight: 12,
      }}
    >
      {icon}
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: '#cbd5e1', marginTop: 4 }}>{subtitle}</Text>
    </View>
  </View>
);

const ExplainersScreen = () => {
  const navigation = useNavigation();

  const slides = useMemo(
    () => [
      {
        key: 'pdf',
        title: 'Turn PDFs into practice set',
        subtitle: 'Import PDFs and extract key questions instantly.',
        icon: <FileText size={40} color="#ffffff" />,
      },
      {
        key: 'camera',
        title: 'Scan and solve question and get similar questions instantly',
        subtitle: 'Capture images, and get step-by-step help.',
        icon: <Camera size={40} color="#ffffff" />,
      },
      {
        key: 'ai',
        title: 'Detailed explanations',
        subtitle: 'Understand concepts with clear reasoning and examples and tricks to remember',
        icon: <Brain size={40} color="#ffffff" />,
      },
      {
        key: 'practice',
        title: 'Endless practice',
        subtitle: 'Generate more questions tailored to your progress.',
        icon: <ListChecks size={40} color="#ffffff" />,
      },
    ],
    [],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        {slides.map(item => (
          <BulletRow
            key={item.key}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
          />
        ))}
      </View>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LanguageSelect')}
          style={{ backgroundColor: '#ffffff', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#000000', fontWeight: '700', fontSize: 24 }}>Next</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

export default ExplainersScreen;


