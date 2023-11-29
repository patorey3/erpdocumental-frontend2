import { format } from 'date-fns';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { Collapse, LinearProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { IJobsItem } from 'src/types/transaction';

import SriDocList from './sri-doc-list';
// import SriDocList from './sri-doc-list';
import { useJobTransactions } from './hook/useJobTransaction';

// ----------------------------------------------------------------------

type Props = {
  row: IJobsItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function SriTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}: Props) {
  const {
    totalKeys,
    processedKeys,
    description,
    created,
    status,
  } = row;

  const [jobTransaction, setJobTransaction] = useState<string>("");

  const query_job = useJobTransactions(jobTransaction);

  const [open, setOpen] = useState(false);

  const [docs, setDocs] = useState([]);

  const confirm = useBoolean();

  const popover = usePopover();

  const handleOpenCollapse = (job:string) =>{
    console.log('query_job',job)
    setJobTransaction(job)
    setOpen(!open);
  }

  useEffect(() => {
    if (query_job.isFetched) {
      setDocs(query_job.data.data.purchases)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query_job.data]);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
        <IconButton
            aria-label="expand row"
            size="small"
            onClick={() =>handleOpenCollapse(row.jobTransaction)}
          >
            {open ? <Iconify icon="mdi:chevron-up" /> : <Iconify icon="mdi:chevron-down" />}
          </IconButton>
        </TableCell>

        <TableCell>
            {description}
        </TableCell>

        <TableCell>
          <ListItemText
            primary={format(new Date(created), 'dd MMM yyyy')}
            secondary={format(new Date(created), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>{totalKeys}</TableCell>
        <TableCell sx={{ typography: 'caption', color: 'text.secondary' }}>
          <LinearProgress
            value={( processedKeys / totalKeys)}
            variant="determinate"
            color={
              (( processedKeys / totalKeys) < 0 && 'error')  ||
              'success'
            }
            sx={{ mb: 1, height: 6, maxWidth: 80 }}
          />
        </TableCell>

        <TableCell>{status}</TableCell>
        <TableCell align="right">
          <IconButton color={popover.open ? 'primary' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <SriDocList docs={docs}/>
        </Collapse>

        </TableCell>
      </TableRow>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
