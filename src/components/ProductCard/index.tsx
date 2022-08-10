import React from 'react';

import { 
  Container,
  Title,
  Amount,
  Footer,
  Description
 } from './styles';

export interface ProductCardProps {
  id:number;
  name:string;
  price:number;
  description:string;
}

interface Props {
  data: ProductCardProps;
}

export function ProductCard({data}:Props){
  return (
    <Container key={data.id}>
      <Title>{data.name}</Title>

      <Amount>R$ {data.price} </Amount>

      <Footer>
        <Title>Descrição</Title>
        <Description>{data.description}</Description>
      </Footer>
    </Container>
  );
}