import { View, Text, ScrollView,Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import Home from '../(tabs)/home';
import { GlobalProvider, useGlobalContext } from '../../context/GlobalProvider';


const SignUp = () => {

  const [form,setForm] = useState({
    username:'',
    email:'',
    password:'',
  })

  const [isSubmitting,setIsSubmitting] = useState(false);

  const submit = async () =>{

    if(form.email ==="" || form.password==="" || form.username ==="")
    Alert.alert("Error","Enter all fields");

    setIsSubmitting(true);

    try {
      const result = await createUser(form.email,form.password,form.username);
      const {setUser,setIsLoggedIn} = useGlobalContext();

      setUser(result);
      setIsLoggedIn(true);
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
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">SignUp for Aora</Text>
            
            <FormField
            title="Username"
            value={form.username}
            handleChangeText = {(u) => {
              setForm({...form,username:u})
            }}
            otherStyles = "mt-10"
            />
            
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isloading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-white text-semibold font-psemibold">Already Have an account ?</Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>SignIn</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp