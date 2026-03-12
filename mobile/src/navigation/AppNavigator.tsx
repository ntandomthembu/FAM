import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import OutbreakMapScreen from '../screens/OutbreakMapScreen';
import MyFarmScreen from '../screens/MyFarmScreen';
import LivestockScreen from '../screens/LivestockScreen';
import PermitRequestScreen from '../screens/PermitRequestScreen';
import VaccinationScreen from '../screens/VaccinationScreen';
import AlertsScreen from '../screens/AlertsScreen';
import BiosecurityGuideScreen from '../screens/BiosecurityGuideScreen';
import AIDetectionScreen from '../screens/AIDetectionScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParamList = {
  Home: undefined;
  ReportIncident: undefined;
  OutbreakMap: undefined;
  MyFarm: undefined;
  Livestock: undefined;
  PermitRequest: undefined;
  Vaccination: undefined;
  Alerts: undefined;
  BiosecurityGuide: undefined;
  AIDetection: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FMD Control' }} />
      <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} options={{ title: 'Report Incident' }} />
      <Stack.Screen name="OutbreakMap" component={OutbreakMapScreen} options={{ title: 'Outbreak Map' }} />
      <Stack.Screen name="MyFarm" component={MyFarmScreen} options={{ title: 'My Farm' }} />
      <Stack.Screen name="Livestock" component={LivestockScreen} options={{ title: 'Livestock' }} />
      <Stack.Screen name="PermitRequest" component={PermitRequestScreen} options={{ title: 'Request Permit' }} />
      <Stack.Screen name="Vaccination" component={VaccinationScreen} options={{ title: 'Vaccination' }} />
      <Stack.Screen name="Alerts" component={AlertsScreen} options={{ title: 'Alerts' }} />
      <Stack.Screen name="BiosecurityGuide" component={BiosecurityGuideScreen} options={{ title: 'Biosecurity Guide' }} />
      <Stack.Screen name="AIDetection" component={AIDetectionScreen} options={{ title: 'AI Detection' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;