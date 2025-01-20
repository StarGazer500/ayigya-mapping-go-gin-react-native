import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { FetchFeatureLayers, GetAttributeNames,SetOperations,PrepareAllData,getAllData,getDataByFeatureLayer,getDataByFeatureLayerAndAtrribute,getDataBySpecificValue } from './fetch_modules';

export default function SideBar({mapRef,setMarkers,setTotalQueries,setIsResultVisible }) {
  // State for selected values
  const [selectedFeature, setSelectedFeature] = useState('All Feature Layers');
  const [selectedAttribute, setSelectedAttribute] = useState('None');
  const [selectedOperator, setSelectedOperator] = useState('None');
  const [queryValue, setQueryValue] = useState('');
  const [featureLayers, setFeatureLayers] = useState(['All Feature Layers']);
  const [attributeLayers, setAttributeLayers] = useState(['None']);
  const [operatorLayers, setOperatorLayers] = useState(['None']);

  const serverbaseurl = 'http://192.168.126.214:8080';

  // State for dropdown visibility
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Function to toggle dropdown visibility
  const toggleDropdown = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Render a single dropdown
  const renderDropdown = (title, options, selectedValue, onSelect) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-600 mb-1">{title}</Text>
      <TouchableOpacity
        onPress={() => toggleDropdown(title)}
        className="border border-gray-300 rounded-md p-2 bg-white"
      >
        <Text className="text-gray-800">
          {selectedValue}

        </Text>
      </TouchableOpacity>

      {/* Dropdown options */}
      {activeDropdown === title && (
        <View className="border border-gray-200 rounded-md mt-1 bg-white absolute w-full z-10 shadow-lg">
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onSelect(option);
                setActiveDropdown(null);
              }}
              className={`p-3 border-b border-gray-100 ${
                index === options.length - 1 ? 'border-b-0' : ''
              } ${selectedValue === option ? 'bg-blue-50' : ''}`}
            >
              <Text className={`${
                selectedValue === option ? 'text-blue-600' : 'text-gray-800'
              }`}>
                {option}
              </Text>
               
               

            </TouchableOpacity>


            
          ))}
        </View>
      )}
    </View>
  );

  // Fetch feature layers on initial render
  useEffect(() => {
    async function fetchFeatures() {
      const featurelayers = await FetchFeatureLayers(serverbaseurl);
      setFeatureLayers(prevLayers => [...prevLayers, ...featurelayers]);
    }
    fetchFeatures();
  }, []); // Empty dependency array to run once when the component mounts

  // Fetch attribute layers based on selected feature
  useEffect(() => {
    if (selectedFeature !== 'All Feature Layers') {
      async function fetchAttributes() {
        // Clear previous attributes before fetching new ones
        setAttributeLayers(['None']);
        const featureattributes = await GetAttributeNames(selectedFeature, serverbaseurl);
        setAttributeLayers(prevAttributes => ['None', ...featureattributes]); // Adding 'None' as the first option
      }
      fetchAttributes();
    }
  }, [selectedFeature]); // Runs when selectedFeature changes

  useEffect(() => {
    if (selectedAttribute !== 'None') {
      async function fetchOperators() {
        // Clear previous attributes before fetching new ones
        setOperatorLayers(['None']);
        const featureoperators = await SetOperations(selectedAttribute,selectedFeature, serverbaseurl);
        setOperatorLayers(prevOperators => ['None', ...featureoperators]); // Adding 'None' as the first option
      }
      fetchOperators();
    }
  }, [selectedAttribute]); // Runs when selectedFeature changes

  const handleSubmit =  async() => {
    if (selectedFeature==='All Feature Layers' ){
      if (selectedAttribute ==='None' && selectedOperator==='None' && queryValue===''){
        const backenddata = await getAllData("searchallfeaturelayersdata",serverbaseurl)
        const {markers,totalQueries} = await PrepareAllData(mapRef,backenddata)
        setTotalQueries(`${totalQueries} total results obtained`)
        setMarkers(markers)
       setIsResultVisible (true)
      }else{
        console.log("Selecting All Feature Layers requres other entries to be empty")
      }
    }
    else if(selectedFeature!=='All Feature Layers'){
        if (selectedAttribute ==='None' && selectedOperator==='None' && queryValue===''){
          const backenddata = await getDataByFeatureLayer("searchbyfeaturelayer",serverbaseurl,selectedFeature)
          const {markers,totalQueries} = await PrepareAllData(mapRef,backenddata)
          setTotalQueries(`${totalQueries} total results obtained`)
          setMarkers(markers)
          setIsResultVisible (true)
         
          // console.log("seach for a specific layer")
        }else if (selectedAttribute !=='None' && selectedOperator==='None' && queryValue===''){
          const backenddata = await getDataByFeatureLayerAndAtrribute("searchbycolumn",serverbaseurl,selectedFeature,selectedAttribute)
          const {markers,totalQueries} = await PrepareAllData(mapRef,backenddata)
          setTotalQueries(`${totalQueries} total results obtained`)
          setMarkers(markers)
          setIsResultVisible (true)
          // console.log("search for a specific attribute in layer")
        } else if( selectedAttribute !=='None' && selectedOperator!=='None' && queryValue!==''){
          const backenddata = await getDataBySpecificValue("makeqquery",serverbaseurl,selectedFeature,selectedAttribute,selectedOperator,queryValue)
          const {markers,totalQueries} = await PrepareAllData(mapRef,backenddata)
          setTotalQueries(`${totalQueries} total results obtained`)
          setMarkers(markers)
          setIsResultVisible (true)
        // Handling Unaccepted queries
        }else if (selectedAttribute !=='None' && selectedOperator!=='None' && queryValue===''){
          console.log("The selected parameters require you to enter search value")
        }else if (selectedAttribute !=='None' && selectedOperator!=='None' && queryValue===''){
          console.log("The selected parameters require you to enter search value")
        }else if (selectedAttribute !=='None' && selectedOperator==='None' && queryValue!==''){
          console.log("The selected parameters require you to choose an operation type")
        }else if (selectedAttribute ==='None' && selectedOperator!=='None' && queryValue!==''){
          console.log("The selected parameters require you to choose an attribute")
        }else{
          console.log("unhandled query Your parameters may be wrong, correct them")
        }
      
    }else{
      console.log("Something went wrong")
    }
   
  }

  

  return (
    <View className="p-4 relative">
      {/* Feature Layers Dropdown */}
      {renderDropdown(
        'Feature Layers',
        featureLayers,
        selectedFeature,
        setSelectedFeature
      )}

      {/* Attribute Layers Dropdown */}
      {renderDropdown(
        'Attribute Layers',
        attributeLayers,
        selectedAttribute,
        setSelectedAttribute
      )}

      {/* Operator Layers Dropdown */}
      {renderDropdown(
        'Operator',
        operatorLayers,
        selectedOperator,
        setSelectedOperator
      )}

      <TextInput style={styles.input} value={queryValue} onChangeText={(text) => setQueryValue(text)} placeholder="Enter Query Value" />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // Align children (TextInput) in a column
    padding: 20, // Optional padding around the container
  },
  input: {
    height: 40, // Height of the input field
    borderColor: 'gray', // Border color
    borderWidth: 1, // Border width
    marginBottom: 10, // Space between inputs
    paddingLeft: 10, // Padding inside the input
  },
  button: {
    backgroundColor: '#007BFF', // Blue button color
    padding: 12, // Padding inside the button
    borderRadius: 5, // Rounded corners
    marginTop: 20, // Add space between the button and input
    alignItems: 'center', // Center text inside the button
  },
  buttonText: {
    color: 'white', // White text color
    fontSize: 16, // Font size of the button text
    fontWeight: 'bold', // Bold text
  },
 
});
