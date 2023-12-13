import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Table,
  TableRow,
  TableCell,
  TableHead,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { useItemByName } from 'src/hooks/use-catalog';

import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

import { IItemResult } from 'src/types/purchases';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  action?: React.ReactNode;
  //
  open: boolean;
  onClose: VoidFunction;
  //
  selected: (selectedId: string) => boolean;
  onSelect: (contact: IItemResult | null) => void;
};

export default function ItemListDialog({
  title = 'Items',
  action,
  //
  open,
  onClose,
  //
  selected,
  onSelect,
}: Props) {
  const [searchItem, setSearchItem] = useState('');
  const [itemList, setItemList] = useState<IItemResult[]>([]);
  const [debouncedValueName, setDebouncedValueName] = useState<string>(searchItem);

  const queryCatalog = useItemByName(debouncedValueName);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValueName(searchItem), 500);

    return () => clearTimeout(timer);
  }, [searchItem]);

  const notFound = !itemList.length && !!searchItem;

  const handleSearchItem = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(event.target.value);
  }, []);

  const handleSelect = useCallback(
    (item: IItemResult | null) => {
      onSelect(item);
      setSearchItem('');
      onClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, onSelect]
  );

  useEffect(() => {
    if (queryCatalog.isFetched) {
      console.log(queryCatalog.data, 'queryCatalog.data');
      const initResult: IItemResult[] = queryCatalog.data.map((item: IItemResult) => ({
        id: item.id,
        barCode: item.barCode,
        name: item.name,
        collectionPath: item.collectionPath,
        taxes: item.taxes,
      }));
      console.log(initResult, 'initResult');
      setItemList(initResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCatalog.data]);

  const renderList = (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell align="left">Código</TableCell>
          <TableCell align="left">Categoría</TableCell>
        </TableRow>
      </TableHead>
      {itemList.map((item) => (
        <TableRow
          hover
          onDoubleClick={()=>handleSelect(item)}
          key={item.id}
          style={{ padding: '0px' }}
        >
          <TableCell align="left" style={{ padding: '5px' }}>
            <Box sx={{ width: 450 }}>
              <Typography variant="subtitle2">{item.barCode} </Typography>

              <Typography sx={{ color: 'text.secondary', typography: 'caption' }} noWrap>
                {item.name}
              </Typography>
            </Box>
          </TableCell>
          <TableCell align="left" style={{ padding: '5px' }}>
            <Box sx={{ color: 'text.secondary', typography: 'caption' }}>{item.collectionPath}</Box>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );

  return (
    <Dialog fullWidth maxWidth="md" style={{ minHeight: '450px' }} open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 3 }} id="customized-dialog-title">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ p: 3, pr: 1.5 }}
        >
          <Typography variant="h6"> {title} </Typography>
          {queryCatalog.isPending ? <CircularProgress color="primary" size={25} /> : null}
          {action}
        </Stack>
        <Stack sx={{ p: 2, pt: 0 }}>
          <TextField
            value={searchItem}
            onChange={handleSearchItem}
            autoFocus
            placeholder="Buscar..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {queryCatalog.isPending ? <CircularProgress color="primary" size={25} /> : null}
                </InputAdornment>
               )
            }}
          />
        </Stack>
        {queryCatalog.isFetching ? <CircularProgress color="primary" size={25} /> : null}

      </DialogTitle>
      <DialogContent dividers>

        {notFound ? (
          <SearchNotFound query={searchItem} sx={{ px: 3, pt: 5, pb: 10 }} />
        ) : (
          renderList
        )}
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
