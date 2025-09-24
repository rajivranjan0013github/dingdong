import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, Text, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import MarkdownMathView from 'react-native-markdown-math-view';
import { useDispatch, useSelector } from 'react-redux';
import { generateRelatedQuestions } from '../redux/slices/topicSlice';
import { useNavigation } from '@react-navigation/native';

const SolutionScreen2 = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    
    const doubtFromParams = route.params?.doubt;
    const { latestSolve, generateMoreQuestionsStatus } = useSelector(state => state.topic);

    const doubt = useMemo(() => doubtFromParams || latestSolve, [doubtFromParams, latestSolve]);
    

    const renderBlock = (str, mathFontSize = 12, type = "answer") => (
        <View  className={`${type === "question" ? "opacity-70" : ""}`}>
            <MarkdownMathView
                markdownStyle={{
                    body: { color: '#ffffff' },
                    heading1: { color: '#ffffff' },
                    heading2: { color: '#ffffff' },
                    heading3: { color: '#ffffff' },
                    bullet_list: { color: 'white' },
                    ordered_list: { color: 'white' },
                    paragraph: { color: 'white' },
                    code_inline: { color: '#ffffff', backgroundColor: '#1f2937' },
                    code_block: { color: '#ffffff', backgroundColor: '#1f2937', padding: 0 },
                    fence: { color: '#ffffff', backgroundColor: '#1f2937', padding: 0 },
                    link: { color: '#60a5fa' },
                    blockquote: { color: '#ffffff', borderLeftColor: '#374151' },
                }}
                style={{ color: 'white' }} 
            >
                {(str ?? '')}
            </MarkdownMathView>
        </View>
    );

    const handleMoreLikeThis = useCallback(async () => {
        if (!doubt) return;
        try {
            const resultAction = await dispatch(
                generateRelatedQuestions({
                    solveId: doubt?._id,
                    question: doubt?.question,
                    answer: doubt?.answer,
                })
            );
            const payload = resultAction?.payload;
            if (payload?._id) {
                navigation.navigate('QuestionBook', {
                    questionBookId: payload._id,
                    isDeepLink: false,
                });
            }
        } catch (e) {
            // no-op UI toast here; keep screen simple
        }
    }, [doubt, dispatch, navigation]);

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-white text-xl font-semibold">Question</Text>
                    <TouchableOpacity
                        onPress={handleMoreLikeThis}
                        disabled={generateMoreQuestionsStatus === 'loading'}
                        style={{ backgroundColor: '#111827', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#374151' }}
                    >
                        {generateMoreQuestionsStatus === 'loading' ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <ActivityIndicator color="#60a5fa" />
                                <Text style={{ color: '#60a5fa', fontWeight: '600' }}>Generating…</Text>
                            </View>
                        ) : (
                            <Text style={{ color: '#60a5fa', fontWeight: '700' }}>More Questions Like This</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {doubt?.topic ? (
                    <View className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                        <Text className="text-sm font-medium text-primary/70 uppercase tracking-wider mb-1">
                            Topic
                        </Text>
                        <Text className="text-3xl font-bold text-foreground">
                            {String(doubt?.topic)}
                        </Text>
                    </View>
                ) : null}

                <View className="p-2 rounded-xl bg-primary/5  border border-primary/10 mb-4">
                    
                    {renderBlock(doubt?.question, 18,"question")}
                </View>

                <View className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Text className="text-xs uppercase tracking-wider text-primary/70 mb-1">
                        Answer
                    </Text>
                    {renderBlock(doubt?.answer, 16)}
                </View>
            </ScrollView>
        </View>
    );
};

export default SolutionScreen2;


