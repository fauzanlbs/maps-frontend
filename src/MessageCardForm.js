import React, {useEffect, useState} from 'react';
import { Card, Button, CardTitle, CardText, CardFooter, Form, FormGroup, Label, Input, Image } from 'reactstrap';
import { CSVLink } from "react-csv";
import logout from './logout.png';


const className = 'class-name-for-style',
  filename = 'hansonland-list-data',
  fields = {
    "no_peta_denah": "no_peta_denah1",
    "luas_tanah": "luas_tanah",
    "warna_wilayah": "warna_wilayah",
    "date": "date",
    "nama_penjual": "nama_penjual",
    "no_akta_jual_beli": "no_akta_jual_beli",
    "luas_awal": "luas_awal",
    "luas_akhir": "luas_akhir",
    "persil_no": "rensil_no",
    "girik_c": "girik_c",
    "sppt_pbb": "sppt_pbb",
    "pejabat_akta": "pejabat_akta",
    "pihak_pertama": "pihak_pertama",
    "pihak_kedua": "pihak_kedua",
    "saksi_pertama": "saksi_pertama",
    "saksi_kedua": "saksi_kedua",
    "tim_pembebasan": "tim_pembebasan",
    "tahun_pembebasan": "tahun_pembebasan",
    "alamat": "alamat",
    "blok": "jalan",
    "kabupaten_kota": "kabupaten_kota",
    "desa_kelurahan": "desa_kelurahan",
    "kecamatan": "kecamatan",
    "provinsi": "provinsi",
    "tgl_akta_jual_beli": "tgl_akta_jual_beli"
  },
  style = {
    padding: "20px",
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

  const [dataJson, setdataJson] = useState([]);

  useEffect(() => {
    console.log(props.data)
    let propertiesnya = props.data.map((dt)=> {
      let tes = {}
      tes = dt.properties;
      tes.koordinat = dt.geometry.coordinates;
      return tes;
    })
    setdataJson(propertiesnya)
    

  }, []);

  return (

    <Card body className="message-form" style={{backgroundColor:'#5F9EA0'}}>

    <CardTitle ><Button onClick={props.cancelMessage}>X </Button></CardTitle>
           
          <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
          <img src={require('./profile.png')}     
          style={{ width: 250, height: 250, borderRadius: 50,justifyContent:'center',
    alignItem:'center'}}
          />
  
          <Form style={{margin:25}} onSubmit={props.formSubmitted}>
          
            <div style={{margin:10}}>
            <FormGroup style={{justifyContent:'center', alignItems:'center'}}>
              <Label style={{fontSize:13, fontWeight:'bold'}} for="name">Nama</Label>
              <Label style={{fontSize:10}} for="name">{props.user.name}</Label>
            </FormGroup>
            <FormGroup style={{justifyContent:'center', alignItems:'center'}}>
              <Label style={{fontSize:13, fontWeight:'bold'}} for="message">Email</Label>
              <Label style={{fontSize:10}} for="message">{props.user.email}</Label>
            </FormGroup>
            </div>

            <div>
        <CSVLink data={dataJson}><img
             src="https://www.megaonlinetrading.id/download/download.png"
             width="130"
            height="50"/></CSVLink>
          </div>
            <div style={{marginLeft:40}}>
            <Button type="cancel" onClick={props.logout}><img
             src={logout}
             width="30"
            height="30"/></Button>
            </div>


          
           
            
            
          </Form> 
            
           </div>

         
    </Card>
  );
};

export default MessageCardForm;