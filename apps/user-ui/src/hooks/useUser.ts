import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

// Fetch user from API
const fetchUser = async () => {
  try {
    const response = await axiosInstance.get("/api/logged-in-user");
    return response.data.user || null;
  } catch (error) {
    return null; 
  }
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { user, isLoading, isError, refetch };
};

export default useUser;
