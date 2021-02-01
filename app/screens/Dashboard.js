import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import MyTextInput from '@components/MyTextInput';
import color from '@styles/colors';
import {loginStyles} from '@styles/styles';
import AsyncStorage from '@react-native-community/async-storage';

export default function LoginScreen(props) {
  const [hidePassword, setHidePassword] = useState(false);


  const clearAppData = async function () {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing app data.');
    }
  };




  return (
    <ScrollView>
      <View style={[loginStyles.container, {padding: 20}]}>
        <StatusBar backgroundColor={color.BLUE} translucent={true} />
        <View style={loginStyles.logo}>
          <Image
            source={require('@recursos/images/logo.png')}
            style={{height: 250, width: 250, marginBottom: 50}}
          />
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('selecciona');
            }}>
            <Text style={loginStyles.btntxt}>Emitir Documento</Text>
          </TouchableOpacity>
        </View>

       

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('listado');
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Mis Ventas
            </Text>
          </TouchableOpacity>
        </View>
        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('reporte');
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Reporte
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.push('Principal');
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Configurar Terminal
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Cerrar',
                'Desea salir de su PERFIL y cerrar sesion?',
                [
                  {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'SI', onPress: () => clearAppData()},
                ],
                {cancelable: false},
              );
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Salir de Mi Perfil
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Cerrar',
                'Desea minimizar la APP sin cerrar su sesion?',
                [
                  {
                    text: 'No',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'SI', onPress: () => BackHandler.exitApp()},
                ],
                {cancelable: false},
              );
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Cerrar APP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
