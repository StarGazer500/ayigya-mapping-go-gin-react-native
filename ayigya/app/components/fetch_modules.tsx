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
  
  

