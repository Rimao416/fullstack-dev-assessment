import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetUserQuery, useRefreshTokenMutation } from "../slice/authSlice";

const useUserData = () => {
  const { data: user, error, refetch } = useGetUserQuery(undefined, {
    skip: !Cookies.get("accessToken"), // Do not call the API if no token is present
  });
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (error && "status" in error && error.status === 401) {
        try {
          const response = await refreshToken().unwrap();
          const newAccessToken = response;

          // Save the new token in cookies
          Cookies.set("accessToken", newAccessToken, { expires: 1 / 24 }); // Expires in 1 hour

          // Retry the request to fetch user data
          refetch();
        } catch (refreshError) {
          console.error("Error while refreshing token:", refreshError);
        }
      }
    };

    if (error) {
      handleTokenRefresh();
    }
  }, [error, refreshToken, refetch]);

  return { user, error };
};

export default useUserData;
