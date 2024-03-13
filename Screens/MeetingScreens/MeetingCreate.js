import React, { useState } from "react";
import {View, Text, TouchableOpacity, TextInput, FlatList, Alert} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "../../api";
import { useWebSocket } from '../../WebSocketProvider'
import EventEmitter from "react-native-eventemitter";

const MeetingCreate = ({navigation}) => {
  const [url, setUrl] = useState('')
  const [capacity, setCapacity] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const keyword = ['운동', '여행', '게임', '문화', '음식', '언어']
  const {subscribe, publish} = useWebSocket();

  const createMeeting = async() => {
    // console.log(url, capacity, title, description, location, category)
    try{
      const email = await AsyncStorage.getItem('email')
      const response = await authApi.post('/meeting/create', { url: url, title: title, comment: description, capacity: capacity, location: location, meetingDate: date, category: category})
    if (response.status == 200) {
      console.log(response.data.id)
      console.log('@@@@')
      subscribe("/sub/chat/"+response.data.id, (message) => {
        handleWebSocketMessage(message)
      })
      publish("/pub/chat/"+ response.data.id, "application/json", email, response.data.id,"생성메세지인데 서버에서 할거임", "CREATE")
      Alert.alert('모임이 생성되었습니다')
      navigation.reset({
        index: 0,
        routes: [{ name: 'MeetingMain' }]
      });
    }
    } catch (error) {
      console.log(error)
      if (error.response.status == 401) {
        console.log(error, '왜 오류?')
      };
      if (error.response.status == 400) {
       console.log(error, '무슨 오류')
      }
    };
  };

  const handleWebSocketMessage = (message) => {
    // 메시지 이벤트를 발생시키는 메서드
    EventEmitter.emit("newMessage", message);
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        onPress={() => setCategory(item)}>
        <Text>{item}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View>
      <Text>사진url</Text>
      <TextInput
        value={url}
        onChangeText={setUrl}/>
      <Text>모임 이름</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}/>
      <Text>모임 소개</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}/>
      <Text>참여 인원 수</Text>
      <TextInput
        value={capacity}
        onChangeText={setCapacity}/>
      <Text>키워드 선택</Text>
      <FlatList
        data={keyword}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <Text>날짜 선택</Text>
      <TextInput
        value={date}
        onChangeText={setDate}/>
      <Text>장소 선택</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}/>
      <TouchableOpacity
        onPress={createMeeting}>
        <Text>생성하기</Text>
      </TouchableOpacity>
    </View>
  )
};

export default MeetingCreate;
