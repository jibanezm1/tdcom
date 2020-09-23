import React, {useState}  from 'react';
import {
    Text, 
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import MyTextInput from '@components/MyTextInput';
import color from '@styles/colors';
import { loginStyles } from '@styles/styles';
import AsyncStorage from '@react-native-community/async-storage';

export default function LoginScreen (props){

    const [hidePassword, setHidePassword ] = useState(false);

    const clearAppData = async function() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            await AsyncStorage.multiRemove(keys);
            props.navigation.navigate('Login');

        } catch (error) {
            console.error('Error clearing app data.');
        }
    }

    return(
        <ScrollView>
        <View style={[loginStyles.container, {padding:20}]}>
            <StatusBar backgroundColor={color.BLUE} translucent={true} />
            <View style={loginStyles.logo}>
                <Image source={require('@recursos/images/logo.png')}
                style={{height:250, width:250, marginBottom:50}} />
            </View>
            
            
            

            

            <View style={loginStyles.btnTransparent}>
                <TouchableOpacity onPress={()=>{
                     props.navigation.navigate('emitir');
                }}>
                <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
                    Documento por Total
                </Text>
                </TouchableOpacity> 
            </View>


            <View style={loginStyles.btnTransparent}>
                <TouchableOpacity onPress={()=>{
                     props.navigation.navigate('emitirg');
                }}>
                <Text style={[loginStyles.btntxt, {color: color.BLUE}]}>
                    Documento con Glosa
                </Text>
                </TouchableOpacity> 
            </View>

            <View style={loginStyles.btnTransparent}>
            <TouchableOpacity onPress={()=>{
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