import { ConditionalCustomerFilterProvider } from "@dashboard/components/ConditionalFilter";
import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  customerAddPath,
  customerAddressesPath,
  CustomerAddressesUrlQueryParams,
  customerListPath,
  CustomerListUrlQueryParams,
  CustomerListUrlSortField,
  customerPath,
  CustomerUrlQueryParams,
} from "./urls";
import CustomerAddressesViewComponent from "./views/CustomerAddresses";
import CustomerCreateView from "./views/CustomerCreate";
import CustomerDetailsViewComponent from "./views/CustomerDetails";
import CustomerListViewComponent from "./views/CustomerList";

const CustomerListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CustomerListUrlQueryParams = asSortParams(qs, CustomerListUrlSortField);

  return (
    <ConditionalCustomerFilterProvider locationSearch={location.search}>
      <CustomerListViewComponent params={params} />
    </ConditionalCustomerFilterProvider>
  );
};

interface CustomerDetailsRouteParams {
  id: string;
}

const CustomerDetailsView: React.FC<RouteComponentProps<CustomerDetailsRouteParams>> = ({
  location,
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerUrlQueryParams = qs;

  return <CustomerDetailsViewComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

interface CustomerAddressesRouteParams {
  id: string;
}

const CustomerAddressesView: React.FC<RouteComponentProps<CustomerAddressesRouteParams>> = ({
  match,
}) => {
  const qs = parseQs(location.search.substr(1));
  const params: CustomerAddressesUrlQueryParams = qs;

  return (
    <CustomerAddressesViewComponent id={decodeURIComponent(match.params.id)} params={params} />
  );
};

export const CustomerSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <Switch>
        <Route exact path={customerListPath} component={CustomerListView} />
        <Route exact path={customerAddPath} component={CustomerCreateView} />
        <Route path={customerAddressesPath(":id")} component={CustomerAddressesView} />
        <Route path={customerPath(":id")} component={CustomerDetailsView} />
      </Switch>
    </>
  );
};
