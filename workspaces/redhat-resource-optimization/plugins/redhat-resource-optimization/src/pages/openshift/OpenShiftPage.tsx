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
import Typography from '@material-ui/core/Typography';
import { BasePage } from '../../components/BasePage';
import { Filters } from './components/Filters';
import { PageLayout } from './components/PageLayout';
import { Switch } from '@material-ui/core';

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
  const [filterBy, setFilterBy] = useState('project');
  const [filterOperation, setFilterOperation] = useState('includes');
  const [filterValue, setFilterValue] = useState('');
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

            <Typography variant="body2">Project name</Typography>
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
            <Typography variant="body2">{data.projectName}</Typography>
            {data.includesOverhead && (
              <Typography
                variant="caption"
                style={{
                  padding: '2px 6px',
                  backgroundColor: '#ddd',
                  border: '1px solid #d2d2d2',
                  borderRadius: '16px',
                  color: '#151515',
                }}
              >
                Includes overhead
              </Typography>
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
            <Button
              size="small"
              variant="outlined"
              to="#"
              style={{ borderRadius: 4 }}
            >
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
      <PageLayout>
        <PageLayout.Filters>
          <Filters
            groupBy={groupBy}
            overheadDistribution={overheadDistribution}
            timeRange={timeRange}
            currency={currency}
            filterBy={filterBy}
            filterOperation={filterOperation}
            filterValue={filterValue}
            onGroupByChange={setGroupBy}
            onOverheadDistributionChange={setOverheadDistribution}
            onTimeRangeChange={setTimeRange}
            onCurrencyChange={setCurrency}
            onFilterByChange={setFilterBy}
            onFilterOperationChange={setFilterOperation}
            onFilterValueChange={setFilterValue}
          />
        </PageLayout.Filters>
        <PageLayout.Table>
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
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Switch
                        checked={showPlatformSum}
                        onChange={e => setShowPlatformSum(e.target.checked)}
                      />
                      <Typography variant="body2">
                        Sum platform costs
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        to="#"
                        style={{ borderRadius: 4 }}
                      >
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
        </PageLayout.Table>
      </PageLayout>
    </BasePage>
  );
}
OpenShiftPage.displayName = 'OpenShiftPage';
