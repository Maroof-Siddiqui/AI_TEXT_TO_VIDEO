import { Client,Account, ID, Avatars, Databases,Query,Storage } from 'react-native-appwrite';

export const config = {
    endpoint : "https://cloud.appwrite.io/v1",
    platform : "com.jsm.aora",
    projectId : "663c7d03002b436dd437",
    databaseId: "663c82010012273bcd7b",
    userCollectionId: "663c82260027d6f06e62",
    videoCollectionId: "663c82550035b10e3006",
    storageId: "663c8892001e38e61bb5"
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export const createUser = async (email, password, username) =>{

    try {

        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        );

        // if any issue while creating new account
        if(!newAccount) throw error;

        // if account is successfull then get the avatars, 
        // this func getinitials takes username and genrate a unique avatar based on username
       const avatarUrl = avatars.getInitials(username);

       await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                "accountId": newAccount.$id,
                "email":email,
                "username":username,
                "avatar": avatarUrl
            }
        );
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


export const signIn = async (email, password) =>{

    try {
        const session = await account.createEmailPasswordSession(email,password);
        console.log("session:"+session);
        return session;

    } catch (error) {
    throw new Error(error);
        
    }
}


export async function getAccount() {
    try {
      const currentAccount = await account.get();
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }



export const getCurrentUser = async() =>{

    try {
        const currentAccount = await getAccount();
        if(!currentAccount) throw Error;
        
        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        );
        if(!currentUser) throw Error;
    
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const getAllPost = async() =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async() =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const searchPosts = async(query) =>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getUserPosts = async(userID) =>{
    try {
        console.log("userId" , userID);
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator',userID)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const signOut = () =>{
    try {
        const session = account.deleteSession('current');
        return session;
    } catch (error) {
        throw new error;
    }
}

export async function getFilePreview(fileId, type) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(config.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          config.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

export async function uploadFile(file, type) {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };
  
    console.log("form",file);
    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );
        console.log("uploadedfile",uploadedFile);
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
}

export async function createVideoPost(form) {


    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        config.databaseId,
        config.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }