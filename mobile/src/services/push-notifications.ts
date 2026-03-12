import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

class PushNotificationService {
    async registerForPushNotifications(): Promise<string | null> {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;

        if (existing !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            Alert.alert('Permission Required', 'Push notifications permission not granted.');
            return null;
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
            });
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        return tokenData.data;
    }

    async scheduleLocalNotification(title: string, body: string, seconds: number = 1) {
        await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: 'default' },
            trigger: { seconds },
        });
    }

    async cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    addNotificationListener(handler: (notification: Notifications.Notification) => void) {
        return Notifications.addNotificationReceivedListener(handler);
    }

    addResponseListener(handler: (response: Notifications.NotificationResponse) => void) {
        return Notifications.addNotificationResponseReceivedListener(handler);
    }
}

export default new PushNotificationService();