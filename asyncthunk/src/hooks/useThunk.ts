import { AsyncThunk } from "@reduxjs/toolkit";
import { useState, useCallback, SetStateAction } from "react";
import { useAppDispatch } from "../store/hooks";

export function useThunk(thunk: AsyncThunk<any, any, any>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  const runThunk = useCallback(
    (args: any) => {
      setIsLoading(true);
      dispatch(thunk(args))
        .unwrap()
        .catch((err: SetStateAction<null>) => setError(err))
        .finally(() => setIsLoading(false));
    },
    [dispatch, thunk]
  );

  return [runThunk, isLoading, error];
}
