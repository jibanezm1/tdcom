import { StyleSheet } from 'react-native'
import color from './colors'

//Estilos para SplashScreen
const imageBackgroundStyle = StyleSheet.create({
    image: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: color.WHITE,
    }
})

//Estilos para LoginScreen
const loginStyles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
    },

    logo: {
        paddingTop: 50,
        alignItems: 'center',
    },

    btnMain: {
        width: 280,
        marginTop:40,
        marginBottom: 20,
        backgroundColor: color.BLUE,
        borderRadius: 60
    },

    btnTransparent: {
        backgroundColor: 'rgba(52, 52, 52, 0)',
        borderColor: color.BLUE,
        width: 280,
        borderWidth: 2,
        marginBottom: 20,
        borderRadius: 60
    },
    btnTransparent2: {
        backgroundColor: 'rgba(52, 52, 52, 0)',
        borderColor: color.BLUE,
        width: 100,
        marginRight:20,
        borderWidth: 2,
        marginBottom: 20,
        borderRadius: 60
    },
    btnTransparent3: {
        backgroundColor: 'rgba(52, 52, 52, 0)',
        borderColor: color.BLUE,
        width: 280,
        marginTop:20,
        marginRight:20,
        marginLeft:40,

        borderWidth: 2,
        marginBottom: 20,
        borderRadius: 60
    },
    btnTransparent4: {
        backgroundColor: 'rgba(52, 52, 52, 0)',
        borderColor: color.BLUE,
        width: 370,
        marginTop:20,
        marginRight:80,
        marginLeft:20,

        borderWidth: 2,
        marginBottom: 20,
        borderRadius: 60
    },
    btntxt: {
        textAlign: 'center',
        fontSize: 17,
        color: color.WHITE,
        paddingVertical: 15,
       // fontFamily: 'Poppins-Bold',
    },

    btntxt2: {
        textAlign: 'center',
        fontSize: 17,
        color: color.WHITE,
        paddingVertical: 15,
       // fontFamily: 'Poppins-Bold',
    },

    txtTransparent: {
        color: color.LIGHTPRIMARYCOLOR,
        fontSize: 14,
      //  fontFamily: 'Poppins-Light',
    }
})

export { loginStyles, imageBackgroundStyle }