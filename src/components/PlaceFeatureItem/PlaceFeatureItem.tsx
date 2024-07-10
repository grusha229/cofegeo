import { View, ImageSourcePropType, StyleSheet, Image, Linking } from 'react-native';
import React, { useCallback } from 'react';
import { Card, TextProps, Text } from 'react-native-ui-lib';

type TContentType = TextProps & {
    text?: string;
};

type TProps = {
    imageSource: ImageSourcePropType;
    content: TContentType[];
    link?: string;
};

function PlaceFeatureInfo(props: TProps) {
    return (
        <>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    //   width: 50,
                    // height: "100%",
                    borderRadius: 0,
                }}
            >
                <Image source={props.imageSource} style={{ width: 24, height: 24 }} />
            </View>
            <View
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginLeft: 16,
                    borderRadius: 0,
                    //   flex: 1,
                }}
            >
                {props.content.map((el, index) => {
                    let { text, ...params } = el;
                    return (
                        <Text style={{ fontFamily: 'Archivo-Medium' }} {...params} key={index}>
                            {text}
                        </Text>
                    );
                })}
            </View>
        </>
    );
}

export default function PlaceFeatureItem(props: TProps) {
    const handleClick = useCallback(() => {
        Linking.openURL(props?.link);
    }, []);

    return (
        <Card onPress={props?.link && handleClick} style={styles.card}>
            <View style={styles.block}>
                <PlaceFeatureInfo imageSource={props.imageSource} content={props.content} />
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginBottom: 8,
    },
    block: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        paddingRight: 24,
    },
});
