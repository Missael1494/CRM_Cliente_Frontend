import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CATIDAD_PRODUCTOS,
    ACTUALIZAR_TOTAL
} from '../../types'

const PedidoState = ({children}) => {

    // State de Pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0
    }

    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    // Modifica el cliente
    const agregarCliente = (cliente) => {
        console.log(cliente);

        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente
        })
    }

    // Modifica los productos
    const agregarProductos = (productosSeleccionados) => {
        //console.log('agregarproductos_SELECCIONADOS', productosSeleccionados);

        let nuevoState;
        if(state.productos.length > 0) {
            // Tomar del segundo arreglo, una copia para asignarlo al primero
            nuevoState = productosSeleccionados.map( producto => {
                const nuevoObjeto = state.productos.find( productoState => productoState.id === producto.id )
                return {...producto, ...nuevoObjeto}
            })

        } else {
            nuevoState = productosSeleccionados;
        }

        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: nuevoState
        })
    }

    // Modifica las cantidades de los pedidos
    const cantidadProductos = ( nuevoProducto) => {
        //console.log(' desde pedidoState');
        dispatch({
            type: CATIDAD_PRODUCTOS,
            payload: nuevoProducto
        })
    }

    const actualizarTotal = () => {
        //console.log('calculando...');
        dispatch({
            type: ACTUALIZAR_TOTAL
        })
    }


    return  (
        <PedidoContext.Provider
            value={{
                cliente: state.cliente,
                productos: state.productos,
                total: state.total,
                agregarCliente,
                agregarProductos,
                cantidadProductos,
                actualizarTotal
            }}
        >
            {children}
        </PedidoContext.Provider>
    )
}

export default PedidoState;
