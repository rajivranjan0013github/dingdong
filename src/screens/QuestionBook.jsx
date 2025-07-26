import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  FlatList,
  ToastAndroid,
} from 'react-native';
import { Text } from '../components/ui/text';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentQuestionBook,
  updateCurrentQuestionBook,
} from '../redux/slices/questionBookSlice';
import { useFocusEffect } from '@react-navigation/native';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { generateMoreQuestions } from '../redux/slices/topicSlice';
import { useNavigation } from '@react-navigation/native';
import {
  EllipsisVertical,
  Repeat,
  Check,
  X,
  BarChart2,
  Filter as FilterIcon,
  List,
  ChevronDown,
  BookOpen,
  AlertCircle,
} from 'lucide-react-native';
import CustomAlertDialog from '../components/customUI/CustomAlertDialog';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

// Constants
const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Correct', value: 'correct' },
  { label: 'Incorrect', value: 'incorrect' },
  { label: 'Unattempted', value: 'unattempted' },
];

const ANIMATION_DURATION = 300;
const FLATLIST_CONFIG = {
  initialNumToRender: 7,
  maxToRenderPerBatch: 10,
  windowSize: 14,
  removeClippedSubviews: true,
};

const SNAP_POINTS = ['25%', '50%', '90%'];
const OPTIONS_SNAP_POINTS = ['20%', '35%'];

// Utility functions
const calculateStats = questions => {
  if (!questions?.length)
    return {
      score: 0,
      totalQuestions: 0,
      attemptedQuestions: 0,
      incorrectCount: 0,
      percentage: 0,
      isExcellent: false,
      isGood: false,
    };

  const totalQuestions = questions.length;
  const attemptedQuestions = questions.filter(
    q => q.userAnswer !== undefined,
  ).length;
  const score = questions.reduce((acc, question) => {
    return (
      acc +
      (question?.userAnswer !== undefined &&
      question?.userAnswer === question?.answer
        ? 1
        : 0)
    );
  }, 0);
  const incorrectCount = questions.reduce((acc, question) => {
    return (
      acc +
      (question?.userAnswer !== undefined &&
      question?.userAnswer !== question?.answer
        ? 1
        : 0)
    );
  }, 0);

  const percentage =
    attemptedQuestions > 0 ? Math.round((score / attemptedQuestions) * 100) : 0;

  return {
    score,
    totalQuestions,
    attemptedQuestions,
    incorrectCount,
    percentage,
    isExcellent: percentage >= 80,
    isGood: percentage >= 60,
  };
};

const filterQuestions = (questions, selectedFilter) => {
  if (selectedFilter === 'all') return questions;
  if (selectedFilter === 'correct') {
    return questions.filter(
      q => typeof q.userAnswer === 'number' && q.userAnswer === q.answer,
    );
  }
  if (selectedFilter === 'incorrect') {
    return questions.filter(
      q => typeof q.userAnswer === 'number' && q.userAnswer !== q.answer,
    );
  }
  if (selectedFilter === 'unattempted') {
    return questions.filter(q => q.userAnswer === undefined);
  }
  return questions;
};

