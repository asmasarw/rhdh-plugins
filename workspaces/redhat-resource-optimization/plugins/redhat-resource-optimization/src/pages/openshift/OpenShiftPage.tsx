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

import React, { useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableColumn,
  Button,
  InfoCard,
} from '@backstage/core-components';
import { BasePage } from '../../components/BasePage';

// Mock data types for cost management
interface ProjectCost {
  id: string;
  projectName: string;
  cost: number;
  costPercentage: number;
  monthOverMonthChange: number;
  monthOverMonthValue: number;
  includesOverhead: boolean;
  previousPeriodCost: number;
}

interface CostManagementData {
  totalCost: number;
  dateRange: string;
  projects: ProjectCost[];
}

// Mock data
const mockCostData: CostManagementData = {
  totalCost: 50561.1,
  dateRange: 'February 1 - 11',
  projects: [
    {
      id: '1',
      projectName: 'Worker unallocated',
      cost: 24844.3,
      costPercentage: 49.14,
      monthOverMonthChange: -11.64,
      monthOverMonthValue: 28117.9,
      includesOverhead: false,
      previousPeriodCost: 28117.9,
    },
    {
      id: '2',
      projectName: 'analytics',
      cost: 6988.81,
      costPercentage: 13.82,
      monthOverMonthChange: 13.68,
      monthOverMonthValue: 8096.22,
      includesOverhead: true,
      previousPeriodCost: 8096.22,
    },
    {
      id: '3',
      projectName: 'wolfpack',
      cost: 5649.63,
      costPercentage: 11.17,
      monthOverMonthChange: -13.98,
      monthOverMonthValue: 6567.72,
      includesOverhead: true,
      previousPeriodCost: 6567.72,
    },
    {
      id: '4',
      projectName: 'cost-management',
      cost: 4685.57,
      costPercentage: 9.27,
      monthOverMonthChange: -13.78,
      monthOverMonthValue: 5434.63,
      includesOverhead: true,
      previousPeriodCost: 5434.63,
    },
    {
      id: '5',
      projectName: 'install-test',
      cost: 2980.5,
      costPercentage: 5.89,
      monthOverMonthChange: -13.99,
      monthOverMonthValue: 3465.15,
      includesOverhead: true,
      previousPeriodCost: 3465.15,
    },
  ],
};

