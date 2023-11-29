import { useState } from 'react';

import { alpha } from '@mui/material/styles';
import { TabPanel, TabContext } from '@mui/lab';
import { Tab, Card, Tabs, Container } from "@mui/material";

import Iconify from 'src/components/iconify';
import { useSettingsContext } from "src/components/settings";

import { IPurchase } from 'src/types/purchases';

import SriItemList from './sri-item-list';
import SriPurchaseList from './sri-purchase-list';

const TABS_OPTIONS = [
    { value: 'comprobantes', label: 'Comprobantes', icon: "mdi:file-document" },
    { value: 'items', label: 'Items por Relacionar', icon: "mdi:package-variant-closed" },
  ];

  type Props = {
    docs: IPurchase[];
  };

export default function SriDocList({
    docs,
  }: Props) {
    const settings = useSettingsContext();
    const [option, setOption] = useState(TABS_OPTIONS[0]);

    const handleOption = (event: React.SyntheticEvent, newValue: string)=> {
        const selectedOption = TABS_OPTIONS.find((op) => op.value === newValue);
        setOption(selectedOption ?? TABS_OPTIONS[0])
        // setPurchases(docs);
    };

    return (
        <Container maxWidth={!settings.themeStretch ? false : 'lg'}>

            <Card>
            <TabContext value={option.value}>
              <Tabs
                value={option.value}
                onChange={handleOption}
                sx={{
                  px: 2.5,
                  boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                }}
              >
                {TABS_OPTIONS.map((tab) => (
                  <Tab
                    key={tab.value}
                    iconPosition="end"
                    icon={<Iconify icon={tab.icon} /> }
                    value={tab.value}
                    label={tab.label}
                  />
                ))}
              </Tabs>
              <TabPanel value={TABS_OPTIONS[0].value}>
               <SriPurchaseList purchases={docs} />
              </TabPanel>
            <TabPanel value={TABS_OPTIONS[1].value}>
                <SriItemList purchases={docs} />
            </TabPanel>
            </TabContext>
            </Card>
          </Container>
      );
}