import { Platform } from 'react-native';
import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from '@/src/widgets/task-handler';

if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);
}

import 'expo-router/entry';