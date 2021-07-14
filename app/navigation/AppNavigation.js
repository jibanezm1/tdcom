import { createAppContainer } from 'react-navigation';
import { createStackNavigator  } from 'react-navigation-stack';
import   SpashScreen from '@screens/SpashScreen';
import   LoginScreen from '@screens/LoginScreen';
import   PrincipalScreen from '@screens/PrincipalScreen';
import   DashboardScreen from '@screens/Dashboard';
import   EmitirScreen from '@screens/Emitir';
import   EmitirgScreen from '@screens/Emitirg';

import   ListadoScreen from '@screens/Listado';
import   ImprimirScreen from '@screens/Imprimir';
import   ImprimirgScreen from '@screens/Imprimirg';
import   ImprimircScreen from '@screens/Imprimirc';
import   reporteScreen from '@screens/reporte';

import   SeleccionaScreen from '@screens/selecciona';

import   escposScreen from '@recursos/escpos';
import   tscScreen from '@recursos/tsc';



const appNavigation = createStackNavigator({

    Splash:{
        screen: SpashScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    Login:{
        screen: LoginScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    Principal:{
        screen: PrincipalScreen,
        navigationOptions:{
            headerShown : true,
            title:"Configuraciones"
        }
    },
    escpos:{
        screen: escposScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    tsc:{
        screen: tscScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    dashboard:{
        screen: DashboardScreen,
        navigationOptions:{
            headerShown : false,
            title:"Inicio"
        }
    },
    emitir:{
        screen: EmitirScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    emitirg:{
        screen: EmitirgScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    imprimir:{
        screen: ImprimirScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    imprimirg:{
        screen: ImprimirgScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    imprimirc:{
        screen: ImprimircScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    listado:{
        screen: ListadoScreen,
        navigationOptions:{
            headerShown : true,
            title:"Mis Ventas"
        }
    },
    selecciona:{
        screen: SeleccionaScreen,
        navigationOptions:{
            headerShown : false
        }
    },
    reporte:{
        screen: reporteScreen,
        navigationOptions:{
            headerShown : true,
            title:"Reporte de Ventas"
        }
    }


})

export default createAppContainer(appNavigation)