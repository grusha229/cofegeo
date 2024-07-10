import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
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
import storage, { firebase } from '@react-native-firebase/storage';
import { useLocalSearchParams } from "expo-router";
import {
  Carousel,
  View,
  AnimatedImage,
  Image,
  Chip,
  Text,
  ScrollBar,
} from "react-native-ui-lib";
import MapBlock from "../../../src/components/Map";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import Product from "../../../src/components/Product";
import ContactsList from "../../../src/components/ContactsList/ContactsList";
import OpeningHours from "../../../src/components/OpeningHours/OpeningHours";
import AddressBlock from "../../../src/components/AddressBlock/AddressBlock";
import { globalStyles, globalTokens } from "../../../src/styles";
import Skeleton from "../../../src/components/Skeleton/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { IStateInterface } from "../../../src/store/store";

const qr = require("../../../assets/qr.png");

const { width, height } = Dimensions.get("window");
const IMG_HEIGHT = 300;

export default function PlacePage() {
  const { id } = useLocalSearchParams();
  const CurrentPlaceInfo = useSelector((state: IStateInterface) => state.places.currentPlace)

  const [imgArray, setImgArray] = useState([])
  // const [placeInfo, setPlaceInfo] = useState<TMapApiResponse>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const dispatch = useDispatch();

  // ref
  const BottomSheetModalRef = useRef<BottomSheetModal>(null);
  const checkInModalRef = useRef<BottomSheetModal>(null);

  const handleOpenModalRef = useCallback((id) => {
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
    // console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    if (CurrentPlaceInfo) {
      setIsLoading(false)
      // console.log(CurrentPlaceInfo.photosUrl)
    }
  },[CurrentPlaceInfo])

  console.log(CurrentPlaceInfo?.coordinates)

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
          <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
            <Animated.View style={[styles.image, imageAnimatedStyle, { height: (CurrentPlaceInfo?.photosUrl?.length === 0 && !isLoading) ? 125 : IMG_HEIGHT}]}>
              <Carousel
                containerStyle={
                  { 
                    height: 360,
                    padding: 0, 
                    margin: 0 }
                }
                containerMarginHorizontal={0}
                pagingEnabled
                itemSpacings={0}
                pageWidth={width}
                pageControlPosition={"over"}
                allowAccessibleLayout
              >
                {
                  (isLoading) &&
                  <AnimatedImage
                      style={{ height: "100%", width: "100%" }}
                      //@ts-ignore
                      loader={<ActivityIndicator />}
                    />
                }
                {
                  (CurrentPlaceInfo?.googleMapsInfo?.photoRef?.length > 0 && !isLoading ) &&
                  CurrentPlaceInfo?.googleMapsInfo?.photoRef?.map((item) => (
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
                          source={{ uri: item }}
                          loader={<ActivityIndicator />}
                        />
                      </View>
                    ))
                }
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
              <View style={[styles.content, { marginTop: 25 }]}>
                <Text style={globalStyles.title}>
                  {!isLoading ? CurrentPlaceInfo?.name : <Skeleton height={38} width={100} />}
                </Text>
              </View>

              <ScrollBar
                contentContainerStyle={{ gap: 10 }}
                contentInset={{ left: 16, right: 16 }}
                contentOffset={{ x: -16, y: 0 }}
              >
                {
                  !isLoading && CurrentPlaceInfo?.labels &&
                    CurrentPlaceInfo?.labels.map((chip) => (
                      <Chip
                        key={chip}
                        label={chip}
                      />
                    ))
                }
                { 
                  isLoading && !CurrentPlaceInfo?.labels &&
                    [1, 2, 3].map((el) => (
                      <Skeleton width={80} height={28} key={el} style={{ marginBottom: 5 }} />
                    ))
                }

              </ScrollBar>
              <View style={[styles.content, { marginBottom: 24 }]}>
                <Text style={styles.description}>
                  {
                    isLoading ?
                      [1, 2, 3, 4].map((el) => (
                        <Skeleton height={17.3} width={300} key={el} />
                      )) :
                      CurrentPlaceInfo?.description && CurrentPlaceInfo?.description
                  }
                </Text>
                <View
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  {
                    (CurrentPlaceInfo?.address) &&
                    <>
                      <Text style={globalStyles.subtitle}>Address</Text>
                      <AddressBlock 
                        address={CurrentPlaceInfo?.address}
                        link={CurrentPlaceInfo?.googleMapsInfo?.locationURL}
                      />
                    </>
                  }
                  {
                    CurrentPlaceInfo?.googleMapsInfo?.openingInfo && 
                      <View>
                        <Text style={globalStyles.subtitle}>Opening hours</Text>
                        <OpeningHours openingHours={CurrentPlaceInfo?.googleMapsInfo?.openingInfo} />
                      </View>
                  }
                  {
                    (CurrentPlaceInfo?.instagram || CurrentPlaceInfo?.website) &&
                    <View>
                      <Text style={globalStyles.subtitle}>Contacts</Text>
                      <ContactsList
                        contacts={{
                          instagram: CurrentPlaceInfo?.instagram && CurrentPlaceInfo.instagram,
                          website: CurrentPlaceInfo?.website.length > 0 ? CurrentPlaceInfo.website : CurrentPlaceInfo.googleMapsInfo.website
                        }}
                      />
                    </View>
                  }
                </View>
              </View>
              <View
                style={{
                  width: width,
                  height: 300,
                }}
              >
                <MapBlock
                  initialPosition={{ latitude: CurrentPlaceInfo?.coordinates.latitude, longitude: CurrentPlaceInfo?.coordinates.longitude }}
                  zoom={0.005}
                  marker={{ latitude: CurrentPlaceInfo?.coordinates.latitude, longitude: CurrentPlaceInfo?.coordinates.longitude }}
                  type={"detailed"}
                />
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
              <Text style={styles.button__text}>Close</Text>
            </Pressable>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider >
    </GestureHandlerRootView >
  );
}

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: globalTokens.colors.black,
    justifyContent: "center",
  },
  content: {
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
    backgroundColor: globalTokens.colors.black,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    elevation: 3,
    backgroundColor: globalTokens.colors.black,
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    color: globalTokens.colors.darkGrey,
  },
  button__text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: globalTokens.colors.white,
  },
  sheetContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  shadow: {
    shadowColor: globalTokens.colors.black,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});