/** @public */
export function OpenShiftPage() {
  const [groupBy, setGroupBy] = useState('project');
  const [overheadDistribution, setOverheadDistribution] =
    useState('distribute');
  const [timeRange, setTimeRange] = useState('month-to-date');
  const [currency, setCurrency] = useState('USD');
  const [showPlatformSum, setShowPlatformSum] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Handle individual row selection
  const handleRowSelect = useCallback(
    (rowId: string, isSelected: boolean) => {
      const newSelectedRows = new Set(selectedRows);
      if (isSelected) {
        newSelectedRows.add(rowId);
      } else {
        newSelectedRows.delete(rowId);
      }
      setSelectedRows(newSelectedRows);
    },
    [selectedRows],
  );

  // Handle select all/none
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows(
        new Set(mockCostData.projects.map(project => project.id)),
      );
    } else {
      setSelectedRows(new Set());
    }
  };

  const isAllSelected =
    selectedRows.size === mockCostData.projects.length &&
    mockCostData.projects.length > 0;
  const isIndeterminate =
    selectedRows.size > 0 && selectedRows.size < mockCostData.projects.length;

  const columns = useMemo<TableColumn<ProjectCost>[]>(
    () => [
      {
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                position: 'relative',
                display: 'inline-block',
                width: '18px',
                height: '18px',
              }}
            >
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={input => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={e => {
                  e.stopPropagation();
                  handleSelectAll(e.target.checked);
                }}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                }}
              />
            </div>

            <span>Project name</span>
          </div>
        ),
        field: 'projectName',
        render: data => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={selectedRows.has(data.id)}
              onChange={e => handleRowSelect(data.id, e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                cursor: 'pointer',
              }}
            />
            <span>{data.projectName}</span>
            {data.includesOverhead && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  backgroundColor: '#ddd',
                  border: '1px solid #d2d2d2',
                  borderRadius: '16px',
                  color: '#151515',
                }}
              >
                Includes overhead
              </span>
            )}
          </div>
        ),
      },
      {
        title: 'Month over month change',
        field: 'monthOverMonthChange',
        render: data => (
          <div>
            <div
              style={{
                color: data.monthOverMonthChange > 0 ? '#d32f2f' : '#2e7d32',
                fontWeight: 'bold',
              }}
            >
              {Math.abs(data.monthOverMonthChange).toFixed(2)}%
              {data.monthOverMonthChange > 0 ? ' ▲' : ' ▼'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
              ${data.monthOverMonthValue.toLocaleString()} for January 1-11
            </div>
          </div>
        ),
      },
      {
        title: 'Cost',
        field: 'cost',
        render: data => (
          <div>
            <div style={{ fontWeight: 'bold' }}>
              ${data.cost.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>
              {data.costPercentage.toFixed(2)}% of cost
            </div>
          </div>
        ),
      },
      {
        title: 'Actions',
        field: 'actions',
        render: () => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="small" variant="outlined" to="#">
              CSV
            </Button>
          </div>
        ),
      },
    ],
    [handleRowSelect, isAllSelected, isIndeterminate, selectedRows],
  );

  return (
    <BasePage pageTitle="OpenShift" withContentPadding>
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        {/* Header with total cost */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
            OpenShift
          </h1>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              ${mockCostData.totalCost.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>
              {mockCostData.dateRange}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, gap: '24px' }}>
          {/* Left Sidebar */}
          <div style={{ width: '300px', minWidth: '300px' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* Group by */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>Group by</span>
                </div>
                <select
                  value={groupBy}
                  onChange={e => setGroupBy(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="project">Project</option>
                  <option value="cluster">Cluster</option>
                  <option value="node">Node</option>
                  <option value="tag">Tag</option>
                </select>
              </div>

              {/* Overhead cost */}
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Overhead cost
                </div>
                <select
                  value={overheadDistribution}
                  onChange={e => setOverheadDistribution(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="distribute">
                    Distribute through cost models
                  </option>
                  <option value="dont_distribute">
                    Dont distribute overhead costs
                  </option>
                </select>
              </div>

              {/* Time */}
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Time
                </div>
                <select
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="month-to-date">Month to date</option>
                  <option value="previos-month">Previous month</option>
                </select>
              </div>

              <hr />

              {/* Filter table by */}
              <InfoCard>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>Filter table by</span>
                  </div>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginBottom: '8px',
                    }}
                  >
                    <option value="project">Project</option>
                    <option value="cluster">Cluster</option>
                    <option value="node">Node</option>
                    <option value="tag">Tag</option>
                  </select>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      marginBottom: '8px',
                    }}
                  >
                    <option value="includes">includes</option>
                    <option value="excludes">excludes</option>
                  </select>
                  <select
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                  >
                    <option value="filter">Filter by project</option>
                  </select>
                </div>
              </InfoCard>

              <hr />

              {/* Currency */}
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Currency
                </div>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="JPY">JPY (¥) - Japanese Yen</option>
                  <option value="AUD">AUD ($) - Australian Dollar</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                  <option value="CHF">CHF (₣) - Swiss Franc</option>
                  <option value="CNY">CNY (¥) - Chinese Yuan</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="MXN">MXN ($) - Mexican Peso</option>
                  <option value="NZD">NZD ($) - New Zealand Dollar</option>
                  <option value="SEK">SEK (kr) - Swedish Krona</option>
                  <option value="SGD">SGD ($) - Singapore Dollar</option>
                  <option value="HKD">HKD ($) - Hong Kong Dollar</option>
                  <option value="TWD">TWD (NT$) - Taiwan Dollar</option>
                  <option value="THB">THB (฿) - Thai Baht</option>
                  <option value="RUB">RUB (₽) - Russian Ruble</option>
                  <option value="BRL">BRL (R$) - Brazilian Real</option>
                  <option value="ZAR">ZAR (R) - South African Rand</option>
                  <option value="PLN">PLN (zł) - Polish Zloty</option>
                  <option value="KRW">KRW (₩) - Korean Won</option>
                  <option value="TRY">TRY (₺) - Turkish Lira</option>
                  <option value="IDR">IDR (Rp) - Indonesian Rupiah</option>
                  <option value="MYR">MYR (RM) - Malaysian Ringgit</option>
                  <option value="PHP">PHP (₱) - Philippine Peso</option>
                  <option value="VND">VND (₫) - Vietnamese Dong</option>
                  <option value="HUF">HUF (Ft) - Hungarian Forint</option>
                  <option value="CZK">CZK (Kč) - Czech Koruna</option>
                  <option value="NOK">NOK (kr) - Norwegian Krone</option>
                  <option value="DKK">DKK (kr) - Danish Krone</option>
                  <option value="ISK">ISK (kr) - Icelandic Krona</option>
                  <option value="HRK">HRK (kn) - Croatian Kuna</option>
                  <option value="RON">RON (lei) - Romanian Leu</option>
                  <option value="BGN">BGN (лв) - Bulgarian Lev</option>
                  <option value="UAH">UAH (₴) - Ukrainian Hryvnia</option>
                  <option value="MDL">MDL (lei) - Moldovan Leu</option>
                  <option value="GEL">GEL (₾) - Georgian Lari</option>
                  <option value="ARS">ARS ($) - Argentine Peso</option>
                  <option value="CLP">CLP ($) - Chilean Peso</option>
                  <option value="COP">COP ($) - Colombian Peso</option>
                  <option value="PEN">PEN (S/) - Peruvian Sol</option>
                  <option value="UYU">UYU ($U) - Uruguayan Peso</option>
                  <option value="VEF">VEF (Bs) - Venezuelan Bolivar</option>
                  <option value="BOB">BOB (Bs) - Bolivian Boliviano</option>
                  <option value="PAB">PAB ($) - Panamanian Balboa</option>
                  <option value="CUP">CUP ($) - Cuban Peso</option>
                  <option value="ANG">
                    ANG ($) - Netherlands Antillean Guilder
                  </option>
                  <option value="AWG">AWG ($) - Aruban Florin</option>
                  <option value="SVC">SVC ($) - Salvadoran Colón</option>
                  <option value="GTQ">GTQ (Q) - Guatemalan Quetzal</option>
                  <option value="HNL">HNL (L) - Honduran Lempira</option>
                  <option value="NIO">NIO (C$) - Nicaraguan Cordoba</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1 }}>
            <InfoCard
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        margin: 0,
                      }}
                    >
                      Projects (100)
                    </h3>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          display: 'inline-block',
                          width: '44px',
                          height: '24px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={showPlatformSum}
                          onChange={e => setShowPlatformSum(e.target.checked)}
                          style={{
                            opacity: 0,
                            width: 0,
                            height: 0,
                            position: 'absolute',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: showPlatformSum
                              ? '#4CAF50'
                              : '#ccc',
                            transition: '.4s',
                            borderRadius: '24px',
                            border: 'none',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              content: '""',
                              height: '18px',
                              width: '18px',
                              left: showPlatformSum ? '22px' : '3px',
                              bottom: '3px',
                              backgroundColor: 'white',
                              transition: '.4s',
                              borderRadius: '50%',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          />
                        </span>
                      </div>
                      <span>Sum platform costs</span>
                    </label>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Button size="small" variant="outlined" to="#">
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              }
            >
              <Table<ProjectCost>
                data={mockCostData.projects}
                columns={columns}
                options={{
                  paging: true,
                  pageSize: 5,
                  pageSizeOptions: [5, 10, 25, 50],
                  search: false,
                  sorting: true,
                  padding: 'dense',
                }}
                localization={{
                  pagination: {
                    labelRowsPerPage: 'rows',
                  },
                }}
              />
            </InfoCard>
          </div>
        </div>
      </div>
    </BasePage>
  );
}
OpenShiftPage.displayName = 'OpenShiftPage';
