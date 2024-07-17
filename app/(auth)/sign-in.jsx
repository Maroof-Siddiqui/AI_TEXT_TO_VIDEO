import { View, Text, ScrollView,Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link,router } from 'expo-router';
import { getCurrentUser, signIn } from '../../lib/appwrite';
import { Alert } from 'react-native';
import { useGlobalContext } from '../../context/GlobalProvider';
import GlobalProvider from '../../context/GlobalProvider';


const SignIn = () => {

  const [form,setForm] = useState({
    email:'',
    password:'',
  })

  const [isSubmitting,setIsSubmitting] = useState(false);

  const submit = async () =>{

    if(form.email==="" || form.password==="")
      Alert.alert("Error","Enter all fields");
  
      setIsSubmitting(true);

    try {
      await signIn(form.email,form.password);
      const result = await getCurrentUser();
      const {setUser,setIsLoggedIn} = useGlobalContext();
      setUser(result);
      setIsLoggedIn(true);

      Alert.alert("Success","User signed in Successfully");
      router.replace('/home')

    } catch (error) {
      Alert.alert('Error',error.message)
    } finally{
      setIsSubmitting(false);
    }

    
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
            <Image
            source={images.logo}
            resizeMode='contain'
            className="w[115px] h-[35px]"
            />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Login to Aora</Text>
            <FormField
            title="Email"
            value={form.email}
            handleChangeText = {(e) => {
              setForm({...form,email:e})
            }}
            otherStyles = "mt-7"
            KeyboardType = "email-address"
            />

            <FormField
            title="Password"
            value={form.password}
            handleChangeText = {(p) => {
              setForm({...form,password:p})
            }}
            otherStyles = "mt-7"
            />
          
          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isloading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-white text-semibold font-psemibold">Don't Have an account ?</Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Signup</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn