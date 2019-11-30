import React, { Component } from 'react';
import L from 'leaflet';
import { Map, TileLayer, Marker, Popup,FeatureGroup, Circle, Polygon, LayersControl, GeoJSON, WMSTileLayer, withLeaflet } from 'react-leaflet';

import { Card, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter,
TabContent, TabPane, Nav, NavItem, NavLink,  CardTitle, Row, Col, Form, FormGroup, Label , Input, FormText  } from 'reactstrap';
import classnames from 'classnames';

import { EditControl } from "react-leaflet-draw"
import PrintControlDefault from 'react-leaflet-easyprint';

import hash from 'object-hash';
import { BaseMapHansonland } from './BaseMapHansonland';

import userLocationURL from './user_location.svg';
import messageLocationURL from './message_location.svg';

import MessageCardForm from './MessageCardForm';
import { getLocation } from './API';

import Api from './API';

import './App.css';
import './MainComponent.css';
import london_postcodes from './london.json'

import { popupContent, popupHead, popupText, okText } from "./PopUpStyle";

import GoogleLayer from './GoogleLayer'
const key = 'AIzaSyDV-Qiaydvq7kZ4KpCFHYHkJ977AkbIA6s';
const terrain = 'TERRAIN';
const road = 'ROADMAP';
const satellite = 'SATELLITE';
const hydrid = 'HYBRID';

const PrintControl = withLeaflet(PrintControlDefault);

const { BaseLayer, Overlay } = LayersControl



