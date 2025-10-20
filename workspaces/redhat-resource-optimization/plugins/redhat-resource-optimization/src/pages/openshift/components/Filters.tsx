/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { InfoCard } from '@backstage/core-components';
import { SelectComponent } from './SelectComponent';
import { AutocompleteComponent } from './AutocompleteComponent';

const useFiltersStyles = makeStyles(
  theme => ({
    root: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginRight: theme.spacing(3),
    },
    value: {
      fontWeight: 'bold',
      fontSize: 18,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      height: theme.spacing(7.5),
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.palette.grey[500]}`,
    },
    filters: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        marginTop: theme.spacing(0),
      },
    },
    filterSection: {
      marginBottom: theme.spacing(0),
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
  }),
  { name: 'OpenShiftFilters' },
);

/** @public */
export type FiltersProps = {
  groupBy: string;
  overheadDistribution: string;
  timeRange: string;
  currency: string;
  filterBy: string;
  filterOperation: string;
  filterValue: string;
  onGroupByChange: (value: string) => void;
  onOverheadDistributionChange: (value: string) => void;
  onTimeRangeChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onFilterByChange: (value: string) => void;
  onFilterOperationChange: (value: string) => void;
  onFilterValueChange: (value: string) => void;
};

export type CurrencyOption = {
  label: string;
  value: string;
};

/** @public */
export function Filters(props: FiltersProps) {
  const {
    groupBy,
    overheadDistribution,
    timeRange,
    currency,
    filterBy,
    filterOperation,
    filterValue,
    onGroupByChange,
    onOverheadDistributionChange,
    onTimeRangeChange,
    onCurrencyChange,
    onFilterByChange,
    onFilterOperationChange,
    onFilterValueChange,
  } = props;
  const classes = useFiltersStyles();

  // Generate filter value options based on the selected filterBy
  const getFilterValueOptions = (): string[] => {
    switch (filterBy) {
      case 'project':
        return [
          'analytics',
          'wolfpack',
          'cost-management',
          'install-test',
          'Worker unallocated',
        ];
      case 'cluster':
        return ['cluster-1', 'cluster-2', 'cluster-3', 'cluster-4'];
      case 'node':
        return ['node-1', 'node-2', 'node-3', 'node-4', 'node-5'];
      case 'tag':
        return ['production', 'staging', 'development', 'testing'];
      default:
        return ['Select a filter type first'];
    }
  };

  const currencyOptions: CurrencyOption[] = [
    { label: 'USD ($) - United States Dollar', value: 'USD' },
    { label: 'EUR (€) - Euro', value: 'EUR' },
    { label: 'GBP (£) - British Pound', value: 'GBP' },
    { label: 'JPY (¥) - Japanese Yen', value: 'JPY' },
    { label: 'AUD ($) - Australian Dollar', value: 'AUD' },
    { label: 'CAD ($) - Canadian Dollar', value: 'CAD' },
    { label: 'CHF (₣) - Swiss Franc', value: 'CHF' },
    { label: 'CNY (¥) - Chinese Yuan', value: 'CNY' },
    { label: 'INR (₹) - Indian Rupee', value: 'INR' },
    { label: 'MXN ($) - Mexican Peso', value: 'MXN' },
    { label: 'NZD ($) - New Zealand Dollar', value: 'NZD' },
    { label: 'SEK (kr) - Swedish Krona', value: 'SEK' },
    { label: 'SGD ($) - Singapore Dollar', value: 'SGD' },
    { label: 'HKD ($) - Hong Kong Dollar', value: 'HKD' },
    { label: 'TWD (NT$) - Taiwan Dollar', value: 'TWD' },
    { label: 'THB (฿) - Thai Baht', value: 'THB' },
    { label: 'RUB (₽) - Russian Ruble', value: 'RUB' },
    { label: 'BRL (R$) - Brazilian Real', value: 'BRL' },
    { label: 'ZAR (R) - South African Rand', value: 'ZAR' },
    { label: 'PLN (zł) - Polish Zloty', value: 'PLN' },
    { label: 'KRW (₩) - Korean Won', value: 'KRW' },
    { label: 'TRY (₺) - Turkish Lira', value: 'TRY' },
    { label: 'IDR (Rp) - Indonesian Rupiah', value: 'IDR' },
    { label: 'MYR (RM) - Malaysian Ringgit', value: 'MYR' },
    { label: 'PHP (₱) - Philippine Peso', value: 'PHP' },
    { label: 'VND (₫) - Vietnamese Dong', value: 'VND' },
    { label: 'HUF (Ft) - Hungarian Forint', value: 'HUF' },
    { label: 'CZK (Kč) - Czech Koruna', value: 'CZK' },
    { label: 'NOK (kr) - Norwegian Krone', value: 'NOK' },
    { label: 'DKK (kr) - Danish Krone', value: 'DKK' },
    { label: 'ISK (kr) - Icelandic Krona', value: 'ISK' },
    { label: 'HRK (kn) - Croatian Kuna', value: 'HRK' },
    { label: 'RON (lei) - Romanian Leu', value: 'RON' },
    { label: 'BGN (лв) - Bulgarian Lev', value: 'BGN' },
    { label: 'UAH (₴) - Ukrainian Hryvnia', value: 'UAH' },
    { label: 'MDL (lei) - Moldovan Leu', value: 'MDL' },
    { label: 'GEL (₾) - Georgian Lari', value: 'GEL' },
    { label: 'ARS ($) - Argentine Peso', value: 'ARS' },
    { label: 'CLP ($) - Chilean Peso', value: 'CLP' },
    { label: 'COP ($) - Colombian Peso', value: 'COP' },
    { label: 'PEN (S/) - Peruvian Sol', value: 'PEN' },
    { label: 'UYU ($U) - Uruguayan Peso', value: 'UYU' },
    { label: 'VEF (Bs) - Venezuelan Bolivar', value: 'VEF' },
    { label: 'BOB (Bs) - Bolivian Boliviano', value: 'BOB' },
    { label: 'PAB ($) - Panamanian Balboa', value: 'PAB' },
    { label: 'CUP ($) - Cuban Peso', value: 'CUP' },
    { label: 'ANG ($) - Netherlands Antillean Guilder', value: 'ANG' },
    { label: 'AWG ($) - Aruban Florin', value: 'AWG' },
    { label: 'SVC ($) - Salvadoran Colón', value: 'SVC' },
    { label: 'GTQ (Q) - Guatemalan Quetzal', value: 'GTQ' },
    { label: 'HNL (L) - Honduran Lempira', value: 'HNL' },
    { label: 'NIO (C$) - Nicaraguan Cordoba', value: 'NIO' },
  ];

  return (
    <Box className={classes.root}>
      <Box className={classes.filters}>
        {/* Group by */}
        <div className={classes.filterSection}>
          <Box p={1} pt={0}>
            <SelectComponent
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              filterSelectedOptions
              label="Group by"
              options={['project', 'cluster', 'node', 'tag']}
              value={groupBy}
              placeholder="Group by"
              onChange={(event): void =>
                onGroupByChange(event.target.value as string)
              }
            />
          </Box>
        </div>

        {/* Overhead cost */}
        <div className={classes.filterSection}>
          <Box p={1}>
            <SelectComponent
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              filterSelectedOptions
              label="Overhead cost"
              options={[
                'Distribute through cost models',
                "Don't distribute overhead costs",
              ]}
              value={
                overheadDistribution === 'distribute'
                  ? 'Distribute through cost models'
                  : "Don't distribute overhead costs"
              }
              placeholder="Overhead cost"
              onChange={(event): void => {
                const value = event.target.value as string;
                const mappedValue =
                  value === 'Distribute through cost models'
                    ? 'distribute'
                    : 'dont_distribute';
                onOverheadDistributionChange(mappedValue);
              }}
            />
          </Box>
        </div>

        {/* Time */}
        <div className={classes.filterSection}>
          <Box p={1}>
            <SelectComponent
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              filterSelectedOptions
              label="Time"
              options={['Month to date', 'Previous month']}
              value={
                timeRange === 'month-to-date'
                  ? 'Month to date'
                  : 'Previous month'
              }
              placeholder="Time"
              onChange={(event): void => {
                const value = event.target.value as string;
                const mappedValue =
                  value === 'Month to date'
                    ? 'month-to-date'
                    : 'previous-month';
                onTimeRangeChange(mappedValue);
              }}
            />
          </Box>
        </div>

        <Divider className={classes.divider} />

        {/* Filter table by */}
        <div className={classes.filterSection}>
          <InfoCard>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                Filter table by
              </div>
              <SelectComponent
                freeSolo
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                filterSelectedOptions
                label=""
                options={['project', 'cluster', 'node', 'tag']}
                value={filterBy}
                placeholder=""
                onChange={(event): void => {
                  onFilterByChange(event.target.value as string);
                  onFilterValueChange('');
                }}
              />
              <SelectComponent
                freeSolo
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                filterSelectedOptions
                label=""
                options={['includes', 'excludes']}
                value={filterOperation}
                placeholder=""
                onChange={(event): void => {
                  onFilterOperationChange(event.target.value as string);
                }}
              />

              <AutocompleteComponent
                label=""
                options={getFilterValueOptions()}
                value={filterValue}
                placeholder={`Filter by ${filterBy || 'project'}`}
                onChange={(_event, value): void => {
                  onFilterValueChange((value as string) ?? '');
                }}
              />
            </div>
          </InfoCard>
        </div>

        <Divider className={classes.divider} />

        {/* Currency */}
        <div className={classes.filterSection}>
          <Box p={2}>
            <SelectComponent
              freeSolo
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              filterSelectedOptions
              label="Currency"
              options={currencyOptions.map(
                (value: CurrencyOption) => value.label,
              )}
              value={
                currencyOptions.find(
                  (item: CurrencyOption) => item.value === currency,
                )?.label ?? ''
              }
              placeholder="Select currency"
              onChange={(event): void => {
                const selectedLabel = event.target.value as string;
                const selectedCurrency =
                  currencyOptions.find(
                    (item: CurrencyOption) => item.label === selectedLabel,
                  )?.value ?? '';
                onCurrencyChange(selectedCurrency);
              }}
            />
          </Box>
        </div>
      </Box>
    </Box>
  );
}
