import React, {useState, useEffect}  from 'react';
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
    Alert
} from 'react-native';
import { Button, Card, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dialog } from 'react-native-simple-dialogs';
import color from '@styles/colors';
import { loginStyles } from '@styles/styles';

import {BluetoothEscposPrinter, BluetoothManager, BluetoothTscPrinter} from"react-native-bluetooth-escpos-printer";
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input'



export default function EmitirScreen (props){
    
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisible1, setDialogVisible1] = useState(false);

  const [terminado, setTerminado ] = useState(true);
  const [text, setText] = useState('');
  const [nompreprod, setNompreprod] = useState('');
  const [valorprod, setValorprod] = useState('');
  const [totalProd, setTotalProd] = useState(0);
  const [cantidadProd, setCantidadProd] = useState(1);
  const [global, setGlobal] = useState(0);

    const [dispositivo, setDispositivo ] = useState();
    const [total, setTotal ] = useState();
    const [urls, setUrls ] = useState("");
    const [list, setList ] = useState([]);

    
    

    const [estado, setearState ] = useState();
    const [hash, setHash ] = useState();
    const [paso1, setPaso1 ] = useState();
    const [paso2, setPaso2 ] = useState();
    const [hidePassword, setHidePassword ] = useState(false);
    var dateFormat = require('dateformat');



    useEffect(()=>{

        load();

        

        var  _listeners = [];
        let respuesta;
        
        if (Platform.OS === 'ios') {
            let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            _listeners.push(bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
                (rsp)=> {
                    console.log(rsp);
                    setDispositivo(rsp);
                }));
            
            
        } else if (Platform.OS === 'android') {
         
            _listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_CONNECTED, (rsp)=> {
                  console.log(rsp);
                    setDispositivo(rsp);
                }));
            _listeners.push(DeviceEventEmitter.addListener(
                BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp)=> {
                    console.log(rsp);
                    setDispositivo(rsp);
                }));           
        }
      },[]);


      const renderRow = productos => {

        console.log(productos.item.QtyItem);
        return ( <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
         
          <Button
          icon={
            <Icon
              name="trash"
              size={20}
              color="white"
            />
          } 
          onPress={() =>{
            const filteredData = list.filter(item => item.NmbItem !== productos.item.NmbItem);
            setList(filteredData);
            var total =0;
            list.map((item) =>{
               total = parseInt(total) + parseInt(item.PrcItem);
            });
            setGlobal(total);


          }} 
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{productos.item.NmbItem}</Text>
          <Text style={styles.restaurantDescription}>
            Cantidad: {productos.item.QtyItem}
          </Text>
          <Text style={styles.restaurantDescription}>
            Total: ${productos.item.PrcItem}
          </Text>
        </View>
      </View>);
    
 
    
        
      }


      const load = async () => {

        const value = await AsyncStorage.getItem('@user');
        if (value !== null) {
          // We have data!!
         // console.log(value);
         let valor = JSON.parse(value);
          setearState(valor);
          setHash(valor.token);
          
        }else{
            alert("Sesion ha caducado.");
        }
      }


      const generar = (resultado) =>{
        console.log(resultado);
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic "+hash);
        myHeaders.append("Accept", "application/json, image/png");

   
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        //  https://app.tdcom.cl/dte/dte_emitidos/pdf/39/24/1/76955668/76955668/2020-06-26/13000
        // "https://app.tdcom.cl/api/dte/dte_emitidos/escpos/"+resultado.dte+"/"+resultado.folio+"/"+resultado.emisor+"?copias_tributarias=1&copias_cedibles=1&cedible=1&compress=0&base64=0"
        
        
        
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
         
          setPaso1(resultado);
          var contri = JSON.parse(this.responseText);
          setPaso2(contri);
          setUrls(estado.url+"/dte/dte_emitidos/pdf/"+resultado.dte+"/"+resultado.folio+"/"+resultado.certificacion+"/"+resultado.emisor+"/"+resultado.fecha+"/"+resultado.total);
          
          console.log(terminado);
          setTerminado(false);
          
        }
        });

        xhr.open("GET", estado.url+"/api/dte/contribuyentes/info/"+resultado.emisor);

       // xhr.open("GET", "https://app.tdcom.cl/api/dte/dte_emitidos/info/"+resultado.receptor+"/"+resultado.dte+"/3f17b99ed5c43ac8fc5af652f27b1388/"+resultado.emisor+"?getDatosDte=1");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Authorization", "Basic "+hash);

        xhr.send();
        
        
        
        //-----------------------------------------------------------------------------------------
    

        
      }

      const test = () =>{
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic "+hash);
        
        var raw = JSON.stringify({
            'Encabezado': {
                'IdDoc': {
                    'TipoDTE': 39,
                },
                'Emisor': {
                    'RUTEmisor': '76.955.668-0',
                },
                'Receptor': {
                    'RUTRecep': '66666666-6',
                    'RznSocRecep': 'Persona sin RUT',
                    'GiroRecep': 'Particular',
                    'DirRecep': 'Santiago',
                    'CmnaRecep': 'Santiago',
                },
            },
            'Detalle': list,
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
            body: raw,
          redirect: 'follow'
        };
        
        fetch(estado.url+"/api/dte/documentos/emitir", requestOptions)
          .then(response => response.text())
          .then(result => {
            var response = JSON.stringify(result);
           
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Basic "+hash);
            
       
            
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: result,
              redirect: 'follow'
            };
            
            fetch(estado.url+"/api/dte/documentos/generar", requestOptions)
              .then(response => response.text())
              .then(result => {
                const value = JSON.parse(result);

                generar(value);
              }
                )
              .catch(error => console.log('error', error));
          }
            
           
            
            )
          .catch(error => console.log('error', error));
      }
   
   

    const quitar = (cadena) =>{
      const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
      return cadena.split('').map( letra => acentos[letra] || letra).join('').toString();	
    
    }
  

    const buscaproducto = () =>{

      var myHeaders = new Headers();
      
      var formdata = new FormData();
      formdata.append("submit", "ok");
      formdata.append("Codigo", text);
      formdata.append("Contribuyente", estado.rut);
      formdata.append("server", estado.url);
      
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
      };
      
      fetch("http://142.93.250.218/api/web/index.php/item/listar", requestOptions)
        .then(response => response.json())
        .then(result => {

          if(result==2){
            Alert.alert("El Producto no existe en la base.");
            setText('');
          }else{
          
            if(result.bruto==true){
              let descuento = parseInt(result.precio) * 0.19;
              let total = parseInt(result.precio)+descuento;
              setValorprod(total);
              setTotalProd(total);
            }else{
              setValorprod(result.precio);
              setTotalProd(result.precio);
            }
          
            setNompreprod(result.item);
            setText('');


          setDialogVisible(true);
          }
         
          
        })
        .catch(error => console.log('error', error));

    }

    const imprimir = async (resultado, result) => {
      const dire = estado+"/dte/dte_emitidos/pdf/"+resultado.dte+"/"+resultado.folio+"/"+resultado.certificacion+"/"+resultado.emisor+"/"+resultado.fecha+"/"+resultado.total;
  
        var contri = result;
  
  
          try {
  
            await BluetoothEscposPrinter.printerInit();
            await BluetoothEscposPrinter.printerLeftSpace(0);
  
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.setBlob(0);
  
            await BluetoothEscposPrinter.setBlob(0);
            await  BluetoothEscposPrinter.printText("TDCOM\r\n", {
                encoding: 'UTF-8',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1
            });
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
            await  BluetoothEscposPrinter.printText("Razon Social "+contri.razon_social+"\r\n", {});
            await  BluetoothEscposPrinter.printText("Rut "+contri.rut+"-"+contri.dv+"\r\n", {});
            await  BluetoothEscposPrinter.printText("BOLETA ELECTRONICA No "+resultado.folio+" \r\n", {});
            
           const giro =  quitar(contri.giro);
            
            await  BluetoothEscposPrinter.printText("Giro: " + giro + "\r\n", { encoding: 'UTF-8'});
            await  BluetoothEscposPrinter.printText("Fecha: " + resultado.fecha_hora_creacion + "\r\n", {});
  
            await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            let columnWidths = [6, 12, 6, 8];
            await BluetoothEscposPrinter.printColumn(columnWidths,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["ID", 'Detalle', 'Monto', 'Total'], {});
  
  
  
            await BluetoothEscposPrinter.printColumn(columnWidths,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["1", 'Item', resultado.total.toString(), resultado.total.toString()], {});
          
            await  BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await  BluetoothEscposPrinter.printText("El IVA de esta boleta es: "+resultado.iva+"\r\n", {});
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printerLeftSpace(1);
            await  BluetoothEscposPrinter.printQRCode(props.navigation.state.params.url, 320, BluetoothEscposPrinter.ERROR_CORRECTION.L );//.then(()=>{alert('done')},(err)=>{alert(err)});
            await  BluetoothEscposPrinter.printText("Copia Cliente\r\n", {});
            await  BluetoothEscposPrinter.printText("Validada como Boleta\r\n", {});
            await  BluetoothEscposPrinter.printText("Autorizada por el SII\r\n", {});
            await  BluetoothEscposPrinter.printText("RES. EX. NRO.8 24/01/2018\r\n", {});
  
            
            await  BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
  
  
          
             
          } catch (e) {
              alert("Existe problema de configuración con la impresora revise su conexion.");
          }
      }  


    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "center"
      },
      restaurantName: {
        fontWeight: "bold",
      },
      viewRestaurant: {
        flexDirection: "row",
        padding:10,
      },
      viewRestaurantImage: {
        marginRight: 15,
      },
      restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 200,
      },
      restaurantAddress: {
        paddingTop: 2,
        color: "grey",
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
        alignItems: 'center'
      },
    cameraIcon: {
            margin: 5,
            height: 40,
            width: 40
        },
     bottomOverlay: {
            position: "absolute",
            width: "100%",
            flex: 20,
            flexDirection: "row",
            justifyContent: "space-between"
        },
      horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
      }
    });

    const footer = () => {
      if(global!=0){
        return(
          <View style={styles.headerStyle}>
            <Text style={styles.titleStyle}>Total de la boleta: ${global}</Text>
          </View>);
      }else{
        return null;
      }
    }

    return(<ScrollView
        contentContainerStyle={{
          flexGrow: 2,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop:50,
          paddingBottom:50,
        
        }}
      >
        <Dialog
            visible={dialogVisible}
           onTouchOutside={() => setDialogVisible(false)} >
            
    <View>
  
  
 
    <Text style={{marginBottom: 10,  textAlign: 'center', fontSize:20, padding:10}}>
    {nompreprod} 
    </Text>
    
    <View style={{alignItems: 'center', marginBottom:15}}>

    <NumericInput 
          onChange={value =>{
                console.log(value);
                setCantidadProd(value);
                 let total = value * valorprod;
                 setTotalProd(total);
          }}
          rounded
          minValue={1}
          initValue={1}
          maxValue={30} 
          textColor='black' 
          iconStyle={{ color: 'white' }} 
          rightButtonBackgroundColor='#5791ef' 
          leftButtonBackgroundColor='#5791ef'/>
   <Text style={{marginBottom: 10,  textAlign: 'center', fontSize:20, padding:10}}>
    ${totalProd} 
    </Text> 
             
  </View>
  <Button
   
   style={{marginTop: 10}}
  onPress={(value)=>{

    list.find((element) => {
      if(element.NmbItem == nompreprod){
        element.cantidadProd = element.cantidadProd + cantidadProd;
        let totales = (parseFloat(totalProd) + parseFloat(global));
        setGlobal(totales);
        setCantidadProd(1);
        setDialogVisible(false);
        return false;
      }
    })

    if(value==0){
      setCantidadProd(1);
    }

    setList([...list, {
        NmbItem: nompreprod,
        QtyItem: cantidadProd,
        PrcItem: valorprod
    }]);
    let totales = (parseFloat(totalProd) + parseFloat(global));
    setGlobal(totales);
    setCantidadProd(1);
    setDialogVisible(false);
  }}
  icon={
    <Icon
      name="plus"
      size={20}
      color="white"
    />
  }
  title=" Agregar"
/>


</View>

  
        </Dialog>


        <Dialog
            visible={dialogVisible1}
           
            onTouchOutside={() => setDialogVisible1(false)} >
            <View>
            <Text style={{textAlignVertical: "center",textAlign: "center"}}>Procesando Boleta</Text>
                <View style={{alignItems: 'center'}}>
                  {
                    terminado?<ActivityIndicator style={{paddingBottom:10}} size="large" />:<Image source={require('@recursos/images/checkk.png')}
                   />
                  }
                  
                  <Button
                    disabled={terminado}
                    onPress={() =>{
                      setDialogVisible1(false)
                      props.navigation.navigate('imprimirg',{
                        'paso1':paso1,
                        'paso2':paso2,
                        'url':urls,
                        'items':list
                      });
                    }}
                    title="Imprimir o Compartir"
                    color="#1c86f3"
                    accessibilityLabel="Boleta Generada"
                  />

                  

                </View>
            </View>
        </Dialog>

        
        <View style={[loginStyles.container, {padding:10}]}>


        <View style={{padding: 10}}>
      <TextInput
        style={{height: 40, backgroundColor:"#ced2d6", padding:10}}
        placeholderTextColor="black"
        
        placeholder="Ingrese el Codigo del Producto"
        onChangeText={text => setText(text)}
        defaultValue={text}
        onSubmitEditing={() =>{
              
          buscaproducto();
        }}
      />

{/* <Button
  onPress={()=>{
    setDialogVisible(true);
  }}
  icon={
    <Icon
      name="camera"
      size={20}
      color="white"
    />
  }
  title=" Escanear con la camara"
/> */}
     
<ScrollView
        contentContainerStyle={{
          flexGrow: 2,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop:50,
          paddingBottom:50,
        
        }}
      >

        {
          list.length > 0? <FlatList
          
          keyExtractor={(item,index) => index.toString()}
          data={list}
          renderItem={renderRow}
          ListFooterComponent={footer}

    /> : <Image source={require('@recursos/images/lista.png')}
          style={{height:250, width:250, marginBottom:40}} />
        }
      

      </ScrollView>
      

      {
          list.length > 0?<View style={loginStyles.btnTransparent}>
          <TouchableOpacity onPress={()=>{
             if(list){
              setDialogVisible1(true);
              test();
             }
               
              
          }}>
            
          <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
          Generar Documento
          </Text>
          </TouchableOpacity> 
      </View>  : null
        }
        



        <View style={loginStyles.btnTransparent}>
            <TouchableOpacity onPress={()=>{
          props.navigation.push('selecciona');
          }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
            Volver
            </Text>
            </TouchableOpacity> 
        </View>

 
      
    </View>




        
        

      </View>
      </ScrollView>)
 
}