import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeScreenProps {
  children: React.ReactNode;
  className?: string;
}

const SafeScreen = ({ children, className = "" }: SafeScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className={`flex-1 bg-background ${className}`} 
      style={{ paddingTop: insets.top }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;