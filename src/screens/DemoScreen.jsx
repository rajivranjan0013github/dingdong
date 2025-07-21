import { View, Text, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

const DemoScreen = () => {

  return (
    <View>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  return (
      <View className="flex-1 bg-background">
        <StatusBar barStyle="light-content" />
        <ScrollView className="flex-1">
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
              {[1, 2].map((index) => (
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
                      {[1, 2, 3, 4].map((optionIndex) => (
                        <View key={optionIndex} className="p-4 rounded-xl border-2 border-border">
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

              <View className="mt-4 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
};

export default DemoScreen;