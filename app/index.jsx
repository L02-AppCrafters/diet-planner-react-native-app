import { Dimensions, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import { api } from "@/convex/_generated/api";
import { useContext, useEffect } from "react";
import { useConvex } from "convex/react";

import { auth } from "../services/FirebaseConfig";
import { UserContext } from "../context/UserContext";
import Colors from "../shared/Colors";
import Button from "../components/shared/Button";

export default function Index() {
  const convex = useConvex();
  const router = useRouter();

  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userInfo) => {
      console.log(userInfo?.email);

      if (!userInfo?.email) {
        return;
      }

      const userData = await convex.query(api.Users.GetUser, {
        email: userInfo?.email
      });

      console.log(userData);
      
      if (userData) {
        setUser(userData);
        router.replace('/(tabs)/Home');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <Image source={require('./../assets/images/landing.jpg')}
        style={{
          width: '100%',
          height: Dimensions.get('screen').height
        }}
      />
      <View style={{
        position: 'absolute',
        height: Dimensions.get('screen').height,
        backgroundColor: '#0707075e',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 20
      }}>
        <Image source={require('./../assets/images/logo.png')}
          style={{
            width: 150,
            height: 150,
            marginTop: 100
          }}
        />

        <Text style={{
          color: Colors.WHITE,
          fontSize: 30,
          fontWeight: 'bold'
        }}>
          Diet Planner
        </Text>

        <Text style={{
          color: Colors.WHITE,
          fontSize: 20,
          textAlign: 'center',
          marginHorizontal: 20,
          marginTop: 15,
          opacity: 0.8
        }}>
          Craft delicious, healthy, mean plans tailored just for you. Achieve your goals with our personalized diet plans.
        </Text>
      </View>

      <View style={{
        position: 'absolute',
        bottom: 25,
        width: '100%',
        padding: 20
      }}>
        <Button
          title={'Get Started'}
          onPress={() => {
            setUser({ name: 'Guest User', email: 'guest@example.com', credit: 10 });
            router.push('/(tabs)/Home');
          }}
          icon={<Ionicons name="arrow-forward" size={24} color="white" />}
        />
      </View>
    </View>
  );
}