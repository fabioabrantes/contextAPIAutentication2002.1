import {useState} from 'react';

import {
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useMyContext} from '../../context/AuthProvider';

import {useForm} from'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {schemaValidationRegisterProduct} from '../../utils/validationYup';

import api from '../../api';

import {ButtonCustom} from '../../components/ButtonCustom';
import {InputForm} from '../../components/InputForm';


import { 
  Container,
  Header,
  UserContainer,
  UserInfo,
  Photo,
  User,
  UserName,
  Product,
  ProductText,
  Form,
  Footer,
} from './styles';



type FormData = {
  name?: string;
  price: string;
  description: string;
};

interface User{
  id:number;
  name:string;
}

export function RegisterProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [userAuth, setUserAuth] = useState<User | null>(null);

  const navigation = useNavigation();
  const {user} = useMyContext();
  
  const {
    control, 
    handleSubmit,
    formState: { errors } 
  } = useForm({
    resolver:yupResolver(schemaValidationRegisterProduct)
  });
   
 
  async function handleRegisterProduct({name,price,description}:FormData){
    const data = {
      name,
      price:parseFloat(price),
      description 
    }

    setIsLoading(true);
    await api.post('products',data);
    setIsLoading(false);

    navigation.navigate('Home');
  }

  useFocusEffect(()=>{
    setUserAuth(user);
  });

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="position" enabled>
              <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
              />
              <Header>
                <UserContainer>
                  <UserInfo>
                    <Photo source={{uri:'https://avatars.githubusercontent.com/u/62598805?v=4'}}/>
                    <User>
                      <UserName>{userAuth?.name}</UserName>
                    </User>
                  </UserInfo>

                  <Product>
                     <ProductText>Cadastre o Produto no sistema do IFPB.</ProductText>
                  </Product>
                </UserContainer>
              </Header>

              <Form>
                <InputForm 
                  iconName="edit"
                  name="name"
                  control={control}
                  placeholder="Digite o nome do produto"
                  autoCorrect={false}/* não fica corrigindo palavras */
                  autoCapitalize="none" /* não fica induzindo a colocar a primeira letra maiúscula */
                  error={errors.name}
                />
                
                <InputForm 
                  iconName="edit"
                  name="price"
                  control={control}
                  placeholder="Digite o preço do produto"
                  autoCorrect={false}/* não fica corrigindo palavras */
                  autoCapitalize="none" /* não fica induzindo a colocar a primeira letra maiúscula */
                  error={errors.price}
                />
                
                <InputForm 
                  iconName="edit"
                  name="description"
                  control={control}
                  placeholder="Digite a descrição do produto"
                  autoCorrect={false}/* não fica corrigindo palavras */
                  autoCapitalize="none" /* não fica induzindo a colocar a primeira letra maiúscula */
                  error={errors.description}
                />
              </Form>

              <Footer>
                <ButtonCustom
                  title="Cadastrar"
                  onPress={handleSubmit(handleRegisterProduct)}
                  loading={isLoading}
                />
              </Footer>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Container>
  );
}