const ResultsBottomSheet = ({
  isVisible,
  onClose,
  questions,
  handleMarkAsCompleted,
}) => {
  // Calculate stats using utility function
  const stats = useMemo(() => calculateStats(questions), [questions]);

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef(null);

  // Callbacks
  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={SNAP_POINTS}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#1F1B24' }}
      handleIndicatorStyle={{ backgroundColor: '#6b7280' }}
    >
      <BottomSheetView className="flex-1 px-6">
        <Card className="mb-8 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Progress Summary 📊
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Score Circle */}
        <View className="items-center mb-8">
          <View
            className={`w-40 h-40 rounded-full border-4 items-center justify-center bg-secondary
            ${stats.isExcellent ? 'border-green-500' : stats.isGood ? 'border-yellow-500' : 'border-red-500'}`}
          >
            <Text
              className={`text-4xl font-bold 
              ${stats.isExcellent ? 'text-green-500' : stats.isGood ? 'text-yellow-500' : 'text-red-500'}`}
            >
              {stats.percentage}%
            </Text>
            <Text className="text-muted-foreground text-sm mt-1">Progress</Text>
          </View>
        </View>

        {/* Stats */}
        <Card className="mb-8 bg-secondary/30 border-primary">
          <CardContent className="flex-row justify-between py-6">
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary mb-1">
                {stats.score}
              </Text>
              <Text className="text-muted-foreground text-xs">Correct</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-red-500 mb-1">
                {stats.incorrectCount}
              </Text>
              <Text className="text-muted-foreground text-xs">Incorrect</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary mb-1">
                {stats.attemptedQuestions}
              </Text>
              <Text className="text-muted-foreground text-xs">Attempted</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-2xl font-bold text-primary mb-1">
                {stats.totalQuestions}
              </Text>
              <Text className="text-muted-foreground text-xs">Total</Text>
            </View>
          </CardContent>
        </Card>

        {/* Result Message */}
        <Card className="mb-8 bg-secondary/30 border-primary">
          <CardContent className="py-6">
            <Text className="text-center text-muted-foreground mb-2">
              You've answered {stats.score} out of {stats.attemptedQuestions}{' '}
              attempted questions correctly
              {stats.attemptedQuestions < stats.totalQuestions &&
                `\n(${stats.totalQuestions - stats.attemptedQuestions} questions remaining)`}
            </Text>
            <Text
              className={`text-xl font-bold text-center
              ${stats.isExcellent ? 'text-green-500' : stats.isGood ? 'text-yellow-500' : 'text-red-500'}`}
            >
              {stats.isExcellent
                ? 'Excellent Progress! 🎉'
                : stats.isGood
                  ? 'Good Progress! 👍'
                  : 'Keep Learning! 💪'}
            </Text>
          </CardContent>
        </Card>
        <Button
          variant="outline"
          className="flex-1 border-primary"
          onPress={handleMarkAsCompleted}
        >
          <Text className="font-bold text-center text-primary">
            Mark as Completed
          </Text>
        </Button>
      </BottomSheetView>
    </BottomSheet>
  );
};

