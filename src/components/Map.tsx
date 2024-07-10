import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker, MarkerPressEvent, Region } from "react-native-maps";
import React, { useCallback, useEffect, useState } from "react";
import MapService from "../http/MapService";
import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { resetPlaces, setCurrentPlace, setPlaces } from "../store/features/PlacesSlice";
import { IStateInterface } from "../store/store";
import { Image } from "react-native-ui-lib";
const placeIcon = require('../../assets/icons/coffee.png');

type TMapType = 'general' | 'detailed';

type Props = {
  initialPosition?: { latitude: number; longitude: number };
  zoom?: number;
  marker?: { latitude: number; longitude: number };
  type?: TMapType
};

const MapBlock: React.FC<Props> = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const places = useSelector((state: IStateInterface) => state.places.places);
  const currentCity = useSelector((state: IStateInterface) => state.cities.currentCity);

  const { zoom, marker, type = 'general' } = props;

  const { width, height } = Dimensions.get("window");

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = zoom ? zoom : 0.12;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [region, setRegion] = useState<Region>({
    latitude: currentCity?.center?.latitude || 0,
    longitude: currentCity?.center?.longitude || 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const [loading, setLoading] = useState(false);
  const currentFilter = useSelector((state: IStateInterface) => state.places.currentFilter);
  const currentCategory = useSelector((state: IStateInterface) => state.places.currentCategory);

  useEffect(() => {

    if (type === 'detailed') {
      setRegion((prev) => ({
        ...prev,
        latitude: props?.initialPosition?.latitude || 0,
        longitude: props?.initialPosition?.longitude || 0,
      }));

      console.log('coords: ',props?.initialPosition?.latitude, props?.initialPosition?.longitude)
    }

    if (type === 'general' && currentCity?.name && currentCategory?.name && currentFilter) {

      setLoading(true);

      setRegion((prev) => ({
        ...prev,
        latitude: currentCity?.center?.latitude || 0,
        longitude: currentCity?.center?.longitude || 0,
      }));

      MapService.getPlacesByCity(currentCity.name, currentCategory, currentFilter === 'all' ? null : currentFilter)
        .then((res) => res.data)
        .then((data) => {
          dispatch(setPlaces(data));
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            dispatch(resetPlaces());
          }
          console.error('Error fetching places:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [currentCategory, currentFilter, currentCity, type]);

  const handleMarkerClick = useCallback((event: MarkerPressEvent) => {
    const placeId = event.nativeEvent.id;
    if (placeId) {
      dispatch(setCurrentPlace(placeId));
      //@ts-ignore
      navigation.navigate('places/[id]', { id: placeId });
    }
  }, [dispatch, navigation, props?.initialPosition]);

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={region}
        showsMyLocationButton={true}
        showsCompass={true}
        onMarkerPress={type === 'general' ? handleMarkerClick : undefined}
        mapPadding={{ top: 15, right: 15, bottom: 25, left: 15 }}
        onMapReady={() => setRegion(region)}
      >
        {(marker && type === 'detailed') && (
          <Marker
            key={(marker.longitude + marker.latitude).toString()}
            coordinate={marker}
          >
            <Image style={styles.marker} source={placeIcon} />
          </Marker>
        )}
        {places.length > 0 && type === 'general' && places.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.coordinates}
            identifier={place.id}
            onPress={handleMarkerClick}
          >
            <Image style={styles.marker} source={placeIcon} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
    marker: {
    width: 25,
    height: 30
  }
});

export default MapBlock;