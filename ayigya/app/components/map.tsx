import { View, Text, TouchableOpacity, StyleSheet, TextInput,Dimensions,Modal } from 'react-native';
import MapView, { PROVIDER_GOOGLE, UrlTile,Marker, Polygon, Polyline, Callout,Region } from 'react-native-maps';
import React, { useState, useEffect,useRef } from 'react';
import {simpleSearch,PrepareAllData} from './fetch_modules'


export default function MapComponent({mapRef,isResultVisible,setMarkers,setTotalQueries,setIsResultVisible,totalQueries,markers=[]}) {
  const [queryValue, setQueryValue] = useState('');
  const [region, setRegion] = useState({});
  const [selectedPolygon, setSelectedPolygon] = useState({}); 
  const [modalVisible, setModalVisible] = useState(false);

  const MIN_ZOOM_LEVEL = 3;
  const MAX_ZOOM_LEVEL = 20;
  const [zoom, setZoom] = useState(14);

  const { width, height } = Dimensions.get('window');
  
 
  
  const serverbaseurl = 'http://192.168.126.214:8080';
 
  

  const handleSubmit = async() => {
    const cleanedvalue = queryValue.trim()
    const backenddata = await simpleSearch("simplesearch",serverbaseurl,cleanedvalue)

     const {markers,totalQueries} = await PrepareAllData(mapRef,backenddata)
    setTotalQueries(`${totalQueries} total results obtained`)
    setMarkers(markers)
    setIsResultVisible (true)
   

  
  };

 

  // Unified zoom function for both zoom-in and zoom-out
  const handleZoom = (isZoomIn = false) => {
    let currentZoomLevel = zoom;
    if (isZoomIn && currentZoomLevel < MAX_ZOOM_LEVEL) {
      currentZoomLevel += 1;
    } else if (!isZoomIn && currentZoomLevel > MIN_ZOOM_LEVEL) {
      currentZoomLevel -= 1;
    }

    // Update region based on the new zoom level
    const [longitudeDelta, latitudeDelta] = getLatLongDelta(currentZoomLevel, region.latitude);
    const updatedRegion = {
      ...region,
      latitudeDelta,
      longitudeDelta,
    };

    setRegion(updatedRegion);
    setZoom(currentZoomLevel);
    mapRef?.current?.animateToRegion(updatedRegion, 200); // Smooth zoom transition
  };

  const handlePolygonPress = (feature) => {
    const center = getPolygonCenter(feature.coordinates);
    setSelectedPolygon({
      coordinates: feature.coordinates,
      title: feature.title,
      description: feature.description,
      center: center,
    });
    setModalVisible(true);  // Show modal with polygon details
  };


  // const handleRegionChangeComplete = (newRegion) => {
  //   setRegion(newRegion); // Update region on map pan or zoom
  // };

  // Function to calculate the screen position of the popup relative to the current map region


  useEffect(()=>{
    function handleRegion(){
         if (markers.length > 0) {
             const allCoords = markers.flatMap(marker => marker!.coordinates);
             const minLat = Math.min(...allCoords.map(coord => coord.latitude));
             const maxLat = Math.max(...allCoords.map(coord => coord.latitude));
             const minLng = Math.min(...allCoords.map(coord => coord.longitude));
             const maxLng = Math.max(...allCoords.map(coord => coord.longitude));
         
             const region: Region = {
               latitude: (minLat + maxLat) / 2,
               longitude: (minLng + maxLng) / 2,
               latitudeDelta: (maxLat - minLat) * 1.1,
               longitudeDelta: (maxLng - minLng) * 1.1,
             };

             setRegion(region)
             setZoom(getZoomLevel(region.latitudeDelta))
         
             // Animate to the region
            //  mapInstance.current?.animateToRegion(region, 1000);
           }
    }
    handleRegion()
  },[markers])


  function renderFeature(feature, index) {
    const uniqueKey = `${feature.id}-${feature.title}-${index}`;
    // console.log("Rendering feature:", feature.type, feature.coordinates);
  
  
    if (!feature.coordinates || feature.coordinates.length === 0) return null;  // Skip invalid features
  
  
  
    switch (feature.type) {
      case 'point':
        return (
          <Marker
            key={uniqueKey}
            coordinate={feature.coordinates[0]}  // Assuming single point
            title={feature.title}
            description={feature.description}
          />
        );
      case 'linestring':
        return (
          <Polyline
            key={uniqueKey}
            coordinates={feature.coordinates}
            strokeColor="red"
            strokeWidth={2}
          >
            <Callout>
              <View>
                <Text>{feature.title}</Text>
                <Text>{feature.description}</Text>
              </View>
            </Callout>
          </Polyline>
        );
      case 'polygon':
        return (
          
          <Polygon
            key={uniqueKey}
            coordinates={feature.coordinates}
            strokeColor="red"
            fillColor="rgba(255,0,0,0.2)"
            strokeWidth={2}
            tappable = {true}
            onPress={() => handlePolygonPress(feature)}
          >
            <Callout>
              <View>
                <Text>{feature.title}</Text>
                <Text>{feature.description}</Text>
              </View>
            </Callout>
          </Polygon>
        );
      case 'multipolygon':
        console.log(feature.description)
        return (
          
          <Polygon
            key={uniqueKey}
            coordinates={feature.coordinates}
            strokeColor="red"
            fillColor="rgba(255,0,0,0.2)"
            strokeWidth={2}
            tappable = {true}
            onPress={() => handlePolygonPress(feature)}
          >
            {/* <Callout>
              <View>
                <Text>{feature.title}</Text>
                <Text>{feature.description}</Text>
              </View>
            </Callout> */}
          </Polygon>
          
        );
      default:
        return null;
    }
  }
  

 

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        
        initialRegion={{
          latitude: 6.19293,
          longitude: -1.3342,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
       mapType={"hybrid"}
   
       
      >

    {markers.length!==0?markers.map((feature,index) => renderFeature(feature,index)):null}

    
      </MapView>

      {/* Custom Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={() => handleZoom(true)}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={() => handleZoom(false)}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      

      <TextInput style={styles.input1}  onSubmitEditing={handleSubmit} value={queryValue} onChangeText={(text) => setQueryValue(text)} placeholder="SimpleSearch" />
      {isResultVisible?<TextInput style={styles.input2}  editable={false}  value={totalQueries} placeholder="" />:null}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>"Feature Properties"</Text>
            <Text style={styles.modalDescription}>{selectedPolygon?.description}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  input1: {
    height: 40, // Height of the input field
    borderColor: 'gray', // Border color
    borderWidth: 1, // Border width
    marginTop: 15, // Space between inputs
    paddingLeft: 10, // Padding inside the input
    position: 'absolute',
    zIndex: 1 ,
    right:3,
    backgroundColor:"white",
    borderRadius:5
    
  },

  input2: {
    height: 40, // Height of the input field
    borderColor: 'gray', // Border color
    borderWidth: 1, // Border width
    marginTop: 15, // Space between inputs
    paddingLeft: 10, // Padding inside the input
    position: 'absolute',
    zIndex: 1 ,
    bottom:3,
    left:3,
    backgroundColor:"lightblue",
    borderRadius:5
    
  },
  zoomControls: {
    position: 'absolute',
    top: 80,
    left: 18,
    zIndex: 10,
    flexDirection: 'column',
  },
  zoomButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    // borderRadius: 25,
    // marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',  // Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
    textDecorationLine:"underline"
  },
  modalDescription: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'left',
  },
  modalCloseButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  modalCloseText: {
    color: 'white',
    fontWeight: 'bold',
  },
});






const getZoomLevel = (latitudeDelta) => {
  const zoomLevel = Math.log2(360 / latitudeDelta); // Simple zoom level calculation
  return zoomLevel;
};

const getLatLongDelta = (zoom, latitude) => {
  const LONGITUDE_DELTA = Math.exp(Math.log(360) - zoom * Math.LN2);
  const ONE_LATITUDE_DEGREE_IN_METERS = 111.32 * 1000;
  const accurateRegion =
    LONGITUDE_DELTA * (ONE_LATITUDE_DEGREE_IN_METERS * Math.cos(latitude * (Math.PI / 180)));
  const LATITUDE_DELTA = accurateRegion / ONE_LATITUDE_DEGREE_IN_METERS;

  return [LONGITUDE_DELTA, LATITUDE_DELTA];
};


const getPolygonCenter = (coordinates) => {
  let latSum = 0;
  let lngSum = 0;
  coordinates.forEach(coord => {
    latSum += coord.latitude;
    lngSum += coord.longitude;
  });
  const centerLat = latSum / coordinates.length;
  const centerLng = lngSum / coordinates.length;
  return { latitude: centerLat, longitude: centerLng };
};
