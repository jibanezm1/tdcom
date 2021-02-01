import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import MyTextInput from '@components/MyTextInput';
import color from '@styles/colors';
import {loginStyles} from '@styles/styles';
import AsyncStorage from '@react-native-community/async-storage';

export default function LoginScreen(props) {
  const [hidePassword, setHidePassword] = useState(false);
  const [hash, setHash] = useState();
  const [valor, setValor] = useState(0);
  const [estado, setearState] = useState();
  const [fecha, setearFecha] = useState();

  const clearAppData = async function () {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing app data.');
    }
  };

  useEffect(() => {
    clean();
    load();

  }, []);


  const clean = async () => {
    const value = await AsyncStorage.removeItem('@carro');
    console.log(value);
  };

  const load = async () => {
    const value = await AsyncStorage.getItem('@user');
    if (value !== null) {
      // We have data!!
      // console.log(value);
      let valor = JSON.parse(value);
      setearState(valor.url);
      setHash(valor.token);
    } else {
      alert('Sesion ha caducado.');
    }
  };



  const laprueba = function () {

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setearFecha(
        year + '-' + month + '-' + date 
    );
  //2019-01-01

    console.log(fecha);
    var data = JSON.stringify({
      periodo: null,
      receptor: null,
      fecha_desde: '2020-1-1',
      fecha_hasta: fecha,
      honorarios_desde: null,
      honorarios_hasta: null,
      anulada: null,
      sucursal_sii: null,
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open(
      'POST',
      'https://app.tdcom.cl/api/dte/boleta_terceros/buscar/76955668',
    );
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + hash);
    xhr.send(data);
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
                
                props.navigation.navigate('emitir');
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Documento por Total
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('emitirg');
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Documento con Glosa
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.push('dashboard');
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Volver
            </Text>
          </TouchableOpacity>
        </View>

       
      </View>
    </ScrollView>
  );
}
