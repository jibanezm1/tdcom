import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

class FlatListWithSearch extends Component {
  constructor(props) {
    super();
    this.arrayholder = [];

    this.state = {
      data: '',
      search: '',
      url: '',
      contri: '',
      usuario: '',
      hash: '',
    };
    this.load();
  }

  load = async () => {
    const value = await AsyncStorage.getItem('@user');
    if (value !== null) {
      // We have data!!
      let valor = JSON.parse(value);
      this.setState({usuario: valor});
      this.setState({hash: valor.token});
      this.test();
      this.contri();
    } else {
      alert('Sesion ha caducado.');
    }
  };

  showItem = (data) => {
    this.test2(data);
    // this.props.navigation.navigate('imprimirc', {
    //   'data': data
    // } );
  };

  test = () => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + this.state.hash);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };
    //76955668
    // YWpZbmcyaE53NlY5d1N2b0ZoVlVTeGdveGxxOW1Nb246WA==

    console.log(this.state);
    fetch(
      this.state.usuario.url +
        '/api/dte/dte_emitidos/buscar/' +
        this.state.usuario.rut,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        this.setState({data: result});
        this.arrayholder = result;
      })
      .catch((error) => console.log('error', error));
  };

  test2 = (item) => {

    console.log(item);
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + this.state.hash);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    //76955668
    // YWpZbmcyaE53NlY5d1N2b0ZoVlVTeGdveGxxOW1Nb246WA==

    fetch(
      this.state.usuario.url +
        '/api/dte/dte_emitidos/info/'+item.dte+'/' +
        item.folio +
        '/' +
        this.state.usuario.rut +
        '?getXML=0&getDetalle=1&getDatosDte=1&getTed=0&getResolucion=1',
      requestOptions,
    )
      .then((response) => response.json())
      .then((resultado) => {
        this.setState({
          url:
            this.state.usuario.url +
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
        });

        var myHeaders = new Headers();
        myHeaders.append('Accept', 'application/json, image/png');
        myHeaders.append('Authorization', 'Basic ' + this.state.hash);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch(
          this.state.usuario.url +
            '/api/dte/dte_emitidos/info/'+item.dte+'/' +
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

        this.props.navigation.navigate('imprimirc', {
          paso1: resultado,
          paso2: this.state.contri,
          url: this.state.url,
          items: resultado.detalle,
          tipo: item.dte,
        });
      })
      .catch((error) => console.log('error', error));
  };

  contri = () => {
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + this.state.hash);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    //76955668
    // YWpZbmcyaE53NlY5d1N2b0ZoVlVTeGdveGxxOW1Nb246WA==

    fetch(
      this.state.usuario.url +
        '/api/dte/contribuyentes/info/' +
        this.state.usuario.rut,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        this.setState({contri: result});
      })
      .catch((error) => console.log('error', error));
  };

  renderHeader = () => {
    const {search} = this.state;
    return (
      <SearchBar
        placeholder="Buscar Documento"
        lightTheme
        onChangeText={(text) => this.searchAction(text)}
        autoCorrect={false}
        value={search}
      />
    );
  };
  searchAction = (text) => {
    const newData = this.arrayholder.filter((item) => {
      const itemData = `${item.folio}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
      search: text,
    });
  };

  renderItem = (item) => {

    return (
      <View key={item.key} style={styles.item}>
        <TouchableOpacity onPress={() => this.showItem(item)}>
          <Text>Documento Nº: {item.folio}</Text>
          <Text>Fecha: {item.fecha}</Text>
          <Text>Total: {item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.data}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={(item) => item.folio}
          ListHeaderComponent={this.renderHeader}
        />
      </SafeAreaView>
    );
  }
}
export default FlatListWithSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#c1dec5',
    marginBottom: 10,
  },
});
