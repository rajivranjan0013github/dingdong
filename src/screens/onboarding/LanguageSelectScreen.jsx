import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storage } from '../../utils/MMKVStorage';
import { Languages, Check } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile } from '../../redux/slices/userSlice';

const LANG_KEY = 'preferredLanguage';
const ONBOARD_KEY = 'hasCompletedOnboarding';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  
];

const LanguageItem = ({ item, selected, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#0b0f12',
      borderColor: selected ? '#ffffff' : '#1f2937',
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
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
      <Languages size={24} color="#ffffff" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>{item.name}</Text>
    </View>
    {selected ? <Check size={20} color="#ffffff" /> : null}
  </TouchableOpacity>
);

const LanguageSelectScreen = ({ navigation, route }) => {
  const user = useSelector(state => state.user);
  const preferredLanguage = user?.user?.preferredLanguage || 'English';
  const dispatch = useDispatch();
  const fromSettings = route?.params?.fromSettings;
  const defaultName = useMemo(() => {
    const savedSelected = preferredLanguage;
    if (savedSelected) {
      const byName = languages.find(l => l.name === savedSelected);
      if (byName) return byName.name;
      const byCode = languages.find(l => l.code === savedSelected);
      if (byCode) return byCode.name;
    }
    const locale = Intl?.DateTimeFormat?.().resolvedOptions?.().locale || 'en';
    return locale.startsWith('hi') ? 'Hindi' : 'English';
  }, []);
  const [selectedName, setSelectedName] = useState(defaultName);


  const handleContinue = () => {
    if (!selectedName) return;
    // Only use storage during onboarding migration; settings flow relies on Redux user
    if (!fromSettings) {
      storage.set(LANG_KEY, selectedName);
    }
    if (storage.getString('selectedLanguage')) {
      storage.delete('selectedLanguage');
    }
    if (fromSettings) {
      dispatch(updateUserProfile({ preferredLanguage: selectedName }));
      // When coming from settings, just go back
      navigation.goBack();
      return;
    }
    storage.set(ONBOARD_KEY, 'true');
    DeviceEventEmitter.emit('ONBOARDING_COMPLETED');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 , justifyContent: 'center'}}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 8 }}>Choose question language</Text>
        <Text style={{ color: '#9ca3af', marginBottom: 16 }}>Questions and explanations will use this language. You can change this later in Settings.</Text>
        {languages.map(item => (
          <LanguageItem
            key={item.code}
            item={item}
            selected={item.name === selectedName}
            onPress={(lang) => setSelectedName(lang.name)}
          />
        ))}
      </View>
      <View style={{ padding: 24 }}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedName}
          style={{ backgroundColor: '#ffffff', opacity: selectedName ? 1 : 0.6, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
        >
          <Text style={{ color: '#000000', fontWeight: '700', fontSize: 24 }}>{fromSettings ? 'Done' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectScreen;


