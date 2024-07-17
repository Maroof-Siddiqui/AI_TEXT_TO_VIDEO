import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View,Image } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../constants'
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';



// remove this: from where you left-------> https://youtu.be/ZBCUegTZF7M?t=4192

export default function App() {

  const {isLoading,isLoggedIn} = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href="/home"/>
  console.log("isloading "+isLoading+" isloggedin "+isLoggedIn );
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{flexGrow:1}}>
      <View className="w-full justify-center items-center min-h-[85vh] px-4">
        <Image
        source={images.logo}
        className="w-[130px] h-[84px]"
        resizeMode='contain'
        />
      
      <Image
      source={images.cards}
      className="max-w-[380px] w-full h-[300px]"
      resizeMode='contain'
      />

      <View className="relative mt-5">
        <Text className="text-3xl text-white fonts-bold text-center">Discover Endless with Possibilities {''}
        <Text className="text-secondary-200">
      Aora
        </Text>
        </Text>

        <Image
        source={images.path}
        className="w-[136px] h-[15px] absolute -bottom-2 -right-1"
        resizeMode='contain'
        />
      </View>

      <Text className="text-sm fonts-pregular text-gray-100 mt-7 text-center">Where creativitiy means innovation: embark on the journey with limitless exploration</Text>
  
      <CustomButton
      title="Continue with Email"
      handlePress={ () =>{
        router.push('/sign-in')
      }}
      containerStyles="w-full mt-7"
      />
</View>
      </ScrollView>
    </SafeAreaView>
  );
}
