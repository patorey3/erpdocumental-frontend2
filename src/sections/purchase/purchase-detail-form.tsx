import { enqueueSnackbar } from 'notistack';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useRef, useState, useEffect, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import {
  Box,
  Card,
  Stack,
  Table,
  Button,
  TableRow,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  Autocomplete,
  TableContainer,
} from '@mui/material';

import { useItemByName, useItemByBarcode } from 'src/hooks/use-catalog';

import { localStorageGetItem } from 'src/utils/storage-available';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { RHFTextField } from 'src/components/hook-form';

/*
{
    "id": "1777ac1d-a5ef-4fe6-ab4a-2ad694e9c9d8",
    "detailTypeId": "Article",
    "invoiceId": 68317,
    "itemId": 2,
    "itemName": null,
    "itemBarCode": null,
    "productCode": null,
    "description": "Zapatera Modificada",
    "quantity": 63,
    "priceAmount": 25,
    "discountDecimalPercent": 0,
    "subtotal": 1575,
    "vatTaxCode": "2",
    "vatTaxDecimalPercent": 0.12,
    "documentId": null,
    "decreaseDocumentId": null,
    "purchaseRequisitionDocumentId": null,
    "invoiceDetailsDocument": [],
    "taxDetails": [
        {
            "id": 12877,
            "taxId": 1,
            "taxCode": "2",
            "taxDescription": "IVA",
            "percentId": 2,
            "percentCode": "2",
            "percentDescription": "12%",
            "percentValue": 0.12,
            "taxAmount": 189
        }
    ]
}
*/

