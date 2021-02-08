import React, { Component, useEffect } from "react";
import L from "leaflet";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  FeatureGroup,
  Circle,
  Polygon,
  LayersControl,
  GeoJSON,
  WMSTileLayer,
  withLeaflet
} from "react-leaflet";

import {
  Card,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert
} from "reactstrap";
import classnames from "classnames";

import { EditControl } from "react-leaflet-draw";
import PrintControlDefault from "react-leaflet-easyprint";

import hash from "object-hash";
import { BaseMapHansonland } from "./BaseMapHansonland";

import userLocationURL from "./user_location.svg";

import MessageCardForm from "./MessageCardForm";
import { getLocation } from "./API";

import Api from "./API";

import "./App.css";
import "./MainComponent.css";
import london_postcodes from "./london.json";

import { popupContent, popupHead, popupText, okText } from "./PopUpStyle";

import GoogleLayer from "./GoogleLayer";
import { ReactLeafletSearch } from "react-leaflet-search";
import { SearchControl, OpenStreetMapProvider } from 'react-leaflet-geosearch'
import GeoSearch from "./GeoSearch";


const prov = OpenStreetMapProvider();
const GeoSearchControlElement = withLeaflet(SearchControl);

const key = "AIzaSyAep5LFEQmUFLb6UppEP_VlCX2Yvh-SnqY";
const hydrid = "HYBRID";
const terrain = "TERRAIN";
const road = "ROADMAP";
const satellite = "SATELLITE";


const PrintControl = withLeaflet(PrintControlDefault);

const { BaseLayer, Overlay } = LayersControl;




