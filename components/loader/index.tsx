import LottieView from "lottie-react-native";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";

interface LoadingContextType {
  show: () => void;
  hide: () => void;
}

export const LoadingContext = createContext<LoadingContextType>({
  show: () => {},
  hide: () => {},
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const show = useCallback(() => setIsLoading(true), []);
  const hide = useCallback(() => setIsLoading(false), []);

  const contextValue = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <>
      <LoadingContext.Provider value={contextValue}>
        {children}
      </LoadingContext.Provider>

      {isLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
          <View className="rounded-2xl bg-white w-[100] h-[100] justify-center items-center">
            <LottieView
              source={require("@/assets/animation/circular-loading.json")}
              autoPlay
              loop
              style={{ width: 125, height: 125 }}
            />
          </View>
        </View>
      )}
    </>
  );
};
