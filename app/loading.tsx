import { ActivityIndicator, ImageBackground, SafeAreaView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { IStateInterface } from '../src/store/store';
import useAuth from '../src/utils/auth';


export default function LoadingPage() {
    const auth = useAuth();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { isLogined, authData } = useSelector((state: IStateInterface) => state.authentication);
    console.warn(isLogined, authData);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldRedirect(true);
        }, 2000); // 2 секунды

        return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
    }, []);

    if (shouldRedirect) {
        if (isLogined) {
            return <Redirect href="/(app)" />;
        }

        if (!authData) {
            return <Redirect href="/welcome" />;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageBackground source={require('../assets/splash.png')} resizeMode="cover" style={styles.image}>
                    <ActivityIndicator size="large" color="#000" style={styles.loader} />
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: "100%",
        flex: 1
    },
    image: {
        flex: 1,
        width: "100%",
        display: "flex",
        justifyContent: "flex-end"
    },
    loader: {
        marginTop: 25
    }
});