class MainComponent extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      key: 123,
      count: 0,
      maxZoom: 11,
      lat: '-6.273545691905462',
      lng: '106.72507524490355',
      haveUsersLocation: false,
      zoom: 18,
      userMessage: {
        name: "",
        message: ""
      },
      formProperties: {
        no_peta_denah: "",
        warna_wilayah: "",
        nama_penjual: "",
        no_akta_jual_beli: "",
        tgl_akta_jual_beli: "",
        luas_ajb: "",
        luas_ukur: "",
        harga_jual_beli: "",
        persil_no: "",
        girik_c: "",
        sppt_pbb: "",
        pejabat_akta: "",
        pihak_pertama: "",
        pihak_kedua: "",
        saksi_pertama: "",
        saksi_kedua: "",
        tim_pembebasan: "",
        tahun_pembebasan: "",
        alamat: "",
        blok: "",
        kabupaten_kota: "",
        desa_kelurahan: "",
        kecamatan: "",
        provinsi: ""
      },
      sideBarVisible: false,
      sendingMessage: false,
      sentMessage: false,
      messages: [],
      modal: false,
      modalInfo: false,
      activeTab: "1",
      streetView: null,
      geojsonApi: [],
      user: {},
      newLokasi: {},
      getApi: false,
      showPopUp: false,
      faseSimpan: true,
      geoJsonClicked: {},
      role: "",
      alertVisible: false
    };


    this.openPopUp = this.openPopUp.bind(this);
    this.baseMaps = BaseMapHansonland;
    this.toggle = this.toggle.bind(this);
    this.toggleTab = this.toggleTab.bind(this);
    this.submitLokasi = this.submitLokasi.bind(this);
    this.editLokasi = this.editLokasi.bind(this);
    this.deleteLokasi = this.deleteLokasi.bind(this);
    this.getDatafromApi = this.getDatafromApi.bind(this);
    this.reset = this.reset.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
 
  }


  render() {
   
    const position = [this.state.lat, this.state.lng];
    let blah = this.state;

    return (
      <div className="map">
        <Map 
          className="map"
          worldCopyJump={true}
          center={position}
          zoom={this.state.zoom}
         >

              {this.state.getApi ? (
                <GeoJSON key={this.state.key}
                    data={this.state.geojsonApi}
                    style={this.geoJSONStyle}
                    onEachFeature={this.onEachFeature}
                    onClick={e => {
                      this.openPopUp(e);
                    }}>
                </GeoJSON>
              ) : null}

                            {/*
                            <PrintControl ref={(ref) => { this.printControl = ref; }} position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} />
                           <PrintControl position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />
                            */}

                            {this.googleRenderLayer()}
                            {this.renderBaseLayerControl()}

                            <GeoSearch />

                            <FeatureGroup
                              onClick={e => this._onClickMap(e)}
                              ref={reactFGref => {
                                this._onFeatureGroupReady(reactFGref);
                              }}
                            >
                                      <EditControl
                                        onCreated={e => this._onCreate(e)}
                                        onEdited={e => this._onEdit(e)}
                                        onDeleted={e => this._onDelete(e)}
                                        onEditVertex={e => this._onEditVertex(e)}
                                        position="topleft"
                                        draw={{
                                          rectangle: false,
                                          circle: false,
                                          circlemarker: false,
                                          polyline: false,
                                          marker: false,
                                          polygon:
                                            this.state.role !== "admin"
                                              ? false
                                              : {
                                                  showArea: true,
                                                  shapeOptions: {
                                                    color: "red"
                                                  }
                                                }
                                        }}
                                        edit={{ edit: false, remove: true }}
                                      />
                                      {this.modalInsert()}
                                      {this.modalInfo()}
                            </FeatureGroup>
           
        </Map>
        <Button
          onClick={this.showMessageForm}
          className="message-form"
          color="info"
        >
          =
        </Button>
        {this.state.sideBarVisible ? (
          <MessageCardForm data={this.state.geojsonApi}
            user={JSON.parse(localStorage.getItem("user"))}
            logout={this.logOut}
            cancelMessage={this.cancelMessage}
            findMe={this.findMe}
          />
        ) : (
          <div />
        )}
      </div>
    );
  }







  componentDidMount() {
    //get data
    this.getDatafromApi();

  }




  async submitLokasi() {
    let joinObject = {
      ...this.state.newLokasi,
      properties: this.state.formProperties
    };
    
    let api = new Api();
    await api.create();
    let client = api.getClient();
    client
      .post("/lokasi", joinObject)
      .then(res => {
       
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
         
          this.getDatafromApi();
          this.setState({
            key: Math.random(),
            getApi: true
          })
          this.reset()

      })
      .catch(err => {
        console.log("ini errorsubmit", err);
        this.setState({
          alertVisible: true
        })
      });

    
  }

  async editLokasi() {
    let data = {
      properties: this.state.formProperties
    };
   
    let api = new Api();
    await api.create();
    let client = api.getClient();
    client
      .put("/lokasi/" + this.state.geoJsonClicked.id, data)
      .then(res => {
        this.setState(prevState => ({
          modalInfo: !prevState.modalInfo,
   
        }));
        // this.props.history.push("/");
          this.getDatafromApi();
          this.setState({
            key: Math.random(),
            getApi: true
          })
          this.reset()
      })
      .catch(err => {
        console.log("ini errorsubmit", err);
        this.setState({
          alertVisible: true
        })
      });

    
  }

  async deleteLokasi() {
    let api = new Api();
    await api.create();
    let client = api.getClient();
    client
      .delete("/lokasi/" + this.state.geoJsonClicked.id)
      .then(res => {
        // this.props.history.push("/");
        this.setState(prevState => ({
          modalInfo: !prevState.modalInfo,
      
        }));

          this.getDatafromApi();
          this.setState({
            key: Math.random(),
            getApi: true
          })
          this.reset()
      })
      .catch(err => {
        console.log("ini errordelete", err);
      });
  }



  getDatafromApi() {
    let token = localStorage.getItem("token");
    let userStorage = localStorage.getItem("user");
    let convertUser = JSON.parse(userStorage);

    this.setState({
      role: JSON.parse(localStorage.getItem("user")).name
    });


    if (token) {
      
      let api = new Api();
      api.create();
      let client = api.getClient();
      client
        .get("/lokasi")
        .then(res => {
      
          this.setState({
            geojsonApi: res.data.data.lokasis
          });

          let features = this.state.geojsonApi;
          let joinObjectnya = features.map(obj => ({
            ...obj,
            type: "Feature"
          }));

          this.setState({
            geojsonApi: joinObjectnya,
            getApi: true
          });
          this.setState({
            key: Math.random(),
           
          })
  
        })
        .catch(err => {
      
          localStorage.clear();
          this.props.history.push("/");
        });
    } else {
      this.props.history.push("/");
    }
  }







  googleRenderLayer(){
    return(


          <LayersControl position="bottomright">
            <BaseLayer checked name="Google Maps Hydrid">
              <GoogleLayer 
                googlekey={key}
                maptype={hydrid}
                libraries={["geometry", "places"]}
              />
            </BaseLayer>
            <BaseLayer name="OpenStreetMap.Mapnik">
              <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
            </BaseLayer>

            <BaseLayer name="Google Maps Roads">
              <GoogleLayer googlekey={key} maptype={road} />
            </BaseLayer>
            <BaseLayer name="Google Maps Terrain">
              <GoogleLayer googlekey={key} maptype={terrain} />
            </BaseLayer>
            <BaseLayer name="Google Maps Satellite">
              <GoogleLayer googlekey={key} maptype={satellite} />
            </BaseLayer>

            <BaseLayer name="Google Maps with Libraries">
              <GoogleLayer
                googlekey={key}
                maptype={hydrid}
                libraries={["geometry", "places"]}
              />
            </BaseLayer>
          </LayersControl>

    )
  }

  renderBaseLayerControl() {
    return (
      <LayersControl position="bottomright">
        {this.baseMaps.map(
          ({
            name,
            url,
            attribution,
            type,
            layer,
            format,
            checked = false
          }) => {
            return type === "wms" ? (
              <LayersControl.BaseLayer key={name} name={name} checked={checked}>
                <WMSTileLayer
                  layers={layer}
                  format={format}
                  transparent={false}
                  url={url}
                  attribution={attribution}
                />
              </LayersControl.BaseLayer>
            ) : (
              <LayersControl.BaseLayer key={name} name={name} checked={checked}>
                <TileLayer attribution={attribution} url={url} />
              </LayersControl.BaseLayer>
            );
          }
        )}
        <LayersControl.BaseLayer name="ImageryLabel s">
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











  modalInsert() {
    return (
      <Modal
        fade={false}
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>Input Tanah </ModalHeader>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggleTab("1");
                }}
              >
                Detail 1
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggleTab("2");
                }}
              >
                Detail 2
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "3" })}
                onClick={() => {
                  this.toggleTab("3");
                }}
              >
                Detail 3
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Form>
                <FormGroup>
                  <Label size="sm" for="exampleEmail">
                    Nomor Peta/Denah
                  </Label>
                  <Input
                   
                    bsSize="sm"
                    value={this.state.formProperties.no_peta_denah}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          no_peta_denah: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleEmail">
                    Nomor Akta Jual beli
                  </Label>
                  <Input
                   
                    bsSize="sm"
                    value={this.state.formProperties.no_akta_jual_beli}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          no_akta_jual_beli: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleDate">
                    Tanggal Akta Jual Beli
                  </Label>
                  <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                    placeholder="date placeholder"
                    value={this.state.formProperties.tgl_akta_jual_beli}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          tgl_akta_jual_beli: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleEmail">
                    Nama Penjual
                  </Label>
                  <Input
                    bsSize="sm"
                    value={this.state.formProperties.nama_penjual}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          nama_penjual: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleColor">
                    Warna Wilayah
                  </Label>
                  <Input
                    bsSize="sm"
                    type="color"
                    name="color"
                    id="exampleColor"
                    placeholder="color placeholder"
                    value={this.state.formProperties.warna_wilayah}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          warna_wilayah: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

               

                <FormGroup>
                  <Label size="sm" for="exampleNumber">
                    Luas AJB /m2
                  </Label>
                  <Input
                    bsSize="sm"
                    type="number"
                    name="number"
                    id="exampleNumber"
                    value={this.state.formProperties.luas_ajb}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          luas_ajb: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleNumber">
                    Luas Ukur /m2
                  </Label>
                  <Input
                    bsSize="sm"
                    type="number"
                    name="number"
                    id="exampleNumber"
                    value={this.state.formProperties.luas_ukur}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          luas_ukur: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>
              </Form>
            </TabPane>

            <TabPane tabId="2">
              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Persil Nomor
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.persil_no}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        persil_no: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Girik C
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.girik_c}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        girik_c: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  SPPT PBB
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.sppt_pbb}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        sppt_pbb: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Pejabat Pembuat Akta Tanah
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.pejabat_akta}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        pejabat_akta: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Pihak Pertama
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.pihak_pertama}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        pihak_pertama: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Pihak Kedua
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.pihak_kedua}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        pihak_kedua: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Saksi 1
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.saksi_pertama}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        saksi_pertama: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Saksi 2
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.saksi_kedua}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        saksi_kedua: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Team Pembebasan
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.tim_pembebasan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        tim_pembebasan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleNumber">
                  Tahun pembebasan
                </Label>
                <Input
                  bsSize="sm"
                  type="number"
                  name="number"
                  id="exampleNumber"
                  value={this.state.formProperties.tahun_pembebasan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        tahun_pembebasan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>
            </TabPane>
            <TabPane tabId="3">
              <FormGroup>
                <Label size="sm" for="exampleText">
                  Alamat
                </Label>
                <Input
                  type="textarea"
                  name="text"
                  id="exampleText"
                  value={this.state.formProperties.alamat}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        alamat: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Blok
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.blok}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        blok: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Kabupaten / kota
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.kabupaten_kota}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        kabupaten_kota: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Desa / Kelurahan
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.desa_kelurahan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        desa_kelurahan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Kecamatan
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.kecamatan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        kecamatan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Provinsi
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.provinsi}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        provinsi: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
            <Alert color="danger" isOpen={this.state.alertVisible} fade={false}>
              No Peta harus Unik
            </Alert>
          <div>
            <Button size="sm" color="info" onClick={this.submitLokasi}>
              Simpan
            </Button>{" "}
            {"  "}
            <Button size="sm" color="secondary" onClick={this.toggle}>
              Keluar
            </Button>
             
          </div>

        </ModalFooter>
      </Modal>
    );
  }

  modalInfo() {
    return (
      <Modal
        fade={false}
        isOpen={this.state.modalInfo}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.cancelForm}>
          Informasi Tanah{" "}
          {this.state.geoJsonClicked.properties
            ? this.state.geoJsonClicked.properties.no_peta_denah
            : ""}
        </ModalHeader>
        <ModalBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" })}
                onClick={() => {
                  this.toggleTab("1");
                }}
              >
                Detail 1
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggleTab("2");
                }}
              >
                Detail 2
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "3" })}
                onClick={() => {
                  this.toggleTab("3");
                }}
              >
                Detail 3
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Form>
                <FormGroup>
                  <Label size="sm" for="exampleEmail">
                    Nomor Peta/Denah
                  </Label>
                  <Input
                    
                    bsSize="sm"
                    value={this.state.formProperties.no_peta_denah}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          no_peta_denah: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleEmail">
                    Nomor Akta Jual beli
                  </Label>
                  <Input
                   
                    bsSize="sm"
                    value={this.state.formProperties.no_akta_jual_beli}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          no_akta_jual_beli: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleDate">
                    Tanggal Akta Jual Beli
                  </Label>
                  <Input
                    type="date"
                    name="date"
                    id="exampleDate"
                    placeholder="date placeholder"
                    value={this.state.formProperties.tgl_akta_jual_beli}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          tgl_akta_jual_beli: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleEmail">
                    Nama Penjual
                  </Label>
                  <Input
                    bsSize="sm"
                    value={this.state.formProperties.nama_penjual}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          nama_penjual: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleColor">
                    Warna Wilayah
                  </Label>
                  <Input
                    bsSize="sm"
                    type="color"
                    name="color"
                    id="exampleColor"
                    placeholder="color placeholder"
                    value={this.state.formProperties.warna_wilayah}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          warna_wilayah: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

               

                <FormGroup>
                  <Label size="sm" for="exampleNumber">
                    Luas AJB /m2
                  </Label>
                  <Input
                    bsSize="sm"
                    type="number"
                    name="number"
                    id="exampleNumber"
                    value={this.state.formProperties.luas_ajb}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          luas_ajb: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label size="sm" for="exampleNumber">
                    Luas Ukur /m2
                  </Label>
                  <Input
                    bsSize="sm"
                    type="number"
                    name="number"
                    id="exampleNumber"
                    value={this.state.formProperties.luas_ukur}
                    onChange={e =>
                      this.setState({
                        formProperties: {
                          ...this.state.formProperties,
                          luas_ukur: e.target.value
                        }
                      })
                    }
                  />
                </FormGroup>
              </Form>
            </TabPane>

            <TabPane tabId="2">
              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Persil Nomor
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.persil_no}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        persil_no: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Girik C
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.girik_c}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        girik_c: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  SPPT PBB
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.sppt_pbb}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        sppt_pbb: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Pejabat Pembuat Akta Tanah
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.pejabat_akta}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        pejabat_akta: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Pihak Pertama
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.pihak_pertama}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        pihak_pertama: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Pihak Kedua
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.pihak_kedua}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        pihak_kedua: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Saksi 1
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.saksi_pertama}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        saksi_pertama: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Saksi 2
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.saksi_kedua}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        saksi_kedua: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Team Pembebasan
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.tim_pembebasan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        tim_pembebasan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleNumber">
                  Tahun pembebasan
                </Label>
                <Input
                  bsSize="sm"
                  type="number"
                  name="number"
                  id="exampleNumber"
                  value={this.state.formProperties.tahun_pembebasan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        tahun_pembebasan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>
            </TabPane>
            <TabPane tabId="3">
              <FormGroup>
                <Label size="sm" for="exampleText">
                  Alamat
                </Label>
                <Input
                  type="textarea"
                  name="text"
                  id="exampleText"
                  value={this.state.formProperties.alamat}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        alamat: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Blok
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.blok}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        blok: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Kabupaten / kota
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.kabupaten_kota}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        kabupaten_kota: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Desa / Kelurahan
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.desa_kelurahan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        desa_kelurahan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Kecamatan
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.kecamatan}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        kecamatan: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label size="sm" for="exampleEmail">
                  Provinsi
                </Label>
                <Input
                  bsSize="sm"
                  value={this.state.formProperties.provinsi}
                  onChange={e =>
                    this.setState({
                      formProperties: {
                        ...this.state.formProperties,
                        provinsi: e.target.value
                      }
                    })
                  }
                />
              </FormGroup>
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
                 <Alert color="danger" isOpen={this.state.alertVisible} fade={false}>
                  No Peta harus Unik
                </Alert>
          <div>
            {this.state.role === "admin" ? (
              <div>
                
                <Button size="sm" color="info" onClick={this.editLokasi}>
                  Ubah
                </Button>{" "}
                {"  "}
                <Button size="sm" color="danger" onClick={this.deleteLokasi}>
                  Hapus
                </Button>{" "}
                {"  "}
                <Button
                  size="sm"
                  color="secondary"
                  onClick={ this.cancelForm}
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                color="secondary"
                onClick={this.cancelForm}
              >
                Keluar
              </Button>
            )}
          </div>
        </ModalFooter>
      </Modal>
    );
  }