function PurchaseDetailForm() {
  const { control, watch, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  console.log('fieldsfieldsfieldsfields',fields)

  const values = watch();

  const inputDescriptionRef = useRef<HTMLInputElement>(null);

  const [inputBarcodeValue, setInputBarcodeValue] = useState<string>('');
  const [inputCantidadValue, setInputCantidadValue] = useState<number>(0);
  const [inputCostoValue, setInputCostoValue] = useState<number>(0);
  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [barcodeText, setBarcodeText] = useState<string>('');
  const [debouncedValueName, setDebouncedValueName] = useState<string>(inputNameValue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValueName(inputNameValue), 500);

    return () => clearTimeout(timer);
  }, [inputNameValue]);

  const [itemSeach, setItemSeach] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>({ itemId: 0, barCode: '', name: '', taxes: [] });
  const handleSeletedItem = (event: any, selectedValue: any) => {   
    console.log('selectedValue', selectedValue)  
    setSelectedItem(selectedValue);
    setValueTax([selectedValue.taxes[0].description]);
    setInputBarcodeValue(selectedValue.barCode);
  };

  const objTaxesCatalog = JSON.parse(localStorageGetItem('taxes-catalog') ?? '');
  const taxesCatalog = objTaxesCatalog.taxes;
  const [valueTax, setValueTax] = useState<any[]>([]);
  const [itemsArray, setItemsArray] = useState<any[]>([]);

  const querySearchItem = useItemByBarcode(barcodeText);
  const querySearchItemByName = useItemByName(debouncedValueName);



  useEffect(() => {
    if (querySearchItem.isFetched) {
      console.log(itemSeach);
      if (querySearchItem.data[0] && querySearchItem.data[0].barCode === barcodeText) {
        setItemSeach(querySearchItem.data[0]);
        setItemsArray([querySearchItem.data[0]]);
        setSelectedItem({
          itemId: querySearchItem.data[0].id,
          barCode: querySearchItem.data[0].barCode,
          name: querySearchItem.data[0].name,
          taxes: querySearchItem.data[0].taxes
        });
        setValueTax([querySearchItem.data[0].taxes[0].description]);
        if (inputDescriptionRef.current) {
          inputDescriptionRef.current.focus();
        }
      } else {
        setItemSeach(null);
        setSelectedItem({ itemId: 0, barCode: '', name: 'No Hay Coincidencias' });
        enqueueSnackbar('Barcode No Existe', {
          variant: 'warning',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySearchItem.data]);

  useEffect(() => {
    if (querySearchItemByName.isFetched) {
      setItemsArray(querySearchItemByName.data);
      // setInputBarcodeValue('');
      // setSelectedItem({itemId:0, barCode:'', name:''})
      if (querySearchItemByName.data.length > 0) {
        //    setSelectedItem({itemId:querySearchItemByName.data[0].itemId, barCode:querySearchItemByName.data[0].barCode, name:querySearchItemByName.data[0].name});
        //    setInputBarcodeValue(querySearchItemByName.data[0].barCode);
      } else {
        setInputBarcodeValue('');
        setSelectedItem({ itemId: 0, barCode: '', name: 'No Hay Coincidencias', taxes: [] });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [querySearchItemByName.data]);

  const searchBarcode = (event: any) => {
    switch (event.target.name) {
      case 'id-description':
        setInputNameValue(event.target.value);
        break;
      case 'id-barcode':
        setInputBarcodeValue(event.target.value);
        break;
      case 'id-quantity':
          setInputCantidadValue(event.target.value);
          break;  
      case 'id-precio':
          setInputCostoValue(event.target.value);
          break;            
      default:
        break;
    }
  };


  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      switch (event.target.name) {
        case 'id-description':
          console.log('inputNameValue');
          break;
        case 'id-barcode':
          setBarcodeText(inputBarcodeValue);
          break;
        case 'id-quantity':
          console.log('inputQuantity');
            break;                    
        case 'id-precio':
          console.log('inputPrecio');
            break;  
          default:
          break;
      }
      // buscarEnAPI(inputValue);
    }
  };

  const handleAdd = () => {
    console.log('selectedItem',selectedItem);
    if(selectedItem.itemId===0){
      enqueueSnackbar('Debe Seleccionar un Item', {
        variant: 'warning',
      });
      return;
    }
    if(inputCantidadValue*inputCostoValue===0){
      enqueueSnackbar('Costo y Cantidad Debe Ser Mayor a 0', {
        variant: 'warning',
      });
      return;
    }
    append({
      "id": "",
      "detailTypeId": "Article",
      "invoiceId": 68317,
      "itemId": selectedItem.itemId,
      "itemName": null,
      "itemBarCode": selectedItem.barCode,
      "barCode": selectedItem.barCode,
      "productCode": null,
      "description": selectedItem.name,
      "quantity": inputCantidadValue,
      "priceAmount": inputCostoValue,
      "discountDecimalPercent": 0,
      "subtotal": Number(inputCantidadValue*inputCostoValue),
      "vatTaxCode": "2",
      "vatTaxDecimalPercent": 0.12,
      "documentId": null,
      "decreaseDocumentId": null,
      "purchaseRequisitionDocumentId": null,
      "invoiceDetailsDocument": [],
      "taxDetails": [
          {
              "id": 12877,
              "taxId": 1,
              "taxCode": "2",
              "taxDescription": "IVA",
              "percentId": 2,
              "percentCode": "2",
              "percentDescription": "12%",
              "percentValue": 0.12,
              "taxAmount": 189
          }
      ]
  });
      // clear form data
      setValueTax([]);
      setItemsArray([]);
      setInputBarcodeValue("");
      setSelectedItem({ itemId: 0, barCode: '', name: '', taxes: [] });
      setInputCantidadValue(0);
      setInputCostoValue(0);
  };
  // const change = () => {
  //   setValue(`details[1].priceAmount`, 15);

  // }
  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleChangeQuantity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`details[${index}].quantity`, Number(event.target.value));
      setValue(
        `details[${index}].subtotal`,
        values.details.map((item: any) => item.quantity * item.priceAmount)[index]
      );
      setValue(
        `details[${index}].taxDetails[0].taxAmount`,
        values.details.map((item: any) => item.subtotal * item.vatTaxDecimalPercent)[index]
      );
    },
    [setValue, values.details]
  );

  const calcSubTotal = () =>
    // return fields.reduce( (acc, cur) => acc = cur.subtotal, 0);
     values.details.reduce((accumulator: number, item: any) => accumulator + item.subtotal, 0)

  

  const renderTotal = (
    <>
      <TableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {calcSubTotal()}
        </TableCell>
      </TableRow>
  
      <TableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ color: 'text.secondary' }}>Impuestos</TableCell>
        <TableCell width={120}>{0}</TableCell>
      </TableRow>
  
      <TableRow>
        <TableCell colSpan={5} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {0}
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <Card style={{ padding: '5px' }}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <Stack>
          <RHFTextField
            id="id-barcode"
            name="id-barcode"
            label="BarCode"
            onChange={searchBarcode}
            onKeyDown={handleKeyDown}
            value={inputBarcodeValue}
          />
        </Stack>
        <Stack>
          <Autocomplete
            id="combo-description"
            options={itemsArray.map((option) => ({
              itemId: option.id,
              barCode: option.barCode,
              name: option.name,
              taxes: option.taxes
            }))}
            getOptionLabel={(option: any) => option.name}
            freeSolo
            size="small"
            // onInputChange={(event, value) =>handleInputDescriptionChange(value)}
            onChange={handleSeletedItem}
            disableClearable
            autoHighlight
            value={selectedItem}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="id-description"
                label="Descripción"
                autoFocus
                onChange={searchBarcode}
                onKeyDown={handleKeyDown}
                inputRef={inputDescriptionRef}
                value={selectedItem}
                InputProps={{
                  ...params.InputProps,
                  type: 'Nombre de Item',
                }}
              />
            )}
          />
        </Stack>
        <Stack>
          <Autocomplete
            id="tags-taxes"
            value={valueTax}
            style={{ minWidth: '200px' }}
            size="small"
            onChange={(event, newValue) => {
              setValueTax(newValue);
            }}
            multiple
            options={taxesCatalog.map((option: any) => option.description)}
            freeSolo
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Impuestos" />}
          />
        </Stack>
        <Stack>
          <RHFTextField
            id="id-quantity"
            name="id-quantity"
            type='number'
            label="Cantidad"
            onChange={searchBarcode}
            onKeyDown={handleKeyDown}
            value={inputCantidadValue}
          />
        </Stack>
        <Stack>
          <RHFTextField
            id="id-precio"
            name="id-precio"
            type='number'
            label="Costo Unitario"
            onChange={searchBarcode}
            onKeyDown={handleKeyDown}
            value={inputCostoValue}
          />
        </Stack>
        <Stack>
        <Button
          size="small"
          color="primary"
          variant='contained'
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Agregar
        </Button>
        </Stack>
      </Stack>

      <Typography variant="h6" style={{ paddingBottom: '10px', paddingTop: '10px' }}>
        Detalle de Items
      </Typography>
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size="medium" sx={{ maxWidth: '100%' }}>
            <TableHead>
              <TableRow key="tk-1235">
                <TableCell>{}</TableCell>
                <TableCell>#</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Descuento</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.details.map((item: any, index: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                      onClick={() => handleRemove(index)}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 200 }}>
                      <Typography variant="subtitle2">BarCode: {item.barCode} </Typography>

                      <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                        {item.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <RHFTextField
                      size="small"
                      name={`details[${index}].quantity`}
                      variant="standard"
                      onChange={(event) => handleChangeQuantity(event, index)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <RHFTextField
                      size="small"
                      name={`details[${index}].priceAmount`}
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>{item.discountDecimalPercent}%</TableCell>
                  <TableCell>{item.subtotal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            {renderTotal}
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

export default PurchaseDetailForm;
