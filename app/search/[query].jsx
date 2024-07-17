import { View, Text, FlatList,Image,RefreshControl, Alert } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import { useEffect } from 'react'
import { getAllPost, getLatestPosts, searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {

  const {query} = useLocalSearchParams();
  const {data: posts, refetch} = useAppwrite(() => searchPosts(query));
  // Create a memoized function to search posts
  // const fetchSearchPosts = React.useCallback(() => searchPosts(query), [query]);

  // const { data: posts, refetch } = useAppwrite(fetchSearchPosts);

  useEffect(() => {
    refetch();
  }, [query])
  

  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      data={posts}
      keyExtractor={(item)=>item.id}
      renderItem={({item})=>(
        <VideoCard video={item}/>
      )}
      ListHeaderComponent={()=>(
        <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {query}
            </Text>
            <View className="mt-6 mb-8">
                <SearchInput intialQuery={query}/>

            </View>

        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title="No Videos Found"
        subtitle="No Videos Found for this search query"
        />
      )}
      />
    </SafeAreaView>
  )
}

export default Search