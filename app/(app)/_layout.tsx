import { Redirect, Stack } from 'expo-router';

import { Text } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { IStateInterface } from '../../src/store/store';
import useAuth from '../../src/utils/auth';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export default function AppLayout() {
  const auth = useAuth();
  const { isLogined, authData } = useSelector((state: IStateInterface) => state.authentication);

  if (auth === undefined) {
    return <Text>Loading</Text>
  }

  if (authData === null) {
    return <Redirect href="/loading" />;
  } else {
    return (
        <Stack 
            screenOptions={{ 
                headerShown: false,
                headerBackButtonMenuEnabled: true,
                headerTransparent: true,
            }} 
            initialRouteName='index'
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    headerTitle: '' 
                }}
            />
            <Stack.Screen
                name="places/[id]"
                options={{
                    headerShown: true,
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="profile/index"
                options={{
                    headerShown: true,
                    headerTitle: '',
                }}
            />
            <Stack.Screen
                name="profile/settings/index"
                options={{
                    headerShown: true,
                    headerTitle: 'Settings',
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                }}
            />
        </Stack>
    );
}
}
