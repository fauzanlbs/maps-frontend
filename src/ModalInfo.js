export default const ModalInfo(){
	return
	(
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
            value={this.state.formProperties.no_peta_denah}
            onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,no_peta_denah:e.target.value} })}
            
          />
        </FormGroup>

         <FormGroup>
          <Label for="exampleEmail">Nomor Akta Jual beli</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            value={this.state.formProperties.no_akta_jual_beli}
            onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,no_akta_jual_beli:e.target.value} })}
          />
        </FormGroup>
        
        
          <FormGroup>
          <Label for="exampleDate">Tanggal Akta Jual Beli</Label>
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
          <Label for="exampleEmail">Nama Penjual</Label>
          <Input
            type="email"
            name="email"
            id="exampleEmail"
            value={this.state.formProperties.nama_penjual}
            onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,nama_penjual:e.target.value} })}
          />
        </FormGroup>

          <FormGroup>
          <Label for="exampleColor">Warna Wilayah</Label>
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
          <Label for="exampleNumber">Luas Tanah</Label>
          <Input
            type="number"
            name="number"
            id="exampleNumber"
            value={this.state.formProperties.luas_tanah}
            onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_tanah:e.target.value} })}
          />
        </FormGroup>


       <FormGroup>
                <Label for="exampleNumber">Luas Awal</Label>
                <Input
                  type="number"
                  name="number"
                  id="exampleNumber"
                  value={this.state.formProperties.luas_awal}
            onChange={(e)=>this.setState({ formProperties: {...this.state.formProperties,luas_awal:e.target.value} })}
                />
              </FormGroup>


       <FormGroup>
                <Label for="exampleNumber">Luas Akhir Pembelian</Label>
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
            <Button color="primary" onClick={this.submitLokasi}>Simpan</Button>{' '}

            <Button color="secondary" onClick={this.toggle}>Batal</Button>
          </ModalFooter>
        </Modal>
	)
}