import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup,FeatureGroup, Circle, Polygon, LayersControl, GeoJSON, WMSTileLayer, withLeaflet } from 'react-leaflet';

import { Card, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter,
TabContent, TabPane, Nav, NavItem, NavLink,  CardTitle, Row, Col, Form, FormGroup, Label, Input, FormText  } from 'reactstrap';
import classnames from 'classnames';

import { EditControl } from "react-leaflet-draw"
import PrintControlDefault from 'react-leaflet-easyprint';

import hash from 'object-hash';


import userLocationURL from './user_location.svg';
import messageLocationURL from './message_location.svg';

import MessageCardForm from './MessageCardForm';
import { getLocation } from './API';

import Api from './API';

import './App.css';
import london_postcodes from './london.json'


const PrintControl = withLeaflet(PrintControlDefault);

const { BaseLayer, Overlay } = LayersControl
const myIcon = L.icon({
  iconUrl: userLocationURL,
  iconSize: [50, 82]
});

const messageIcon = L.icon({
  iconUrl: messageLocationURL,
  iconSize: [50, 82]
});

const multiPolygon = [
  [[51.505, -0.12], [51.505, -0.13], [51.53, -0.13]],
  [[51.505, -0.05], [51.51, -0.07], [51.53, -0.07]],
]

const multiPolygon2 = [
  [[51.505, -0.18], [51.505, -0.17], [51.52, -0.17]],
  [[51.505, -0.11], [51.505, -0.29], [51.50, -0.07]],
]

