import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import MyTextInput from '@components/MyTextInput';
import color from '@styles/colors';
import {loginStyles} from '@styles/styles';
import {Picker} from '@react-native-community/picker';
import base64 from 'react-native-base64';
var utf8 = require('utf8');
import AsyncStorage from '@react-native-community/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

export default function LoginScreen(props) {
  const [hidePassword, setHidePassword] = useState(false);
  const [estado, setearState] = useState();
  const [hash, setHash] = useState();
  const [rut, setRut] = useState();
  const [servidor, setServidor] = useState();

  useEffect(() => {
    check();
    consulta();
  }, []);

  const consulta = () => {
    // var data = new FormData();
    // data.append("submit", "ok");

    // var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    // xhr.addEventListener("readystatechange", function() {
    // if(this.readyState === 4) {
    //     let valor = JSON.parse(this.responseText);
    //     setServidor(valor);
    // }
    // });

    // xhr.open("GET", "http://142.93.250.218/api/web/index.php/servidores/listar");
    // xhr.setRequestHeader("Cookie", "__cfduid=d3d1f1de2ea9b0b4acf563ba50048d3c71597961426; PHPSESSID=vkrf3dr923n0f9807jucdq0vs4; _csrf=bd96184aa19cda97f81ba7e73ea214c61e231b07bb7c826ca2b1701df7341f63a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22fmceCStbd8UTgoQBlm5XMxK_vcMGvhJy%22%3B%7D");
    // xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
    // xhr.send(data);

    var formdata = new FormData();

    var requestOptions = {
      method: 'GET',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    fetch(
      'http://142.93.250.218/api/web/index.php/servidores/listar',
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        let valor = JSON.parse(result);
        setServidor(valor);
      })
      .catch((error) => console.log('error', error));
  };

  const renderRow = () => {
    return servidor.map((x, i) => {
      return (
        <Picker.Item
          label={x.nombre.toString()}
          value={x.url.toString()}
          key={x.id}
        />
      );
    });
  };
  const check = async () => {
    const value = await AsyncStorage.getItem('@user');
    const value2 = await AsyncStorage.getItem('@tipo');

    if (value !== null) {
      console.log(value);
      console.log(value2);

      props.navigation.navigate('dashboard');
    } else {
    }
  };

  const _storeData = async (result) => {
    try {
      const jsonValue = JSON.stringify(result);
      const jsonValue2 = JSON.stringify(39);

      await AsyncStorage.setItem('@user', jsonValue);
      await AsyncStorage.setItem('@tipo', jsonValue2);

      const value = await AsyncStorage.getItem('@user');
      
      if (value !== null) {
        // We have data!!
        // console.log(value);
        let valor = JSON.parse(value);

        test(valor);
      } else {
        console.log('nada');
      }
    } catch (error) {
      // Error saving data
    }
  };
  const _storeData2 = async (result) => {
    try {

      const jsonValue = result.dv
      await AsyncStorage.setItem('@contri', jsonValue);
      const value = await AsyncStorage.getItem('@contri');
      if (value !== null) {
        // We have data!!
        // console.log(value);
        console.log(value);

      } else {
        console.log('nada');
      }
    } catch (error) {
      // Error saving data
    }
  };

  const test = (value) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + value.token);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    console.log(value.url + '/api/dte/contribuyentes/info/' + value.rut);
    fetch(
      value.url + '/api/dte/contribuyentes/info/' + value.rut,
      requestOptions,
    )
      .then((response) => response.text())
      .then((result) => {
        const valor = JSON.parse(result);
      
        if (result == 'Cabecera Authorization es incorrecta') {
          alert('El Hash ingresado es incorrecto.');
        } else {
          console.log(value.rut);
          if (valor.rut == value.rut) {
            _storeData2(valor);
            props.navigation.navigate('dashboard');
          } else {
            alert('El rut ingresado no esta en nuestra plataforma.');
          }
        }

        console.log('este es resultado:' + result);
      })
      .catch((error) => console.log('error', error));
  };

  return (
    <KeyboardAwareScrollView>
      <View style={[loginStyles.container, {padding: 20}]}>
        <StatusBar backgroundColor={color.BLUE} translucent={true} />
        <View style={loginStyles.logo}>
          <Image
            source={require('@recursos/images/logo.png')}
            style={{height: 250, width: 250}}
          />
        </View>
        <Text style={{paddingTop: 20}}>Selecciona el servidor</Text>

        <Picker
          style={{
            height: 40,
            width: 250,
            marginTop: Platform.OS === 'ios' ? 20 : 0,
            marginBottom: Platform.OS === 'ios' ? 150 : 0,
          }}
          selectedValue={estado}
          mode={'dropdown'}
          onValueChange={(lang) => {
            setearState(lang);
            if (lang == 'https://app.tdcom.cl') {
              setRut('76955668');
              setHash('ajYng2hNw6V9wSvoFhVUSxgoxlq9mMon');

              console.log(rut);
              var bytes = utf8.encode(hash + ':x');
              var encoded = base64.encode(hash + ':x');
              console.log(encoded);
              var resultado = {
                url: estado,
                token: encoded,
                rut: rut,
              };

              _storeData(resultado);
            }else{
                setRut(null);
              setHash(null);
            }
          }}>
          <Picker.Item label={'Seleccione'} value={0} key={0} />
          {servidor ? (
            renderRow()
          ) : (
            <Picker.Item label="Ninguno" value="Ninguno" />
          )}
        </Picker>
        <MyTextInput
          onChangeText={(value) => {
            setRut(value);
            console.log(rut);
          }}
          value={rut}
          placeholder="Ingrese el rut del contribuyente"
          image="account-circle"
        />

        <MyTextInput
          onChangeText={(value) => {
            setHash(value);
            console.log(hash);
          }}
          value={hash}
          keyboardType="email-address"
          placeholder="Ingrese Su Hash"
          image="lock"
        />

        <View style={loginStyles.btnMain}>
          <TouchableOpacity
            onPress={() => {
              if (estado && hash && rut) {
                console.log(estado);
                var bytes = utf8.encode(hash + ':x');
                var encoded = base64.encode(hash + ':x');
                console.log(encoded);
                var resultado = {
                  url: estado,
                  token: encoded,
                  rut: rut,
                };

                _storeData(resultado);
              } else {
                alert('Ingrese y seleccione todos los campos');
              }
            }}>
            <Text style={loginStyles.btntxt}>Iniciar Sesion</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={loginStyles.btnTransparent}>
                <TouchableOpacity>
                <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
                    Registrarse
                </Text>
                </TouchableOpacity> 
            </View>
            
            <View >
                <TouchableOpacity>
                <Text style={[loginStyles.txtTransparent, {textDecorationLine: 'underline'}]}>
                    Olvide Mi Contraseña
                </Text>
                </TouchableOpacity> 
            </View> */}
      </View>
    </KeyboardAwareScrollView>
  );
}
