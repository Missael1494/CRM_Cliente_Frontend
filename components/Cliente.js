import React from 'react'
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router'


const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!){
        eliminarCliente(id:$id)
    }
`;

const OBTENER_CLIENTES_USUARIO = gql`
  query obtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
  }
`

const Cliente = ({cliente}) => {

    // mutation para eliminar cliente
    const [ eliminarCliente ] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            // obtener una copia del objeto de cache
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO});

            // Reescribir wl cache 
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor : obtenerClientesVendedor.filter( clienteActual => clienteActual.id !== id)
                }
            })
        }
    });

    const { nombre, apellido, empresa, email, id } = cliente;

    const confirmarEliminarCliente = id => {
        //console.log('eliminando', id);
        Swal.fire({
            title: 'Deseas eliminar este usuario?',
            text: "Esta accion no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!',
            cancelButtonText: 'No, cancelar'
          }).then( async (result) => {
            if (result.isConfirmed) {

                try {

                    // Eliminar por ID
                    const { data } = await eliminarCliente({
                        variables: {
                                id
                            }
                        
                    })
                    console.log(data);

                    // Mostrar una alerta
                    Swal.fire(
                        'Eliminado!',
                        data.eliminarCliente,
                        'success'
                      )
                    
                } catch (error) {
                    console.log(error);
                }

                

              
            }
          })
    }

    const editarCliente = () => {
        Router.push({
            pathname: "/editarcliente/[id]",
            query: { id }
        })
    }

  return (
    <tr key={cliente.id}>
        <td className="border px-4 py-2">{nombre} {apellido} </td>
        <td className="border px-4 py-2">{empresa} </td>
        <td className="border px-4 py-2">{email}</td>
        <td className="border px-4 py-2">

            <button
                    type='button'
                    className='flex justify-center my-2 items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => 
                        confirmarEliminarCliente(id)
                    }
                >
                    Eliminar

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
            </button>

        </td>

        <td className="border px-4 py-2">

                <button
                    type='button'
                    className='flex justify-center my-2 items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => 
                        editarCliente()
                    }
                >
                    Editar

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

        </td>
                
            
    </tr>
  )
}


export default Cliente;