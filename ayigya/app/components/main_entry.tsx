import { Text, View, TouchableOpacity, useWindowDimensions } from "react-native";
import { useState, useEffect,useRef } from "react";
import MapComponent from "./map";
import SideBar from "./sidebar";

export default function EntryComponent() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const mapRef = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [isResultVisible,setIsResultVisible] = useState(false)
  const [totalQueries,setTotalQueries] = useState('')
  
  // Determine if we're on mobile based on screen width
  const isMobile = screenWidth < 768; // Standard tablet breakpoint
  
  // Hide sidebar on initial mount for mobile, show for desktop
  useEffect(() => {
    setSidebarVisible(!isMobile);
  }, [isMobile]);

  // Constants for layout
  const SIDEBAR_WIDTH = isMobile ? '75%' : '25%';
  
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View className="flex flex-row relative h-full w-full">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarVisible && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50 z-20"
          onPress={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      {isSidebarVisible && (
        <View
          className={`h-full bg-white z-30 shadow-lg ${
            isMobile
              ? 'absolute left-0 w-[75%]'
              : 'relative w-1/4'
          }`}
        >
          {/* Close Button */}
          <View className="absolute top-5 right-3 z-40">
            <TouchableOpacity
              onPress={toggleSidebar}
              className="p-2 bg-white rounded shadow-md"
            >
              <Text className="text-xl font-bold">×</Text>
            </TouchableOpacity>
          </View>
          <SideBar mapRef={mapRef} setIsResultVisible ={setIsResultVisible} setTotalQueries = {setTotalQueries} setMarkers ={setMarkers}/>
        </View>
      )}

      {/* Map Container */}
      <View
        className={`h-full ${
          isSidebarVisible && !isMobile ? 'w-3/4' : 'w-full'
        }`}
      >
        <MapComponent markers = {markers} setIsResultVisible ={setIsResultVisible} setTotalQueries = {setTotalQueries} setMarkers ={setMarkers} isResultVisible = {isResultVisible} totalQueries ={totalQueries} mapRef = {mapRef}/>
        
        {/* Menu Button - Only visible when sidebar is closed */}
        {!isSidebarVisible && (
          <TouchableOpacity
            onPress={toggleSidebar}
            className="absolute top-5 left-5 p-2 bg-white rounded shadow-md z-10"
          >
            <Text className="text-xl">☰</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}