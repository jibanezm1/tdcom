import React, {Component} from 'react';
import DatePicker from 'react-native-datepicker';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  LogBox
} from 'react-native';
import { Input } from 'react-native-elements';
import color from '@styles/colors';
import {loginStyles} from '@styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import filter from 'lodash.filter';
import SunmiV2Printer from 'react-native-sunmi-v2-printer';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';


export default class reporteScreen extends Component {
  constructor(props) {

    super(props);
    this.state = {date1: ''};
    this.state = {date2: ''};
    this.arrayholder = [];

    this.state = {
      data: '',
      search: '',
      url: '',
      contri: '',
      usuario: '',
      hash: '',
      total: '',
      folioinicial:'',
      foliofinal:'',
      query: '',
      terminal: '',
      fullData: []
        };
    this.load();
    this.loadTerminal();
  }

  load = async () => {
    const value = await AsyncStorage.getItem('@user');
    if (value !== null) {
      // We have data!!
      let valor = JSON.parse(value);
      this.setState({usuario: valor});
      this.setState({hash: valor.token});
    } else {
      alert('Sesion ha caducado.');
    }
  };

  loadTerminal = async () => {
    const value = await AsyncStorage.getItem('@terminal');
    let valor = JSON.parse(value);
    this.setState({terminal:valor});
  };
 

