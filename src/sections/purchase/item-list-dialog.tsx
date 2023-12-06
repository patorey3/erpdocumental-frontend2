import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton, { listItemButtonClasses } from '@mui/material/ListItemButton';

import { useCatalogContact } from 'src/hooks/use-catalog';

import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

interface IContactResult {
  id: number;
  ruc: string;
  name: string;
  address: string;
}

type Props = {
  title?: string;
  action?: React.ReactNode;
  //
  open: boolean;
  onClose: VoidFunction;
  //
  selected: (selectedId: string) => boolean;
  onSelect: (contact: IContactResult | null) => void;
};

const page = 1;
const pageSize = 10;

export default function ItemListDialog({
  title = 'Contactos',
  action,
  //
  open,
  onClose,
  //
  selected,
  onSelect,
}: Props) {
  const [filter, setFilter] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [contactList, setContactList] = useState<IContactResult[]>([]);

  const queryCatalog = useCatalogContact(page, pageSize, filter);

  const notFound = !contactList.length && !!searchAddress;

  const handleSearchAddress = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(event.target.value);
    if(event.target.value.length>0){
      const filtersResult = `&name=${searchAddress}`;
      setFilter(filtersResult);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectAddress = useCallback(
    (address: IContactResult | null) => {
      onSelect(address);
      setSearchAddress('');
      setFilter('');
      onClose();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, onSelect]
  );

  useEffect(() => {
    if (queryCatalog.isFetched) {
      const initResult = queryCatalog.data.data.map((contact: any) => ({
        id: contact.id,
        ruc: contact.cC_RUC_DNI,
        name: contact.name,
        address: contact.address,
      }));
      setContactList(initResult);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCatalog.data]);

  useEffect(() => {
    const filtersResult = `&name=${searchAddress}`; 
    setFilter(filtersResult);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchAddress]);

  

  const renderList = (
    <Stack
      spacing={0.5}
      sx={{
        p: 0.5,
        maxHeight: 80 * 8,
        overflowX: 'hidden',
      }}
    >
      {contactList.map((address) => (
        <Stack
          key={address.id}
          spacing={0.5}
          component={ListItemButton}
          selected={selected(`${address.id}`)}
          onClick={() => handleSelectAddress(address)}
          sx={{
            py: 1,
            px: 1.5,
            borderRadius: 1,
            flexDirection: 'column',
            alignItems: 'flex-start',
            [`&.${listItemButtonClasses.selected}`]: {
              bgcolor: 'action.selected',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            },
          }}
        >
          {address.ruc && (
            <Box sx={{ typography: 'caption' }}>{address.ruc}</Box>
          )}
                    {address.name && (
            <Box sx={{ typography: 'caption' }}>{address.name}</Box>
          )}
          {address.address && (
            <Box sx={{ color: 'primary.main', typography: 'caption' }}>{address.address}</Box>
          )}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="Buscar..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

