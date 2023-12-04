import { TreeList } from 'devextreme-react';
import { useState, useEffect } from 'react';
import {
  Pager,
  Column,
  Paging,
  Scrolling,
  Selection,
  SearchPanel,
} from 'devextreme-react/tree-list';

import { Box, Grid, Container, TextField } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { ICollectionItem } from 'src/types/transaction';

type Props = {
  itemCollection: any[];
  itemToCreate: ICollectionItem;
  setItemToCreate: (item: ICollectionItem) => void;

};

function SriCreateItemStep1({ itemCollection, itemToCreate, setItemToCreate }: Props) {
  const [focusedRowKey, setFocusedRowKey] = useState('i');
  const settings = useSettingsContext();

  const cellItemNameRender = (data: any) => {
    const changeColor = data.data.level === 3 ? '#1EAAE7' : '#BABABBA';
    return <div style={{ color: `${changeColor}` }}>{data.data.name}</div>;
  };

  const cellItemNamePathRender = (data: any) => {
    const changeColor = data.data.level === 3 ? '#1EAAE7' : '#BABABBA';
    return <div style={{ color: `${changeColor}` }}>{data.data.collectionPath}</div>;
  };
  const allowedPageSizes = [5, 10, 20];

  const onFocusedRowChanged = (e: any) => {
    const rowData = e.row && e.row.data;
    console.log(rowData);
    if (rowData && e.row.data.level === 3) {
      const newItemQ:ICollectionItem  = {
              ...itemToCreate,
              "itemNodeId": e.row.data.id,
              "parentId": e.row.data.parentId,
              "itemNodename": e.row.data.name,
              "itemNodePath": e.row.data.collectionPath
              }
              setItemToCreate(newItemQ); 
      setFocusedRowKey(e.row.data.id);
    }
  };

  useEffect(() => {
    setFocusedRowKey('i');
     setFocusedRowKey(itemToCreate.itemNodeId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'md'}>
      <Grid container>
        <Grid item xs={12}>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                error={itemToCreate.itemNodePath.length === 0}
                id="id-name-path"
                label="Naturaleza Documental"
                value={itemToCreate.itemNodePath}
                disabled
                helperText="Debe seleccionar del listado la Naturaleza del Item"
              />
            </div>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TreeList
            id="itemCollection"
            dataSource={itemCollection}
            columnAutoWidth
            wordWrapEnabled
            showBorders
            keyExpr="id"
            parentIdExpr="parentId"
            focusedRowEnabled
            focusedRowKey={focusedRowKey}
            onFocusedRowChanged={onFocusedRowChanged}
          >
            <SearchPanel visible />
            <Selection mode="single" />
            <Scrolling mode="standard" />
            <Paging enabled defaultPageSize={10} />
            <Pager showPageSizeSelector allowedPageSizes={allowedPageSizes} showInfo />
            <Column dataField="id" />
            <Column dataField="level" caption="Nivel" />
            <Column dataField="name" caption="Nombre" cellRender={cellItemNameRender} />
            <Column
              dataField="collectionPath"
              caption="Catagoría"
              cellRender={cellItemNamePathRender}
            />
            <Column
              dataField="hasDocumentModelForPurchase"
              allowEditing={false}
              caption="Es Item"
            />
          </TreeList>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SriCreateItemStep1;
