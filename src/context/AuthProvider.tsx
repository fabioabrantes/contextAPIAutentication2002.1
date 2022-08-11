import React,{createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import API from '../api'
import { isLoading } from 'expo-font';

interface User{
  id:number;
  name:string;
}

interface ResponseData{
  user:User | null,
  token:string;
}

interface IContexto{
  user:User | null,
  logar: (email:string, password:string)=> Promise<void>;
  deslogar(): Promise<void>;
  isLogado:boolean;
}
const AuthContext = createContext<IContexto>({} as IContexto);


export function AuthProvider({children}){
  const [user, setUser] = useState<User | null>(null);

  
  async function logar(email:string, password:string){   
    
    try {
      const dados ={
        email, password
      }
      const response =  await API.post('auth', dados);
      const {user, token} = response.data as ResponseData;

      API.defaults.headers.common.Authorization = `Bearer ${token}`;
    
      await AsyncStorage.setItem('Auth.user', JSON.stringify(user));
      await AsyncStorage.setItem('Auth.token', token);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }

  async function deslogar(){
    setUser(null);
    await AsyncStorage.removeItem('Auth.user');
    await AsyncStorage.removeItem('Auth.token');
  }

  useEffect(() => {
    async function loadStorage(){
      const userStorage= await AsyncStorage.getItem('Auth.user');
      const tokenStorage= await AsyncStorage.getItem('Auth.token');
      if(userStorage && tokenStorage){
        API.defaults.headers.common.Authorization = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      }
  
    }
    loadStorage();
  },[]);
  
  return (
    <AuthContext.Provider
      value={{logar,user,deslogar, isLogado:!!user}} 
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMyContext(){
  const contexto = useContext(AuthContext);
  return contexto;
}