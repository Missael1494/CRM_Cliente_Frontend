import React, {useContext, useState} from 'react';
import Layout from '../components/Layout';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'


// context de pedidos
import PedidoContext from '../context/pedidos/PedidoContext';
import Swal from 'sweetalert2';


const NUEVO_PEDIDO = gql`
mutation nuevoPedido($input: PedidoInput){
    nuevoPedido(input: $input){
      id
    }
}
`;


const OBTENER_PEDIDOS = gql`
query obtenerPedidosVendedor {
  obtenerPedidosVendedor {
    id
    pedido {
      id
      cantidad
      nombre
    }
    cliente {
      id
      nombre
      apellido
      email
      telefono
    }
    vendedor
    total
    estado
  }
}
`



const NuevpPedido = () => {

    const router = useRouter();

    const [mensaje, setMensaje] = useState(null);


    // Utilizar contect y extrare sus funciones 
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;

    //console.log('total', total);


    //MUTATION para crear un nuevo pedido
    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
        update(cache, {data: {nuevoPedido}}) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
        }
        
    });

    const validarPedido = () => {
        return !productos.every( producto => producto.cantidad > 0 ) || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed " : ""
    }

    const crearNuevoPedido = async () => {

        const { id } = cliente;
        console.log('cliente_id', id)

        //  Remover lo no deseado de producto
        const pedido = productos.map( ({__typename, existencia, creado, ...producto}) => producto)
        console.log('pedido_sin_type', pedido);

        //const valoresInput = {pedido, total, cliente: id, estado:"COMPLETADO"}
        //console.log('valores_INPUT', valoresInput);

        try {
            const {data} = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido
                        
                    }
                }

            })
            //console.log('data_crear_pedido', data);
            router.push('/pedidos');

            // redireccionar 
            Swal.fire(
                'Correcto',
                'El pedido se registro correctamente',
                'success'

            )
        } catch (error) {
            console.log(error.message);
            setMensaje(error.message);

            setTimeout(() => {
                setMensaje(null);
            }, 3000);
        }

    }

    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto' >
                <p>{mensaje}</p>
            </div>
        )
    }

    return ( 


        <Layout>
            <h1 className='text-2xl text-gray-800 font-light' >Crear Nuevo Pedido</h1>

            {mensaje && mostrarMensaje()}

            <div className='flex justify-center mt-5' >
                <div className='w-full max-w-lg'>

                <AsignarCliente />
                <AsignarProductos />
                <ResumenPedido />
                <Total />

                <button
                    type='button'
                    className={` bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${ validarPedido() } `}
                    onClick={() => crearNuevoPedido()}
                >
                    Registrar Producto
                </button>

                </div>
            </div>

            
        </Layout>

        
     );
}
 
export default NuevpPedido;