
import { Region } from 'react-native-maps';

export async function FetchFeatureLayers(baseurl) {
    try {
      // Send the fetch request
      const response = await fetch(`${baseurl}/map/featurelayers`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        console.log('Error: ', response.status);
        throw new Error('Network response was not ok');
      }
  
      // Parse the response as JSON
      const response_data = await response.json();
      console.log("returned data", response_data.data);
  
      // Process the new layers
      const newLayers = Object.values(response_data.data);
     
      return newLayers
      console.log("layers3", newLayers);
  
    } catch (error) {
      // Handle any errors that occur during the fetch or response parsing
      console.error('Unknown error occurred:', error.message);
    }
  }



  export async function GetAttributeNames(layer, baseurl) {
    try {
      // Make the POST request
      const response = await fetch(`${baseurl}/map/featureattributes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedLayer: layer }), // Send searchLayer in the body
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        console.log('Error: ', response.status);
        throw new Error('Network response was not ok');
      }
  
      // Parse the response as JSON
      const response_data = await response.json();
      
      // Process the returned data
      const newattributes = Object.values(response_data.data);
      return newattributes
      
      console.log("attributes", response_data.data);
  
    } catch (error) {
      // Handle any errors that occur during the fetch or response parsing
      console.log('Unknown error occurred:', error.message);
    }
  }
  

  export async function SetOperations(attribute,selectedFeatureLayer,baseurl) {
    try {
      // Send the POST request
      const response = await fetch(`${baseurl}/map/featureoperatures`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedAttribute: attribute, selectedLayer: selectedFeatureLayer }) // Send selected attributes and layer in the body
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        console.log(response.status);
        throw new Error('Network response was not ok');
      }
  
      // Parse the response as JSON
      const response_data = await response.json();
      console.log("operators", response_data.data);
  
      // Process the new layers
      const newOperators = Object.values(response_data.data);
      return newOperators
  
    } catch (error) {
      // Handle any errors that occur during the fetch or response parsing
      console.log('Unknown error occurred:', error.message);
    }
  }
  


  export async function getAllData(path,baseurl) {
    try {
      // Fetch GeoJSON data from the server
      const response = await fetch(`${baseurl}/map/${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}) // Send selectedLayer in the body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // let data = await response.json();
      const responseJson = await response.json();
    
      // Validate that we have data property
      if (!responseJson || !responseJson.data) {
        console.warn("Response missing data property:", responseJson);
        return [];
      }
  
      const data = responseJson.data;
  
      // Log the length only if data is an array
      if (Array.isArray(data)) {
        // console.log("length", data.length);
        
      } else {
        console.warn("Data is not an array:", typeof data);
      }
          
  
      return data

    } catch (error) {
      console.error("Errohhr fetching GeoJSON data:", error);
      return []; // Return an empty array in case of error
    } finally {
      console.log("Map projection:", 'EPSG:3857'); // Leaflet uses Web Mercator by default
    }
  }
  


 export  async function getDataByFeatureLayer(path,baseurl,featurelayer) {
    try {
      // Fetch GeoJSON data from the server
      const response = await fetch(`${baseurl}/map/${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({selectedLayer:featurelayer}) // Send selectedLayer in the body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // let data = await response.json();
      const responseJson = await response.json();
    
      // Validate that we have data property
      if (!responseJson || !responseJson.data) {
        console.warn("Response missing data property:", responseJson);
        return [];
      }
  
      const data = responseJson.data;
  
      // Log the length only if data is an array
      if (Array.isArray(data)) {
        // console.log("length", data.length);
        
      } else {
        console.warn("Data is not an array:", typeof data);
      }
          
  
      return data

    } catch (error) {
      console.error("Errohhr fetching GeoJSON data:", error);
      return []; // Return an empty array in case of error
    } finally {
      console.log("Map projection:", 'EPSG:3857'); // Leaflet uses Web Mercator by default
    }
  }


  export  async function getDataByFeatureLayerAndAtrribute(path,baseurl,featurelayer,attribute) {
    try {
      // Fetch GeoJSON data from the server
      const response = await fetch(`${baseurl}/map/${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({selectedLayer:featurelayer,selectedAttribute:attribute}) // Send selectedLayer in the body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // let data = await response.json();
      const responseJson = await response.json();
    
      // Validate that we have data property
      if (!responseJson || !responseJson.data) {
        console.warn("Response missing data property:", responseJson);
        return [];
      }
  
      const data = responseJson.data;
  
      // Log the length only if data is an array
      if (Array.isArray(data)) {
        // console.log("length", data.length);
        
      } else {
        console.warn("Data is not an array:", typeof data);
      }
          
  
      return data

    } catch (error) {
      console.error("Errohhr fetching GeoJSON data:", error);
      return []; // Return an empty array in case of error
    } finally {
      console.log("Map projection:", 'EPSG:3857'); // Leaflet uses Web Mercator by default
    }
  }
  

  export  async function getDataBySpecificValue(path,baseurl,featurelayer,attribute,operator,searchvalue) {
    try {
      // Fetch GeoJSON data from the server
      const response = await fetch(`${baseurl}/map/${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({selectedLayer:featurelayer,selectedAttribute:attribute,selectedOperator:operator,searchValue:searchvalue}) // Send selectedLayer in the body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // let data = await response.json();
      const responseJson = await response.json();
    
      // Validate that we have data property
      if (!responseJson || !responseJson.data) {
        console.warn("Response missing data property:", responseJson);
        return [];
      }
  
      const data = responseJson.data;
  
      // Log the length only if data is an array
      if (Array.isArray(data)) {
        // console.log("length", data.length);
        
      } else {
        console.warn("Data is not an array:", typeof data);
      }
          
  
      return data

    } catch (error) {
      console.error("Errohhr fetching GeoJSON data:", error);
      return []; // Return an empty array in case of error
    } finally {
      console.log("Map projection:", 'EPSG:3857'); // Leaflet uses Web Mercator by default
    }
  }
  


  export  async function simpleSearch(path,baseurl,searchvalue) {
    try {
      // Fetch GeoJSON data from the server
      const response = await fetch(`${baseurl}/map/${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({searchValue:searchvalue}) // Send selectedLayer in the body
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // let data = await response.json();
      const responseJson = await response.json();
    
      // Validate that we have data property
      if (!responseJson || !responseJson.data) {
        console.warn("Response missing data property:", responseJson);
        return [];
      }
  
      const data = responseJson.data;
  
      // Log the length only if data is an array
      if (Array.isArray(data)) {
        // console.log("length", data.length);
        
      } else {
        console.warn("Data is not an array:", typeof data);
      }
          
  
      return data

    } catch (error) {
      console.error("Errohhr fetching GeoJSON data:", error);
      return []; // Return an empty array in case of error
    } finally {
      console.log("Map projection:", 'EPSG:3857'); // Leaflet uses Web Mercator by default
    }
  }
  
  

interface GeoJsonFeature {
  geom: any;
  TableName?: string;
  [key: string]: any;
}

export async function PrepareAllData(mapRef: any,serverdata){

  try{
 

    let responseData = serverdata
    const data: GeoJsonFeature[] = responseData;


    const totalQueries = data.length

 
    const markers = await convertGeoJSONToMarkers(data)

    flyToRegion(markers,mapRef)

    return {markers,totalQueries};

  } catch (error) {
    console.error("Errhhor fetching GeoJSON data:", error);
    return [];
  }
};






async function flyToRegion(markers,mapInstance){
   // Calculate bounds for the map
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

    // Animate to the region
    mapInstance.current?.animateToRegion(region, 1000);
  }
}

async function convertGeoJSONToMarkers(data) {
  const markers = [];

  const formatKey = (key: string): string => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatValue = (key: string, value: any): any => {
    const formatMap: Record<string, any> = {
      'shape__len': `${value} meters`,
      'shape__are': `${value} sq meters`,
      'creationda': value ? new Date(value).toLocaleDateString() : value
    };
    return formatMap[key] || value;
  };
  
  for (let index = 0; index < data.length; index++) {
    const item = data[index];

    // Skip if geometry is missing
    if (!item.geom || !item.geom.coordinates) {
      console.warn("Missing geometry data for item:", item);
      continue;
    }

    let coordinates;
    
    // Extract coordinates based on geometry type
    if (item.geom.type.toLowerCase() === 'point') {
      coordinates = [{
        latitude: item.geom.coordinates[1],
        longitude: item.geom.coordinates[0]
      }];
    } else if (item.geom.type.toLowerCase() === 'linestring') {
      coordinates = item.geom.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0]
      }));
    } else if (item.geom.type.toLowerCase() === 'polygon') {
      coordinates = item.geom.coordinates[0].map(coord => ({
        latitude: coord[1],
        longitude: coord[0]
      }));
    } else if (item.geom.type.toLowerCase() === 'multipolygon') {
      coordinates = item.geom.coordinates.flatMap(polygon =>
        polygon[0].map(coord => ({
          latitude: coord[1],
          longitude: coord[0]
        }))
      );
    } else {
      console.warn(`Unsupported geometry type: ${item.geom.type}`);
      continue;
    }

    // Create popup content
    let description = '';
    for (const [key, value] of Object.entries(item)) {
      if (key !== 'geom' && value != null && value !== '') {
        description += `${formatKey(key)}: ${formatValue(key, value)}\n`;
      }
    }

    markers.push({
      coordinates,
      type: item.geom.type.toLowerCase(),
      title: item.TableName || `Feature ${index + 1}`,
      description: description.trim(),
      id: index.toString(),
    });
  }

  // console.log("retrieved markers", markers);
  return markers;
}
