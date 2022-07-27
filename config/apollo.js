import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "apollo-link-context";
//import fetch from 'node-fetch'


const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
})

const authLink = setContext((_, {headers}) => {

    //leer el storage almacenado
    const token = localStorage.getItem('token');
     
    return {
        headers: {
            ...headers,
            autorization: token ? `Bearer ${token}` : '',
            miPropioHeader: 'Hola!!'
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: authLink.concat( httpLink )
});


export default client;