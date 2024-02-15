import React, { useCallback, useMemo, useRef } from "react";
import {
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  useAnimatedValue,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import {
  Carousel,
  View,
  AnimatedImage,
  Image,
  Chip,
  Card,
} from "react-native-ui-lib";
import MapBlock from "../../src/components/Map";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Product from "../../src/components/Product";
import ContactsList from "../../src/components/ContactsList/ContactsList";
import OpeningHours from "../../src/components/OpeningHours/OpeningHours";
import AddressBlock from "../../src/components/AddressBlock/AddressBlock";

const dogPhoto = require("../../assets/random_img.jpeg");
const qr = require("../../assets/qr.png");

const { width, height } = Dimensions.get("window");
const IMG_HEIGHT = 300;

export default function PlacePage() {
  const { id } = useLocalSearchParams();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  // ref
  const BottomSheetModalRef = useRef<BottomSheetModal>(null);
  const checkInModalRef = useRef<BottomSheetModal>(null);

  const handleOpenModalRef = useCallback((id) => {
    console.log(id);
    checkInModalRef.current?.present();
  }, []);

  const handleCloseModalRef = useCallback(() => {
    checkInModalRef.current?.dismiss();
    handlePresentModalPress();
  }, []);

  const handlePresentModalPress = useCallback(() => {
    BottomSheetModalRef.current?.present();
  }, []);

  // variables
  const snapPoints = useMemo(() => [height - 100, "50%"], []);
  const modalSnapPoints = useMemo(() => ["55%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Stack.Screen
            options={{
              headerTransparent: true,
              // headerLeft: () => <Text>Back</Text>
            }}
          />
          <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <Animated.View style={[styles.image, imageAnimatedStyle]}>
              <Carousel
                containerStyle={{ height: 360, padding: 0, margin: 0 }}
                containerMarginHorizontal={0}
                pagingEnabled
                itemSpacings={0}
                pageWidth={width}
                pageControlPosition={"over"}
                allowAccessibleLayout
              >
                {[1, 2, 3, 4, 5].map((item) => (
                  <View
                    style={{
                      width: "100%",
                      padding: 0,
                      backgroundColor: "grey",
                    }}
                    key={item}
                  >
                    <AnimatedImage
                      style={{ height: "100%", width: "100%" }}
                      source={dogPhoto}
                      loader={<ActivityIndicator />}
                    />
                  </View>
                ))}
              </Carousel>
            </Animated.View>
            <View
              style={{
                display: "flex",
                backgroundColor: "#fff",
                minHeight: height - IMG_HEIGHT,
                borderRadius: 24,
              }}
            >
              <View style={styles.content}>
                <Text style={styles.title}>Place name {id}</Text>
                <View
                  style={{
                    width: 100,
                  }}
                >
                  <Chip
                    label={"Cafe"}
                    onPress={() => console.log("pressed")}
                    dismissContainerStyle={{ width: 10 }}
                  />
                </View>
                <Text style={styles.description}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Text>
                <View
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 24,
                  }}
                >
                  <Text style={styles.subtitle}>Address</Text>
                  <AddressBlock />
                  <Text style={styles.subtitle}>Opening hours</Text>
                  <OpeningHours />
                  <Text style={styles.subtitle}>Contacts</Text>
                  <ContactsList
                    contacts={{
                      instagram: "grusha229",
                      website: "google.com",
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  width: width,
                  height: 300,
                }}
              >
                <MapBlock
                  initialPosition={{ latitude: 52.52437, longitude: 13.41053 }}
                  zoom={0.05}
                  markers={[{ latitude: 52.52437, longitude: 13.41053 }]}
                />
              </View>
              <View style={{ marginTop: 0 }}>
                <Pressable
                  style={styles.button}
                  onPress={handlePresentModalPress}
                >
                  <Text style={styles.button__text}>Check in</Text>
                </Pressable>
              </View>
            </View>
          </Animated.ScrollView>
        </View>
        <BottomSheetModal
          ref={BottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          style={styles.shadow}
        >
          <View
            style={[
              styles.content,
              {
                display: "flex",
                gap: 8,
                marginTop: 24,
              },
            ]}
          >
            {["cappuccino", "latte", "water", "espresso", "flat white"].map(
              (item, index) => (
                <Product
                  name={item}
                  description={"Lorem ipsum dolor sit amet"}
                  actionFn={() => handleOpenModalRef(index)}
                  key={index}
                />
              )
            )}
          </View>
        </BottomSheetModal>
        <BottomSheetModal
          ref={checkInModalRef}
          index={0}
          snapPoints={modalSnapPoints}
          detached={true}
          bottomInset={height / 3}
          style={[styles.sheetContainer, styles.shadow]}
        >
          <Image style={{ height: 280, width: 280 }} source={qr} />
          <View style={{ marginTop: "auto" }}>
            <Pressable style={styles.modalButton} onPress={handleCloseModalRef}>
              <Text style={styles.text}>Close</Text>
            </Pressable>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
  {
    // <View style={styles.placeContent}>
    //   <Text>Place page! {id}</Text>
    // </View>
  }
}

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "black",
    justifyContent: "center",
  },
  content: {
    marginTop: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 64,
    paddingHorizontal: 32,
    borderRadius: 0,
    elevation: 3,
    backgroundColor: "black",
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    elevation: 3,
    backgroundColor: "black",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 16,
    marginBottom: 4,
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    color: "#aaabab",
  },
  button__text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  sheetContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});
