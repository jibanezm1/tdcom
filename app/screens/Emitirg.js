import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  ListItem,
  NativeEventEmitter,
  DeviceEventEmitter,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Share,
  Alert,
  LogBox,
} from 'react-native';
import {Button, Card, Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dialog} from 'react-native-simple-dialogs';
import color from '@styles/colors';
import {loginStyles} from '@styles/styles';
import {PricingCard} from 'react-native-elements';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input';

export default function EmitirScreen(props) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisible1, setDialogVisible1] = useState(false);

  const [terminado, setTerminado] = useState(true);
  const [text, setText] = useState('');
  const [nompreprod, setNompreprod] = useState('');
  const [valorprod, setValorprod] = useState('');
  const [totalProd, setTotalProd] = useState();
  const [cantidadProd, setCantidadProd] = useState(1);
  const [global, setGlobal] = useState(0);

  const [dispositivo, setDispositivo] = useState();
  const [total, setTotal] = useState();
  const [urls, setUrls] = useState('');
  const [list, setList] = useState([]);
  const [contri, setContri] = useState();

  const [tipo, setTipo] = useState();
  const inputEl = useRef(null);

  const [estado, setearState] = useState();
  const [hash, setHash] = useState();
  const [paso1, setPaso1] = useState();
  const [paso2, setPaso2] = useState();
  const [hidePassword, setHidePassword] = useState(false);
  var dateFormat = require('dateformat');
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  useEffect(() => {
    loadtipo();
    load();
    load2();
    loadCarro();
    loadtipo();

    var _listeners = [];
    let respuesta;
  }, [global]);

  const remove = async (productos) => {
    const values = await AsyncStorage.getItem('@carro');
    let articulos = JSON.parse(values);
    const resultado = articulos.find((producto, index) => {
      var nombredelproducto = producto.NmbItem;
      if (nombredelproducto == productos) {
        articulos.splice(index, 1);
      }
    });
    await AsyncStorage.setItem('@carro', JSON.stringify(articulos));
    loadCarro();
  };

  const renderRow = (productos) => {
    return (
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Button
            icon={<Icon name="trash" size={20} color="white" />}
            onPress={() => {
              //aqui filtro y elimino
              remove(productos.item.NmbItem);
            }}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{productos.item.NmbItem}</Text>
          <Text style={styles.restaurantDescription}>
            Cantidad: {productos.item.QtyItem}
          </Text>
          <Text style={styles.restaurantDescription}>
            Precio: ${productos.item.PrcItem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </Text>
          <Text style={styles.restaurantDescription}>
            Total: ${(productos.item.PrcItem * productos.item.QtyItem).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
          </Text>
        </View>
      </View>
    );
  };

  const load = async () => {
    const value = await AsyncStorage.getItem('@user');
    if (value !== null) {
      // We have data!!
      // console.log(value);
      let valor = JSON.parse(value);
      setearState(valor);
      setHash(valor.token);
    } else {
      alert('Sesion ha caducado.');
    }
  };

  const loadtipo = async () => {
    const value = await AsyncStorage.getItem('@tipo');
    let valor = JSON.parse(value);
    setTipo(valor);
  };

  const tipodte = async () => {
    const value = await AsyncStorage.getItem('@tipo');
    let valor = JSON.parse(value);
    return valor;
  };

  const clean = async () => {
    const value = await AsyncStorage.removeItem('@carro');
    setList([]);
  };

  const loadCarro = async () => {
    const value = await AsyncStorage.getItem('@carro');
    let valor = JSON.parse(value);
    if (valor != null) {
      setList(valor);
    }
    var resultado = 0;
    for (let item of list) {
      let totalProducto = item.PrcItem * item.QtyItem;
      console.log(item);

      resultado = resultado + totalProducto;
    }
    setGlobal(resultado);
    inputEl.current.focus();
  };

  const load2 = async () => {
    const value = await AsyncStorage.getItem('@contri');
    if (value !== null) {
      // We have data!!

      setContri(value);
    } else {
      alert('Sesion ha caducado.');
    }
  };

  const generar = (resultado) => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + hash);
    myHeaders.append('Accept', 'application/json, image/png');

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    //  https://app.tdcom.cl/dte/dte_emitidos/pdf/39/24/1/76955668/76955668/2020-06-26/13000
    // "https://app.tdcom.cl/api/dte/dte_emitidos/escpos/"+resultado.dte+"/"+resultado.folio+"/"+resultado.emisor+"?copias_tributarias=1&copias_cedibles=1&cedible=1&compress=0&base64=0"

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        setPaso1(resultado);
        var contri = JSON.parse(this.responseText);
        setPaso2(contri);
        setUrls(
          estado.url +
            '/dte/dte_emitidos/pdf/' +
            resultado.dte +
            '/' +
            resultado.folio +
            '/' +
            resultado.certificacion +
            '/' +
            resultado.emisor +
            '/' +
            resultado.fecha +
            '/' +
            resultado.total,
        );

        var myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json, image/png');
        myHeaders.append('Authorization', 'Basic ' + hash);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch(
          estado.url +
            '/api/dte/dte_emitidos/info/' +
            tipo +
            '/' +
            resultado.folio +
            '/' +
            resultado.emisor +
            '?getXML=0&getDetalle=0&getDatosDte=0&getTed=0&getResolucion=1&getEmailEnviados=0',
          requestOptions,
        )
          .then((response) => response.text())
          .then((result) => {
            var obj = JSON.parse(result);
            resultado.resolucion = obj.resolucion;
          })
          .catch((error) => console.log('error', error));
        setTerminado(false);
      }
    });

    xhr.open(
      'GET',
      estado.url + '/api/dte/contribuyentes/info/' + resultado.emisor,
    );

    // xhr.open("GET", "https://app.tdcom.cl/api/dte/dte_emitidos/info/"+resultado.receptor+"/"+resultado.dte+"/3f17b99ed5c43ac8fc5af652f27b1388/"+resultado.emisor+"?getDatosDte=1");
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + hash);

    xhr.send();

    //-----------------------------------------------------------------------------------------
  };

  const test = () => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + hash);
    loadtipo();
    console.log(tipo);
    if (tipo == 41) {
      var raw = JSON.stringify({
        Encabezado: {
          IdDoc: {
            TipoDTE: '41',
            IndServicio: '3',
          },
          Emisor: {
            RUTEmisor: estado.rut + '-' + contri,
          },
          Receptor: {
            RUTRecep: '66666666-6',
            RznSocRecep: 'Sin razon social informada',
            DirRecep: 'Sin direccion informada',
            CmnaRecep: 'Santiago',
          },
          Totales: {
            //MntExe: total,
            //MntTotal: total
          },
        },
        Detalle: list,
      });
    } else {
      var raw = JSON.stringify({
        Encabezado: {
          IdDoc: {
            TipoDTE: tipo,
          },
          Emisor: {
            RUTEmisor: estado.rut + '-' + contri,
          },
          Receptor: {
            RUTRecep: '66666666-6',
            RznSocRecep: 'Persona sin RUT',
            GiroRecep: 'Particular',
            DirRecep: 'Santiago',
            CmnaRecep: 'Santiago',
          },
        },
        Detalle: list,
      });
    }
    console.log(raw);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(estado.url + '/api/dte/documentos/emitir', requestOptions)
      .then((response) => response.text())
      .then((result) => {
        var response = JSON.stringify(result);

        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Basic ' + hash);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: result,
          redirect: 'follow',
        };

        fetch(estado.url + '/api/dte/documentos/generar', requestOptions)
          .then((response) => response.text())
          .then((result) => {
            const value = JSON.parse(result);

            generar(value);
          })
          .catch((error) => console.log('error', error));
      })
      .catch((error) => console.log('error', error));
  };

  const quitar = (cadena) => {
    const acentos = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
    };
    return cadena
      .split('')
      .map((letra) => acentos[letra] || letra)
      .join('')
      .toString();
  };

  const buscaproducto = () => {
    var myHeaders = new Headers();

    var formdata = new FormData();
    formdata.append('submit', 'ok');
    formdata.append('Codigo', text);
    formdata.append('Contribuyente', estado.rut);
    formdata.append('server', estado.url);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch('http://142.93.250.218/api/web/index.php/item/listar', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result == 2) {
          Alert.alert('El Producto no existe en la base.');
          setText('');
        } else {
          if (result.bruto == true) {
            let descuento = parseInt(result.precio) * 0.19;
            let total = parseInt(result.precio) + descuento;
            result.precio = total;
          }
          consulta(result);
          loadCarro();
        }
      })
      .catch((error) => console.log('error', error));
  };

  const consulta = async (item) => {
    if (global == 0) {
      setGlobal(item.precio);
    }

    const value = await AsyncStorage.getItem('@carro');
    let valor = JSON.parse(value);

    if (valor == null) {
      if(tipo==41){
        var articulo = [
          {
            NroLinDet: 1,
            IndExe: 1,
            NmbItem: item.item,
            QtyItem: 1,
            PrcItem: item.precio,
            MontoItem: item.precio,
          },
        ];
      }else{
        var articulo = [
          {
            NmbItem: item.item,
            QtyItem: 1,
            PrcItem: item.precio,
          },
        ];
      }
      
      await AsyncStorage.setItem('@carro', JSON.stringify(articulo));
    } else {
      const values = await AsyncStorage.getItem('@carro');
      let articulos = JSON.parse(values);
      let flag = 0;
      const resultado = articulos.find((producto) => {
        if (producto.NmbItem == item.item) {
          producto.QtyItem = producto.QtyItem + 1;
          producto.MontoItem = producto.PrcItem * producto.QtyItem;
          flag = 1;
        }
      });

      if (flag == 0) {
        //ingresa uno nuevo
        if (tipo == 41) {
          var articulo = {
            NroLinDet: 1,
            IndExe: 1,
            NmbItem: item.item,
            QtyItem: 1,
            PrcItem: item.precio,
            MontoItem: item.precio,
          };
        } else {
          var articulo = {
            NmbItem: item.item,
            QtyItem: 1,
            PrcItem: item.precio,
          };
        }

        articulos.push(articulo);
        await AsyncStorage.setItem('@carro', JSON.stringify(articulos));
      } else {
        await AsyncStorage.setItem('@carro', JSON.stringify(articulos));
      }

      const arrayfinal = await AsyncStorage.getItem('@carro');
      let articulosfinales = JSON.parse(arrayfinal);
      var resultadoski = 0;
      let totalProducto = 0;
      for (let item of articulosfinales) {
        let totalProducto = item.PrcItem * item.QtyItem;
        resultadoski = resultadoski + totalProducto;
      }
      loadCarro();

      //console.log(item.item);

      // for(let  producto of articulos){

      //   console.log(producto);
      // }
    }
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    restaurantName: {
      fontWeight: 'bold',
    },
    viewRestaurant: {
      flexDirection: 'row',
      padding: 10,
    },
    viewRestaurantImage: {
      marginRight: 15,
    },
    restaurantDescription: {
      paddingTop: 2,
      color: 'grey',
      width: 200,
    },
    restaurantAddress: {
      paddingTop: 2,
      color: 'grey',
    },

    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
    containera: {
      flex: 1,
      flexDirection: 'row',
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    cameraIcon: {
      margin: 5,
      height: 40,
      width: 40,
    },
    bottomOverlay: {
      position: 'absolute',
      width: '100%',
      flex: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

  const footer = () => {
    var totalProducto = 0;
    for (let item of list) {
      totalProducto = parseInt(totalProducto) + parseInt(item.PrcItem*item.QtyItem);
    }

    

    return (
      <PricingCard
        color="#4f9deb"
        title="Total Boleta"
        price={'$' + totalProducto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        onButtonPress={() => {
          if (list) {
            setDialogVisible1(true);
            test();
          }
        }}
        button={{title: 'Generar documento'}}
      />
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
      }}>
      <Dialog
        visible={dialogVisible1}
        onTouchOutside={() => setDialogVisible1(false)}>
        <View>
          <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>
            Procesando Boleta
          </Text>
          <View style={{alignItems: 'center'}}>
            {terminado ? (
              <ActivityIndicator style={{paddingBottom: 10}} size="large" />
            ) : (
              <Image source={require('@recursos/images/checkk.png')} />
            )}

            <Button
              disabled={terminado}
              onPress={() => {
                setDialogVisible1(false);
                clean();
                props.navigation.navigate('imprimirg', {
                  paso1: paso1,
                  paso2: paso2,
                  url: urls,
                  items: list,
                });
              }}
              title="Imprimir o Compartir"
              color="#1c86f3"
              accessibilityLabel="Boleta Generada"
            />
          </View>
        </View>
      </Dialog>

      <View style={[loginStyles.container, {padding: 10}]}>
        <View style={{padding: 5}}>
          <TextInput
            ref={inputEl}
            style={{height: 80, backgroundColor: '#ced2d6', padding: 10}}
            placeholderTextColor="black"
            placeholder="Ingrese el Codigo del Producto"
            onChangeText={(text) => setText(text)}
            defaultValue={text}
            onSubmitEditing={() => {
              buscaproducto();
              setText('');
            }}
          />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 2,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 50,
              paddingBottom: 50,
            }}>
            {list.length > 0 ? (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={list}
                renderItem={renderRow}
                ListFooterComponent={footer}
              />
            ) : (
              <Image
                source={require('@recursos/images/lista.png')}
                style={{height: 250, width: 250, marginBottom: 40}}
              />
            )}
          </ScrollView>

          <View style={loginStyles.btnTransparent}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.push('selecciona');
              }}>
              <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
                Volver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
