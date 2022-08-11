import React, { useState } from 'react';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import { useTheme } from 'styled-components';
import {useFocusEffect} from '@react-navigation/native'

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
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductCardProps[]>([] as ProductCardProps[]);
  const [userAuth, setUserAuth] = useState<User | null>(null);
  
  const {user, deslogar} = useMyContext();
 
  const theme = useTheme();

  useFocusEffect(() => {
    setIsLoading(true);
    API.get('products').then(response => {
      setProducts(response.data);
      setUserAuth(user);
    });
    setIsLoading(false);
  });

 
  async function goToPageLogin(){
    await deslogar();
  }

  return (
    <Container>
         <Header>
            <UserContainer>
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
            {
              isLoading ?
                <Load/>
              :
                <ProductList
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{paddingBottom:getBottomSpace()}}
                  data={products}
                  keyExtractor={(item ) =>String(item.id)}
                  renderItem={({item})=>  <ProductCard data={item}/>}
                />
            }
          </Products>
    </Container>
  );
}