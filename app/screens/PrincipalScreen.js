/**
 * Created by januslo on 2018/12/27.
 */

import React, {Component} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';

import {BottomSheet, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import EscPos from '@recursos/escpos';
import Tsc from '@recursos/tsc';
import {loginStyles} from '@styles/styles';
import color from '@styles/colors';
import AsyncStorage from '@react-native-community/async-storage';

var {height, width} = Dimensions.get('window');
var isEnabled = false;
var isEnableds = false;

export default class Home extends Component {
  _listeners = [];

  constructor(props) {
    super();
    this.check();
    this.check2();

    this.state = {
      devices: null,
      pairedDs: [],
      foundDs: [],
      bleOpend: true,
      loading: true,
      boundAddress: '',
      debugMsg: '',
      isVisible: false,
      isVisibles: false,
      isVisible3: false,
      isEnabledd:39,
      list3: props.navigation.state.params.sucursales,
      list2: [
        {
          title: 'Terminal SUMMI',
          titleStyle: {color: 'black'},
          onPress: () => {
            // this.setState({isEnabled: true});
            isEnableds = 1;
            this._storeDatas(1);
            this.setState({isVisibles: false});
          },
        },
        {
          title: 'Terminal Generico',
          titleStyle: {color: 'black'},
          onPress: () => {
            isEnableds = 2;
            this._storeDatas(2);
            this.setState({isVisibles: false});
          },
        },
        {
          title: 'Cancelar',
          containerStyle: {backgroundColor: '#2288dd'},
          titleStyle: {color: 'white'},
          onPress: () => this.setState({isVisibles: false}),
        },
      ],
      list: [
        {
          title: 'Boleta Normal',
          titleStyle: {color: 'black'},
          onPress: () => {
            // this.setState({isEnabled: true});
            this.state.isEnableds = 39;
            this.setState({isEnabledd:39});
            this._storeData(39);
            this.setState({isVisible: false});
          },
        },
        {
          title: 'Boleta Exenta',
          titleStyle: {color: 'black'},
          onPress: () => {
            isEnabled = 41;
            this.setState({isEnabledd:41});
            this._storeData(41);
            this.setState({isVisible: false});
          },
        },
        {
          title: 'Cancelar',
          containerStyle: {backgroundColor: '#2288dd'},
          titleStyle: {color: 'white'},
          onPress: () => this.setState({isVisible: false}),
        },
      ],
    };
  }

  componentDidMount() {
    //alert(BluetoothManager)
    console.log(this.state.list3 )
    BluetoothManager.isBluetoothEnabled().then(
      (enabled) => {
        this.setState({
          bleOpend: Boolean(enabled),
          loading: false,
        });
      },
      (err) => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          (rsp) => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          (rsp) => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }
  }

  async check() {
    const value = await AsyncStorage.getItem('@tipo');
    if (value !== null) {
      isEnabled = value;
      this.setState({isEnabledd:value});

      console.log(value);
      // this.setState({isEnabled: value});
    }
  }

  async sucursales() {
    const value = await AsyncStorage.getItem('@sucursales');
    if (value !== null) {
      this.setState({list3: value});
      // this.setState({isEnabled: value});
    }
  }

  async check2() {
    const value = await AsyncStorage.getItem('@terminal');
    if (value !== null) {
      isEnabled = value;
      // this.setState({isEnabled: value});
    }
  }

  

  async _storeData(result) {
    try {
      const jsonValue = JSON.stringify(result);

      await AsyncStorage.setItem('@tipo', jsonValue);
      const value = await AsyncStorage.getItem('@tipo');
      if (value !== null) {
        // We have data!!
        // this.setState({
        //   isEnabled: result,
        // });
        isEnabled = value;

        // console.log(this.state.isEnabled);
      } else {
        console.log('nada');
      }
    } catch (error) {
      // Error saving data
    }
  }


  async _storeDataS(result) {
    try {
      const jsonValue = JSON.stringify(result);
      console.log(result);
      await AsyncStorage.setItem('@codigosii', jsonValue);
      const value = await AsyncStorage.getItem('@codigosii');
      if (value !== null) {
        // We have data!!
        // this.setState({
        //   isEnabled: result,
        // });
        console.log('Sucursal actual:'+ value)
        // console.log(this.state.isEnabled);
      } else {
        console.log('nada');
      }
    } catch (error) {
      // Error saving data
    }
  }

  async _storeDatas(result) {
    try {
      const jsonValue = JSON.stringify(result);

      await AsyncStorage.setItem('@terminal', jsonValue);
      const value = await AsyncStorage.getItem('@terminal');
      if (value !== null) {
        // We have data!!
        // this.setState({
        //   isEnabled: result,
        // });
        isEnableds = value;

        // console.log(this.state.isEnabled);
      } else {
        console.log('nada');
      }
    } catch (error) {
      // Error saving data
    }
  }

  componentWillUnmount() {
    //for (let ls in this._listeners) {
    //    this._listeners[ls].remove();
    //}
  }

  _deviceAlreadPaired(rsp) {
    var ds = null;
    if (typeof rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {}
    }
    if (ds && ds.length) {
      let pared = this.state.pairedDs;
      pared = pared.concat(ds || []);
      this.setState({
        pairedDs: pared,
      });
    }
  }

  _deviceFoundEvent(rsp) {
    //alert(JSON.stringify(rsp))
    var r = null;
    try {
      if (typeof rsp.device == 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      //alert(e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = this.state.foundDs || [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          this.setState({
            foundDs: found,
          });
        }
      }
    }
  }

  _renderRow(rows) {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            key={new Date().getTime() + i}
            style={styles.wtf}
            onPress={() => {
              this.setState({
                loading: true,
              });
              BluetoothManager.connect(row.address).then(
                (s) => {
                  this.setState({
                    loading: false,
                    boundAddress: row.address,
                    name: row.name || 'UNKNOWN',
                  });
                },
                (e) => {
                  this.setState({
                    loading: false,
                  });
                  alert(e);
                },
              );
            }}>
            <Text style={styles.name}>{row.name || 'UNKNOWN'}</Text>
            <Text style={styles.address}>{row.address}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <BottomSheet
          isVisible={this.state.isVisible}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {this.state.list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        <BottomSheet
          isVisible={this.state.isVisibles}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {this.state.list2.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>

        <BottomSheet
          isVisible={this.state.isVisible3}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {this.state.list3.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={(value) => {
                this._storeDataS(l.codigo);
                this.setState({isVisible3:false})
              }}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.nombre}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        

        <View style={{marginTop: 50}}>
          <View style={styles.containerLogo}>
            <Image
              source={require('@recursos/images/logo.png')}
              style={{height: 150, width: 150}}
            />
          </View>
          <View style={styles.containerLogo2}>
            <Button
              title=" Tipo  de  Boleta"
              style={{marginBottom: 100, paddingTop: 10}}
              onPress={() => {
                this.setState({isVisible: true});
              }}
            />
          </View>
          <View style={styles.containerLogo2}>
            <Button
              title="       Sucursal       "
              style={{marginBottom: 100, paddingTop: 10}}
              onPress={() => {
                this.setState({isVisible3: true});
              }}
            />
          </View>
          <View style={styles.containerLogo2}>
            <Button
              title="Tipo de terminal"
              style={{marginBottom: 100, paddingTop: 10}}
              onPress={() => {
                this.setState({isVisibles: true});
              }}
            />
          </View>
          <View style={styles.containerLogo}>
            <Button
              disabled={this.state.loading || !this.state.bleOpend}
              onPress={() => {
                this._scan();
              }}
              title="Buscar terminal"
            />
          </View>
        </View>
        <View style={styles.containerLogo}></View>
        <Text style={(styles.title, {padding: 10})}>
          Tipo de Boleta Activa:
          <Text style={{color: 'blue'}}>
            {this.state.isEnabledd == 39 ? 'Boleta Normal' : 'Boleta Exenta'}
          </Text>
        </Text>

        <Text style={(styles.title, {padding: 10})}>
          Tipo de Terminal:
          <Text style={{color: 'blue'}}>
            {isEnableds == 1 ? 'Terminal SUMMI' : ' Terminal Generico'}
          </Text>
        </Text>

        <Text style={(styles.title, {padding: 10})}>
          Terminal Conectada:
          <Text style={{color: 'blue'}}>
            {!this.state.name ? 'No Devices' : this.state.name}
          </Text>
        </Text>

        {this.state.boundAddress.length == 0 ? (
          <View>
            <Text style={(styles.title, {padding: 10})}>
              Encontradas (tap para conectar):
            </Text>
            {this.state.loading ? <ActivityIndicator animating={true} /> : null}
            <View style={{flex: 1, flexDirection: 'column'}}>
              {this._renderRow(this.state.foundDs)}
            </View>
            <Text style={styles.title}>Conectadas anteriormente:</Text>
            {this.state.loading ? <ActivityIndicator animating={true} /> : null}
            <View style={{flex: 1, flexDirection: 'column'}}>
              {this._renderRow(this.state.pairedDs)}
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.containerLogo}>
              <Image
                source={require('@recursos/images/termal.png')}
                style={{height: 250, width: 250}}
              />
            </View>
          </View>
        )}

        <View style={(loginStyles.btnTransparent, {paddingTop: 50})}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
              Volver
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  _selfTest() {
    this.setState(
      {
        loading: true,
      },
      () => {
        BluetoothEscposPrinter.selfTest(() => {});

        this.setState({
          loading: false,
        });
      },
    );
  }

  _scan() {
    this.setState({
      loading: true,
    });
    BluetoothManager.scanDevices().then(
      (s) => {
        var ss = s;
        var found = ss.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = this.state.foundDs;
        if (found && found.length) {
          fds = found;
        }
        this.setState({
          foundDs: fds,
          loading: false,
        });
      },
      (er) => {
        this.setState({
          loading: false,
        });
        //alert('error' + JSON.stringify(er));
        console.log(JSON.stringify(er));
      },
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  containerLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  containerLogo2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    width: width,
    backgroundColor: '#eee',
    color: '#232323',
    paddingLeft: 8,
    paddingVertical: 4,
    textAlign: 'left',
  },
  wtf: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    textAlign: 'left',
  },
  address: {
    flex: 1,
    textAlign: 'right',
  },
});
