import { Platform } from 'react-native';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { renderMarketPulseWidget } from '@/src/widgets/task-handler';

const widgetNames = ['MarketPrice', 'MarketNews'] as const;

/**
 * Draw every Market Pulse widget already placed on the Android home screen.
 * This runs while the app process is active, which also recovers widgets whose
 * initial background render was delayed by the launcher or WorkManager.
 */
export async function refreshAndroidWidgets() {
  if (Platform.OS !== 'android') return;

  await Promise.all(widgetNames.map((widgetName) => requestWidgetUpdate({
    widgetName,
    renderWidget: (widgetInfo) => renderMarketPulseWidget(widgetName, widgetInfo),
  })));
}