class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    location: {
      lat: -6.273545691905462,
      lng: 106.72507524490355,
    },
    haveUsersLocation: false,
    zoom: 21,
    userMessage: {
      name: '',
      message: ''
    },
    formProperties: {
      no_peta_denah: '',
      luas_tanah: '',
      warna_wilayah: '',
      nama_penjual:'',
      no_akta_jual_beli:'',
      tgl_akta_jual_beli:'',
      luas_awal:'',
      luas_akhir:'',
      harga_jual_beli:''
    },
    sideBarVisible: false,
    sendingMessage: false,
    sentMessage: false,
    messages: [],
    modal: false,
    activeTab: '1',
    streetView: null,
    geojsonApi: [],
    user:{},
    newLokasi:{},
    getApi: false,
    showPopUp: false,
    faseSimpan: true,
    geoJsonClicked: {},
    role: ''
  }

    this.openPopUp = this.openPopUp.bind(this)
    this.baseMaps = BaseMapHansonland;
    this.toggle = this.toggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.submitLokasi = this.submitLokasi.bind(this);
    this.deleteLokasi = this.deleteLokasi.bind(this);

  }
  
 
           renderBaseLayerControl() {
              return (
                <LayersControl position="bottomright">
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
                  <LayersControl.BaseLayer name="ImageryLabel s" >
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

modalInsert(){
  return(
       <Modal fade={false} isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                          <ModalHeader toggle={this.toggle}>Input Tanah {this.state.geoJsonClicked.properties?this.state.geoJsonClicked.properties.no_peta_denah:''}</ModalHeader>
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
                                                <Label  size="sm" for="exampleEmail">Nomor Peta/Denah</Label >
                                                <Input placeholder="BC98723" bsSize="sm"
                                                  value={this.state.formProperties.no_peta_denah}
                                                  onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,no_peta_denah:e.target.value} })} 
                                              />
                                             </FormGroup>

                                               <FormGroup>
                                                <Label  for="exampleEmail">Nomor Akta Jual beli</Label >
                                                <Input placeholder="0980C234" bsSize="sm"
                                                  
                                                  
                                                  
                                                  value={this.state.formProperties.no_akta_jual_beli}
                                                  onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,no_akta_jual_beli:e.target.value} })}
                                                />
                                              </FormGroup>
                                            
                                              <FormGroup>
                                              <Label  for="exampleDate">Tanggal Akta Jual Beli</Label >
                                              <Input
                                                type="date"
                                                name="date"
                                                id="exampleDate"
                                                placeholder="date placeholder"
                                                value={this.state.formProperties.tgl_akta_jual_beli}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,tgl_akta_jual_beli:e.target.value} })}
                                              />
                                              </FormGroup>

                                              <FormGroup>
                                              <Label  for="exampleEmail">Nama Penjual</Label >
                                              <Input bsSize="sm" value={this.state.formProperties.nama_penjual}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,nama_penjual:e.target.value} })}
                                              />
                                             </FormGroup>

                                              <FormGroup>
                                              <Label  for="exampleColor">Warna Wilayah</Label >
                                              <Input bsSize="sm"
                                                type="color"
                                                name="color"
                                                id="exampleColor"
                                                placeholder="color placeholder"
                                                value={this.state.formProperties.warna_wilayah}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,warna_wilayah:e.target.value} })}
                                              />
                                             </FormGroup>

                                             <FormGroup>
                                              <Label  for="exampleNumber">Luas Tanah</Label >
                                              <Input bsSize="sm"
                                                type="number"
                                                name="number"
                                                id="exampleNumber"
                                                value={this.state.formProperties.luas_tanah}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_tanah:e.target.value} })}
                                              />
                                             </FormGroup>


                                           <FormGroup>
                                                    <Label  for="exampleNumber">Luas Awal</Label >
                                                    <Input bsSize="sm"
                                                      type="number"
                                                      name="number"
                                                      id="exampleNumber"
                                                      value={this.state.formProperties.luas_awal}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_awal:e.target.value} })}
                                                    />
                                           </FormGroup>


                                           <FormGroup>
                                                    <Label  for="exampleNumber">Luas Akhir Pembelian</Label >
                                                    <Input bsSize="sm"
                                                      type="number"
                                                      name="number"
                                                      id="exampleNumber"
                                                      value={this.state.formProperties.luas_akhir}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_akhir:e.target.value} })}
                                                    />
                                          </FormGroup>
                                </Form>
                                </TabPane>

                              <TabPane tabId="2">
                             
                                         <FormGroup>
                                        <Label  for="exampleEmail">Rensil Nomor</Label >
                                        <Input bsSize="sm" />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Girik C</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">SPPT PBB</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Pejabat Pembuat Akta Tanah</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Pihak Pertama</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Pihak Kedua</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Saksi 1</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Saksi 2</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Team Pembebasan</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>


                                      <FormGroup>
                                        <Label  for="exampleNumber">Tahun pembebasan</Label >
                                        <Input bsSize="sm"
                                          type="number"
                                          name="number"
                                          id="exampleNumber"
                                          
                                        />
                                      </FormGroup>

                           </TabPane>
                          <TabPane tabId="3">

                                            <FormGroup>
                                        <Label  for="exampleText">Alamat</Label >
                                        <Input type="textarea" name="text" id="exampleText" />
                                      </FormGroup>


                                         <FormGroup>
                                        <Label  for="exampleEmail">Jalan</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Kabupaten / kota</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Desa / Kelurahan</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Kecamatan</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Provinsi</Label >
                                        <Input bsSize="sm"/>
                                      </FormGroup>
                          </TabPane>
                        </TabContent>
                        </ModalBody>
              <ModalFooter>
                {this.state.faseSimpan?
                (
                <div> 
                <Button size="sm" color="info" onClick={this.submitLokasi}>Simpan</Button> {'  '}
                <Button size="sm" color="secondary" onClick={this.toggle}>Keluar</Button>
                </div>
                )
                :
                (
                <div>
                {this.state.role === 'admin'?
                <div>
                <Button size="sm" color="info" onClick={this.submitLokasi}>Ubah</Button>  {'  '}
                <Button size="sm" color="danger" onClick={this.deleteLokasi}>Hapus</Button> {'  '}
                <Button size="sm" color="secondary" onClick={()=> this.setState(prevState => ({
                  modal: !prevState.modal
                }))}>Keluar</Button>
                </div>
                :<Button size="sm" color="secondary" onClick={()=> this.setState(prevState => ({
                  modal: !prevState.modal
                }))}>Keluar</Button>}
                 
                </div>
                )
              }
               
            </ModalFooter>
    </Modal>
  )
}