class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    location: {
      lat: -6.273545691905462,
      lng: 106.72507524490355,
    },
    haveUsersLocation: false,
    zoom: 18,
    userMessage: {
      name: '',
      message: ''
    },
    sideBarVisible: false,
    sendingMessage: false,
    sentMessage: false,
    messages: [],
    modal: false,
    activeTab: '1',
    streetView: null,
    geojsonApi: [],
    user:{}
  }


  this.baseMaps = [

      {
        name: 'Google Satellite',
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        attribution: '&copy; Google',
        type: 'tile',
        checked: true
      },
      {
        name: 'OpenStreet Map',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Imagery Firefly',
        url: 'http://fly.maptiles.arcgis.com/arcgis/rest/services/World_Imagery_Firefly/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Street Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Topo Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Ocean Basemap',
        url: 'http://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri',
        type: 'tile'
      },
     
      {
        name: 'ArcGIS World Dark Gray Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, DeLorme, HERE',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Dark Gray Map with Label',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        attribution: '',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Light Gray Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, NAVTEQ, DeLorme',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Light Gray Map with Label',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        attribution: '',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Imagery',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Imagery with Label',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        attribution: '',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Transportation Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        attribution: '',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Shaded Relief Map',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, NAVTEQ, DeLorme',
        type: 'tile'
      },
      {
        name: 'ArcGIS World Shaded Relief Map with Label',
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}',
        attribution: '',
        type: 'tile'
      },
     
      {
        name: 'ArcGIS World Imagery Clarity',
        url: 'http://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
        type: 'tile'
      },
      
      
    ];




    this.toggle = this.toggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
  }
  
 
 renderBaseLayerControl() {
    return (
      <LayersControl position="bottomleft">
        { this.baseMaps.map(({ name, url, attribution, type, layer, format, checked = false }) => {
          return type === 'wms' ? (
            <LayersControl.BaseLayer key={name} name={name} checked={checked} >
              <WMSTileLayer
                layers={layer}
                format={format}
                transparent={false}
                url={url}
                attribution={attribution}
               />
            </LayersControl.BaseLayer>
          ) : (
            <LayersControl.BaseLayer key={name} name={name} checked={checked} >
              <TileLayer
                attribution={attribution}
                url={url}
              />
            </LayersControl.BaseLayer>
          );
        }) }
        <LayersControl.BaseLayer name="ImageryLabels" >
          <FeatureGroup>
              <TileLayer
                attribution="Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community"
                url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <TileLayer
                attribution=""
                url="http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              />
              <TileLayer
                attribution=""
                url="http://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
              />
          </FeatureGroup>
        </LayersControl.BaseLayer>
      </LayersControl>
    );
  }

  
  geoJSONStyle() {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: '#fff2af',
    }
  }

  onEachFeature(feature: Object, layer: Object) {
    console.log('ini objectnya',feature)
    const popupContent = ` <Popup><p>Customizable Popups <br />with feature information.</p><pre>Borough: 
    <br />${feature.properties.name}
    <br />${feature.properties.alamat}
    </pre></Popup>`
    layer.bindPopup(popupContent)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  valueChanged = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }))
  }

  async componentDidMount() {

    //get api all

    let token = localStorage.getItem('token');
    let userStorage = localStorage.getItem('user');
    let convertUser = JSON.parse(userStorage);
    
    console.log('token di main', token)
    console.log('user di main', convertUser)

    if(token){
      console.log('masuk setelah validasi token')
        let api = new Api()
        await api.create();
        let client = api.getClient()
        client.get('/lokasi').then((res) => {
          this.setState({
            geojsonApi: res.data.data.lokasis
          })
          console.log('ini geojson didmount', this.state.geojsonApi)
        }).catch((err)=>{
          console.log('ini errornya', err)
        })

    }else{
      this.props.history.push('/');
    }

    

  }

  _onCreate = (data) => {
    
    console.log('state', this.state)
    // data.sourceTarget._layers.eachLayer(a => {
    //   console.log('ini isinya loh', a.toGeoJSON())
    // });
    // data.sourceTarget
    let test = {
    "cat" : "meong",    
    "size" : "XL"   
      };
    //data.layer.options.push(test);
    //console.log('oncreate', data)
    
    let coba = data.layer.toGeoJSON();
    
    // coba["properties"]["coba"] = "lagi";
    console.log(coba,'coba ini');
  }

  _onEdit = (data) => {
    console.log('onEdit', data)
    console.log('state', this.state)
  }

  _onDelete = (data) => {
    console.log('ondelete', data)
    console.log('state', this.state)
  }

  _onEditVertex = (data) => {
    console.log('oneditvertex', data)
    console.log('state', this.state)
  }

  _onClickMap = (data) => {
    console.log('ini data yg di klik', data)
    data.layer.options.color = "red";
    let test = data.layer.toGeoJSON();

    if(test.properties.length !== 0){
      console.log('sudah dua kali');
    }
    test["properties"]["cobain"] = "lagiz";
    console.log('ini di klik map: ', test)
    console.log('ini refnya', this._editableFG);
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if(!this._editableFG){
      return;
    }

    

  }


  _editableFG = null

  _onFeatureGroupReady = (reactFGref) => {

    // populate the leaflet FeatureGroup with the geoJson layers

    let leafletGeoJSON = new L.GeoJSON(london_postcodes);
    // console.log('ini leafletgeojson: ',leafletGeoJSON);
    // console.log('ini refnya ', reactFGref)
    if(reactFGref){
      let leafletFG = reactFGref.leafletElement;

      
    }

      
    
    // console.log('ini convertnya', leafletFG);

   

    // // store the ref for future access to content

     this._editableFG = reactFGref;

     console.log(this._editableFG,'ini hasilnya');

     if(this._editableFG){
         const geojsonData = this._editableFG.leafletElement.toGeoJSON();
         console.log('ini geojsondatanya', geojsonData);
     }
    

  }

  _onChange = () => {

    // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

    const { onChange } = this.props;

    if (!this._editableFG || !onChange) {
      return;
    }

    const geojsonData = this._editableFG.leafletElement.toGeoJSON();
    onChange(geojsonData);
  }


  showMessageForm = () => {
    this.setState({
      sideBarVisible: true
    });
    
  }

  findMe = () => {
    getLocation()
    .then(location => {
      this.setState({
        location,
        haveUsersLocation: true,
        zoom: 18
      });
    });
    
  }

  cancelMessage = () => {
    this.setState({
      sideBarVisible: false
    });
  }

  logOut = () => {
     localStorage.clear()
     this.props.history.push('/')

  }

  formIsValid = () => {
    let { name, message } = this.state.userMessage;
    name = name.trim();
    message = message.trim();

    const validMessage =
      name.length > 0 && name.length <= 500 &&
      message.length > 0 && message.length <= 500;

    return validMessage && this.state.haveUsersLocation ? true : false;
  }

  formSubmitted = (event) => {
    event.preventDefault();
    
    if (this.formIsValid()) {
      this.setState({
        sendingMessage: true
      });

      const message = {
        name: this.state.userMessage.name,
        message: this.state.userMessage.message,
        latitude: this.state.location.lat,
        longitude: this.state.location.lng,
      };

      // send

      // sendMessage(message)
      //   .then((result) => {
      //     setTimeout(() => {
      //       this.setState({
      //         sendingMessage: false,
      //         sentMessage: true
      //       });
      //     }, 4000);
      //   });


    }
  }


   dataGeo = () => {
    if(london_postcodes){
      const json = london_postcodes;
      return <GeoJSON  key={hash(json)}
          data={json}
          style={this.geoJSONStyle}
          onEachFeature={this.onEachFeature}
          onClick={(e)=> {console.log('tes ini klik', e)}}
        />
    }
  }

  

  render() {
    const position = [this.state.location.lat, this.state.location.lng];

    return (
      <div className="map">
        
        <Map
          className="map"
          worldCopyJump={true}
          center={position}
          zoom={this.state.zoom}
         
          >

        {this.dataGeo()}



          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
         <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />
 
          { this.renderBaseLayerControl() }



          
 


          <FeatureGroup onClick={(e) => this._onClickMap(e)} ref={ (reactFGref) => {this._onFeatureGroupReady(reactFGref);} }>
          <EditControl 
          onCreated={(e) => this._onCreate(e)}
          onEdited={(e) => this._onEdit(e)}
          onDeleted={(e) => this._onDelete(e)}
          onEditVertex={(e) => this._onEditVertex(e)}
          position='bottomleft'
          draw={{
              rectangle: false,
              polyline: false,
              marker: false,
              polygon: {
                showArea: true,
                shapeOptions: {
                  color: 'red'
                }
              }
            }}
          />
          


         
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Informasi Tanah</ModalHeader>
          <ModalBody>
            
          <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggleTab('1'); }}
            >
              Detail 1
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggleTab('2'); }}
            >
              Detail 2
            </NavLink>
          </NavItem>
           <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggleTab('3'); }}
            >
              Detail 3
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            

            <Form>
       
        <FormGroup>
          <Label for="exampleEmail">Nomor Peta/Denah</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Nomor Akta Jual beli</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>
        
        
          <FormGroup>
          <Label for="exampleDate">Tanggal Akta Jual Beli</Label>
          <Input
            type="date"
            name="date"
            id="exampleDate"
            placeholder="date placeholder"
          />
          </FormGroup>

          <FormGroup>
          <Label for="exampleEmail">Nama Penjual</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

          <FormGroup>
          <Label for="exampleColor">Warna Wilayah</Label>
          <Input
            type="color"
            name="color"
            id="exampleColor"
            placeholder="color placeholder"
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleNumber">Luas Tanah</Label>
          <Input
            type="number"
            name="number"
            id="exampleNumber"
            
          />
        </FormGroup>


       <FormGroup>
                <Label for="exampleNumber">Luas Awal</Label>
                <Input
                  type="number"
                  name="number"
                  id="exampleNumber"
                  
                />
              </FormGroup>


       <FormGroup>
                <Label for="exampleNumber">Luas Akhir Pembelian</Label>
                <Input
                  type="number"
                  name="number"
                  id="exampleNumber"
                  
                />
      </FormGroup>


         <FormGroup>
          <Label for="exampleText">Status / Deskripsi</Label>
          <Input type="textarea" name="text" id="exampleText" />
        </FormGroup>

        <FormGroup>
          <Label for="exampleNumber">Harga Jual Beli</Label>
          <Input
            type="number"
            name="number"
            id="exampleNumber"
            
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleNumber">Biaya lain2</Label>
          <Input
            type="number"
            name="number"
            id="exampleNumber"
            
          />
        </FormGroup>


        <FormGroup>
          <Label for="exampleFile">Foto</Label>
          <Input type="file" name="file" id="exampleFile" />
          <FormText color="muted">
           
          </FormText>
        </FormGroup>



      </Form>


          </TabPane>
          <TabPane tabId="2">
             
              <FormGroup>
          <Label for="exampleEmail">Rensil Nomor</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Girik C</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">SPPT PBB</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Pejabat Pembuat Akta Tanah</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Pihak Pertama</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Pihak Kedua</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Saksi 1</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Saksi 2</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Team Pembebasan</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>


        <FormGroup>
          <Label for="exampleNumber">Tahun pembebasan</Label>
          <Input
            type="number"
            name="number"
            id="exampleNumber"
            
          />
        </FormGroup>

          </TabPane>
          <TabPane tabId="3">
              <FormGroup>
          <Label for="exampleText">Alamat</Label>
          <Input type="textarea" name="text" id="exampleText" />
        </FormGroup>


           <FormGroup>
          <Label for="exampleEmail">Jalan</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Kabupaten / kota</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Desa / Kelurahan</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Kecamatan</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Provinsi</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            
          />
        </FormGroup>


          </TabPane>
        </TabContent>



          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Simpan</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Batal</Button>
          </ModalFooter>
        </Modal>


         

          <Polygon color="red" positions={multiPolygon2}>
          </Polygon>

        </FeatureGroup>

          {
            this.state.haveUsersLocation ? 
            <Marker
              position={position}
              icon={myIcon}>
            </Marker> : ''
          }
          {this.state.messages.map(message => (
            <Marker
              key={message._id}
              position={[message.latitude, message.longitude]}
              icon={messageIcon}>
              <Popup>
                <p><em>{message.name}:</em> {message.message}</p>
                { message.otherMessages ? message.otherMessages.map(message => <p key={message._id}><em>{message.name}:</em> {message.message}</p>) : '' }
              </Popup>
            </Marker>
          ))}
        </Map>

        
          
          <Button onClick={this.showMessageForm} className="message-form"  color="info">=</Button> 
          
          {this.state.sideBarVisible?<MessageCardForm user={JSON.parse(localStorage.getItem('user'))} logout={this.logOut} cancelMessage={this.cancelMessage} findMe={this.findMe} />:<div/> }
          
        
       

      </div>
    );
  }
}

export default MainComponent;
