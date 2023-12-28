import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { Box, Card, Table, Select, MenuItem, TableBody, TextField, InputLabel, FormControl, Autocomplete, TableContainer, InputAdornment, SelectChangeEvent } from '@mui/material';

import { useSectorCatalog, useCatalogContact, useCatalogCitiesCollectionByName } from 'src/hooks/use-catalog';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { LoadingScreen } from 'src/components/loading-screen';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import { IContact } from 'src/types/contact';

import ContactTableRow from './contact-table-row';


// ----------------------------------------------------------------------
const pageSize = 10;
const TABLE_HEAD = [
  { id: '', label: '#', width: 88 },
  { id: 'name', label: 'Razón Social', align: 'center' },
  { id: 'isPerson', label: 'Tipo Contacto', width: 145, align: 'center' },
  { id: 'contactos', label: 'Empl. Asociados', width: 145, align: 'center' },
  { id: 'ubication', label: 'Ubicación', width: 120, align: 'center' },
  { id: 'sector', label: 'Sec. Económico', width: 145, align: 'center' },
  { id: 'sent', label: 'Correo/Teléfono', align: 'center' },
  { id: 'c_activo', label: 'Status', align: 'center' },
  { id: '' },
];


export default function ContactList() {
  const [filter, setFilter] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [debouncedRazonSocial, setDebouncedRazonSocial] = useState<string>(razonSocial);

  const [sectorValue, setSectorValue] = useState('');
  const [debouncedSectorValue, setDebouncedSectorValue] = useState<string>(sectorValue);
  const [sectorList, setSectorList] = useState<any[]>([]);

  const [cityValue, setCityValue] = useState('');
  const [codeCity, setCodeCity] = useState('');
  const [codeSector, setCodeSector] = useState('');
  const [debouncedCityValue, setDebouncedCityValue] = useState<string>(cityValue);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [contactList, setContactList] = useState<IContact[]>([]);

  const queryCatalog = useCatalogContact(page, pageSize, filter);
  const querySector = useSectorCatalog(debouncedSectorValue);
  const queryCities = useCatalogCitiesCollectionByName(debouncedCityValue);

  const table = useTable({ defaultRowsPerPage: 10, defaultDense: true });
  const [tableData, setTableData] = useState<IContact[]>(contactList);  
  const [tipoContacto, setTipoContacto] = useState<boolean | string>("all");

  const onChangeTipoContacto= (event: SelectChangeEvent<unknown>) => {
    if(event.target.value===true || event.target.value===false || event.target.value==="all" ){
      setTipoContacto(event.target.value);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSectorValue(sectorValue), 500);

    return () => clearTimeout(timer);
  }, [sectorValue]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCityValue(cityValue), 500);

    return () => clearTimeout(timer);
  }, [cityValue]);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedRazonSocial(razonSocial), 500);

    return () => clearTimeout(timer);
  }, [razonSocial]);

  useEffect(() => {
    const parTipoContacto = tipoContacto==="all" ? "" : `&isPerson=${tipoContacto}`;
    const CityId = codeCity==="" ? "" : `&CityId=${codeCity}`;
    const SectorId = codeSector==="" ? "" : `&SectorId=${codeSector}`;
    setFilter(`&Name=${debouncedRazonSocial}${parTipoContacto}${CityId}${SectorId}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRazonSocial, tipoContacto,codeCity,codeSector])
  

  useEffect(() => {
    if (queryCatalog.isFetched) {
      setTotalPages(queryCatalog.data.totalPages);
       const initResult = queryCatalog.data.data.map((contact: any) => ({
         id: contact.id,
         ruc: contact.cC_RUC_DNI,
         name: contact.name,
         address: contact.address,
         email: contact.emailBilling,
         phone: contact.phone,
         empleados: contact.employees,
         sector: contact.sector ? contact.sector.name : 'SIN SECTOR',
         isPerson: contact.isPerson,
         c_activo: contact.c_activo,
         ubication: contact.city.name
       }));
      setContactList(initResult);
      setTableData(initResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCatalog.data]);

  useEffect(() => {
    if (querySector.isFetched) {
      setSectorList(querySector.data.data.sort().map((sector: any) => ({id: sector.id, name: sector.name, parentId: sector.parentId}) ));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySector.data]);

  useEffect(() => {
    if (queryCities.isFetched) {
       setCitiesList(queryCities.data.data.sort().map((sector: any) => ({id: sector.id, name: sector.name, parentId: sector.parentId}) ));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCities.data]);

  
  const onPageChange = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
    table.onChangePage(event, newPage);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'id-razon-social':
        setRazonSocial(value);
        break;
      case 'tipo-contacto':
        break;
      case 'sector':
        break;  
      case 'ubicacion':
        break;

      default:
        break;
    }
  };



// if(queryCatalog.isLoading)  {
//  return <LoadingScreen />

// }

  return (
    <Card style={{ marginTop: '15px', marginBottom: '15px' }}>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <FormControl fullWidth>
          <TextField
            id="id-razon-social"
            name="id-razon-social"
            label="Razón Social"
            variant="outlined"
            autoFocus
            value={razonSocial}
            onChange={handleInputChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="material-symbols:search" />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="id-tipo-contacto">Tipo Contacto</InputLabel>
          <Select
            labelId="id-tipo-contacto"
            id="tipo-contacto"
            name="tipo-contacto"
            size="small"
            value={tipoContacto}
            label="Tipo Contacto"
            onChange={onChangeTipoContacto}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value={true as any}>Persona</MenuItem>
            <MenuItem value={false as any}>Empresa</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
        <Autocomplete
            disablePortal
            id="combo-ubicacion"
            size="small"
            onChange={(event, newVal)=> setCodeCity(newVal.id)}
            getOptionLabel={(option) => option.name}
            options={citiesList}
            groupBy={(option) => option.parentId}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option.id} {'->'} {option.name}
              </Box>
            )}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Ubicación" name="ubicacion" value={cityValue} onChange={(e: any)=>setCityValue(e.target.value)} />}
          />
        </FormControl>
        <FormControl fullWidth>
          <Autocomplete
            disablePortal
            id="combo-sector"
            size="small"
            onChange={(event, newVal)=>setCodeSector(newVal.id)}
            getOptionLabel={(option) => option.name}
            options={sectorList}
            groupBy={(option) => option.parentId}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {option.id} {'->'} {option.name}
              </Box>
            )}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Sector Económico"             name="sector" value={sectorValue} onChange={(e: any)=>setSectorValue(e.target.value)} />}
          />
        </FormControl>
      </Stack>
      {
        queryCatalog.isLoading && <LoadingScreen />
      }
      <TableContainer sx={{ position: 'relative', overflow: 'unset', backgroundColor: '#FFFFFF' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ maxWidth: '100%' }}>
            <TableHeadCustom
              key="thc-contact"
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={table.selected.length}
            />
            <TableBody>
              {tableData.map((row, index) => (
                <ContactTableRow row={row} rowNumber={(page - 1) * 10 + index + 1} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
      <TablePaginationCustom
        count={pageSize * totalPages}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={table.onChangeRowsPerPage}
        //
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}
