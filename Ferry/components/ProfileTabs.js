import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ProfileTabs = ({ tabs, initalTab, onChange }) => {
    const [activeTab, setActiveTab] = useState(initalTab);

    const handleTabChange = (tabIndex) => {
        setActiveTab(tabIndex);
        onChange(tabIndex);
    }

    return (
        // Displays the tabs and the button to switch between tabs
        <View style={proTabStyle.tabContainer}>
            {tabs.map((tab, index) => (
                <TouchableOpacity key={index} style={proTabStyle.tabButton} onPress={() => handleTabChange(index)}>
                    <Text style={proTabStyle.tabButtonText}>{tab}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}



const proTabStyle = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
      },
      tabButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
      },
      activeTabButton: {
        backgroundColor: '#2196F3',
      },
      tabButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
      },
})

export default ProfileTabs;