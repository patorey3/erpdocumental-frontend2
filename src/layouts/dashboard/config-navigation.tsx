import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: t('general'),
        items: [
          {
            title: t('announcement_panel'),
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          // {
          //   title: t('ecommerce'),
          //   path: paths.dashboard.general.ecommerce,
          //   icon: ICONS.ecommerce,
          // },
          // {
          //   title: t('analytics'),
          //   path: paths.dashboard.general.analytics,
          //   icon: ICONS.analytics,
          // },
          // {
          //   title: t('banking'),
          //   path: paths.dashboard.general.banking,
          //   icon: ICONS.banking,
          // },
          // {
          //   title: t('booking'),
          //   path: paths.dashboard.general.booking,
          //   icon: ICONS.booking,
          // },
          // {
          //   title: t('file'),
          //   path: paths.dashboard.general.file,
          //   icon: ICONS.file,
          // },
        ],
      },

      // MANAGEMENT GESTIÓN
      // ----------------------------------------------------------------------
      {
        subheader: t('management'),
        items: [
          // USER
          {
            title: t('business_relationship'),
            path: paths.dashboard.contact.root,
            icon: ICONS.user,
            children: [
              { title: t('contacts'), path: paths.dashboard.contact.root },
              { title: t('crm_docs'), path: paths.dashboard.crm.list },
              { title: t('docs_flows'), path: paths.dashboard.contact.list },
              // { title: t('list'), path: paths.dashboard.user.list },
              // { title: t('create'), path: paths.dashboard.user.new },
              // { title: t('edit'), path: paths.dashboard.user.demo.edit },
              // { title: t('account'), path: paths.dashboard.user.account },
            ],
          },

          // PRODUCT document_management
          {
            title: t('document_management'),
            path: paths.dashboard.product.root,
            icon: ICONS.file,
            children: [
              { title: t('catalogs'), path: paths.dashboard.product.root },
              {
                title: t('transactions'),
                path: paths.dashboard.product.demo.details,
              },
              // { title: t('create'), path: paths.dashboard.product.new },
              // { title: t('edit'), path: paths.dashboard.product.demo.edit },
            ],
          },

          // ORDER VNTAS
          {
            title: t('sales'),
            path: paths.dashboard.order.root,
            icon: ICONS.order,
            children: [
              { title: t('direct_sales'), path: paths.dashboard.order.root },
              { title: t('pos'), path: paths.dashboard.order.demo.details },
              { title: t('sales_actions'), path: paths.dashboard.order.demo.details },
              { title: t('sales_reports'), path: paths.dashboard.order.demo.details },
            ],
          },

          // INVOICE COMPRAS
          {
            title: t('purchases'),
            path: paths.dashboard.purchase.root,
            icon: ICONS.invoice,
            children: [
              { title: t('purchases_register'), path: paths.dashboard.purchase.root },
              {
                title: t('purchases_request'),
                path: paths.dashboard.invoice.demo.details,
              },
              { title: t('purchases_actions'), path: paths.dashboard.invoice.new },
             // { title: t('edit'), path: paths.dashboard.invoice.demo.edit },
            ],
          },

          // BLOG INVENTARIO
          {
            title: t('inventory'),
            path: paths.dashboard.post.root,
            icon: ICONS.product,
            children: [
              { title: t('inventory_items'), path: paths.dashboard.post.root },
              { title: t('sales_shipping'), path: paths.dashboard.post.demo.details },
              { title: t('items_actions'), path: paths.dashboard.post.new },
              { title: t('item_audit'), path: paths.dashboard.post.demo.edit },
              { title: t('inventory_reports'), path: paths.dashboard.post.demo.edit },
            ],
          },

          // JOB FINANZAS
          {
            title: t('finance'),
            path: paths.dashboard.job.root,
            icon: ICONS.job,
            children: [
              { title: t('accounting'), path: paths.dashboard.job.root },
              { title: t('treasury'), path: paths.dashboard.job.demo.details },
              { title: t('budget'), path: paths.dashboard.job.new },
              { title: t('finance_reports'), path: paths.dashboard.job.demo.edit },
            ],
          },

          // TOUR
          {
            title: t('utilities'),
            path: paths.dashboard.utils.root,
            icon: ICONS.tour,
            children: [
              { title: t('sri_utilities'), path: paths.dashboard.utils.root },
              // { title: t('details'), path: paths.dashboard.tour.demo.details },
              // { title: t('create'), path: paths.dashboard.tour.new },
              // { title: t('edit'), path: paths.dashboard.tour.demo.edit },
            ],
          },

          // FILE MANAGER
          // {
          //   title: t('file_manager'),
          //   path: paths.dashboard.fileManager,
          //   icon: ICONS.folder,
          // },

          // MAIL
          // {
          //   title: t('mail'),
          //   path: paths.dashboard.mail,
          //   icon: ICONS.mail,
          //   info: <Label color="error">+32</Label>,
          // },

          // CHAT
          // {
          //   title: t('chat'),
          //   path: paths.dashboard.chat,
          //   icon: ICONS.chat,
          // },

          // CALENDAR
          // {
          //   title: t('calendar'),
          //   path: paths.dashboard.calendar,
          //   icon: ICONS.calendar,
          // },

          // KANBAN
          {
            title: t('kanban'),
            path: paths.dashboard.kanban,
            icon: ICONS.kanban,
          },
        ],
      },

      // DEMO MENU STATES
      /*
      {
        subheader: t(t('other_cases')),
        items: [
          {
            // default roles : All roles can see this entry.
            // roles: ['user'] Only users can see this item.
            // roles: ['admin'] Only admin can see this item.
            // roles: ['admin', 'manager'] Only admin/manager can see this item.
            // Reference from 'src/guards/RoleBasedGuard'.
            title: t('item_by_roles'),
            path: paths.dashboard.permission,
            icon: ICONS.lock,
            roles: ['admin', 'manager'],
            caption: t('only_admin_can_see_this_item'),
          },
          {
            title: t('menu_level'),
            path: '#/dashboard/menu_level',
            icon: ICONS.menuItem,
            children: [
              {
                title: t('menu_level_1a'),
                path: '#/dashboard/menu_level/menu_level_1a',
              },
              {
                title: t('menu_level_1b'),
                path: '#/dashboard/menu_level/menu_level_1b',
                children: [
                  {
                    title: t('menu_level_2a'),
                    path: '#/dashboard/menu_level/menu_level_1b/menu_level_2a',
                  },
                  {
                    title: t('menu_level_2b'),
                    path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b',
                    children: [
                      {
                        title: t('menu_level_3a'),
                        path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3a',
                      },
                      {
                        title: t('menu_level_3b'),
                        path: '#/dashboard/menu_level/menu_level_1b/menu_level_2b/menu_level_3b',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title: t('item_disabled'),
            path: '#disabled',
            icon: ICONS.disabled,
            disabled: true,
          },
          {
            title: t('item_label'),
            path: '#label',
            icon: ICONS.label,
            info: (
              <Label color="info" startIcon={<Iconify icon="solar:bell-bing-bold-duotone" />}>
                NEW
              </Label>
            ),
          },
          {
            title: t('item_caption'),
            path: '#caption',
            icon: ICONS.menuItem,
            caption:
              'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
          },
          {
            title: t('item_external_link'),
            path: 'https://www.google.com/',
            icon: ICONS.external,
          },
          {
            title: t('blank'),
            path: paths.dashboard.blank,
            icon: ICONS.blank,
          },
        ],
      }, */
    ],
    [t]
  );

  return data;
}
