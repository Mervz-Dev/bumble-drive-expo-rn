import { InputField } from "@/components/fields/input-field";
import { useLoading } from "@/hooks/useLoading";
import schema from "@/schemas/email-login-schema";
import { useAppStore } from "@/stores/appStore";
import { useAuthStore } from "@/stores/authStore";
import { Auth } from "@/types/app/auth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuthStore();
  const { setFirstTimeLoggedIn } = useAppStore();
  const loading = useLoading();

  const { control, handleSubmit } = useForm<Auth.EmailCredentials>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSignIn = async (params: Auth.Authentication) => {
    try {
      loading.show();

      switch (params.type) {
        case "email":
          await signInWithEmail({
            type: "email",
            email: params.email,
            password: params.password,
          });
          break;

        case "google":
        case "facebook":
          await signInWithGoogle();
          break;
        default:
          break;
      }
      setFirstTimeLoggedIn();
    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: "error",
          text1: error?.message,
        });
      }

      console.log("onEmailSignIn error: ", error);
    } finally {
      loading.hide();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="absolute top-14 left-6 z-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-gray-100 shadow-sm active:opacity-70"
        >
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center px-6">
        <View className="mb-10">
          <Text className="text-4xl font-extrabold text-black">Welcome 👋</Text>
          <Text className="text-gray-500 mt-2 text-base">
            Sign in to continue your journey with{" "}
            <Text className="text-yellow-500 font-semibold">Bumble Drive</Text>
          </Text>
        </View>

        <InputField
          control={control}
          name="email"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleSubmit((values) =>
            onSignIn({ type: "email", ...values })
          )}
          className="bg-black py-4 rounded-full items-center shadow-lg mb-6"
          activeOpacity={0.9}
        >
          <Text className="font-bold text-yellow-400 text-lg">
            {"Login / Sign Up"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-3 text-gray-400">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <TouchableOpacity
          onPress={() => onSignIn({ type: "google" })}
          className="flex-row items-center justify-center bg-[#DB4437] py-4 rounded-full shadow-sm mb-4"
          activeOpacity={0.9}
        >
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="ml-3 font-semibold text-white">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSignIn({ type: "facebook" })}
          className="flex-row items-center justify-center bg-[#1877F2] py-4 rounded-full shadow-sm"
          activeOpacity={0.9}
        >
          <Ionicons name="logo-facebook" size={20} color="white" />
          <Text className="ml-3 font-semibold text-white">
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </View>

      <View className="items-center py-10 px-6">
        <Text className="text-gray-400 text-xs text-center">
          By continuing, you agree to our{" "}
          <Text className="text-yellow-500">Terms</Text> &{" "}
          <Text className="text-yellow-500">Privacy Policy</Text>.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
