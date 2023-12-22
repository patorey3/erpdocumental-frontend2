
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useLocalStorage } from 'src/hooks/use-local-storage';
import { useListDocCatalog, useCatalogTaxCollection, useCatalogCitiesCollection } from 'src/hooks/use-catalog';

import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWidget from '../app-widget';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import AppNewInvoice from '../app-new-invoice';
import AppTopAuthors from '../app-top-authors';
import AppTopRelated from '../app-top-related';
import AppAreaInstalled from '../app-area-installed';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentDownload from '../app-current-download';
import AppTopInstalledCountries from '../app-top-installed-countries';

// ----------------------------------------------------------------------
const initialCatalogState = { type_docs: [] };
const initialCitiesCatalogState = { cities: [] };
const initialTaxesCatalogState = { taxes: [] };
const initialListFormFilters = { filters: {}};

const STORAGE_KEY = ['doc-catalog','cities-catalog','taxes-catalog','form-filters-purchase'];

export default function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  const settings = useSettingsContext();

  const [catalogDoc, setCatalogDoc] = useState([]);

  const [catalogTax, setCatalogTax] = useState([]);


  const [catalogCities, setCatalogCities] = useState([]);

  const queryCatalog = useListDocCatalog('Purchase');
  

  const queryCitiesCatalog= useCatalogCitiesCollection();

  const queryTaxCatalog = useCatalogTaxCollection();

  const { state: docCatalog, update: updateCatalog } = useLocalStorage(
    STORAGE_KEY[0],
    initialCatalogState
  );
  const { state: citiesCatalog, update: updateCitiesCatalog } = useLocalStorage(
    STORAGE_KEY[1],
    initialCitiesCatalogState
  );
  const { state: taxesCatalog, update: updateTaxesCatalog } = useLocalStorage(
    STORAGE_KEY[2],
    initialTaxesCatalogState
  );

  const { state: listFilterPurchase, update: updateListFilterPurchase} = useLocalStorage(
    STORAGE_KEY[3],
    initialListFormFilters
  );

  
  useEffect(() => {
    if (queryCatalog.isFetched) {
      const cat = queryCatalog.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        accountId: item.accountId,
      }));
      setCatalogDoc(cat);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCatalog.data]);



  useEffect(() => {
    if (queryCitiesCatalog.isFetched) {
      console.log('Cities', queryCitiesCatalog.data);
      const cities = queryCitiesCatalog.data.map((city: any) => ({
        id: city.id,
        parentId: city.parentId,
        name: city.name,
        level: city.level,
      }));
      setCatalogCities(cities)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCitiesCatalog.data]);

  useEffect(() => {
    console.log('docCatalog',docCatalog);
    if(catalogDoc.length > 0){
      updateCatalog('type_docs', catalogDoc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogDoc]);

  useEffect(() => {
    console.log('docCatalog',citiesCatalog);

    if(catalogCities.length > 0){
        updateCitiesCatalog('cities', catalogCities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogCities]);

  useEffect(() => {
    if (queryTaxCatalog.isFetched) {
      console.log('queryTaxCatalog', queryTaxCatalog.data);
      setCatalogTax(queryTaxCatalog.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTaxCatalog.data]);

  useEffect(() => {
    console.log('docCatalog',taxesCatalog);

    if(catalogTax.length > 0){
      updateTaxesCatalog('taxes', catalogTax);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogTax]);

  useEffect(() => {

    updateListFilterPurchase('filters',{
      hasCredit: false,
      emittedDocument: false,  
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFilterPurchase]);

  


  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
            img={<SeoIllustration />}
            action={
              <Button variant="contained" color="primary">
                Go Now
              </Button>
            }
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppFeatured list={_appFeatured} />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Active Users"
            percent={2.6}
            total={18765}
            chart={{
              series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Installed"
            percent={0.2}
            total={4876}
            chart={{
              colors: [theme.palette.info.light, theme.palette.info.main],
              series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Downloads"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.palette.warning.light, theme.palette.warning.main],
              series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Current Download"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Area Installed"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  year: '2019',
                  data: [
                    {
                      name: 'Asia',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'America',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    {
                      name: 'Asia',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'America',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New Invoice"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Top Related Applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top Authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Stack spacing={3}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{
                series: 48,
              }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              color="info"
              chart={{
                series: 75,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