const QuestionCard = React.memo(
  ({ question, questionIndex, handleOptionSelect }) => {
    const [internalUserAnswer, setInternalUserAnswer] = useState(
      question?.userAnswer,
    );

    // Sync internal state with prop
    useEffect(() => {
      setInternalUserAnswer(question?.userAnswer);
    }, [question?.userAnswer]);

    const isAnswered = typeof internalUserAnswer === 'number';
    const isCorrect = isAnswered && internalUserAnswer === question?.answer;

    return (
      <Card className="rounded-2xl" key={questionIndex}>
        <CardHeader className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-primary text-sm font-semibold uppercase tracking-wide">
              Question {questionIndex + 1}
            </Text>
            {isAnswered && (
              <Badge
                variant={isCorrect ? 'success' : 'destructive'}
                className="rounded-full px-2 py-1"
              >
                <Text>{isCorrect ? 'Correct' : 'Incorrect'}</Text>
              </Badge>
            )}
          </View>
          <CardTitle className="text-xl">{question?.question}</CardTitle>
        </CardHeader>

        <CardContent>
          <View className="gap-4">
            {question?.options.map((option, optionIndex) => {
              const isUserAnswer = internalUserAnswer === optionIndex;
              const isCorrectAnswer = question?.answer === optionIndex;

              let bgColor = 'bg-card';
              let borderColor = 'border-border';
              let textColor = 'text-foreground';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  bgColor = 'bg-green-500/10';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-500';
                } else if (isUserAnswer) {
                  bgColor = 'bg-red-500/10';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-500';
                }
              }

              return (
                <TouchableOpacity
                  key={optionIndex}
                  onPress={() => {
                    if (!isAnswered) {
                      setInternalUserAnswer(optionIndex); // Immediate visual update
                      handleOptionSelect(questionIndex, optionIndex); // Propagate to parent
                    }
                  }}
                  disabled={isAnswered}
                >
                  <View
                    className={`relative p-4 rounded-xl border-2 flex-row items-center ${bgColor} ${borderColor}`}
                  >
                    <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-4">
                      <Text className="text-sm font-bold text-muted-foreground">
                        {String.fromCharCode(65 + optionIndex)}
                      </Text>
                    </View>
                    <Text className={`flex-1 text-base ${textColor}`}>
                      {option}
                    </Text>
                    {isAnswered && (isUserAnswer || isCorrectAnswer) && (
                      <Badge
                        variant="secondary"
                        className="absolute -right-0 -top-0"
                      >
                        <Text className="text-xs">
                          {isUserAnswer ? 'Your Answer' : 'Correct Answer'}
                        </Text>
                      </Badge>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Explanation section - shown after answering */}
            {isAnswered && (
              <View className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <Text className="text-sm font-medium text-primary">
                  Explanation:
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  {question?.explanation}
                </Text>
              </View>
            )}
          </View>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the question object or index changes
    return (
      prevProps.question === nextProps.question &&
      prevProps.questionIndex === nextProps.questionIndex
    );
  },
);

const CollapsibleQuestionCard = React.memo(
  ({ question, questionIndex, handleOptionSelect }) => {
    const [internalUserAnswer, setInternalUserAnswer] = useState(
      question?.userAnswer,
    );
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedHeight = useSharedValue(0);
    const chevronRotation = useSharedValue(0);

    // Sync internal state with prop
    useEffect(() => {
      setInternalUserAnswer(question?.userAnswer);
    }, [question?.userAnswer]);

    const isAnswered = typeof internalUserAnswer === 'number';
    const isCorrect = isAnswered && internalUserAnswer === question?.answer;

    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
      animatedHeight.value = withTiming(isExpanded ? 0 : 1, {
        duration: ANIMATION_DURATION,
      });
      chevronRotation.value = withTiming(isExpanded ? 0 : 180, {
        duration: ANIMATION_DURATION,
      });
    };

    const animatedStyle = useAnimatedStyle(() => {
      return {
        maxHeight: interpolate(
          animatedHeight.value,
          [0, 1],
          [0, 1000],
          Extrapolation.CLAMP,
        ),
        opacity: animatedHeight.value,
      };
    });

    const chevronStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${chevronRotation.value}deg` }],
      };
    });

    return (
      <Card className="rounded-2xl">
        <TouchableOpacity onPress={toggleExpanded}>
          <CardHeader className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <Text className="text-primary text-sm font-semibold uppercase tracking-wide">
                    Question {questionIndex + 1}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    {isAnswered && (
                      <Badge
                        variant={isCorrect ? 'success' : 'destructive'}
                        className="rounded-full px-2 py-1"
                      >
                        <Text>{isCorrect ? 'Correct' : 'Incorrect'}</Text>
                      </Badge>
                    )}
                    <Animated.View style={chevronStyle}>
                      <ChevronDown size={20} color="#6b7280" />
                    </Animated.View>
                  </View>
                </View>
                <Text className="text-xl font-medium text-foreground mt-1">
                  {question?.question}
                </Text>
              </View>
            </View>
          </CardHeader>
        </TouchableOpacity>

        <Animated.View style={animatedStyle} className="overflow-hidden">
          <CardContent>
            <View className="gap-4">
              {question?.options.map((option, optionIndex) => {
                const isUserAnswer = internalUserAnswer === optionIndex;
                const isCorrectAnswer = question?.answer === optionIndex;

                let bgColor = 'bg-card';
                let borderColor = 'border-border';
                let textColor = 'text-foreground';

                if (isAnswered) {
                  if (isCorrectAnswer) {
                    bgColor = 'bg-green-500/10';
                    borderColor = 'border-green-500';
                    textColor = 'text-green-500';
                  } else if (isUserAnswer) {
                    bgColor = 'bg-red-500/10';
                    borderColor = 'border-red-500';
                    textColor = 'text-red-500';
                  }
                }

                return (
                  <TouchableOpacity
                    key={optionIndex}
                    onPress={() => {
                      if (!isAnswered) {
                        setInternalUserAnswer(optionIndex); // Immediate visual update
                        handleOptionSelect(questionIndex, optionIndex); // Propagate to parent
                      }
                    }}
                    disabled={isAnswered}
                  >
                    <View
                      className={`relative p-4 rounded-xl border-2 flex-row items-center ${bgColor} ${borderColor}`}
                    >
                      <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-4">
                        <Text className="text-sm font-bold text-muted-foreground">
                          {String.fromCharCode(65 + optionIndex)}
                        </Text>
                      </View>
                      <Text className={`flex-1 text-base ${textColor}`}>
                        {option}
                      </Text>
                      {isAnswered && (isUserAnswer || isCorrectAnswer) && (
                        <Badge
                          variant="secondary"
                          className="absolute -right-0 -top-0"
                        >
                          <Text className="text-xs">
                            {isUserAnswer ? 'Your Answer' : 'Correct Answer'}
                          </Text>
                        </Badge>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Explanation section - shown after answering */}
              {isAnswered && (
                <View className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <Text className="text-sm font-medium text-primary">
                    Explanation:
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1">
                    {question?.explanation}
                  </Text>
                </View>
              )}
            </View>
          </CardContent>
        </Animated.View>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the question object or index changes
    return (
      prevProps.question === nextProps.question &&
      prevProps.questionIndex === nextProps.questionIndex
    );
  },
);

const OptionsBottomSheet = ({
  isVisible,
  onClose,
  onClearProgress,
  onMarkAsCompleted,
  setIsDrawerVisible,
  handleToggleFilterBar,
  showFilterBar,
  handleToggleAccordionView,
  showAccordionView,
}) => {
  const bottomSheetRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleSheetChanges = useCallback(
    index => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const optionButtons = [
    {
      icon: BarChart2,
      text: 'View Progress',
      onPress: () => {
        setIsDrawerVisible(true);
        onClose();
      },
    },
    {
      icon: Check,
      text: 'Mark as Completed',
      onPress: () => {
        onMarkAsCompleted();
        onClose();
      },
    },
    {
      icon: FilterIcon,
      text: showFilterBar ? 'Hide Filters' : 'Show Filters',
      onPress: () => {
        handleToggleFilterBar();
        onClose();
      },
    },
    {
      icon: List,
      text: showAccordionView ? 'Normal View' : 'Accordion View',
      onPress: () => {
        handleToggleAccordionView();
        onClose();
      },
    },
    {
      icon: Repeat,
      text: 'Reattempt',
      onPress: () => setShowAlert(true),
    },
    {
      icon: X,
      text: 'Close',
      onPress: onClose,
    },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={OPTIONS_SNAP_POINTS}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#1F1B24' }}
      handleIndicatorStyle={{ backgroundColor: '#6b7280' }}
    >
      <BottomSheetView className="flex-1 px-6 py-4">
        {optionButtons.map((button, index) => (
          <TouchableOpacity
            key={button.text}
            className="flex-row items-center justify-center p-4 gap-2 rounded-xl bg-secondary/30 mb-4"
            onPress={button.onPress}
          >
            <button.icon size={20} color="white" className="mr-2" />
            <Text className="text-primary text-lg font-semibold">
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}

        <CustomAlertDialog
          visible={showAlert}
          onCancel={() => setShowAlert(false)}
          onConfirm={() => {
            setShowAlert(false);
            onClearProgress();
            onClose();
          }}
          title="Reattempt All Questions?"
          message="This will clear all your previous answers. Are you sure you want to reattempt?"
          confirmText="Reattempt"
          cancelText="Cancel"
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

// Extracted components
const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-background/80 z-50 items-center justify-center">
      <View className="bg-card p-6 rounded-xl shadow-lg">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="text-primary text-lg font-semibold mt-4 text-center">
          Switching View...
        </Text>
      </View>
    </View>
  );
};

const FilterBar = ({ showFilterBar, selectedFilter, onFilterChange }) => {
  if (!showFilterBar) return null;

  return (
    <View className="w-full px-6">
      <View className="flex-row items-center justify-between gap-2 mb-2">
        {FILTERS.map(f => (
          <Button
            key={f.value}
            variant={selectedFilter === f.value ? 'default' : 'outline'}
            size="sm"
            className={selectedFilter === f.value ? 'border-primary' : ''}
            onPress={() => onFilterChange(f.value)}
          >
            <Text
              className={
                selectedFilter === f.value
                  ? 'text-primary-foreground font-bold'
                  : 'text-primary'
              }
            >
              {f.label}
            </Text>
          </Button>
        ))}
      </View>
    </View>
  );
};

const HeaderCard = ({ topic, prompt }) => (
  <Card className="mb-6">
    <CardHeader>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <CardTitle className="text-2xl font-bold text-foreground mb-1">
            {topic}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {prompt}
          </CardDescription>
        </View>
      </View>
    </CardHeader>
  </Card>
);

const ActionButtons = ({
  onProgressPress,
  onGenerateQuestions,
  generateMoreQuestionsStatus,
  questionBookId,
  dispatch,
}) => (
  <View className="mt-4 gap-4">
    <Button onPress={onProgressPress} variant="secondary" className="flex-1">
      <Text className="text-lg font-bold text-center text-primary">
        Progress 📊
      </Text>
    </Button>
    <Button
      variant="outline"
      className="flex-1"
      onPress={() => dispatch(generateMoreQuestions(questionBookId))}
      disabled={generateMoreQuestionsStatus === 'loading'}
    >
      {generateMoreQuestionsStatus === 'loading' ? (
        <View className="flex-row items-center justify-center">
          <ActivityIndicator color="#007AFF" />
          <Text className="text-primary text-lg font-semibold">
            Generating...
          </Text>
        </View>
      ) : (
        <Text className="font-bold text-center text-primary">
          More Questions 📚
        </Text>
      )}
    </Button>
  </View>
);

const EmptyState = ({ selectedFilter }) => {
  const isFiltered = selectedFilter !== 'all';

  return (
    <View className="flex-1 items-center justify-center py-16">
      {isFiltered ? (
        <>
          <AlertCircle size={60} color="#6b7280" />
          <Text className="text-muted-foreground text-lg text-center mt-4">
            No questions match your filter.
          </Text>
          <Text className="text-muted-foreground text-sm text-center mt-2">
            Try changing your filter or clear it to see all questions.
          </Text>
        </>
      ) : (
        <>
          <BookOpen size={60} color="#6b7280" />
          <Text className="text-muted-foreground text-lg text-center mt-4">
            No questions found in this book.
          </Text>
          <Text className="text-muted-foreground text-sm text-center mt-2">
            Please add some questions to get started.
          </Text>
        </>
      )}
    </View>
  );
};

const QuestionBook = ({ route }) => {
  const { questionBookId } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { currentQuestionBook, fetchCurrentQuestionBookStatus } = useSelector(
    state => state.questionBook,
  );
  const { generateMoreQuestionsStatus } = useSelector(state => state.topic);

  // State management
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsDrawerVisible, setIsOptionsDrawerVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showAccordionView, setShowAccordionView] = useState(false);
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);

  // Refs
  const questionsRef = useRef([]);
  const currentQuestionBookRef = useRef(null);
  const hasChangesRef = useRef(false);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      if (isDrawerVisible || isOptionsDrawerVisible) {
        setIsDrawerVisible(false);
        setIsOptionsDrawerVisible(false);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isDrawerVisible, isOptionsDrawerVisible]);

  useEffect(() => {
    dispatch(fetchCurrentQuestionBook(questionBookId));
  }, [dispatch, questionBookId]);

  useEffect(() => {
    if (currentQuestionBook) {
      setQuestions(prevQuestions => {
        // Create a map of previous answers by question _id
        const prevAnswers = {};
        prevQuestions?.forEach(q => {
          if (q._id && q.userAnswer !== undefined) {
            prevAnswers[q._id] = q.userAnswer;
          }
        });
        // Merge userAnswer into new questions if available
        return currentQuestionBook?.questions?.map(q => ({
          ...q,
          userAnswer:
            prevAnswers[q._id] !== undefined
              ? prevAnswers[q._id]
              : q.userAnswer,
        }));
      });
      questionsRef.current = currentQuestionBook.questions;
      currentQuestionBookRef.current = currentQuestionBook;
      hasChangesRef.current = false; // Reset changes flag when new data is loaded
    }
  }, [currentQuestionBook]);

  // Update ref whenever questions change
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  const saveQuestionBook = () => {
    if (
      hasChangesRef.current &&
      currentQuestionBookRef.current &&
      currentQuestionBookRef.current._id
    ) {
      const allQuestionsAnswered = questionsRef.current.every(
        question => question.userAnswer !== undefined,
      );

      dispatch(
        updateCurrentQuestionBook({
          questions: questionsRef.current,
          questionBookId: currentQuestionBookRef.current._id,
          status: allQuestionsAnswered ? 'completed' : 'pending',
        }),
      );
      ToastAndroid.show('Your response has been saved!', ToastAndroid.SHORT);
    }
  };

  // Set the loading state to false when the current question book is fetched
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fetchCurrentQuestionBookStatus === 'succeeded') {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [currentQuestionBook]);

  // Set the header right icon to the ellipsis icon
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsOptionsDrawerVisible(true)}>
          <EllipsisVertical size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Save question book when the user navigates away from the screen
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        saveQuestionBook();
      };
    }, []), // Remove questions dependency
  );

  // Handle marking the question book as completed
  const handleMarkAsCompleted = () => {
    dispatch(
      updateCurrentQuestionBook({
        questions: questionsRef.current,
        questionBookId: currentQuestionBookRef.current._id,
        status: 'completed',
      }),
    );
    setIsDrawerVisible(false);
    ToastAndroid.show('You have marked as completed!', ToastAndroid.SHORT);
  };

  // Handle clearing the progress
  const handleClearProgress = useCallback(() => {
    setQuestions(prev => prev.map(q => ({ ...q, userAnswer: undefined })));
    hasChangesRef.current = true; // Mark that changes have been made
    ToastAndroid.show('All previous answers cleared!', ToastAndroid.SHORT);
  }, []);

  // Handle selecting an option
  const handleOptionSelect = useCallback(
    (questionIndex, selectedOptionIndex) => {
      setQuestions(prev => {
        // Only update the changed question
        if (prev[questionIndex]?.userAnswer === selectedOptionIndex)
          return prev;
        const newQuestions = [...prev];
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          userAnswer: selectedOptionIndex,
        };
        return newQuestions;
      });
      hasChangesRef.current = true; // Mark that changes have been made
    },
    [],
  );

  // Filtered questions based on selected filter
  const filteredQuestions = useMemo(() => {
    return filterQuestions(questions, selectedFilter);
  }, [questions, selectedFilter]);

  // Handler to toggle filter bar and reset filter if hiding
  const handleToggleFilterBar = () => {
    setShowFilterBar(prev => {
      if (prev) setSelectedFilter('all');
      return !prev;
    });
  };

  // Handler to toggle accordion view
  const handleToggleAccordionView = () => {
    setIsViewTransitioning(true);
    setTimeout(() => {
      setShowAccordionView(prev => !prev);
      setIsViewTransitioning(false);
    }, ANIMATION_DURATION); // Match the animation duration
  };

  // Show skeleton loading when fetching data
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="px-4 py-4">
          {/* Header Card Skeleton */}
          <Card className="mb-6">
            <CardHeader>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </View>
                <Skeleton className="h-10 w-20 ml-4" />
              </View>
            </CardHeader>
          </Card>

          {/* Questions Skeleton */}
          <View className="gap-6">
            {[1, 2].map(index => (
              <Card className="rounded-2xl" key={index}>
                <CardHeader className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </View>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>

                <CardContent>
                  <View className="gap-4">
                    {[1, 2, 3, 4].map(optionIndex => (
                      <View
                        key={optionIndex}
                        className="p-4 rounded-xl border-2 border-border"
                      >
                        <View className="flex-row items-center">
                          <Skeleton className="w-8 h-8 rounded-full mr-4" />
                          <Skeleton className="flex-1 h-5" />
                        </View>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>
            ))}

            {/* Action Buttons Skeleton */}
            <View className="mt-4 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      {/* Filter UI - at the very top, with icon */}
      <FilterBar
        showFilterBar={showFilterBar}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
      <View className="flex-1">
        {isViewTransitioning && (
          <LoadingOverlay isVisible={isViewTransitioning} />
        )}
        {filteredQuestions?.length === 0 ? (
          <EmptyState selectedFilter={selectedFilter} />
        ) : showAccordionView ? (
          <FlatList
            data={filteredQuestions}
            keyExtractor={(item, index) =>
              item._id ? item._id : index.toString()
            }
            renderItem={({ item, index }) => (
              <CollapsibleQuestionCard
                question={item}
                questionIndex={questions.indexOf(item)}
                handleOptionSelect={handleOptionSelect}
              />
            )}
            {...FLATLIST_CONFIG}
            extraData={questions}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 32,
              gap: 24,
            }}
            ListHeaderComponent={
              <HeaderCard
                topic={currentQuestionBook?.topic}
                prompt={currentQuestionBook?.prompt}
              />
            }
            ListFooterComponent={
              <ActionButtons
                onProgressPress={() => setIsDrawerVisible(true)}
                onGenerateQuestions={() =>
                  dispatch(generateMoreQuestions(questionBookId))
                }
                generateMoreQuestionsStatus={generateMoreQuestionsStatus}
                questionBookId={questionBookId}
                dispatch={dispatch}
              />
            }
          />
        ) : (
          <FlatList
            data={filteredQuestions}
            keyExtractor={(item, index) =>
              item._id ? item._id : index.toString()
            }
            renderItem={({ item, index }) => (
              <QuestionCard
                question={item}
                questionIndex={questions.indexOf(item)}
                handleOptionSelect={handleOptionSelect}
              />
            )}
            {...FLATLIST_CONFIG}
            extraData={questions}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 32,
              gap: 24,
            }}
            ListHeaderComponent={
              <HeaderCard
                topic={currentQuestionBook?.topic}
                prompt={currentQuestionBook?.prompt}
              />
            }
            ListFooterComponent={
              <ActionButtons
                onProgressPress={() => setIsDrawerVisible(true)}
                onGenerateQuestions={() =>
                  dispatch(generateMoreQuestions(questionBookId))
                }
                generateMoreQuestionsStatus={generateMoreQuestionsStatus}
                questionBookId={questionBookId}
                dispatch={dispatch}
              />
            }
          />
        )}
      </View>

      {/* Results Bottom Sheet */}
      <ResultsBottomSheet
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        questions={questions}
        handleMarkAsCompleted={handleMarkAsCompleted}
      />

      {/* Options Bottom Sheet */}
      <OptionsBottomSheet
        isVisible={isOptionsDrawerVisible}
        onClose={() => setIsOptionsDrawerVisible(false)}
        onClearProgress={handleClearProgress}
        onMarkAsCompleted={handleMarkAsCompleted}
        setIsDrawerVisible={setIsDrawerVisible}
        handleToggleFilterBar={handleToggleFilterBar} // PASS DOWN TOGGLE HANDLER
        showFilterBar={showFilterBar} // PASS STATE
        handleToggleAccordionView={handleToggleAccordionView} // PASS DOWN TOGGLE HANDLER
        showAccordionView={showAccordionView} // PASS STATE
      />
    </SafeAreaView>
  );
};

export default QuestionBook;
