import { Link, useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image } from 'react-native-ui-lib';
import { globalStyles, globalTokens } from '../src/styles';
import { Button } from '../src/components/Button/Button';
import auth, { signInWithCredential } from "firebase/auth"
import {auth as firebaseAuth} from '../src/utils/firebase';
import {
    GoogleSignin,
    GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { IStateInterface } from '../src/store/store';
import useAuth from '../src/utils/auth';

const provider = new GoogleAuthProvider();

export default function WelcomePage() {
    const router = useRouter();
    const auth = useAuth()
    const { isLogined, authData } = useSelector((state: IStateInterface) => state.authentication);

    const configureGoogleSignIn = () => {
        GoogleSignin.configure({
            webClientId: "1076432211496-f93a4j5ofqda6l3vbcq0eq4rrqo1tb0s.apps.googleusercontent.com",
            iosClientId: "1076432211496-a5kbtfng4f3sje3f82chpom0tli632qi.apps.googleusercontent.com",
        })
    };

    // useEffect(() => {
    //     if (authData) {
    //         router.replace('(app)');
    //     }
    // }, [authData])

    useEffect(() => {
        configureGoogleSignIn()
    });

    const signin = async () => {
        console.log("click")
        const auth = getAuth();
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = GoogleAuthProvider.credential(idToken)

        signInWithCredential(auth ,googleCredential)
            .then((user) => {
                console.log('signed in:', user);
                router.replace('(app)');
            })
            .catch((error) => {
                console.log('error:',error)
            })
    }

    const onLoginPress = () => {
        router.push('login');
    };

    const onRegisterPress = () => {
        router.push('registration');
    };

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={{ display: 'flex', alignItems: 'center' }}>
                <Image style={styles.kv} source={require('../assets/favicon.png')} />
                <Text style={[globalStyles.title]}>Welcome to FAVS!</Text>
                <Text style={[globalStyles.subtitle, styles.subtitle]}>
                    Create an account and get access to cool places around the Europe
                </Text>
                <View style={[styles.cta]}>
                    <Button
                        onClick={onRegisterPress}
                        children={'Sign up'}
                    />
                    <Button
                        onClick={onLoginPress}
                        children={'Sign in'}
                        type="secondary"
                    />
                </View>
                <View style={{marginTop: 16}}>
                    <GoogleSigninButton
                        size={GoogleSigninButton.Size.Wide}
                        color={GoogleSigninButton.Color.Light}
                        onPress={signin}
                    />
                </View>
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 45,
        paddingHorizontal: 16,
    },
    kv: {
        marginTop: 96,
        marginBottom: 48,
        width: 200,
        height: 200,
    },
    link: {
        color: globalTokens.colors.darkGrey,
    },
    subtitle: {
        paddingHorizontal: 16,
        textAlign: 'center',
    },
    cta: {
        marginTop: 32,
        display: "flex",
        flexDirection: "row",
        gap: 16
    },
});
