import { View, Text, FlatList,Image,RefreshControl, Alert } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { useEffect } from 'react'
import { getAllPost, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
const Home = () => {

  const {user,setUser, setIsLoggedIn } = useGlobalContext();
  const {data: posts, refetch} = useAppwrite(getAllPost);
  const {data: latestPosts} = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = async () =>{
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  console.log(posts);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      data={posts}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>(
        <VideoCard video={item}/>
      )}
      ListHeaderComponent={()=>(
        <View className="my-6 px-4 space-y-6">
          <View className="flex-row justify-between items-center">
          <View className="justify-between">
            <Text className="font-pmedium text-sm text-gray-100">
              Welcome Back
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {user?.username}
            </Text>
          </View>
          <View>
            <Image
            source={images.logoSmall}
            className="w-10 h-11"
            resizeMode='contain'
            />
          </View>
          </View>
        <SearchInput placeholder={"Search for a Video Topic"}/>

        <View className="w-full flex-1 pt-5 pb-8">
          <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Vidoes</Text>
          <Trending posts={latestPosts}/>
        </View>
        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title="No Videos Found"
        subtitle="Be the First one to upload the video"
        />
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Home