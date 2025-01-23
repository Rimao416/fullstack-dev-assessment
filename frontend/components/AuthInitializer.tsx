import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetUserQuery, useRefreshTokenMutation } from "@/slice/authSlice";

export default function AuthInitializer() {
  const {  error, refetch } = useGetUserQuery(undefined, {
    skip: !Cookies.get("accessToken"),
  });
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (error && "status" in error && error.status === 401) {
        try {
          const response = await refreshToken().unwrap();
          const newAccessToken = response;

          Cookies.set("accessToken", newAccessToken, { expires: 15 / (24 * 60) });

          refetch();
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token:",
            refreshError
          );
        }
      }
    };

    if (error) {
      handleTokenRefresh();
    }
  }, [error, refreshToken, refetch]);


  return null; 
}
