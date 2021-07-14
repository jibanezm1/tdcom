import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  NativeEventEmitter,
  DeviceEventEmitter,
  ScrollView,
  Button,
  StyleSheet,
  ActivityIndicator,
  Share,
} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import MyTextInput from '@components/MyTextInput';
import color from '@styles/colors';
import {loginStyles} from '@styles/styles';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import {Calculator, CalculatorInput} from 'react-native-calculator';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-community/async-storage';
import SunmiV2Printer from 'react-native-sunmi-v2-printer';

export default function ImprimirScreen(props) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [terminado, setTerminado] = useState(true);
  const [terminal, setTerminal] = useState();

  const [dispositivo, setDispositivo] = useState();
  const [total, setTotal] = useState();
  const [urls, setUrls] = useState('');
  const [imagen, setImagen] = useState('');
  const [valor, setValor] = useState(0);
  const [estado, setearState] = useState();
  const [hash, setHash] = useState();
  const [tipo, setTipo] = useState();
  const [sucursal, setSucursal] = useState();

  useEffect(() => {
    load();
    loadtipo();
    loadTerminal();
    codigosii();

    var _listeners = [];
    let respuesta;

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      _listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => {
            setDispositivo(rsp);
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTED,
          (rsp) => {
            setDispositivo(rsp);
          },
        ),
      );
      _listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => {
            setDispositivo(rsp);
          },
        ),
      );
    }
  }, []);
  const codigosii = async () => {
    const value = await AsyncStorage.getItem('@codigosii');
    let valor = JSON.parse(value);
    setSucursal(valor);
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
  const loadTerminal = async () => {
    const value = await AsyncStorage.getItem('@terminal');
    let valor = JSON.parse(value);
    setTerminal(valor);
  };
  const loadtipo = async () => {
    const value = await AsyncStorage.getItem('@tipo');
    let valor = JSON.parse(value);
    setTipo(valor);
  };

  const share = async () => {
    try {
      const result = await Share.share({
        message: 'Descargue su documento: ' + props.navigation.state.params.url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
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
        setUrls(
          estado +
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
        setTerminado(false);
      }
    });

    xhr.open(
      'GET',
      estado + '/api/dte/contribuyentes/info/' + resultado.emisor,
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

    var raw = JSON.stringify({
      Encabezado: {
        IdDoc: {
          TipoDTE: tipo,
        },
        Emisor: {
          RUTEmisor: '76.955.668-0',
        },
        Receptor: {
          RUTRecep: '66666666-6',
          RznSocRecep: 'Persona sin RUT',
          GiroRecep: 'Particular',
          DirRecep: 'Santiago',
          CmnaRecep: 'Santiago',
        },
      },
      Detalle: [
        {
          NmbItem: 'producto 1',
          QtyItem: 1,
          PrcItem: total,
        },
      ],
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(estado + '/api/dte/documentos/emitir', requestOptions)
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

        fetch(estado + '/api/dte/documentos/generar', requestOptions)
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

  const print = async (resultado, result) => {
    const dire =
      estado +
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
      resultado.total;

    var contri = result;

    let lassucursal = 0;
    var imprimir = Object.entries(result.sucursales);

    for (let item of imprimir) {
      if (resultado.sucursal_sii == item[0]) {
        lassucursal = item[1];
      }
    }

    let columnAliment = [0, 1, 1, 2];
    let columnWidth = [5, 10, 10, 5];
    try {
      //set aligment: 0-left,1-center,2-right
      await SunmiV2Printer.setAlignment(1);

      //SunmiV2Printer.commitPrinterBuffer();

      await SunmiV2Printer.setFontSize(40);
      await SunmiV2Printer.printOriginalText(contri.razon_social + '\r\n');
      await SunmiV2Printer.setFontSize(20);
      await SunmiV2Printer.setAlignment(0);
      await SunmiV2Printer.printOriginalText(
        'Rut ' + contri.rut + '-' + contri.dv + '\r\n',
      );
      await SunmiV2Printer.printOriginalText(
        'Comuna: ' + contri.comuna_glosa + '\r\n',
      );
      await SunmiV2Printer.printOriginalText(
        'Direccion: ' + contri.direccion + '\r\n',
      );
      await SunmiV2Printer.printOriginalText(
        'BOLETA ELECTRONICA No ' + resultado.folio + ' \r\n',
      );
      const giro = quitar(contri.giro);

      await SunmiV2Printer.printOriginalText('Giro: ' + giro + '\r\n');
      await SunmiV2Printer.printOriginalText(
        'Fecha: ' + resultado.fecha_hora_creacion + '\r\n',
      );

      if (resultado.sucursal_sii) {
        await SunmiV2Printer.printOriginalText(
          'Sucursal SII: ' + lassucursal + '\r\n',
        );
      }
      await SunmiV2Printer.printOriginalText(
        '======================================\n',
      );

      await SunmiV2Printer.setFontSize(22);

      var detalless = ['ID', 'Item', 'Cant', 'total'];

      await SunmiV2Printer.printColumnsText(
        detalless,
        columnWidth,
        columnAliment,
      );

      let rows = props.navigation.state.params.items;
      let indice = 1;
      for (let i in rows) {
        let row = rows[i];

        var totallinea = row.QtyItem * row.PrcItem;

        var detalles = [
          indice.toString(),
          row.NmbItem.toString().substr(0, 4),
          row.QtyItem.toString(),
          totallinea.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        ];

        await SunmiV2Printer.printColumnsText(
          detalles,
          columnWidth,
          columnAliment,
        );
        indice++;
      }

      await SunmiV2Printer.setFontSize(20);
      await SunmiV2Printer.printOriginalText(
        '======================================\n',
      );
      await SunmiV2Printer.setAlignment(2);
      await SunmiV2Printer.setFontSize(20);
      
      if (props.navigation.state.params.tipo == 41) {

        await SunmiV2Printer.printOriginalText(
          'El Total Exento es: ' + resultado.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
        );
        await SunmiV2Printer.printOriginalText(
          'El Total de esta boleta es: ' + resultado.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
        );

      
      } else {
        await SunmiV2Printer.printOriginalText(
          'El IVA de esta boleta es: ' + resultado.iva.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
        );
        await SunmiV2Printer.printOriginalText(
          'El Total de esta boleta es: ' + resultado.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
        );
      }

      await SunmiV2Printer.setAlignment(1);

      await SunmiV2Printer.setFontSize(20);
      await SunmiV2Printer.printOriginalText(
        '======================================\n',
      );
      await SunmiV2Printer.printOriginalText('Copia Cliente\r\n');
      await SunmiV2Printer.printOriginalText('Validada como Boleta\r\n');
      await SunmiV2Printer.printOriginalText('Autorizada por el SII\r\n');
      await SunmiV2Printer.printOriginalText(
        'RES. EX. NRO.' +
        props.navigation.state.params.paso1.resolucion.numero +
        ' ' +
        props.navigation.state.params.paso1.resolucion.fecha +
        '\r\n',
      );
      await SunmiV2Printer.printOriginalText('\n\n');
      await SunmiV2Printer.printQRCode(props.navigation.state.params.url, 4, 3);

      await SunmiV2Printer.printOriginalText('\n\n');
      await SunmiV2Printer.printOriginalText('\n\n');
      await SunmiV2Printer.printOriginalText('\n\n');
    } catch (e) {
      alert(e);
    }
  };

  const imprimir = async (resultado, result) => {
    const dire =
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
      resultado.total;

    var contri = result;

    let lassucursal = 0;

    var imprimir = Object.entries(result.sucursales);

    for (let item of imprimir) {
      if (resultado.sucursal_sii == item[0]) {
        lassucursal = item[1];
      }
    }

    try {
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.setBlob(0);

      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText('TDCOM\r\n', {
        encoding: 'UTF-8',
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 0,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      );
      await BluetoothEscposPrinter.printText(
        'Razon Social ' + contri.razon_social + '\r\n',
        {},
      );
      await BluetoothEscposPrinter.printText(
        'Rut ' + contri.rut + '-' + contri.dv + '\r\n',
        {},
      );
      await BluetoothEscposPrinter.printText(
        'Comuna: ' + contri.comuna_glosa + '\r\n',
        {},
      );
      await BluetoothEscposPrinter.printText(
        'Direccion ' + contri.direccion + '\r\n',
        {},
      );
      await BluetoothEscposPrinter.printText(
        'BOLETA ELECTRONICA No ' + resultado.folio + ' \r\n',
        {},
      );

      const giro = quitar(contri.giro);

      await BluetoothEscposPrinter.printText('Giro: ' + giro + '\r\n', {
        encoding: 'UTF-8',
      });
      await BluetoothEscposPrinter.printText(
        'Fecha: ' + resultado.fecha_hora_creacion + '\r\n',
        {},
      );
        console.log(lassucursal);
      if (resultado.sucursal_sii) {
        await BluetoothEscposPrinter.printText(
          'Sucursal SII: ' + lassucursal + '\r\n',
          {},
        );
      }

      await BluetoothEscposPrinter.printText(
        '--------------------------------\r\n',
        {},
      );
      let columnWidths = [6, 12, 6, 8];
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['ID', 'Detalle', 'Cant', 'Total'],
        {},
      );

      let rows = props.navigation.state.params.items;

      for (let i in rows) {
        let row = rows[i];
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            row.NroLinDet.toString(),
            row.NmbItem.toString().substr(0, 4),
            row.QtyItem.toString(),
            row.PrcItem.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          ],
          {},
        );
      }

      await BluetoothEscposPrinter.printText(
        '--------------------------------\r\n',
        {},
      );
      console.log('----------------');

      console.log(resultado);

      if (props.navigation.state.params.tipo == 41) {
        await BluetoothEscposPrinter.printText(
          'Total Excento: ' + resultado.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
          {},
        );
      } else {
        await BluetoothEscposPrinter.printText(
          'El IVA de esta boleta es: ' + resultado.iva.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
          {},
        );
      }

      await BluetoothEscposPrinter.printText(
        'Total: ' + resultado.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '\r\n',
        {},
      );

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printerLeftSpace(1);
      await BluetoothEscposPrinter.printQRCode(
        props.navigation.state.params.url,
        320,
        BluetoothEscposPrinter.ERROR_CORRECTION.L,
      ); //.then(()=>{alert('done')},(err)=>{alert(err)});
      await BluetoothEscposPrinter.printText('Copia Cliente\r\n', {});
      await BluetoothEscposPrinter.printText('Validada como Boleta\r\n', {});
      await BluetoothEscposPrinter.printText('Autorizada por el SII\r\n', {});
      await BluetoothEscposPrinter.printText(
        'RES. EX. NRO.' +
          props.navigation.state.params.paso1.resolucion.numero +
          ' ' +
          props.navigation.state.params.paso1.resolucion.fecha +
          '\r\n',
        {},
      );

      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
    } catch (e) {
      alert(
        'Existe problema de configuración con la impresora revise su conexion.',
      );
    }
  };

  const glosa = async (item) => {
    await BluetoothEscposPrinter.printColumn(
      columnWidths,
      [
        BluetoothEscposPrinter.ALIGN.LEFT,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.CENTER,
        BluetoothEscposPrinter.ALIGN.RIGHT,
      ],
      [
        item.NroLinDet.toString(),
        item.NmbItem.toString().substr(0, 4),
        item.QtyItem.toString(),
        item.PrcItem.toString(),
      ],
      {},
    );
  };

  const [hidePassword, setHidePassword] = useState(false);
  var dateFormat = require('dateformat');
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 100,
      }}>
      <View style={[loginStyles.container, {padding: 10}]}>
        <View style={loginStyles.logo}>
          <Image
            source={require('@recursos/images/invoice.png')}
            style={{height: 250, width: 250, marginBottom: 40}}
          />
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              if (terminal == 1) {
                print(
                  props.navigation.state.params.paso1,
                  props.navigation.state.params.paso2,
                );
              } else {
                imprimir(
                  props.navigation.state.params.paso1,
                  props.navigation.state.params.paso2,
                );
              }
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Imprimir
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              share();
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Compartir Documento
            </Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.btnTransparent}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('listado');
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
