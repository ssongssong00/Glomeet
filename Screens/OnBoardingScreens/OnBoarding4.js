import React from "react";
import {View, Text, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnBoarding4 = ({navigation}) => {

  
  return (
  <View>
    <TouchableOpacity
      onPress={() => navigation.reset({
        index: 0,
        routes: [{ name: 'Root' }]
      })}>
      <Text>시작하기</Text>
    </TouchableOpacity>
    
  </View>

  )
};
export default OnBoarding4;