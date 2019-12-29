import React from 'react';
import { Card, Button, CardTitle, CardText, CardFooter, Form, FormGroup, Label, Input, Image } from 'reactstrap';
import {JsonToExcel} from 'react-json-excel';


const className = 'class-name-for-style',
  filename = 'hansonland-list-data',
  fields = {
    "index": "Index",
    "guid": "GUID"
  },
  style = {
    padding: "10px",
    backgroundColor:'#00BFFF',
    fontSize:'10px',
    color:'#fff',
    borderRadius: '10px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  data = [
    { index: 0, guid: 'asdf231234'},
    { index: 1, guid: 'wetr2343af'}
  ];

const MessageCardForm = (props) => {
  return (

    <Card body className="message-form">

    <CardTitle onClick={props.cancelMessage}>X</CardTitle>
           
          <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
          <img src={require('./profile.png')}     
          style={{ width: 250, height: 250, borderRadius: 50,justifyContent:'center',
    alignItem:'center'}}
          />
  
          <Form style={{margin:25}} onSubmit={props.formSubmitted}>
           
            <FormGroup>
              <Label style={{fontSize:14, fontWeight:'bold'}} for="name">Nama</Label>
              <Label style={{fontSize:10}} for="name">{props.user.name}</Label>
            </FormGroup>
            <FormGroup>
              <Label style={{fontSize:14, fontWeight:'bold'}} for="message">Email</Label>
              <Label style={{fontSize:10}} for="message">{props.user.email}</Label>
            </FormGroup>
            
            <Button type="cancel" color="danger" onClick={props.logout}>Logout</Button>
           
            
            
          </Form> 
           <CardFooter><JsonToExcel
              data={props.data}
              className={className}
              filename={filename}
              fields={props.data}
              style={style}
            /></CardFooter>
           </div>
           
         
         
    </Card>
  );
};

export default MessageCardForm;