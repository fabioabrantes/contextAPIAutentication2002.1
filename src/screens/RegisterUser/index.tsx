import {useState} from 'react';

import {
  StatusBar,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import {useForm} from'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {schemaValidationRegister} from '../../utils/validationYup';

import api from '../../api';

import {ButtonCustom} from '../../components/ButtonCustom';
import {InputForm} from '../../components/InputForm';


import { 
  Container,
  Header,
  SubTitle,
  Form,
  Footer,
} from './styles';



type FormData = {
  name?: string;
  email: string;
  password: string;
};

export function RegisterUser() {
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();

  const {
    control, 
    handleSubmit,
    formState: { errors } 
  } = useForm<FormData>({
    resolver:yupResolver(schemaValidationRegister)
  });
   

  async function handleRegisterUser({email,name,password}:FormData){
    const data = {
      name,
      email,
      password 
    }

    // aqui usar trycatch
    const user = await api.post('users',data);
    setIsLoading(false);
    console.log(user);

    navigation.navigate('Login');
  }

  return (
    <Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior="position"
          enabled
        >
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
              />

              <Header>
                <SubTitle>
                  Faça seu Cadastro no sistema do IFPB.
                </SubTitle>
              </Header>

              <Form>
              <InputForm 
                  iconName="edit"
                  name="name"
                  control={control}
                  placeholder="Digite seu nome"
                  autoCorrect={false}/* não fica corrigindo palavras */
                  autoCapitalize="none" /* não fica induzindo a colocar a primeira letra maiúscula */
                  error={errors.name}
                />
                
                <InputForm 
                  iconName="mail"
                  name="email"
                  control={control}
                  placeholder="Digite seu E-mail"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none" 
                  error={errors.email}
                />
                
                <InputForm 
                  iconName="lock"
                  name="password"
                  control={control}
                  placeholder="Digite sua Senha"
                  error={errors.password}
                />
              </Form>

              <Footer>
                <ButtonCustom
                  title="Cadastrar"
                  onPress={handleSubmit(handleRegisterUser)}
                  loading={isLoading}
                />
              </Footer>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Container>
  );
}