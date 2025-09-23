import LottieView from "lottie-react-native";
import React, { createContext, ReactNode, useState } from "react";
import { View } from "react-native";

interface LoadingContextType {
  show: () => void;
  hide: () => void;
  isLoading: boolean;
}

export const LoadingContext = createContext<LoadingContextType>({
  show: () => {},
  hide: () => {},
  isLoading: false,
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const show = () => setIsLoading(true);
  const hide = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ show, hide, isLoading }}>
      {children}
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
    </LoadingContext.Provider>
  );
};
