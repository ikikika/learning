import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { refreshService } from "../../features/auth/refreshService";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  logOut,
  selectCurrentToken,
  selectCurrentUser,
  setCredentials,
} from "../../features/auth/authSlice";
import BackToLogin from "./BackToLogin";
import { apiService } from "../../features/services/apiService";

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const [refreshUninit, setRefreshUninit] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const currentAccessToken = useAppSelector(selectCurrentToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const generateNewAccessToken = async () => {
      try {
        const refreshResult = await dispatch(
          refreshService.endpoints.refresh.initiate(null)
        );
        await dispatch(setCredentials({ ...refreshResult.data, user }));
        await dispatch(apiService.util.resetApiState());
        console.log(refreshResult);
        setIsLoading(refreshResult.isLoading);
        setRefreshError(refreshResult.isError);
        setRefreshUninit(refreshResult.isUninitialized);
      } catch (err) {
        dispatch(logOut());
        setRefreshError(true);
        console.error(err);
      }
    };

    if (!currentAccessToken) {
      setIsLoading(true);
      generateNewAccessToken();
    }
  }, [currentAccessToken, dispatch, user]);

  // console.log({
  //   currentAccessToken,
  //   user,
  //   refreshError,
  // });

  return (
    <>
      {isLoading ? (
        <p>Loadingggg...</p>
      ) : currentAccessToken ? (
        <Outlet />
      ) : refreshError || refreshUninit ? (
        <BackToLogin />
      ) : null}
    </>
  );
};
