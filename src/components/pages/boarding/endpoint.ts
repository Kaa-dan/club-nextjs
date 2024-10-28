import { axiosConfig } from "@/lib/axios";

export const postDetails = async (id: string, userData: any) => {
  try {
    console.log({ id, userData });
    //api calling and storing response
    const response = await axiosConfig.put(
      `/onboarding/details/${id}`,
      userData
    );
    console.log({ response });
    // returning the response
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postPicture = async(id:string,userData:any)=>{
  try{
    const response = await axiosConfig.put(`/onboarding/images/${id}`,userData)
    return response.data
  }catch(error){
    throw error
  }
}
