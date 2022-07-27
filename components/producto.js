import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';


const ELIMINAR_PRODUCTO= gql`
    mutation eliminarProducto($id: ID!, $eliminarProductoId: ID!) {
        eliminarProducto(id: $eliminarProductoId)
    }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      precio
      existencia
      creado
    }
  }
`;

 const Producto = ({producto}) => {
     const {nombre, precio, existencia, id} = producto;

     //Mutation para eliminar productos
     const [ eliminarProducto ] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const {obtenerProductos} = cache.readQuery({
                query: OBTENER_PRODUCTOS
            });

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter( productoActual => productoActual.id !== id)
                }
            })
        }
     });

    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: 'Deseas eliminar este producto?',
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
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    })

                    Swal.fire(
                        'Producto eliminado',
                        data.eliminarProducto,
                        'success'
                    )
                } catch (error) {
                    
                }
                
            }
          })
    }

    const editarProducto = () => {
        Router.push({
            pathname: "/editarproducto/[id]",
            query: { id }
        })
    }

     return (  
        <tr>
            <td className='border px-4 py-2' >{nombre}</td>
            <td className='border px-4 py-2' >{existencia} Piezas</td>
            <td className='border px-4 py-2' >$ {precio}</td>
            <td className='border px-4 py-2' >
                <button
                    type='button'
                    className='flex justify-center my-2 items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => 
                        confirmarEliminarProducto(id)
                    }
                >
                    Eliminar

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className='border px-4 py-2' >

                <button
                    type='button'
                    className='flex justify-center my-2 items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => 
                        editarProducto()}
                   
                >
                    Editar

                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>

            </td>


        </tr>
      );
 }
  
 export default Producto;