  resumen = () => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + this.state.usuario.token);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      this.state.usuario.url +
        '/api/dte/dte_emitidos/buscar/' +
        this.state.usuario.rut,
      requestOptions,
    )
      .then((response) => response.json())
      .then((resultado) => {
        var totalf = 0;
        var arrayholder = [];
        var final = 0;
        resultado.forEach((item, index) => {
          if(index==0){
            this.setState({foliofinal :item.folio});
          }

          if (
            item.fecha >= this.state.date1 &&
            item.fecha <= this.state.date2
          ) {
            if(item)
            arrayholder.push(item);
            totalf = totalf + item.total;
            final = item.folio;
          }
        });
        this.setState({folioinicial:final});

        this.setState({total:totalf});
        this.setState({data:arrayholder});
        this.cargausuarios();

      })
      .catch((error) => console.log('error', error));
  };

   renderRow = () => {
    return this.state.usuario.map((x, i) => {
      return (
        <Picker.Item
          label={x.toString()}
          value={x.toString()}
          key={x}
        />
      );
    });
  };


  renderItem = (item) => {
    return (
      <View
        key={item.key}
        style={{
          padding: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#c1dec5',
          marginBottom: 10,
        }}>
        <TouchableOpacity>
          <Text>Documento Nº: {item.folio}</Text>
          <Text>Fecha: {item.fecha}</Text>
          <Text>Total: {item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
        </TouchableOpacity>
      </View>
    );
  };


   async print(resultado, result){
    

    let columnAliment = [0, 1, 1];
    let columnWidth = [10, 10, 10];
    try {
      //set aligment: 0-left,1-center,2-right
      await SunmiV2Printer.setAlignment(1);

      //SunmiV2Printer.commitPrinterBuffer();

     
      await SunmiV2Printer.setFontSize(22);

      var detalless = ['Folio', 'fecha', 'Monto'];

      await SunmiV2Printer.printColumnsText(
        detalless,
        columnWidth,
        columnAliment,
      );
      await SunmiV2Printer.printOriginalText(
        '==================================\n',
      );
      for (let i in this.state.data) {
        let row = this.state.data[i];
        var detalles = [row.folio.toString(), row.fecha.toString(), row.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")];
        await SunmiV2Printer.printColumnsText(
          detalles,
          columnWidth,
          columnAliment,
        );
      }


      await SunmiV2Printer.printOriginalText(
        '==================================\n',
      );
      await SunmiV2Printer.setFontSize(30);

      await SunmiV2Printer.printOriginalText('Total consolidado:'+this.state.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+'\r\n');

      await SunmiV2Printer.printOriginalText('\n\n');
      await SunmiV2Printer.printOriginalText('\n\n');
      await SunmiV2Printer.printOriginalText('\n\n');
    } catch (e) {
      console.log(e);
    }
  };


  imprimir = async() =>{
    try {
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.setBlob(0);


      await BluetoothEscposPrinter.printText(
        '--------------------------------\r\n',
        {},
      );
      let columnWidths = [6, 12, 6];
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ['Folio', 'fecha', 'Monto'],
        {},
      );

      await BluetoothEscposPrinter.printText(
        '--------------------------------\r\n',
        {},
      );
      for (let i in this.state.data) {
        let row = this.state.data[i];
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            row.folio.toString(),
            row.fecha.toString(),
            row.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
          ],
          {},
        );
      }
      
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText('Total consolidado:'+this.state.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+'\r\n', {});

      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
    } catch (e) {
      console.log(e);
      alert(
        'Existe problema de configuración con la impresora revise su conexion.',
      );
    }
  }
  handleSearch = text => {
    const formattedQuery = text.toLowerCase()
    const data = filter(this.state.data, user => {
      return this.contains(user, formattedQuery)
    })
   
    this.setState({ data, query: text })
  }

  contains = ({ usuario }, query) => {

    if (usuario.includes(query)) {
      return true
    }
    return false
  }

  renderHeader = () => {
    return (
      <View
      style={{
        backgroundColor: '#fff',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Input
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={this.handleSearch}
        status='info'
        placeholder='Search'
        style={{
          borderRadius: 25,
          borderColor: '#333',
          backgroundColor: '#fff'
        }}
        textStyle={{ color: '#000' }}
        clearButtonMode='always'
      />
    </View>
    );
  };

    
  

  render() {
    return (
      <ScrollView style={{marginTop: 30, height:1000}}>
        <Text
          style={{
            height: 100,
            padding: '5%',
            fontSize: 30,
            textAlign: 'center',
            color: 'black',
          }}>
          Filtrar por fechas
        </Text>

        <View style={{flexDirection: 'row', marginLeft: '10%', marginRight: '10%'}}>
          <DatePicker
            style={{width: 150, color: 'black'}}
            date={this.state.date1}
            mode="date"
            androidMode="default"
            placeholder="Fecha de Inicio"
            format="YYYY-MM-DD"
            minDate="2020-05-01"
            maxDate="2090-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {
              this.setState({date1: date});
            }}
          />
          <DatePicker
            style={{width: 150, color: 'black', marginLeft: 20}}
            date={this.state.date2}
            mode="date"
            androidMode="default"
            placeholder="Fecha de Termino"
            format="YYYY-MM-DD"
            minDate="2020-05-01"
            maxDate="2090-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {
              if (date < this.state.date1) {
                alert('la Fecha no puede ser menor a la de termino');
                this.setState({date1: ''});
              } else {
                this.setState({date2: date});
              }
            }}
          />
        </View>
        <View style={loginStyles.btnTransparent4}>
          <TouchableOpacity
            onPress={() => {
              this.resumen();
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Filtrar
            </Text>
          </TouchableOpacity>
        </View>
        
        {
          this.state.folioinicial?<View>
             
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Total de ventas Periodo: {this.state.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>
            <View style={loginStyles.btnTransparent4}>
          <TouchableOpacity
            onPress={() => {
              console.log(this.state);
              if(this.state.terminal==1){
                this.print();

              }else{
                this.imprimir();

              }

            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Imprimir
            </Text>
          </TouchableOpacity>
        </View>
          </View>:null
        }
        

        <SafeAreaView
          style={{
            flex: 1,
            padding: 10,
            marginBottom:200
          }}>
            {
              this.state.data?<FlatList
              ListHeaderComponent={this.renderHeader}
              data={this.state.data}
              renderItem={({item}) => this.renderItem(item)}
              keyExtractor={(item) => item.folio}
            />:null
            }
          
        </SafeAreaView>
      </ScrollView>
    );
  }
}
