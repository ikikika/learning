import { AsyncThunk } from "@reduxjs/toolkit";
import { useState, useCallback, SetStateAction } from "react";
import { useAppDispatch } from "../store/hooks";
import { RootState } from "../store";

interface AsyncThunkConfig {
  state: RootState;
}

export function useThunk(thunk: AsyncThunk<any, void, AsyncThunkConfig>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  const runThunk = useCallback(() => {
    setIsLoading(true);
    dispatch(thunk())
      .unwrap()
      .catch((err: SetStateAction<null>) => setError(err))
      .finally(() => setIsLoading(false));
  }, [dispatch, thunk]);

  return [runThunk, isLoading, error];
}
