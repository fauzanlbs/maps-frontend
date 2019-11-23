import React, { Component } from 'react';
import {
  Container, Col, Form,
  FormGroup, Label, Input,
  Button, FormText, FormFeedback, Alert
} from 'reactstrap';
import Loader from 'react-loader-spinner'
import './Login.css';
import { Link } from "react-router-dom";
import Api from './API'


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      alertVisible: false,
      alertOnDismiss: false,
      isLoading: false
    }
    this.submitForm = this.submitForm.bind(this)

   }


async submitForm(){

  
  this.setState({
      isLoading: false
    })
  let data = {
    email: this.state.email,
    password: this.state.password
  }
  let api = new Api();
  await api.create();
  let client = api.getClient();
  client.post('/autentikasi', data).then((res)=>{
    
  
    if (res.data.status !== "error"){
    
      try{
        let user = res.data.data.user
        let token = res.data.data.token
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        console.log('ini localstoragenya',localStorage.getItem('user'))
        this.props.history.push('/maps');
      }catch(err){
        console.log('error save user data')
      }
    }
  }).catch((err)=>{
      console.log('ini errornya loh', err)
      this.setState({
        alertVisible: true
      })
  })

  this.setState({
    isLoading: true
  })
}

componentDidMount(){
  localStorage.clear()
}

 render() {

    return (
      <Container className="App">
        <h2>Log In</h2>
        <Form className="form">
          <Col>
            <FormGroup>
              <Label>Email</Label>
              <Input value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="myemail@email.com"
              
              />
            
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})}
                type="password"
                name="password"
                id="examplePassword"
                placeholder="********" />
              <Button color="primary" style={{marginTop:20}} className="px-4" onClick={this.submitForm}>Login</Button>
            </FormGroup>
          </Col>
          
      </Form>
      <Alert color="primary" isOpen={this.state.alertVisible} toggle={this.state.alertOnDismiss} fade={false}>
        Login gagal!
      </Alert>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '5vh'}}>
      <Loader
       visible={this.state.isLoading}
       type="Plane"
       color="#00BFFF"
       height={100}
       width={100}
       timeout={10000} //3 secs
      />
      </div>
      

      </Container>
    );
  }
}

export default Login;