modalInfo(){
  return(
       <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                          <ModalHeader toggle={this.toggle}>Informasi Tanah {this.state.geoJsonClicked.properties?this.state.geoJsonClicked.properties.no_peta_denah:''}</ModalHeader>
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
                                                <Label  for="exampleEmail">Nomor Peta/Denah</Label >
                                                <Input
                                                  
                                                  
                                                  
                                                  value={this.state.formProperties.no_peta_denah}
                                                  onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,no_peta_denah:e.target.value} })} 
                                              />
                                             </FormGroup>

                                               <FormGroup>
                                                <Label  for="exampleEmail">Nomor Akta Jual beli</Label >
                                                <Input
                                                  
                                                  
                                                  
                                                  value={this.state.formProperties.no_akta_jual_beli}
                                                  onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,no_akta_jual_beli:e.target.value} })}
                                                />
                                              </FormGroup>
                                            
                                              <FormGroup>
                                              <Label  for="exampleDate">Tanggal Akta Jual Beli</Label >
                                              <Input
                                                type="date"
                                                name="date"
                                                id="exampleDate"
                                                placeholder="date placeholder"
                                                value={this.state.formProperties.tgl_akta_jual_beli}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,tgl_akta_jual_beli:e.target.value} })}
                                              />
                                              </FormGroup>

                                              <FormGroup>
                                              <Label  for="exampleEmail">Nama Penjual</Label >
                                              <Input
                                                
                                                
                                                
                                                value={this.state.formProperties.nama_penjual}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,nama_penjual:e.target.value} })}
                                              />
                                             </FormGroup>

                                              <FormGroup>
                                              <Label  for="exampleColor">Warna Wilayah</Label >
                                              <Input
                                                type="color"
                                                name="color"
                                                id="exampleColor"
                                                placeholder="color placeholder"
                                                value={this.state.formProperties.warna_wilayah}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,warna_wilayah:e.target.value} })}
                                              />
                                             </FormGroup>

                                             <FormGroup>
                                              <Label  for="exampleNumber">Luas Tanah</Label >
                                              <Input
                                                type="number"
                                                name="number"
                                                id="exampleNumber"
                                                value={this.state.formProperties.luas_tanah}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_tanah:e.target.value} })}
                                              />
                                             </FormGroup>


                                           <FormGroup>
                                                    <Label  for="exampleNumber">Luas Awal</Label >
                                                    <Input
                                                      type="number"
                                                      name="number"
                                                      id="exampleNumber"
                                                      value={this.state.formProperties.luas_awal}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_awal:e.target.value} })}
                                                    />
                                           </FormGroup>


                                           <FormGroup>
                                                    <Label  for="exampleNumber">Luas Akhir Pembelian</Label >
                                                    <Input
                                                      type="number"
                                                      name="number"
                                                      id="exampleNumber"
                                                      value={this.state.formProperties.luas_akhir}
                                                onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_akhir:e.target.value} })}
                                                    />
                                          </FormGroup>
                                </Form>
                                </TabPane>

                              <TabPane tabId="2">
                             
                                         <FormGroup>
                                        <Label  for="exampleEmail">Rensil Nomor</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Girik C</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">SPPT PBB</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Pejabat Pembuat Akta Tanah</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Pihak Pertama</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Pihak Kedua</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Saksi 1</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Saksi 2</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Team Pembebasan</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>


                                      <FormGroup>
                                        <Label  for="exampleNumber">Tahun pembebasan</Label >
                                        <Input
                                          type="number"
                                          name="number"
                                          id="exampleNumber"
                                          
                                        />
                                      </FormGroup>

                           </TabPane>
                          <TabPane tabId="3">

                                            <FormGroup>
                                        <Label  for="exampleText">Alamat</Label >
                                        <Input type="textarea" name="text" id="exampleText" />
                                      </FormGroup>


                                         <FormGroup>
                                        <Label  for="exampleEmail">Jalan</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Kabupaten / kota</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Desa / Kelurahan</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Kecamatan</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>

                                       <FormGroup>
                                        <Label  for="exampleEmail">Provinsi</Label >
                                        <Input
                                          
                                          
                                          
                                          
                                        />
                                      </FormGroup>


                          </TabPane>
                        </TabContent>
                        </ModalBody>
              <ModalFooter>
                {this.state.faseSimpan?
                (
                <div> 
                <Button size="sm" color="info" onClick={this.submitLokasi}>Simpan</Button> {'  '}
                <Button size="sm" color="secondary" onClick={this.toggle}>Keluar</Button>
                </div>
                )
                :
                (
                <div>
                {this.state.role === 'admin'?
                <div>
                <Button size="sm" color="info" onClick={this.submitLokasi}>Ubah</Button>  {'  '}
                <Button size="sm" color="danger" onClick={this.deleteLokasi}>Hapus</Button> {'  '}
                <Button size="sm" color="secondary" onClick={()=> this.setState(prevState => ({
                  modal: !prevState.modal
                }))}>Keluar</Button>
                </div>
                :<Button size="sm" color="secondary" onClick={()=> this.setState(prevState => ({
                  modal: !prevState.modal
                }))}>Keluar</Button>}
                 
                </div>
                )
              }
               
            </ModalFooter>
    </Modal>
  )
}












  
  geoJSONStyle(feature: Object) {
    
    return {
      color: feature.properties.warna_wilayah,
      weight: 1,
      fillOpacity: 0.5,
      fillColor: feature.properties.warna_wilayah,
    }
  }

  onEachFeature(feature: Object, layer: Object) {
    console.log('ini featurnya per item',feature)
     console.log('ini layernya per item',layer)


    const popupContent = ` <Popup>

    <div style={{textAlign: "center",
            height: "350px",
            marginTop: "30px"}}>
            <img
              src="https://icon-library.net/images/land-icon-png/land-icon-png-8.jpg"
              width="150"
              height="150"
            />
              <br />
              <br />

            <div className="m-2" 
            style={{fontWeight: "bold",
            fontSize: "22px"}}>
              
            </div>
            <span style={{fontSize: "15px",
            marginBottom: "20px"}}>
              No Peta Denah: ${feature.properties.no_peta_denah?feature.properties.no_peta_denah:'-'}
              <br />
              Nama Penjual: ${feature.properties.nama_penjual?feature.properties.nama_penjual:'-'}
              <br />
              Luas Tanah: ${feature.properties.luas_tanah?feature.properties.luas_tanah:'-'}
              <br />
              No Akta Jual Beli: ${feature.properties.no_akta_jual_beli?feature.properties.no_akta_jual_beli:'-'}
              <br />
              Tanggal Akta Jual Beli: ${feature.properties.tgl_akta_jual_beli?feature.properties.tgl_akta_jual_beli:'-'}
              <br />
              Luas Tanah: ${feature.properties.luas_tanah?feature.properties.luas_tanah:'-'}
              <br />
              Luas Awal: ${feature.properties.luas_awal?feature.properties.luas_awal:'-'}
              <br />
              Luas Akhir: ${feature.properties.luas_akhir?feature.properties.luas_akhir:'-'}
              <br />
              Tanggal Input: ${feature.properties.date?feature.properties.date:'-'}
            </span>
          
          </div>
    
    </Popup>`
   
    layer.on({
      mouseover: function(event) {
        var popup = L.popup()
            .setLatLng(event.latlng)
            .setContent(popupContent, {maxWidth: 700})
            .openOn(layer._map);
            layer.bindPopup(popup)
          }

    }); 
    
  }

  openPopUp(e){
    console.log('ini klikz', e.layer.feature);
    this.setState({
      geoJsonClicked: e.layer.feature,
      modal: true,
      faseSimpan: false
     
    })

    console.log('ini idclickednya', this.state.geoJsonClicked)
   
  }

  toggle() {

    this.setState(prevState => ({
      modal: !prevState.modal
    }));
    this.props.history.push('/');
  }

  refreshPage(){ 
    window.parent.location = window.parent.location.href; 
  }

  async submitLokasi(){

    console.log('ini submit', this.state.formProperties, this.state.newLokasi)

    let joinObject = {...this.state.newLokasi, properties: this.state.formProperties }

    console.log('ini joinnya', joinObject);

    let api = new Api();
    await api.create();
    let client = api.getClient();
    client.post('/lokasi', joinObject).then((res)=>{

      console.log('ini res postnya',res.data)
      this.props.history.push('/');
      this.setState({
        geojsonApi: {...this.state.geojsonApi, ...joinObject}
      })
    }).catch((err)=>{
      console.log('ini errorsubmit', err)
    });


    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  async deleteLokasi(){

    console.log('hit delete func', this.state.geoJsonClicked.id)

    let api = new Api();
    await api.create();
    let client = api.getClient();
    client.delete('/lokasi/'+this.state.geoJsonClicked.id).then((res)=>{

      console.log('ini res postnya',res.data)
      this.props.history.push('/');
     
    }).catch((err)=>{
      console.log('ini errordelete', err)
    });

  }

  ComponentDidUpdate(){
    this.getDatafromApi()
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

  getDatafromApi(){


  let token = localStorage.getItem('token');
    let userStorage = localStorage.getItem('user');
    let convertUser = JSON.parse(userStorage);

    

    this.setState({
      role: JSON.parse(localStorage.getItem('user')).name
    })
    
    
    console.log('token di main', token)
    console.log('user di main', this.state.role)

    if(token){
      console.log('masuk setelah validasi token')
        let api = new Api()
         api.create();
        let client = api.getClient()
        client.get('/lokasi').then((res) => {
          this.setState({
            geojsonApi: res.data.data.lokasis
          })

          let features = this.state.geojsonApi
          let joinObjectnya = features.map(obj=>({...obj, type:'Feature'}))

          this.setState({
            geojsonApi:joinObjectnya,
            getApi: true
          })

        console.log('test', joinObjectnya)
        }).catch((err)=>{
          console.log('ini errornya', err)
           localStorage.clear()
           this.props.history.push('/');
        })

    }else{
      this.props.history.push('/');
    }


  }

   componentDidMount() {
          //get data
         this.getDatafromApi()
   }

  _onCreate = (data) => {
    
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    this.setState({
      faseSimpan: true
    })

    console.log('state', this.state)
    
    let newLokasiJson = data.layer.toGeoJSON();

    this.setState({
      newLokasi: newLokasiJson
    })
    
    // coba["properties"]["coba"] = "lagi";
    console.log(this.state.newLokasi,'coba ini');
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

  


   dataGeo = () => {
    if(this.state.geojsonApi){
      console.log('ini isi londonjson', london_postcodes)
      const json = london_postcodes;
      const geojsonApinya = this.state.geojsonApi;
      return <GeoJSON  key={hash(json)}
          data={geojsonApinya}  
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
         
          {this.state.getApi?
          (<GeoJSON 
          data={this.state.geojsonApi}
          style={this.geoJSONStyle}
          onEachFeature={this.onEachFeature}
          onClick={(e)=> {this.openPopUp(e)}}>
          

          </GeoJSON>
          ):null}


          <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
         <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />
 
          { this.renderBaseLayerControl() }


          <LayersControl position='bottomright'>

          <BaseLayer  name='Google Maps Hydrid'>
            <GoogleLayer googlekey={key}  maptype={hydrid}  libraries={['geometry', 'places']} />
          </BaseLayer> 
          <BaseLayer  name='OpenStreetMap.Mapnik'>
            <TileLayer  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"/>
          </BaseLayer>

         <BaseLayer checked name='Google Maps Roads'>
            <GoogleLayer googlekey={key}  maptype={road} />
          </BaseLayer>
         <BaseLayer  name='Google Maps Terrain'>
            <GoogleLayer googlekey={key}  maptype={terrain} />
          </BaseLayer>
           <BaseLayer  name='Google Maps Satellite'>
            <GoogleLayer googlekey={key}  maptype={satellite} />
          </BaseLayer>
            
          <BaseLayer  name='Google Maps with Libraries'>
            <GoogleLayer googlekey={key}  maptype={hydrid}  libraries={['geometry', 'places']} />
          </BaseLayer>        
        </LayersControl>
 


          <FeatureGroup onClick={(e) => this._onClickMap(e)} ref={ (reactFGref) => {this._onFeatureGroupReady(reactFGref);} }>
          <EditControl 
          onCreated={(e) => this._onCreate(e)}
          onEdited={(e) => this._onEdit(e)}
          onDeleted={(e) => this._onDelete(e)}
          onEditVertex={(e) => this._onEditVertex(e)}
          position='topleft'
          draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              polyline: false,
              marker: false,
              polygon: this.state.role !=='admin'?false:{
                showArea: true,
                shapeOptions: {
                  color: 'red'
                }
              }
            }}
            edit={{ edit: false, remove: false }}
          
          />
          

         {this.modalInsert()}
                       

         

        </FeatureGroup>

         
         
        </Map>

        
          
          <Button onClick={this.showMessageForm} className="message-form"  color="info">=</Button> 
          
          {this.state.sideBarVisible?<MessageCardForm user={JSON.parse(localStorage.getItem('user'))} logout={this.logOut} cancelMessage={this.cancelMessage} findMe={this.findMe} />:<div/> }
          
        
       

      </div>
    );
  }
}

export default MainComponent;
