import React from 'react';
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input, Image } from 'reactstrap';

const MessageCardForm = (props) => {
  return (
    <Card body className="message-form">

    <CardTitle onClick={props.cancelMessage}>X</CardTitle>

          <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
          <img src='https://cdn6.f-cdn.com/contestentries/1376995/30494909/5b566bc71d308_thumbCard.jpg'     
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
           </div>
    </Card>
  );
};

export default MessageCardForm;