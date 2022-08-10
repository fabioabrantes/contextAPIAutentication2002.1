import React, { useState } from 'react';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import { useTheme } from 'styled-components'; 
import {useNavigation,useFocusEffect} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useMyContext} from '../../context/AuthProvider';
import API from '../../api';

import {ProductCard,ProductCardProps} from '../../components/ProductCard';
import {Load} from '../../components/Load';

import { 
  Container,
  Header,
  UserContainer,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  LogoutButton,
  IconPower,
  Products,
  Title,
  ProductList
} from './styles';

interface User{
  id:number;
  name:string;
  
}

export function Home(){
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductCardProps[]>([] as ProductCardProps[]);
  const [userAuth, setUserAuth] = useState<User | null>(null);
  
  const {user, deslogar} = useMyContext();

  const navigation = useNavigation();
  
  const theme = useTheme();

  useFocusEffect(() => {
    API.get('products').then(response => {
      setProducts(response.data);
      setUserAuth(user);
      setIsLoading(false);
    })
  });

 /*  function goToPageProductDetail(id:number){
    navigation.navigate('ProductDetails',{id});
  } */

  function goToPageCreateProduct(){
    navigation.navigate('RegisterUser');
   
  }
  async function goToPageLogin(){
    await deslogar();
  }

  return (
    <Container>
      {
        isLoading ?
          <Load/>
        :
        <>
          <Header>
            <UserContainer index={1}>
              <UserInfo>
                <Photo source={{uri:'https://avatars.githubusercontent.com/u/62598805?v=4'}}/>
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{userAuth?.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={goToPageLogin}>
                <IconPower name="power" color={theme.colors.main_light}/>
              </LogoutButton>
            </UserContainer>
          </Header>
     
          <Products>
            <Title>Listagem de Produtos</Title>

            <ProductList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom:getBottomSpace()}}
              data={products}
              keyExtractor={(item ) =>String(item.id)}
              renderItem={({item})=>  <ProductCard data={item}/>}
            />
          </Products>
        </>
      }
    </Container>
  );
}