import { View, Text, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState, useContext } from 'react';
import { useConvex } from 'convex/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { api } from '../../convex/_generated/api';

import { auth } from '../../services/FirebaseConfig';
import { UserContext } from '../../context/UserContext';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';

export default function SignIn() {
  const convex = useConvex();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser } = useContext(UserContext);

  const onSignIn = () => {
    if (!email || !password) {
      Alert.alert('Missing fields!', 'Please fill all the fields');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const userData = await convex.query(api.Users.GetUser, {
          email: email
        });

        console.log(userData);
        setUser(userData);
        router.replace('/(tabs)/Home');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        Alert.alert('Error signing in!', 'Please check your credentials and try again');
      });
  }

  return (
    <View style={{
      display: 'flex',
      alignItems: 'center',
      padding: 20
    }}>
      <Image source={require('./../../assets/images/logo.png')}
        style={{
          width: 150,
          height: 150,
          marginTop: 60
        }}
      />

      <Text style={{
        fontSize: 35,
        fontWeight: 'bold'
      }}>
        Welcome Back!
      </Text>

      <View style={{
        width: '100%',
        marginTop: 20
      }}>
        <Input placeholder={'Email'} onChangeText={setEmail} />
        <Input placeholder={'Password'} password={true} onChangeText={setPassword} />
      </View>

      <View style={{
        width: '100%',
        marginTop: 15
      }}>
        <Button title={'Sign In'} onPress={() => onSignIn()} style={{
          marginTop: 20
        }} />
        <Text style={{
          textAlign: 'center',
          fontSize: 16,
          marginTop: 15
        }}>
          Don't have an account?</Text>
        <Link href={'/auth/SignUp'} asChild>
          <Text style={{
            textAlign: 'center',
            fontSize: 16,
            marginTop: 5,
            fontWeight: 'bold'
          }}>
            Create new account
          </Text>
        </Link>
      </View>
    </View>
  )
}