import {ID, Query} from 'appwrite';
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, database, storage } from './config';


// Create User Account
export async function createUserAccount(user: INewUser) {

  try {

    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Save User to DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// Sign In
export async function signInAccount(user: {email: string; password: string;}) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

// Get All current users
export async function getCurrentUser() {
  try {
    const currenAccount = await account.get();

    if (!currenAccount) throw new Error;

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currenAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Sign Out
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    console.log(error);
  }
}

// Create Post
export async function createPost(post: INewPost) {
  try{

    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    const fileUrl = await getFilePreview(uploadedFile.$id);
    if(!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    // Convert Tags to Array
    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    // Create Post
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    };

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// Upload file function
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// Get file preview function
export async function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100,
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// Delete file function
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return {status: 'success'};
  } catch (error) {
    console.log(error);
  }
}

// Get Recent Posts
export async function getRecentPosts() {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)],
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// Get User Posts
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Get User saved Posts
export async function savedPost(postId: string, userId: string) {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// Get User saved Posts
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId,
    );
    if (!statusCode) throw Error;
    return {status: 'success'};
  } catch (error) {
    console.log(error);
  }
}