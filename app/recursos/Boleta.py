#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
var1 = sys.argv[1] # nombre producto
var2 = sys.argv[2] # cantidad 
var3 = sys.argv[3] # precio 
var4 = sys.argv[4] # nombre archivo 
#print "Creando Boleta por un total $" print var3
# datos a utilizar
url = 'https://app.tdcom.cl'
hash = 'ajYng2hNw6V9wSvoFhVUSxgoxlq9mMon'
dte = {
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
    'Detalle': [
        {
            'NmbItem': var1,
            'QtyItem': var2,
            'PrcItem': var3,
        },
    ],
}

# módulos que se usarán
from os import sys
from libredte.sdk import LibreDTE

# crear cliente
Cliente = LibreDTE(hash, url)

# crear DTE temporal
emitir = Cliente.post('/dte/documentos/emitir', dte)
if emitir.status_code!=200 :
    sys.exit('Error al emitir DTE temporal: '+emitir.json())

# crear DTE real
generar = Cliente.post('/dte/documentos/generar', emitir.json());
if generar.status_code!=200 :
    sys.exit('Error al generar DTE real: '+generar.json())

# obtener el PDF del DTE
generar_pdf = Cliente.get('/dte/dte_emitidos/pdf/'+str(generar.json()['dte'])+'/'+str(generar.json()['folio'])+'/'+str(generar.json()['emisor']));
if generar_pdf.status_code!=200 :
    sys.exit('Error al generar PDF del DTE: '+generar_pdf.json())

# guardar PDF en el disco
with open(var4, 'wb') as f:
    f.write(generar_pdf.content)
	
