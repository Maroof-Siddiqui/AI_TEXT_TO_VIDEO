import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from "react";
import FormField from "../../components/FormField";
import { Video, ResizeMode } from "expo-av";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";
import { createVideoPost } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const Create = () => {

  const {user} = useGlobalContext();
  const openpicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/jpg','image/png','image/jpeg'] : ['video/mp4','video/gif']
    });

    if (!result.canceled) {
      if (selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === 'video') {
        setForm({ ...form, video: result.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      Alert.alert("Please fill all fields");
    }

    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };

  const clearVideo = () => {
    setForm({ ...form, video: null });
  };

  const clearThumbnail = () => {
    setForm({ ...form, thumbnail: null });
  };

  const [uploading, setUploading] = useState(false);
  const [text, setText] = useState("");

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [form, setForm] = useState({
    title: "",
    video: video,
    thumbnail: thumbnail,
    prompt: "",
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give a catchy title"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
            <TouchableOpacity onPress={clearVideo}>
              <Text className="text-1xl text-white font-psemibold">Clear</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => openpicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
                />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
        <View className="flex-row justify-between">
          <Text className="text-base text-gray-100 font-pmedium">Thumbnail Image</Text>
          <TouchableOpacity onPress={clearThumbnail}>
            <Text className="text-1xl text-white font-psemibold">Clear</Text>
          </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => openpicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
                alt="upload"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI PROMPT"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
