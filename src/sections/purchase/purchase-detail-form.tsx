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
  Collapse,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Autocomplete,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useItemByName, useItemByBarcode } from 'src/hooks/use-catalog';

import { localStorageGetItem } from 'src/utils/storage-available';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { RHFTextField } from 'src/components/hook-form';

import { IItemResult, IDetailPurchase } from 'src/types/purchases';

import ItemListDialog from './item-list-dialog';

const initialFormRegister: IDetailPurchase = {
  id: 0,
  barCode: '',
  detailTypeId: '',
  invoiceId: 0,
  itemId: 0,
  itemName: '',
  itemBarCode: null,
  productCode: null,
  description: '',
  quantity: 0,
  priceAmount: 0,
  discountDecimalPercent: 0,
  subtotal: 0,
  vatTaxCode: '',
  vatTaxDecimalPercent: 0,
  documentId: null,
  decreaseDocumentId: null,
  purchaseRequisitionDocumentId: null,
  totalImpuesto: 0,
  total: 0,
  montoDescuento: 0,
  invoiceDetailsDocument: [],
  taxDetails: [],
};

function PurchaseDetailForm() {
  const [formRegister, setFormRegister] = useState<IDetailPurchase>(initialFormRegister);
  const from = useBoolean();

  const updateFormRegister = (key: keyof IDetailPurchase, value: any) => {
    setFormRegister((prevFormRegister) => ({
      ...prevFormRegister,
      [key]: value,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let pvalue: number = 0;
    let subtotalbruto: number = 0;
    switch (name) {
      case 'quantity':
      case 'priceAmount':
        pvalue = parseInt(event.target.value, 10);
        if (pvalue < 0) pvalue = 0;
        updateFormRegister(name as keyof IDetailPurchase, pvalue);
        break;
      case  'discountDecimalPercent':
        pvalue = parseInt(event.target.value, 10);
        if (pvalue > 100) pvalue = 100;
        if (pvalue < 0) pvalue = 0;
        updateFormRegister(name as keyof IDetailPurchase, pvalue);
        break;
        case  'montoDescuento':
          pvalue = parseInt(event.target.value, 10);
          subtotalbruto = formRegister.quantity * formRegister.priceAmount;
          if (pvalue > subtotalbruto) pvalue = subtotalbruto;
          if (pvalue < 0) pvalue = 0;
          updateFormRegister(name as keyof IDetailPurchase, pvalue);
          break;

      default:
        updateFormRegister(name as keyof IDetailPurchase, value);
        break;
    }

  };

  const { control, watch, setValue } = useFormContext();

  const { prepend, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const values = watch();

  const inputCostoRef = useRef<HTMLInputElement>(null);
  const inputDescPerRef = useRef<HTMLInputElement>(null);
  const inputDescValRef = useRef<HTMLInputElement>(null);
  const addButtonValRef = useRef<HTMLButtonElement>(null);
  const inputQuantityRef = useRef<HTMLInputElement>(null);
  const inputBarcodeRef = useRef<HTMLInputElement>(null);

  const [inputNameValue, setInputNameValue] = useState<string>('');
  const [showCreateItem, setShowCreateItem] = useState<boolean>(false);
  const [barcodeText, setBarcodeText] = useState<string>('');
  const [debouncedValueName, setDebouncedValueName] = useState<string>(inputNameValue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValueName(inputNameValue), 500);

    return () => clearTimeout(timer);
  }, [inputNameValue]);

  const [itemSeach, setItemSeach] = useState<any>();
  const [selectedItem, setSelectedItem] = useState<any>({
    itemId: 0,
    barCode: '',
    name: '',
    taxes: [],
  });
  const handleSeletedItem = (event: any, selectedValue: any) => {
    setSelectedItem(selectedValue);
    setValueTax([selectedValue.taxes[0].description]);
    console.log('valueTax', selectedValue);
    updateFormRegister('barCode', selectedValue.barCode);
    updateFormRegister('vatTaxCode', selectedValue.taxes[0].taxCode);
    updateFormRegister('vatTaxDecimalPercent', selectedValue.taxes[0].percentValue);
    updateFormRegister(
      'totalImpuesto',
      formRegister.subtotal * selectedValue.taxes[0].percentValue
    );
  };

  const objTaxesCatalog = JSON.parse(localStorageGetItem('taxes-catalog') ?? '');
  const taxesCatalog = objTaxesCatalog.taxes;
  const [valueTax, setValueTax] = useState<any[]>([]);
  const [itemsArray, setItemsArray] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

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
          taxes: querySearchItem.data[0].taxes,
          collectionPath: querySearchItem.data[0].collectionPath,
        });
        setValueTax([querySearchItem.data[0].taxes[0].description]);
      } else {
        setItemSeach(null);
        setShowCreateItem(true)
        setSelectedItem({ itemId: 0, barCode: '', name: 'No Hay Coincidencias' });
        setFormRegister(initialFormRegister);
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
      updateFormRegister('barCode', '');

      // setSelectedItem({itemId:0, barCode:'', name:''})
      if (querySearchItemByName.data.length > 0) {
        //    setSelectedItem({itemId:querySearchItemByName.data[0].itemId, barCode:querySearchItemByName.data[0].barCode, name:querySearchItemByName.data[0].name});
        //    setInputBarcodeValue(querySearchItemByName.data[0].barCode);
      } else {
        updateFormRegister('barCode', '');
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
        // setInputBarcodeValue(event.target.value);
        break;
      case 'id-quantity':
        break;
      case 'id-precio':
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (event: any) => {
    setShowCreateItem(false);
    let subtotalbruto: number = 0;
    let percentage : number = 0;
    let taxItem: any = {};
    let impuestos: number = 0;
    let desvalue: number = 0;
    if (event.key === 'Enter') {
      event.preventDefault();
      switch (event.target.name) {
        case 'id-description':
          console.log('id-description');
          if (inputQuantityRef.current) {
            inputQuantityRef.current.focus();
          }
          break;
        case 'quantity':
          console.log('quantity');
          subtotalbruto = formRegister.quantity * formRegister.priceAmount;
          desvalue = (formRegister.montoDescuento ?? 0 ) / subtotalbruto*100;
          updateFormRegister('discountDecimalPercent', desvalue.toFixed(4));
          // eslint-disable-next-line no-case-declarations
          taxItem = taxesCatalog.find((tax: any) => tax.description === valueTax[0]);
          // eslint-disable-next-line no-case-declarations
         percentage = Number(taxItem?.percentValue ?? 0);
          updateFormRegister('vatTaxDecimalPercent', percentage ?? 0 );
          impuestos = subtotalbruto * (percentage ?? 0);
          updateFormRegister(
            'totalImpuesto',
            impuestos
          );
          if (inputCostoRef.current) {
            inputCostoRef.current.focus();
          }
          break;
        case 'priceAmount':
          console.log('priceAmount');
          subtotalbruto = formRegister.quantity * formRegister.priceAmount;
          desvalue = (formRegister.montoDescuento ?? 0 ) / subtotalbruto*100;
          updateFormRegister('discountDecimalPercent', desvalue.toFixed(4));
          taxItem = taxesCatalog.find((tax: any) => tax.description === valueTax[0]);
          percentage = Number(taxItem.percentValue ?? 0);

          updateFormRegister('vatTaxDecimalPercent', percentage ?? 0 );
          impuestos = subtotalbruto * (percentage ?? 0);
          updateFormRegister(
            'totalImpuesto',
            impuestos
          );
          if (inputDescPerRef.current) {
            inputDescPerRef.current.focus();
          }
          break;
        case 'barCode':
          setBarcodeText(formRegister.barCode ?? '');
          break;
        case 'discountDecimalPercent':
          subtotalbruto = formRegister.quantity * formRegister.priceAmount;
          desvalue = (subtotalbruto * event.target.value) / 100;
          updateFormRegister('subtotal', subtotalbruto - desvalue);
          updateFormRegister(
            'totalImpuesto',
            (subtotalbruto - desvalue) * formRegister.vatTaxDecimalPercent
          );
          console.log(
            'total',
            formRegister.vatTaxDecimalPercent,
            formRegister.totalImpuesto,
            formRegister.subtotal
          );
          updateFormRegister('total', subtotalbruto - desvalue + (formRegister.totalImpuesto ?? 0));
          updateFormRegister('montoDescuento', desvalue.toFixed(2));
          if (inputDescValRef.current) {
            inputDescValRef.current.focus();
          }

          break;
        case 'montoDescuento':
          subtotalbruto = formRegister.quantity * formRegister.priceAmount;
          desvalue = (event.target.value * 100) / subtotalbruto;
          updateFormRegister('subtotal', subtotalbruto - event.target.value);
          updateFormRegister(
            'totalImpuesto',
            (subtotalbruto - event.target.value) * formRegister.vatTaxDecimalPercent
          );
          updateFormRegister(
            'total',
            subtotalbruto - event.target.value + (formRegister.totalImpuesto ?? 0)
          );
          updateFormRegister('discountDecimalPercent', desvalue.toFixed(4));
          if (addButtonValRef.current) {
            addButtonValRef.current.focus();
          }
          break;
        default:
          break;
      }
      // buscarEnAPI(inputValue);
    }
  };

  const handleAdd = () => {
    setShowCreateItem(false);
    if (selectedItem.itemId === 0) {
      enqueueSnackbar('Debe Seleccionar un Item', {
        variant: 'warning',
      });
      return;
    }
    if (formRegister.quantity === 0) {
      enqueueSnackbar('Cantidad Debe Ser Mayor a 0', {
        variant: 'warning',
      });
      return;
    }
    prepend({
      id: '',
      detailTypeId: 'Article',
      invoiceId: 68317,
      itemId: selectedItem.itemId,
      itemName: null,
      itemBarCode: selectedItem.barCode,
      barCode: formRegister.barCode,
      productCode: null,
      description: selectedItem.name,
      quantity: formRegister.quantity,
      priceAmount: formRegister.priceAmount,
      discountDecimalPercent: formRegister.discountDecimalPercent,
      subtotal: formRegister.subtotal,
      vatTaxCode: selectedItem.taxes[0].taxCode,
      vatTaxDecimalPercent: selectedItem.taxes[0].percentValue,
      documentId: null,
      decreaseDocumentId: null,
      purchaseRequisitionDocumentId: null,
      invoiceDetailsDocument: [],
      taxDetails: [
        {
          id: 0,
          taxId: selectedItem.taxes[0].id,
          taxCode: selectedItem.taxes[0].taxCode,
          taxDescription: selectedItem.taxes[0].description,
          percentId: selectedItem.taxes[0].id,
          percentCode: selectedItem.taxes[0].percentCode,
          percentDescription: selectedItem.taxes[0].description,
          percentValue: selectedItem.taxes[0].percentValue,
          taxAmount: formRegister.discountDecimalPercent * formRegister.subtotal,
        },
      ],
    });
    // clear form data
    setValueTax([]);
    setItemsArray([]);
    updateFormRegister('barCode', '');
    updateFormRegister('quantity', 1);
    updateFormRegister('priceAmount', 1);
    updateFormRegister('priceAmount', 1);
    updateFormRegister('discountDecimalPercent', 0);
    updateFormRegister('montoDescuento', 0);
    updateFormRegister('subtotal', 1);
    updateFormRegister('totalImpuesto', 0);
    updateFormRegister('total', 1);

    setSelectedItem({ itemId: 0, barCode: '', name: '', taxes: [] });
    if (inputBarcodeRef.current) {
      inputBarcodeRef.current.focus();
    }
  };
  // const change = () => {
  //   setValue(`details[1].priceAmount`, 15);

  // }
  const handleRemove = (index: number) => {
    remove(index);
  };

  const handleChangeQuantity = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setShowCreateItem(false);
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

  const handleOnBlurDecimal = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      setValue(`details[${index}].priceAmount`, event.target.value);

      /*  setValue(
        `details[${index}].subtotal`,
        values.details.map((item: any) => item.quantity * item.priceAmount)[index]
      );
      setValue(
        `details[${index}].taxDetails[0].taxAmount`,
        values.details.map((item: any) => item.subtotal * item.vatTaxDecimalPercent)[index]
      );  */
    },
    [setValue]
  );

  const calcSubTotal = () =>
    // return fields.reduce( (acc, cur) => acc = cur.subtotal, 0);
    values.details.reduce((accumulator: number, item: any) => accumulator + item.subtotal, 0);
  const calcTotal = () =>
    // return fields.reduce( (acc, cur) => acc = cur.subtotal, 0);
    values.details.reduce(
      (accumulator: number, item: any) =>
        accumulator + item.subtotal * (1 + item.vatTaxDecimalPercent),
      0
    );
  const calcImpuestos = () =>
    // return fields.reduce( (acc, cur) => acc = cur.subtotal, 0);
    values.details.reduce(
      (accumulator: number, item: any) => accumulator + item.subtotal * item.vatTaxDecimalPercent,
      0
    );

    const handleOpenCollapse = () => {
      setOpen(!open);
    };

  const renderTotal = (
    <>
      <TableRow>
        <TableCell colSpan={7} />
        <TableCell sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell align="right" width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {calcSubTotal().toFixed(2)}
        </TableCell>
      </TableRow>

      <TableRow>        
        <TableCell colSpan={6} />
        <TableCell>
        <IconButton aria-label="expand row" size="small" onClick={() => handleOpenCollapse()}>
            {open ? <Iconify icon="mdi:chevron-up" /> : <Iconify icon="mdi:chevron-down" />}
          </IconButton>
                </TableCell>
                <TableCell sx={{ typography: 'subtitle2' }}>Impuestos</TableCell>
        <TableCell align="right" width={140} sx={{ typography: 'subtitle2' }}>
          {calcImpuestos().toFixed(2)}
        </TableCell>
      </TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
      <Collapse in={open} timeout="auto" unmountOnExit>
          <div style={{display: 'flex', justifyContent:'flex-end',width: '100%'}}>
            <Table size="medium" sx={{ maxWidth: '250px' }}>
              <TableBody>
                  <TableRow>
                    <TableCell>SubTotal</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SubTotal Iva 12%</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SubTotal Iva 0%</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SubTotal No Objeto</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SubTotal Exento</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SubTotal Sin impuestos</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Descuento</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IVA 12%</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ICE</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Otros</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </div>
        </Collapse>
      </TableCell>

      <TableRow>
        <TableCell colSpan={7} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell align="right" width={140} sx={{ typography: 'subtitle1' }}>
          {calcTotal().toFixed(2)}
        </TableCell>
      </TableRow>
    </>
  );

  useEffect(() => {
    if (formRegister.quantity) {
      const subTotal =
        formRegister.quantity * (formRegister.priceAmount ?? 0) -
        (formRegister.montoDescuento ?? 0);
      const impuestos = subTotal * (formRegister.vatTaxDecimalPercent ?? 0);
      updateFormRegister('subtotal', subTotal);
      updateFormRegister('totalImpuesto', impuestos);
      updateFormRegister('total', subTotal + impuestos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRegister.quantity]);

  useEffect(() => {
    if (formRegister.priceAmount) {
      const subTotal =
        formRegister.priceAmount * (formRegister.quantity ?? 0) -
        (formRegister.montoDescuento ?? 0);
      const impuestos = subTotal * (formRegister.vatTaxDecimalPercent ?? 0);
      updateFormRegister('subtotal', subTotal);
      updateFormRegister('totalImpuesto', impuestos);
      updateFormRegister('total', subTotal + impuestos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRegister.priceAmount]);

  useEffect(() => {
    if (inputBarcodeRef.current) {
      inputBarcodeRef.current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = (item: IItemResult | null) => {
    if (item) {
      console.log('item', item);
      setShowCreateItem(false);
      setSelectedItem(item);
      setBarcodeText(item.barCode);
      updateFormRegister('barCode', item.barCode);
      updateFormRegister('quantity', 1);

      if (inputQuantityRef.current) {
        console.log('inputCostoRef', inputQuantityRef);

        inputQuantityRef.current.focus();
      }
      // const provider: IProviderCatalog = {
      //   id: partner.id,
      //   name: partner.name,
      //   ruc: partner.ruc,
      // };
      // setProviders([provider]);
      // setValue('partnerId', provider.id);
      // setValue('cC_RUC_DNI', provider.ruc);
      // clearErrors('partnerId');
      // clearErrors('cC_RUC_DNI');
    }
  };

  
  return (
    <Card style={{ padding: '5px' }}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
        <Stack>
          <RHFTextField
            id="barCode"
            name="barCode"
            inputRef={inputBarcodeRef}
            autoFocus
            onFocus={(event) => {
              event.target.select();
            }}
            label="BarCode"
            InputProps={{
              inputProps: {
                style: { textAlign: 'left', width: '100px' },
              },
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={formRegister.barCode}
          />
          {
            showCreateItem && (          <Button
              size="small"
              color="primary"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={undefined}
              sx={{ flexShrink: 0, mt: 1 }}
            >
              Crear Item
            </Button>)
          }
        </Stack>
        <Stack>
          <Autocomplete
            id="combo-description"
            options={itemsArray.map((option) => ({
              itemId: option.id,
              barCode: option.barCode,
              name: option.name,
              collectionPath: option.collectionPath,
              taxes: option.taxes,
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
                onClick={from.onTrue}
                onChange={searchBarcode}
                onKeyDown={handleKeyDown}
                value={selectedItem}
                InputProps={{
                  ...params.InputProps,
                  type: 'Nombre de Item',
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} style={{ width: '500px' }}>
                <div>
                  <strong>{option.name}</strong>
                  <p>Barcode: {option.barCode}</p>
                  <p>Categoría: {option.collectionPath}</p>
                </div>
              </li>
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
            id="quantity"
            name="quantity"
            inputRef={inputQuantityRef}
            onFocus={(event) => {
              event.target.select();
            }}
            type="number"
            label="Cantidad"
            InputProps={{
              inputProps: {
                style: { textAlign: 'right', width: '100px' },
              },
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={formRegister.quantity}
          />
          <Box
            sx={{
              width: 150,
              backgroundColor: 'rgba(145, 158, 171, 0.24)',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          >
            <Typography variant="subtitle2">SubTotal</Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'right', marginRight: '25px' }}
              noWrap
            >
              $ {formRegister.subtotal.toFixed(2)}
            </Typography>
          </Box>
        </Stack>
        <Stack>
          <RHFTextField
            id="priceAmount"
            name="priceAmount"
            type="number"
            inputRef={inputCostoRef}
            onFocus={(event) => {
              event.target.select();
            }}
            autoFocus
            label="Costo Unitario"
            InputProps={{
              inputProps: {
                style: { textAlign: 'right', width: '100px' },
              },
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={formRegister.priceAmount}
          />

          <Box
            sx={{
              width: 150,
              backgroundColor: 'rgba(145, 158, 171, 0.24)',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          >
            <Typography variant="subtitle2">Impuestos</Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'right', marginRight: '25px' }}
              noWrap
            >
              $ {formRegister.totalImpuesto?.toFixed(2)}
            </Typography>
          </Box>
        </Stack>

        <Stack>
          <RHFTextField
            id="discountDecimalPercent"
            name="discountDecimalPercent"
            inputRef={inputDescPerRef}
            type="number"
            onFocus={(event) => {
              event.target.select();
            }}
            label="Descuento %"
            InputProps={
              {
                
              inputProps: {
                style: { textAlign: 'right', width: '100px' },
              },
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={formRegister.discountDecimalPercent}
          />
          <Box
            sx={{
              width: 150,
              backgroundColor: 'rgba(145, 158, 171, 0.24)',
              borderRadius: '5px',
              marginTop: '10px',
            }}
          >
            <Typography variant="subtitle2">Total</Typography>

            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'right', marginRight: '25px' }}
              noWrap
            >
              $ {formRegister.total?.toFixed(2)}
            </Typography>
          </Box>
        </Stack>
        <Stack>
          <Stack>
            <RHFTextField
              id="montoDescuento"
              name="montoDescuento"
              onFocus={(event) => {
                event.target.select();
              }}
              type="number"
              inputRef={inputDescValRef}
              label="Descuento $"
              InputProps={{
                inputProps: {
                  style: { textAlign: 'right', width: '100px' },
                },
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              value={formRegister.montoDescuento}
            />
          </Stack>
          <Button
            size="small"
            ref={addButtonValRef}
            color="primary"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAdd}
            sx={{ flexShrink: 0, mt: 1 }}
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
                <TableCell>SubTotal</TableCell>
                <TableCell>Impuestos</TableCell>
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
                      type="number"
                      style={{ width: '75px' }}
                      InputProps={{
                        inputProps: {
                          style: { textAlign: 'right', width: '75px' },
                        },
                      }}
                      onChange={(event) => handleChangeQuantity(event, index)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>
                    <RHFTextField
                      size="small"
                      name={`details[${index}].priceAmount`}
                      variant="standard"
                      onBlur={(event) => handleOnBlurDecimal(event, index)}
                      type="number"
                      style={{ width: '100px' }}
                      InputProps={{
                        inputProps: {
                          style: { textAlign: 'right', width: '100px' },
                        },
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </TableCell>
                  <TableCell>{item.discountDecimalPercent}%</TableCell>
                  <TableCell align="right">{item.subtotal.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    {(item.vatTaxDecimalPercent * item.subtotal).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {((1 + item.vatTaxDecimalPercent) * item.subtotal).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {renderTotal}
          </Table>
        </Scrollbar>
      </TableContainer>
      <ItemListDialog
        title="Items"
        open={from.value}
        onClose={from.onFalse}
        selected={(selectedId: string) => values.partnerId.toString() === selectedId}
        onSelect={(item: IItemResult | null) => onSelect(item)}
      />
    </Card>
  );
}

export default PurchaseDetailForm;
