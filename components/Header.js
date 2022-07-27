import { gql, useQuery } from '@apollo/client';
import React from 'react'
import { useRouter } from 'next/router';


const OBTENER_USUARIO = gql`
    query obtenerUsuario{
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header = () => {

    const router = useRouter();

    // query de apollo
    const { data, loading, error, client } = useQuery(OBTENER_USUARIO);


    //proteger que no accedamos a data antes de tener resultados 
    if (loading) {
        return null;
    }

    if(!data) {
        return router.push('/login');
    }
    
    const {nombre, apellido} = data.obtenerUsuario; 

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        client.clearStore();
        router.push('/login');
    }

  return (
      <div className='sm:flex sm:justify-between mb-6'>
        <p className='mr-2'>Hola: {nombre} {apellido}</p>

        <button 
        onClick={() => cerrarSesion()}
            type='button'
            className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md'
        >
            Cerrar Sesión
        </button>
        
      </div>
  )
}

export default Header;
