import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

interface Orphanage {
  id: number,
  name: string,
  latitude: number,
  longitude: number
}

export default function OrphanagesMap() {
    const navigation = useNavigation();
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useFocusEffect(()=> {
      api.get('orphanages').then(response => {
        setOrphanages(response.data);
      })
    });

    function handlerNavigationToDetails(id: number) {
      navigation.navigate('OrphanagesDetails', { id });
    }

    function handleNavigationToCreateOrphanage() {
      navigation.navigate('SelectMapPosition')
    }

    return (
        <View style={styles.container}>
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={styles.map} 
                initialRegion={{
                latitude: -20.2845958,
                longitude: -50.5446169,
                latitudeDelta: 0.02,
                longitudeDelta: 0.05
                }}
            >
              {orphanages.map(orphanage => {
                return (
                  <Marker 
                    key={orphanage.id}
                    icon={mapMarker}
                    calloutAnchor={{
                        x: 2.9,
                        y: 0.9,
                    }}
                    coordinate={{
                        latitude: orphanage.latitude,
                        longitude: orphanage.longitude,
                    }}
                    >
                    <Callout 
                      tooltip={true} 
                      onPress={() => handlerNavigationToDetails(orphanage.id)}>
                        <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                        </View>
                    </Callout>
                  </Marker>
                );
              })}
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

                <TouchableOpacity 
                    style={styles.createOrphanageButton}
                    onPress={handleNavigationToCreateOrphanage}
                >
                    <Feather name='plus' size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
    calloutText: {
      color: '#0089a5',
      fontFamily: 'Nunito_700Bold',
      fontSize: 14,
    },
    footer: {
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: '#fff',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  
      elevation: 3
    },
    footerText: {
      fontFamily: 'Nunito_700Bold',
      color: '#8fa7b3',
    },
    createOrphanageButton: {
      width: 56,
      height: 56,
      borderRadius: 20,
      backgroundColor: "#15c3d6",
  
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  