geoJSONStyle(feature: Object) {
    return {
      color: feature.properties.warna_wilayah,
      weight: 1,
      fillOpacity: 0.5,
      fillColor: feature.properties.warna_wilayah
    };
  }

  onEachFeature(feature: Object, layer: Object) {
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
              No Peta Denah: ${
                feature.properties.no_peta_denah
                  ? feature.properties.no_peta_denah
                  : "-"
              }
              <br />
              Nama Penjual: ${
                feature.properties.nama_penjual
                  ? feature.properties.nama_penjual
                  : "-"
              }
              <br />
             
              No Akta Jual Beli: ${
                feature.properties.no_akta_jual_beli
                  ? feature.properties.no_akta_jual_beli
                  : "-"
              }
              <br />
              Tanggal Akta Jual Beli: ${
                feature.properties.tgl_akta_jual_beli
                  ? feature.properties.tgl_akta_jual_beli
                  : "-"
              }
              <br />
              Luas AJB: ${
                feature.properties.luas_ajb
                  ? feature.properties.luas_ajb
                  : "-"
              }
              <br />
              Luas Ukur: ${
                feature.properties.luas_ukur
                  ? feature.properties.luas_ukur
                  : "-"
              }
              <br />
              Tanggal Input: ${
                feature.properties.date ? feature.properties.date : "-"
              }
            </span>
          
          </div>
    
    </Popup>`;

    layer.on({
      mouseover: function(event) {
        var popup = L.popup()
          .setLatLng(event.latlng)
          .setContent(popupContent, { maxWidth: 700 })
          .openOn(layer._map);
        layer.bindPopup(popup);
      }
    });
  }
















  openPopUp(e) {
    this.setState({
      geoJsonClicked: e.layer.feature,
      formProperties: e.layer.feature.properties,
      modalInfo: true,
      faseSimpan: false
    });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
   
  }

  refreshPage() {
    window.parent.location = window.parent.location.href;
  }


  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  valueChanged = event => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }));
  };


  _onCreate = data => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    this.setState({
      faseSimpan: true
    });

    let newLokasiJson = data.layer.toGeoJSON();

    this.setState({
      newLokasi: newLokasiJson
    });

    
    this.getDatafromApi()
    this.setState(this.state);
    this.forceUpdate()

    
  };

  _onEdit = data => {
    // console.log('onEdit', data)
    // console.log('state', this.state)
  };

  _onDelete = data => {
    // console.log('ondelete', data)
    // console.log('state', this.state)
  };

  _onEditVertex = data => {
    // console.log('oneditvertex', data)
    // console.log('state', this.state)
  };

  _onClickMap = data => {
   
   
    let newLokasiJson = data.layer.toGeoJSON();

    this.setState({
      newLokasi: newLokasiJson
    });

    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if (!this._editableFG) {
      return;
    }
  };

  _editableFG = null;

  _onFeatureGroupReady = reactFGref => {
    // populate the leaflet FeatureGroup with the geoJson layers

    let leafletGeoJSON = new L.GeoJSON(london_postcodes);

    if (reactFGref) {
      let leafletFG = reactFGref.leafletElement;
    }

    // // store the ref for future access to content

    this._editableFG = reactFGref;

    

    if (this._editableFG) {
      const geojsonData = this._editableFG.leafletElement.toGeoJSON();
      
    }
  };

  _onChange = () => {
    // this._editableFG contains the edited geometry, which can be manipulated through the leaflet API

    const { onChange } = this.props;

    if (!this._editableFG || !onChange) {
      return;
    }

    const geojsonData = this._editableFG.leafletElement.toGeoJSON();
    onChange(geojsonData);
  };

  showMessageForm = () => {
    this.setState({
      sideBarVisible: true
    });
  };

  findMe = () => {
    getLocation().then(location => {
      this.setState({
        location,
        haveUsersLocation: true,
        zoom: 18
      });
    });
  };

  cancelForm(){
    this.reset()
    this.setState(prevState => ({
        modalInfo: !prevState.modalInfo,
        alertVisible: false
      }))
  }

  cancelMessage = () => {
    this.setState({
      sideBarVisible: false
    });
  };

  logOut = () => {
    localStorage.clear();
    this.props.history.push("/");
  };


  reset() {
        this.setState(prevState => ({
        formProperties: {                   // object that we want to update
            ...prevState.formProperties,    // keep all other key-value pairs
            no_peta_denah: "",
            warna_wilayah: "",
            nama_penjual: "",
            no_akta_jual_beli: "",
            tgl_akta_jual_beli: "",
            luas_ajb: "",
            luas_ukur: "",
            harga_jual_beli: "",
            persil_no: "",
            girik_c: "",
            sppt_pbb: "",
            pejabat_akta: "",
            pihak_pertama: "",
            pihak_kedua: "",
            saksi_pertama: "",
            saksi_kedua: "",
            tim_pembebasan: "",
            tahun_pembebasan: "",
            alamat: "",
            blok: "",
            kabupaten_kota: "",
            desa_kelurahan: "",
            kecamatan: "",
            provinsi: ""       // update the value of specific key
        }
          }))
  }

 
}

export default MainComponent;
